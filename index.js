const csv=require('csvtojson')
var fs = require('fs');

const convertToJsonArray = (csvFilePath) => {
  return csv().fromFile(csvFilePath);
}

const writeJsonArrayToFile = (data) => {
  const json = JSON.stringify({ data }, null, 2);
  fs.writeFile('dataJson.json', json, 'utf8', () => { console.log('Content write complete'); });
}

const getParsedParams = str => {
  const paramsStartIndex = str.indexOf('params=') + 7;
  const lastCurlyBraceIndex = str.lastIndexOf('} ');
  return JSON.parse(str.slice(paramsStartIndex , lastCurlyBraceIndex + 2).replaceAll('=>', ':').replaceAll('nil', null));
}

const getParsedIp = (str) => {
  const strStartingIpAddr = str.slice(str.indexOf('ip=') + 3);
  return strStartingIpAddr.slice(0, strStartingIpAddr.indexOf(' '));
}

const start = async () => {
  const csvFilePath = './data.csv';
  const jsonArray = await convertToJsonArray(csvFilePath);
  const parsedData = jsonArray.map((record) => {
    const params = getParsedParams(record.message);
    const ip = getParsedIp(record.message);
    return { date: record.date, ip, ...params };
  });

  return writeJsonArrayToFile(parsedData);
};

start();
