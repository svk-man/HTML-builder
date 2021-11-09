const { readdir, createReadStream, createWriteStream } = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist');
const destFileName = 'bundle.css';
const destFilePath = path.join(destPath, destFileName);
let destFileWriteStream = createWriteStream(destFilePath);
const encoding = 'UTF8';

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

  console.log('finished writing');
});