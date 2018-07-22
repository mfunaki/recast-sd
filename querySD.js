// discoverMovie.js
const axios = require('axios');
const config = require('./config.js');
const tools = require('./tools.js');
const baseURL = 'https://i053832trial-trial.apim1.hanatrial.ondemand.com/i053832trial/SD_F1873_SO_WL_SRV';
const paraURL1 = '/C_SalesOrderWl_F1873/?sap-client=100';
const paraURL2 = '&$select=SalesOrder,SoldToParty,to_SoldToParty/CustomerName,PurchaseOrderByCustomer,' +
    'RequestedDeliveryDate,OverallSDProcessStatus,TotalNetAmount,' +
    'TransactionCurrency,SalesOrderDate&$expand=to_SoldToParty';
const paraURL3 = '&$format=json';

function querySD(dateRange, numbers, status) {
  var url = baseURL + paraURL1;
  if (numbers == null) {
      numbers = 5;
  }
  url = url + `&$skip=0&$top=${numbers}`;
  url = url + `&orderby=SalesOrderDate%20desc,SalesOrder%20desc`;
  url = url + paraURL2;
  const statusId = tools.getProcessStatusId(status);
  if (statusId != null) {
    url = url + `&$filter=OverallSDProcessStatus%20eq%20%27${statusId}%27`;
  }
  url = url + paraURL3;
  return axios
    .get(url, {
        auth: {
          username: config.BASIC_AUTH_API_USERNAME,
          password: config.BASIC_AUTH_API_PASSWORD
        }
      })
    .then(results => {
      if (results.data.d.results.length == 0) {
        return [{
          type: 'quickReplies',
          content: {
            title: '指定された受注情報は見つかりませんでした。',
            buttons: [{ title: '最初から', value: '最初から' }],
          },
        }];
      }  
      const cards = results.data.d.results.slice(0, numbers).map(sd => ({
        type: 'text',
        content: `受注: ${sd.SalesOrder}\n` + 
          `受注先: ${sd.SoldToParty}\n` +
          `得意先: ${sd.to_SoldToParty.CustomerName}\n` +
          `正味額: ${sd.TransactionCurrency} ${sd.TotalNetAmount}\n` +
          `伝票日付: ${tools.parseJsonDate(sd.SalesOrderDate)}\n` +
          `指定納期: ${tools.parseJsonDate(sd.RequestedDeliveryDate)}\n` +
          `処理ステータス: ${tools.getProcessStatus(sd.OverallSDProcessStatus)}`
      }));

      return cards;
    })
    .catch((error) => {
      console.log('通信に失敗しました。');
    });
}

module.exports = querySD;

