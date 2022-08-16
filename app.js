const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv')
const { parse } = require('csv-parse');
const express = require('express');
const { parseRowData } = require('./utils');
const app = express();
const port = 4000;
const const_video = 8680;

const writetoCSV = async videoDetails => {
    const csv = new ObjectsToCsv(videoDetails)
    await csv.toDisk('./videoDetails.csv')
}
app.get('/', (req, res) => {
  let readData = [];
  let parsedData = [];
  fs.createReadStream('./twoboards.csv')
    .pipe(parse({ delimiter: ',', from_line: 1 }))
    .on('data', function (row) {
        parseRowData(row, parsedData);
    });
    setTimeout(() => {
        writetoCSV(parsedData);
    }, 10000);
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`Server Listening on PORT: ${port}`);
});