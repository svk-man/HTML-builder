const { readdir, stat } = require('fs');
const path = require('path');

const secretPath = path.join(__dirname, 'secret-folder');

readdir(secretPath, function(err, files) {
  if (!err) {
    for (const file of files) {
      const filePath = path.join(secretPath, file);
      const fileExt = path.extname(filePath);
      const fileName = path.basename(filePath, fileExt);
      const fileShortExt = fileExt[0] === '.' ? fileExt.substring(1) : fileExt;

      stat(filePath, function(err, stats) {
        if (stats.isFile()) {
          const fileSize = (stats.size / 1024).toFixed(3);
          if (!err) {
            console.log(`${fileName} - ${fileShortExt} - ${fileSize}kb`);
          } else {
            console.log(err.message);
          }
        }
      });
    }
  } else {
    console.log(err.message);
  }
});