//Verify webhook with Facebook so it doesn't ban the bot.
const verifyWebhook = (req, res) => {
  let VERIFY_TOKEN = "James1:5";

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("We are Called");
  } else {
    res.sendStatus(403);
  }
};

module.exports = verifyWebhook;
