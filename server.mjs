//Keep the secret id secret and stuff


import dotenv from 'dotenv';
import fbMessenger from 'fbmessenger';
import bodyParser from 'body-parser';
import verifyWebhook from './verify-webhook.js';
import messageWebhook from './message-webhook.js';
import express from 'express';
import processMessage from './process-message.mjs';
import crypto from 'crypto';
dotenv.config({
  path: ".env"
});

const {
  FACEBOOK_ACCESS_TOKEN
} = process.env;
const {
  APP_SECRET
} = process.env;
const {
  Messenger
} = fbMessenger;
const messenger = new Messenger({
  pageAccessToken: FACEBOOK_ACCESS_TOKEN
});
const {
  handleMessage,
  handlePostback
} = processMessage;
const app = express();
const port = (process.env.PORT || 5000);

/* 
   Verify that the webhooks come from Facebook. 
   This should be added to verify-webhook.js at some point.
*/
const verifyRequestSignature = (req, res, buf) => {
  const signature = req.headers['x-hub-signature'];

  if (!signature) {
    throw new Error('Couldn\'t validate the signature.');
  } else {
    const elements = signature.split('=');
    const signatureHash = elements[1];
    const expectedHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(buf).digest('hex');

    if (signatureHash !== expectedHash) {
      throw new Error('Couldn\'t validate the request signature.');
    }
  }
};

messenger.on('message', (event) => {
  messenger.senderAction('mark_seen', event.sender.id);
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(event.sender.id));
  messenger.getUser(event.sender.id)
  .then((user) => {
    handleMessage(event, user)
  })
  //handleMessage(event, );
});

messenger.on('postback', (event) => {
  messenger.senderAction('typing_on', event.sender.id);
  messenger.getUser(event.sender.id)
  .then((user) => {
    handlePostback(event, user)
  })
});

// Verify the webhook, calls verifyWebhook which confirms it is 
// From Facebook
app.get("/", verifyWebhook);
app.use(bodyParser.json({
  verify: verifyRequestSignature
}));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.listen(port, () => console.log("Express server running on port " + port));
app.post("/", (req, res) => {
  res.sendStatus(200);
  messenger.handle(req.body);
});
