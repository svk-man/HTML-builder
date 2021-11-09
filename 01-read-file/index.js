const { createReadStream } = require('fs');
const path = require('path');
const { stdout } = require('process');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const fileReadStream = createReadStream(filePath);

fileReadStream.pipe(stdout);