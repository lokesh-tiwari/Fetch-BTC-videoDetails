const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv')
const { parse } = require('csv-parse');
const express = require('express');
const { parseRowData, checkUrlType } = require('./utils');
const { data } = require('./Input/allVideosDetails');
const app = express();
const port = 4000;

let newData = JSON.parse(JSON.stringify(data));

const writetoCSV = async videoDetails => {
    const csv = new ObjectsToCsv(videoDetails);
    await csv.toDisk('./Output/UpdatedVideoDetails.csv')
}
app.get('/', (req, res) => {
  let parsedData = [];
  try{
    fs.createReadStream('./Input/allboards.csv')
    .pipe(parse({ delimiter: ',', from_line: 1 }))
    .on('data', function (row) {
        parseRowData(row, parsedData, newData);
    })
    .on('end', () => {
      checkUrlType(newData)
      writetoCSV(newData);
      console.log('==> done');
    })
  } catch(err) {
    console.error(err);
  }
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`Server Listening on PORT: ${port}`);
});
