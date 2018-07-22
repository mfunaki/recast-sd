// discoverMovie.js
const axios = require('axios');
const config = require('./config.js');
const tools = require('./tools.js');
const baseURL = 'https://i053832trial-trial.apim1.hanatrial.ondemand.com/i053832trial/SD_F1873_SO_WL_SRV';
const paraURL = '/C_SalesOrderWl_F1873/$count?sap-client=100';

function querySDCount(dateRange, numbers, status) {
  var url = baseURL + paraURL;
  const statusId = tools.getProcessStatusId(status);
  if (statusId != null) {
    url = url + `&$filter=OverallSDProcessStatus%20eq%20%27${statusId}%27`;
  }
  return axios
    .get(url, {
        auth: {
          username: config.BASIC_AUTH_API_USERNAME,
          password: config.BASIC_AUTH_API_PASSWORD
        }
      })
    .then(results => {
      const count = results.data;
      var text;
      if (statusId != null) {
        text = [
          { type: 'text', content: `${count}件の受注が${status}です。` }
        ];
      } else {
        text = [
          { type: 'text', content: `受注は全部で${count}件です。` }
        ];
      }
      return text;
    })
    .catch((error) => {
      console.log('通信に失敗しました。');
    });
}

module.exports = querySDCount;

