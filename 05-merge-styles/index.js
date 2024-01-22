const path = require('path');
const fs = require('fs');

function mergeCSS(srcFolder, outputFolder, outputFileName) {
  const cssFiles = [];
  let curCSSFile = 0;
  function prepareBundle() {
    fs.mkdir(outputFolder, { recursive: true }, (err) => {
      if (err) throw err;
      const outputFile = path.join(outputFolder, outputFileName);
      fs.open(outputFile, 'w', (err, fd) => {
        if (err) throw err;
        writeBundle(fd);
      });
    });
  }
  function writeBundle(bundleFileDesc) {
    if (curCSSFile >= cssFiles.length) {
      fs.close(bundleFileDesc, () => process.exit(0));
    } else {
      fs.readFile(cssFiles[curCSSFile], { encoding: 'utf-8' }, (err, data) => {
        if (err) throw err;
        fs.write(bundleFileDesc, data, (err) => {
          if (err) throw err;
          curCSSFile += 1;
          writeBundle(bundleFileDesc);
        });
      });
    }
  }

  fs.readdir(srcFolder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (!file.isFile() || path.extname(file.name) !== '.css') {
        continue;
      }
      cssFiles.push(path.join(srcFolder, file.name));
    }
  });
  prepareBundle();
}
if (require.main === module) {
  const outputFolder = path.join(__dirname, 'project-dist');
  const outFile = 'bundle.css';
  const srcDir = path.join(__dirname, 'styles');
  mergeCSS(srcDir, outputFolder, outFile);
}
module.exports = {
  mergeCSS,
};
