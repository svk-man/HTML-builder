const { mkdir, readdir, copyFile, access, createWriteStream, createReadStream } = require('fs');
const path = require('path');

const directory = 'project-dist';
const destPath = path.join(__dirname, directory);

mkdir(destPath, {recursive: true}, function(err) {
  if (!err) {
    const template = 'template';
    const templateFileName = `${template}.html`;
    const templateFilePath = path.join(__dirname, templateFileName);
    const index = 'index';
    const indexFileName = `${index}.html`;
    const indexFilePath = path.join(__dirname, directory, indexFileName);
    replaceTags(templateFilePath, indexFilePath);

    const styles = 'styles';
    const stylesSourcePath = path.join(__dirname, styles);
    const stylesDestPath = path.join(__dirname, directory);
    const stylesDestFileName = 'style.css';
    mergeStyles(stylesSourcePath, stylesDestPath, stylesDestFileName);

    const assets = 'assets';
    const assetsSourcePath = path.join(__dirname, assets);
    const assetsDestPath = path.join(__dirname, directory, assets);
    copyDirectory(assetsSourcePath, assetsDestPath);
  }
});

async function replaceTags(templateFilePath, indexFilePath, regexp = /\{\{([a-z]+)\}\}/g) {
  const templateFileReadStream = createReadStream(templateFilePath);
  let templateFileData = await readStream(templateFileReadStream);

  const tags = [...templateFileData.matchAll(regexp)];
  for (tag of tags) {
    let tagName = tag[1];
    templateFileData = await replaceTag(templateFileData, tagName);
  }

  const indexFileWriteStream = createWriteStream(indexFilePath);
  indexFileWriteStream.write(templateFileData);
}

async function replaceTag(data, tag) {
  const tagFileName = `${tag}.html`;
  const tagFilePath = path.join(__dirname, 'components', tagFileName);
  const tagFileReadStream = createReadStream(tagFilePath);
  const tagFileData = await readStream(tagFileReadStream);

  return data.replace(`{{${tag}}}`, tagFileData)
}

function readStream(readStream) {
  const chunks = [];
  return new Promise((resolve) => {
    readStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    readStream.on('end', () => resolve(Buffer.concat(chunks).toString('UTF8')));
  })
}

function mergeStyles(sourcePath, destPath, destFileName, encoding = 'UTF8') {
  const destFilePath = path.join(destPath, destFileName);
  let destFileWriteStream = createWriteStream(destFilePath);
  destFileWriteStream.write('', encoding);
  readdir(sourcePath, function(err, files) {
    if (!err) {
      for (sourceFile of files) {
        const sourceFilePath = path.join(sourcePath, sourceFile);
        let sourceFileData = '';
        if (path.extname(sourceFilePath) === '.css') {
          const sourceFileReadStream = createReadStream(sourceFilePath);
          sourceFileReadStream.setEncoding(encoding);
          sourceFileReadStream.on('data', (chunk) => {
            sourceFileData += chunk;
          });
  
          sourceFileReadStream.on('end', () => {
            destFileWriteStream = createWriteStream(destFilePath, {flags: 'a+'});
            destFileWriteStream.write(sourceFileData, encoding);
            destFileWriteStream.end();
          });
        }
      }
    }
  });
}

function copyDirectory(sourcePath, destPath) {
  mkdir(destPath, {recursive: true}, function(err) {
    if (!err) {
      readdir(sourcePath, {withFileTypes: true}, function(err, dirents) {
        if (!err) {
          for (const dirent of dirents) {
            const direntSourcePath = path.join(sourcePath, dirent.name);
            const direntDestPath = path.join(destPath, dirent.name);
            if (dirent.isFile()) {
              copyFile(direntSourcePath, direntDestPath, function() {});
            } else {
              copyDirectory(direntSourcePath, direntDestPath);
            }
          }
        }
      });

      readdir(destPath, function(err, files) {
        if (!err) {
          for (const file of files) {
            const fileSourcePath = path.join(sourcePath, file);
            const fileDestPath = path.join(destPath, file);
            access(fileSourcePath, (err) => {
              if (err) {
                unlink(fileDestPath, function() {});
              }
            });
          }
        }
      });
    }
  });
}