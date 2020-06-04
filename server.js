require("dotenv").config({
  path: ".env"
});

const express = require("express");
const bodyParser = require("body-parser");
const port = 5000;
const verifyWebhook = require("./verify-webhook");
const messageWebhook = require("./message-webhook");
const app = express();

app.get("/", verifyWebhook);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.listen(port, () => console.log("Express server running on port " + port));
app.post("/", messageWebhook);
