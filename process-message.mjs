import fbMessenger from 'fbmessenger';

const {
  Messenger,
  Button,
  Element,
  Image,
  Video,
  GenericTemplate,
  GreetingText,
  PersistentMenuItem,
  PersistentMenu,
  QuickReply,
  QuickReplies,
  ReceiptTemplate,
  ListTemplate,
  Address,
  Summary,
  Adjustment,
} = fbMessenger;

// Don't forget to add it to your `.env` file.
const {
  FACEBOOK_ACCESS_TOKEN
} = process.env;

const messenger = new Messenger({
  pageAccessToken: FACEBOOK_ACCESS_TOKEN
});

//Pass the userID and string that you want the bot to return to the user
const sendTextMessage = (userId, text) => {
  messenger.send({
    text: text
  }, userId);
};


// Pass through the userID string, along with the string of the image url you wish to use in order to send it to the user.
const sendImageMessage = (userId, url) => {
  messenger.send(new Image({
    url: url,
    is_reusable: true
  }), userId)
};

/*
Similar to sendTextMessage, but pass an array of quick replies in the following format:
          [{
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

  Refer to Facebook API for supported content_type, title is the name that you wish to appear on the quick reply, payload is what is returned to the bot when
  the end user selects a quick reply.
*/
const sendQuickReplyMessage = (userId, text, replies) => {
  messenger.send(Object.assign(new Text(text), replies), userId);
};
/*
This likely needs to be refactored to be more than a single use call. Currently passing the userID of the end user will 
send them a collection featuring how to install the Book of Mormon on their device
*/
const sendBookMessage = userId => {
  messenger.send(new GenericTemplate({
    elements: [element] = new Element([{
      title: "The Book of Mormon",
      image_url: "https://assets.ldscdn.org/0a/bf/0abf50527076758eb00e719b78d8491922daf1e0/teens_book_of_mormon.jpeg",
      subtitle: "Another Testament of Jesus Christ",
      default_action: {
        type: "web_url",
        url: "https://www.churchofjesuschrist.org/study/scriptures/bofm?lang=eng",
        webview_height_ratio: "tall"
      },
      buttons: [
        new Button({
          type: "web_url",
          url: "https://play.google.com/store/apps/details?id=org.lds.bom",
          title: "Download for Android"
        }),
        new Button({
          type: "web_url",
          url: "https://apps.apple.com/us/app/the-book-of-mormon/id547313550",
          title: "Download for iOS"
        }),
        new Button({
          type: "web_url",
          url: "https://www.churchofjesuschrist.org/study/scriptures/bofm",
          title: "Read Online"
        })
      ]
    }])
  }), userId)
  .then(console.log(res))
  .catch(err => console.log(err));
}

/*
Pass this the userID, an array of buttons, the link that the user gets by clicking the template and the type.
Example usage:
 sendMediaTemplate(
   userId,
   [{
     type: "postback", // Refer to Facebook api, postback means that when it is clicked the bot is sent the payload in the text.
     title: "I want to learn more!", // Text that you want on the button
     payload: "meet_missionaries" // payload returned to bot when button selected
   }],
   "video",
   "https://www.facebook.com/ComeUntoChrist/videos/1834287723271507"
 )
*/
const sendMediaTemplate = (userId, buttons, type, link) => {
  messenger.send({
    "attachment" : {
      "type" : "template",
      "payload": {
        "template_type": "media",
        "elements": [{
          media_type: type,
          url: link,
          buttons: buttons
        }]
      }
    }
  }, userId);
};

