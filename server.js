"use strict";

require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json());

const subdomain = process.env.VONAGE_SUBDOMAIN;
const vonageNumber = process.env.VONAGE_PHONE_NUMBER;

if (!subdomain || !vonageNumber) {
  throw new Error("Set the subdomain and vonageNumber variables");
}

app.get("/voice/answer", (req, res) => {
  console.log("/voice/answer");
  console.log(req.query);
  console.log("---");
  res.json([
    {
      action: "talk",
      text: "Please wait while we connect you.",
    },
    {
      action: "connect",
      from: vonageNumber,
      endpoint: [{ type: "phone", number: req.query.to }],
    },
  ]);
});

app.all("/voice/event", (req, res) => {
  console.log("/voice/event");
  console.dir(req.body);
  console.log("---");
  res.sendStatus(200);
});

app.listen(3000);

const localtunnel = require("localtunnel");
(async () => {
  const tunnel = await localtunnel({
    subdomain: subdomain,
    port: 3000,
  });
  console.log(`App available at: ${tunnel.url}`);
})();
