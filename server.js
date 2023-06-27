'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const subdomain = process.env.VONAGE_SUBDOMAIN;
const vonageNumber = process.env.VONAGE_PHONE_NUMBER;

if (!subdomain || !vonageNumber) {
  throw new Error('Set the environment variables');
}

const allowedDomains = ['https://develop.d1c2tjcpinymi4.amplifyapp.com'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedDomains.includes(origin)) {
    console.log('allowed');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    next();
  } else {
    res.status(403).send('Unauthorized access');
  }
});

app.get('/voice/answer', (req, res) => {
  console.log('/voice/answer');
  console.log(req.query);
  console.log('---');
  res.json([
    {
      action: 'talk',
      text: 'Please wait while we connect you.'
    },
    {
      action: 'connect',
      from: vonageNumber,
      endpoint: [{ type: 'phone', number: req.query.to }]
    }
  ]);
});

app.all('/voice/event', (req, res) => {
  console.log('/voice/event');
  console.dir(req.body);
  console.log('---');
  res.sendStatus(200);
});

app.listen(3000);

const localtunnel = require('localtunnel');
(async () => {
  const tunnel = await localtunnel({
    subdomain: subdomain,
    port: 3000
  });
  console.log(`App available at: ${tunnel.url}`);
})();