/*
Pass this the message object, userId and the info object, and it will automatically determine if the message is within the scope of Wit.Ai and reply with the proper message.
Example usage:
function handlePostback(event, info) {
  const userId = event.sender.id;
  const payload = event.postback.payload;
  return determineIntent({ confidence: 1, value: payload }, userId, info);
}
*/
function determineIntent(message, userId, info) {
  if (message.confidence >= 0.8) {
    messenger.senderAction('typing_on', userId);
    switch (message.value) {
      case "request_book":


        sendBookMessage(userId);
        break;
      case "basic_beliefs":


        sendTextMessage(
          userId,
          `${
            info.first_name != undefined
              ? "Hey " + info.first_name + "!"
              : "Hey!"
          } As Christians, we believe in learning all we can about Jesus. The greatest happiness in life comes from following the Savior. You will feel His love for you as you seek to understand His life and teachings.`
        );
        sendMediaTemplate(
          userId,
          [{
            type: "postback",
            title: "I want to learn more!",
            payload: "meet_missionaries"
          }],
          "video",
          "https://www.facebook.com/ComeUntoChrist/videos/1834287723271507"
        );
        break;
      case "who_is_jesus":


        sendTextMessage(
          userId,
          "Jesus is the Son of God and our loving Savior. He lived to teach us, and  He suffered and died to save us from sin and death. Because of Him, we  can be forgiven, we can overcome challenges, and we can live with God  again someday.",
          "https://assets.ldscdn.org/c9/21/c921f1ca8b509f367491922c1db697bc548a6f80/christ_rich_man_hofmann_art.jpeg"
        );
        /*sendImageMessage(
          userId,
          "https://assets.ldscdn.org/c9/21/c921f1ca8b509f367491922c1db697bc548a6f80/christ_rich_man_hofmann_art.jpeg"
        );*/
        sendMediaTemplate(
          userId,
          [{
            type: "postback",
            title: "How do I learn more?",
            payload: "meet_missionaries"
          }],
          "video",
          "https://www.facebook.com/ComeUntoChrist/videos/1844677835565829"
        );
        break;
      case "meet_missionaries":


        sendQuickReplyMessage(
          userId,
          "We would love to help, how would you like us to get in contact with you?",
          [{
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


        sendTextMessage(
          userId,
          `${
            info.first_name != undefined
              ? "Hey " + info.first_name + "!"
              : "Hey!"
          } Like the Bible, the Book of Mormon is an ancient record that  teaches about Jesus. It answers essential questions that we all have: Is there life after death, what is the purpose of life, and how can I find happiness and peace now? People from all over the world, and from all  walks of life, are learning that the Book of Mormon can help us become better people and feel closer to God.`
        );
        sendMediaTemplate(userId,
          [{
              type: "postback",
              title: "Request a Copy",
              payload: "request_book"
            },
            {
              type: "postback",
              title: "Learn More",
              payload: "meet_missionaries"
            }

          ],
          "video",
          "https://www.facebook.com/ComeUntoChrist/videos/880047042028918")
        break;
      case "info_bible":


        sendTextMessage(
          userId,
          "Absolutely! We follow and believe in all of the teachings of the Bible, as well as the Book of Mormon. Together they preach and teach of Jesus Christ."
        );
        sendMediaTemplate(
          userId,
          [{
            type: "postback",
            title: "Can I learn more?",
            payload: "meet_missionaries"
          }],
          "video",
          "https://www.facebook.com/ComeUntoChrist/videos/1328179177215700"
        );
        break;
      case "life_purpose":


        sendTextMessage(
          userId,
          "Life is a proving ground for us.\nGod sent us to earth to learn and grow through experiences, both pleasant and painful. He lets us choose between good and evil and lets us decide whether we will serve others or focus only about ourselves. The challenge is to have faith in His plan even though we don’t have all of the answers. Because we all make mistakes, God sent His Son, Jesus Christ, so we can be cleansed and forgiven. When we accept Jesus and follow His example, we become less selfish and can enjoy greater love, peace, and joy."
        );
        sendMediaTemplate(
          userId,
          [{
            type: "postback",
            title: "Can I learn more?",
            payload: "meet_missionaries"
          }],
          "video",
          "https://www.facebook.com/ComeUntoChrist/videos/880555581978064"
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

/*
This is a stub that likely needs to be reworked at some point.
Currently this continues responding to the user when they select
a quickreply message or a message with a payload, for scheduling an appointment.
For usage, as it is only used once, view handlerMessage()
*/
function continuePayload(message, userId) {
  if (message.nlp.entities.phone_number != undefined) {
    if (message.nlp.entities.phone_number[0].confidence > .9) {
      sendTextMessage(
        userId,
        "Thanks! We will get back to you shortly."
      );
    }
  } else if (message.nlp.entities.email != undefined) {
    if (message.nlp.entities.email[0].confidence > .9) {
      sendTextMessage(
        userId,
        "Alright, we will get in contact shortly!"
      );
    }
  } else {
    switch (message.quick_reply.payload) {
      case "request_phone":


        sendQuickReplyMessage(userId, "Sure, what is your phone number?", [{
          content_type: "user_phone_number",
          payload: "phone_sent"
        }]);
        break;
      case "request_video":


        sendTextMessage(
          userId,
          "Ok, we will call you on messenger. When is a good day for you?"
        );
        break;
      case "request_email":


        sendQuickReplyMessage(userId, "Sure, what is your Email?", [{
          content_type: "user_email",
          payload: "email_sent"
        }]);
        break;
      default:
        break;
    }
  }
}
/*
This is the main entry point of this entire module. 
handleMessage takes the event object (message text, Wit.AI data, etc) and the info object (Users name, etc).
Based on what is contained within the event object this function will complete scheduling an appointment,
starting a conversation etc.
*/
function handleMessage(event, info) {
  //console.log("Hey Listen " + JSON.stringify(event));
  const userId = event.sender.id;
  const message = event.message.text;
  if (
    event.message.quick_reply != undefined &&
    typeof event.message.nlp.entities.intent === "undefined"
  ) {
    //console.log(JSON.stringify(event));
    return continuePayload(event.message, userId);
  } else if (typeof event.message.nlp.entities.intent === "undefined") {
    return;
  } else {
    return determineIntent(event.message.nlp.entities.intent[0], userId, info);
  }
}

// Secondary entry point, called when event contains a postback, and handles the appropriate response.
function handlePostback(event, info) {
  const userId = event.sender.id;
  const payload = event.postback.payload;
  return determineIntent({
    confidence: 1,
    value: payload
  }, userId, info);
}

export default {
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