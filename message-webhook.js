/*const {handleMessage, handlePostback} = require("./process-message");
const { FACEBOOK_ACCESS_TOKEN } = process.env;
const fetch = require("node-fetch");*/

/*
Only entrypoint to this module, it determines if the webhook is valid, then determines if data should be used, and called retrieveInfo()
*/
/*module.exports = (req, res) => {
  //console.log(req);
  if (req.body.object === "page") {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message || event.postback) {
          retrieveInfo(event);
        }
      });
    });

    res.status(200).end();
  }
};*/

/*
When called, this function retrieves the users name and other available info, then calls the appropriate method.
This may contain a race condition.
*/
/*function retrieveInfo (event) {
  fetch(`https://graph.facebook.com/${event.sender.id}?fields=first_name,last_name,profile_pic&access_token=${FACEBOOK_ACCESS_TOKEN}`)
  .then(response => response.json())
  .then(data => {
    if(event.postback){
      handlePostback(event, data);
    } 
    else{ 
      handleMessage(event, data);
    }
    
  });
}*/
