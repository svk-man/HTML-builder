const { readdir, mkdir, copyFile, access, unlink } = require('fs');
const path = require('path');

const directory = 'files';
const sourcePath = path.join(__dirname, directory);
const destPath = path.join(__dirname, `${directory}-copy`);

copyDirectory(sourcePath, destPath);

function copyDirectory(sourcePath, destPath) {
  mkdir(destPath, {recursive: true}, function(err) {
    if (!err) {
      readdir(sourcePath, function(err, files) {
        if (!err) {
          for (const file of files) {
            const fileSourcePath = path.join(sourcePath, file);
            const fileDestPath = path.join(destPath, file);
            copyFile(fileSourcePath, fileDestPath, function() {});
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