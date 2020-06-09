const fetch = require("node-fetch");

// Don't forget to add it to your `.env` file.
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

const setTyping = userId => {
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
        sender_actions: "typing_on"
      })
    }
  );
};

const setRead = userId => {
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
        sender_actions: "mark_seen"
      })
    }
  );
};

const sendImageMessage = (userId, url, text) => {
  return fetch(
    `https://graph.facebook.com/v7.0/me/messages?batch=`,
    [
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
            attachment: {
              type: "image",
              payload: {
                url: url,
                is_reusable: true
              }
            }
          }
        })
      },
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
    ],
    `&access_token={${FACEBOOK_ACCESS_TOKEN}}`
  )
    .then(res => res.json())
    .then(json => console.log(json));
};

const sendQuickReplyMessage = (userId, text, replies) => {
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
          text,
          quick_replies: replies
        }
      })
    }
  );
};

const sendBookMessage = userId => {
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
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: "The Book of Mormon",
                  image_url:
                    "https://assets.ldscdn.org/0a/bf/0abf50527076758eb00e719b78d8491922daf1e0/teens_book_of_mormon.jpeg",
                  subtitle: "Another Testament of Jesus Christ",
                  default_action: {
                    type: "web_url",
                    url:
                      "https://www.churchofjesuschrist.org/study/scriptures/bofm?lang=eng",
                    webview_height_ratio: "tall"
                  },
                  buttons: [
                    {
                      type: "web_url",
                      url:
                        "https://play.google.com/store/apps/details?id=org.lds.bom",
                      title: "Download for Android"
                    },
                    {
                      type: "web_url",
                      url:
                        "https://apps.apple.com/us/app/the-book-of-mormon/id547313550",
                      title: "Download for iOS"
                    },
                    {
                      type: "web_url",
                      url:
                        "https://www.churchofjesuschrist.org/study/scriptures/bofm",
                      title: "Read Online"
                    }
                  ]
                }
              ]
            }
          }
          //text
        }
      })
    }
  );
};

function determineIntent(message, userId, info) {
  if (message.confidence >= 0.8) {
    switch (message.value) {
      case "request_book":
        setTyping(userId);
        setRead(userId);
        sendBookMessage(userId);
        break;
      case "basic_beliefs":
        setTyping(userId);
        setRead(userId);
        sendTextMessage(
          userId,
          `${
            info.first_name != undefined
              ? "Hey " + info.first_name + "!"
              : "Hey!"
          } As Christians, we believe in learning all we can about Jesus. The greatest happiness in life comes from following the Savior. You will feel His love for you as you seek to understand His life and teachings.`
        );
        break;
      case "who_is_jesus":
        setTyping(userId);
        setRead(userId);
        /*sendTextMessage(
          userId,
          "Jesus is the Son of God and our loving Savior. He lived to teach us, and  He suffered and died to save us from sin and death. Because of Him, we  can be forgiven, we can overcome challenges, and we can live with God  again someday.",
          "https://assets.ldscdn.org/c9/21/c921f1ca8b509f367491922c1db697bc548a6f80/christ_rich_man_hofmann_art.jpeg"
        );*/
        sendImageMessage(
          userId,
          "https://assets.ldscdn.org/c9/21/c921f1ca8b509f367491922c1db697bc548a6f80/christ_rich_man_hofmann_art.jpeg", "Jesus is the Son of God and our loving Savior. He lived to teach us, and  He suffered and died to save us from sin and death. Because of Him, we  can be forgiven, we can overcome challenges, and we can live with God  again someday."
        );
        break;
      case "meet_missionaries":
        setTyping(userId);
        setRead(userId);
        sendQuickReplyMessage(
          userId,
          "We would love to help, how would you like us to get in contact with you?",
          [
            {
              content_type: "text",
              title: "Email",
              payload: "request_email"
            },
            {
              content_type: "text",
              title: "Phone",
              payload: "request_phone"
            },
            {
              content_type: "text",
              title: "Video Call",
              payload: "request_video"
            }
          ]
        );
        break;
      case "info_book":
        setTyping(userId);
        setRead(userId);
        sendTextMessage(
          userId,
          `${
            info.first_name != undefined
              ? "Hey " + info.first_name + "!"
              : "Hey!"
          } Like the Bible, the Book of Mormon is an ancient record that  teaches about Jesus. It answers essential questions that we all have: Is there life after death, what is the purpose of life, and how can I find happiness and peace now? People from all over the world, and from all  walks of life, are learning that the Book of Mormon can help us become better people and feel closer to God.`
        );
        break;
      default:
        break;
    }
    return;
  } else {
    return;
  }
}

function continuePayload(message, userId) {
  switch (message.quick_reply.payload) {
    case "request_phone":
      setTyping(userId);
      setRead(userId);
      sendQuickReplyMessage(userId, "Sure, what is your phone number?", [
        {
          content_type: "user_phone_number",
          payload: "phone_sent"
        }
      ]);
      break;
    case "request_video":
      setTyping(userId);
      setRead(userId);
      sendTextMessage(
        userId,
        "Ok, we will call you on messenger. When is a good day for you?"
      );
      break;
    case "request_email":
      setTyping(userId);
      setRead(userId);
      sendQuickReplyMessage(userId, "Sure, what is your Email?", [
        {
          content_type: "user_email",
          payload: "email_sent"
        }
      ]);
      break;
    default:
      break;
  }
}

function handleMessage(event, info) {
  const userId = event.sender.id;
  const message = event.message.text;
  if (
    event.message.quick_reply != undefined &&
    typeof event.message.nlp.entities.intent === "undefined"
  ) {
    return continuePayload(event.message, userId);
  } else if (typeof event.message.nlp.entities.intent === "undefined") {
    return;
  } else {
    return determineIntent(event.message.nlp.entities.intent[0], userId, info);
  }
}

function handlePostback(event, info) {
  const userId = event.sender.id;
  const payload = event.postback.payload;
  return determineIntent({ confidence: 1, value: payload }, userId, info);
}

module.exports = {
  handleMessage,
  handlePostback
};

//Set the API

/*
curl -X POST -H "Content-Type: application/json" -d '{
        "persistent_menu": [{
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [{
                    "type": "postback",
                    "title": "What is the Book of Mormon",
                    "payload": "info_book"
                },
                {
                    "type": "postback",
                    "title": "What are your basic beliefs?",
                    "payload": "basic_beliefs"
                },
                {
                    "type": "postback",
                    "title": "I want to meet missionaries.",
                    "payload": "meet_missionaries"
                }
            ]
        }]
}' "https://graph.facebook.com/v7.0/me/messenger_profile?access_token=<token>"*/
