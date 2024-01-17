const readLine = require('readline');
const fs = require('fs');
const path = require('path');
const process = require('process');

const writingFile = fs.createWriteStream(path.join(__dirname, 'text.txt'),'utf-8');
console.log('>>>>Enter a words for writing or "exit" for quit<<<< :');
const rl = readLine.createInterface({input: process.stdin, output: process.stdout,});
rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
  } else {
  writingFile.write(line);
  writingFile.write('\n');
  }
  rl.prompt();
}).on('close', () => {
  console.log('>>>>Goodbye. Have a nice day!<<<<');
  process.exit(0);
}).on('SIGINT', () => {
    rl.close();
});
rl.prompt();


