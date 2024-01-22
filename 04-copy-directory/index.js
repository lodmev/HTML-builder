const path = require('path');
const fs = require('fs');

function makeDirCopy(source, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        if (file.isDirectory()) {
          makeDirCopy(path.join(source, file.name), path.join(dest, file.name));
        } else {
          fs.copyFile(
            path.join(source, file.name),
            path.join(dest, file.name),
            (err) => {
              if (err) throw err;
            },
          );
        }
      }
    });
  });
}
if (require.main === module) {
  const source = path.join(__dirname, 'files');
  const dest = path.join(__dirname, 'files-copy');
  makeDirCopy(source, dest);
}
module.exports = {
  makeDirCopy,
};
