const fetch = require("node-fetch");

// You can find your project ID in your Dialogflow agent settings
const projectId = "test-hffkcy"; //https://dialogflow.com/docs/agents#settings
const sessionId = "123456";
const languageCode = "en-US";

const dialogflow = require("dialogflow");

const config = {
  credentials: {
    private_key: JSON.parse("-----BEGIN PRIVATE KEY-----MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDS+bXI+0H3mWI5OexgEYq1RvzsnzDZoGPqBc8qDlttukX+SvwqO8BMO99QR+81RzzjERSGNlKDUiRiYjG3U20qKg3eh7FXYq2Nbog6sX6TgGRznnlLzZGBUpuCaXFe/hdpKgiKrpIFX7DsKnHU4WhvrHvEFx4rWq//35iK5AM3yoqCAW0h2tG98qK1xux8bR+yZqg6t8MZ23CJJRSmWaYnHclfRUJUV2tJCojkIf1+gZgFHj6X019ZYEf9DkSIXx1gAMZm3eVNmOjvODbeCzCs9iCOgWb/QyoNyIUsTkPP8xlhRW1EU4CCYMSWTxLl/V8vzuyLT7cRJMuIBLOhr507AgMBAAECggEADQul0LAcGWxYd4Np1IChLmCwD+kK59DvjviLj0Cbu4upjb8jQEwm+uISmRRgfBjBuhJoclga/upbznRxXkSANo30AwXhQGXmXkIKKHE7Qk0W1sEZ/0by+MwJk6U+7BwTiRVV3ioCrcIaA0K66lfwrR8Y1Bf0tueTFr96lj0q3lfA8rvNQAWvKhYltM39dK/gnnWOnuoZ6qhaK3d2xRMabzak0E10dJDCNWk7Ife8a9M26z3EkBnEuaTy9m3Bpz84Vx9LElQXGv7ECNaHIrnMK86gDRj8+wc1qNR+H1kKR4EzyrFhysIpLqG+kE+8gXFkFKBwydIxOWmtunFTzNgLUQKBgQDuYeS8sumw2eQkCqpN6qowXCy2N9ROMgxL58le6OTIdE+X6XACXfah4mq8J3XRF70gm05pg6+K+7RYhW4+i1wCrWldJO8FXbMFUB83vUxDU/RW+dbKjhjjpgrGoFlGWPglmCNW972RsZ89Sn9lx0m4GGdBUuMG6ktIDhhsAgoq6QKBgQDikUl2C+bBqPZLgtq0nmbiDKfsOUwSNcFkOpdtud9sTYI7TzobD0W6LwqLS9sMsJNKKZOh/Wd4fyxhQJV8jYxyvy1CzPk1IfcmueRk33mt2USdQrGb9nR+qXLQ+dbDZwDhePBZYQLhmTkw5DCxYuFBwy6LTVFSnnVb56YymoVogwKBgQDGlRBazeR1ah5uk9/phrp+DNtGdN3Mwk6SESYkhXjJMHN5xoKDxkkF9LsbwPeZ1t+7wQUiSww6iJJlR8peGfPtWw6yBGmFm9fdbjCDW5OjZtXeesSe+p7rTdAeRUf5nXYiw0l1Um4+Z6yS/3N/kvPrg5DIz0bG5PkProZTu6NCuQKBgEP/YLHKDp5urESraCIvLCeJrtgpthf9BCalow7uawyhEoXkWEcIxV+EgMCfqoVbdUkbw1ApsmUqndIuRO8VuGIz2EylIeH9aKS5w782htlTTNF5075AMGRXTLtFUFxizJPe7RuWDvxQNSbkRWznhT1sa8qpENAf+I71rh6f24wrAoGBAMQhqBJtvb6h8oV6QlI1b1Q2vEgl4oO1MWVQ2Xov0gvCdFozeaGSpGL/yHYwj216h3+OtCv0y5sAv6Hzdmd9ngnJm0CZt+dYGUgMDN99Ql0opfME5bCxEx78hmDCI3OXVdGatf0BStlwMJ8H3PYcFZDk05n43Z5ImR0wz/ChAo2L-----END PRIVATE KEY-----"),//JSON.parse(process.env.DIALOGFLOW_PRIVATE_KEY),
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

const sessionClient = new dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.
const { FACEBOOK_ACCESS_TOKEN } = process.env;

const sendTextMessage = (userId, text) => {
  return fetch(
    `https://graph.facebook.com/v7.0/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
    {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        messaging_type: "RESPONSE",
        recipient: {
          id: userId
        },
        message: {
          text
        }
      })
    }
  );
};

module.exports = event => {
  const userId = event.sender.id;
  const message = event.message.text;
  //sendTextMessage(userId, message);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode
      }
    }
  };

  sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;
      return sendTextMessage(userId, result.fulfillmentText);
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
};
