const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const fileWriteStream = fs.createWriteStream(filePath, {flags: 'a+'});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

printWelcome();

rl.on('SIGINT', () => {
  printFinish();
  process.exit();
});

rl.on('line', (line) => {
  if (line === 'exit') {
    printFinish();
    process.exit();
  } else {
    fileWriteStream.write(line + '\n');
  }
});

function printWelcome() {
  console.log('Привет! Введите текст, который Вы хотите добавить в файл.');
  console.log('Сочетание клавиш CTRL + C позволит завершить редактирование файла.');
  console.log();
}

function printFinish() {
  console.log();
  console.log('Редактирование файла завершено! Спасибо!');
}