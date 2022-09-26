const fs = require('fs');
const fetch = require('node-fetch');

const readRowData = (parsedData) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream('./twoboards.csv')
      .pipe(parse({ delimiter: ',', from_line: 1 }))
      .on('data', function (row) {
        parseRowData(row, parsedData);
      })
      .on('end', () => {
        console.log('Done.');
        resolve();
      })
      .on('error', reject)
  });
};

const checkIfIdIsUsed = (content, newData) => {
  let indexes = [],
    i;
  for (i = 0; i < newData.length; i++){
    if (newData[i].id.toString() === content.toString()) {
      newData[i].isUsing = 'true';
    }
    else {
      if(newData[i].isUsing !== 'true')
      newData[i].isUsing = 'false';
    }
};
}

const parseRowData = (row, parsedData, newData) => {
  let rawData = [...row];
  rawData = row.map((item) => {
    let splitContent = item.split(' ');
    if (Array.isArray(splitContent)) {
      splitContent.forEach((content) => {
        const splitStringContent = content.split(',');
        splitStringContent.forEach((item) => {
          checkIfIdIsUsed(item, newData);
          if (parseInt(item)) {
            fetch(
                `https://api.tllms.com/blc_web/web/one_to_many/cms/videos/${item}`, {
                    headers: {
                      'x-tnl-user-id': 87504679,
                      'authorization': 'Bearer f611927b2ff4498fad4a4429e644428a5c1f5290670ab0bf2d62acd6d34ada71',
                      'Cache-Control': 'max-age=0, private, must-revalidate',
                    }
                }
              )
              .then(res => res.json())
              .then(json => {
                if(typeof json.video === 'object'){
                  parsedData.push(json.video);
                }
                // write to a file

        })
        }
        })
      });
    }
  });
};

const writetoCSV = async videoDetails => {
    const csv = new ObjectsToCsv(videoDetails)
    await csv.toDisk('./videoDetails.csv')
}

const checkUrlType = (newData) => {
  for(let i=0; i<newData.length; i++){
    if(newData[i].dash_url.includes('cloudfront')){
      newData[i].cdn = 'cloudfront';
    } else if(newData[i].dash_url.includes('llnwi')){
      newData[i].cdn = 'Lime Light';
    } else if(newData[i].dash_url.includes('bitgravity')){
      newData[i].cdn = 'Tata CDN';
    } else if(newData[i].dash_url.includes('gcdn')){
      newData[i].cdn = 'GCDN';
    }
  }
}

module.exports = {
    parseRowData: parseRowData,
    checkUrlType: checkUrlType
    // writetoCSV: writetoCSV,
    // readRowData: readRowData
}