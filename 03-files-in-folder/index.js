const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs');
const secretFolder = path.join(__dirname, 'secret-folder');
readdir(secretFolder, {
  withFileTypes: true,
})
  .then((files) => {
    for (const file of files) {
      if (!file.isDirectory()) {
        const filePath = path.parse(file.name);
        stat(path.join(secretFolder, file.name), (err, stats) => {
          console.log(
            `${filePath.name} - ${filePath.ext.slice(1)} - ${stats.size}`,
          );
        });
      }
    }
  })
  .catch((err) => console.error(err));
