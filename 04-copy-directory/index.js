const { readdir, mkdir, copyFile, access, unlink } = require('fs');
const path = require('path');

const directory = 'files';
const sourcePath = path.join(__dirname, directory);
const destinationPath = path.join(__dirname, `${directory}-copy`);

mkdir(destinationPath, {recursive: true}, function(err) {
  if (!err) {
    readdir(sourcePath, function(err, files) {
      if (!err) {
        for (const file of files) {
          const fileSourcePath = path.join(sourcePath, file);
          const fileDestinationPath = path.join(destinationPath, file);
          copyFile(fileSourcePath, fileDestinationPath, function() {});
        }
      }
    });

    readdir(destinationPath, function(err, files) {
      if (!err) {
        for (const file of files) {
          const fileSourcePath = path.join(sourcePath, file);
          const fileDestinationPath = path.join(destinationPath, file);
          access(fileSourcePath, (err) => {
            if (err) {
              unlink(fileDestinationPath, function() {});
            }
          });
        }
      }
    });
  }
});
