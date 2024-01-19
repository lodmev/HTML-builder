const path = require('path');
const fs = require('fs');
const { Buffer } = require('buffer');
const { makeDirCopy } = require('../04-copy-directory');
const { mergeCSS } = require('../05-merge-styles');

function buildProject() {
  const htmlTemplate = path.join(__dirname, 'template.html');
  const stylesInputFolder = path.join(__dirname, 'styles');
  const assetsInputFolder = path.join(__dirname, 'assets');
  const componentsFolder = path.join(__dirname, 'components');
  const componentsExt = 'html';
  const distFolder = path.join(__dirname, 'project-dist');
  const outputHTML = path.join(distFolder, 'index.html');
  const outputCSS = path.join(distFolder, 'style.css');
  const outputAssets = path.join(distFolder, 'assets');

  function createHTML(htmlTemplate, outputHTML) {
    const templateRegExp = /{{(\w+)}}/g;
    const templateParts = [];
    const resultHTMLBuffers = [];
    function writeHTML() {
      fs.writeFile(outputHTML, Buffer.concat(resultHTMLBuffers), () => {});
    }
    function mergeAllParts(components) {
      for (
        let i = 0;
        i < Math.max(templateParts.length, components.length);
        i += 1
      ) {
        if (templateParts[i]) {
          resultHTMLBuffers.push(templateParts[i]);
        }
        if (components[i]) {
          resultHTMLBuffers.push(components[i]);
        }
      }
      writeHTML();
    }
    function loadComponents(componentsNames) {
      const componentsLoaders = componentsNames.map((componentName) =>
        fs.promises.readFile(
          path.join(componentsFolder, `${componentName}.${componentsExt}`),
        ),
      );
      Promise.all(componentsLoaders).then(mergeAllParts);
    }
    fs.promises
      .readFile(htmlTemplate, {
        encoding: 'utf-8',
      })
      .then((template) => {
        let lastTemplateIDX = 0;
        const foundComponents = []; // names of components
        for (const match of template.matchAll(templateRegExp)) {
          templateParts.push(
            Buffer.from(template.slice(lastTemplateIDX, match.index)),
          );
          foundComponents.push(match[1]);
          lastTemplateIDX = match.index + match[0].length;
        }
        templateParts.push(
          Buffer.from(template.slice(lastTemplateIDX, template.length)),
        );
        loadComponents(foundComponents);
      });
  }
  const mkdir = fs.promises.mkdir(distFolder, { recursive: true });
  mkdir.then(() => {
    createHTML(htmlTemplate, outputHTML);
    makeDirCopy(assetsInputFolder, outputAssets);
    mergeCSS(stylesInputFolder, outputCSS);
  });
}

buildProject();
