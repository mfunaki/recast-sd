// index.js
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');

const querySD = require('./querySD.js');
const querySDCount = require('./querySDCount.js');

const app = express();
app.use(bodyParser.json());

app.post('/errors', (req, res) => {
  console.error(req.body);
  res.sendStatus(200);
});

app.post('/query-sd', (req, res) => {
  console.log('[POST] /query-sd');
  const nlp = req.body.nlp;
  const intents  = nlp.intents;   // sdquery, sdquerycount, sdquerytotal
  const entities = nlp.entities;  // DATERANGE, NUMBERS, PROCESSSTATUS
  
  const intent = intents[0].slug;

  var dateRange = null;
  if (entities.hasOwnProperty('daterange')) {
    daterange = entities.daterange[0].value;
  }
  var numbers = null;
  if (entities.hasOwnProperty('numbers')) {
    numbers = entities.numbers[0].value;
  }
  var status = null;
  if (entities.hasOwnProperty('processstatus')) {
    status = entities.processstatus[0].value;
  }

  if (intent == 'sdquery') {
    return querySD(dateRange, numbers, status)
      .then((text) => res.json({
        replies: text,
    }))
    .catch((err) => console.error('querySD error: ', err));
  } else if (intent == 'sdquerycount') {
    return querySDCount(dateRange, numbers, status)
      .then((text) => res.json({
        replies: text,
    }))
    .catch((err) => console.error('querySDCount error: ', err));
  } else if (intent == 'sdquerytotal') {
    // not implemented
  } else {

  }
  return;
});

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`));