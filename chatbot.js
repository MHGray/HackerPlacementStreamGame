const TwitchJS = require('twitch-js');
const request = require('request');
const options = require('./secrets').options

// https://github.com/twitch-apis/twitch-js/blob/master/docs/Chat/Configuration.md
const client = new TwitchJS.client(options);
client.on('chat',handleMessage);

function handleMessage(channel, user, message, self){
  if (self) return;

  //TODO: update player activity when this comes around.

  //if this isn't a command, take a hike
  if(message.slice(0,1) != "!"){
    return;
  }

  let command = message.split(" ")[0];

  switch(command){
    case "!hack":
      let targetNum = Number(message.split(" ")[1]);
      if(/^\d+$/.test(targetNum)){
        let data = {
          name: "hack",
          target: targetNum
        };
        sendRequest(user.username, data);
      }else{
        client
          .say(channel, "That is an invalid node number")
          .then(() => console.log("Message Sent")  )
          .catch((err) => console.log("Couldn't send message:", err))
      }

      break;
    case "!node":
      let nodeNum = Number(message.split(" ")[1]);
      if(/^\d+$/.test(nodeNum)){
        let data = {
          name: "node",
          target: nodeNum
        };
        sendRequest(user.username, data);
      }else{
        client
          .say(channel, "That is an invalid node number")
          .then(() => console.log("Message Sent")  )
          .catch((err) => console.log("Couldn't send message:", err))
      }
      break;
    case "!stats":
      sendRequest(user.username, {name: "stats", target: null});
      break;
    case "!craft":
      //TODO Build crafting stuffs
      break;
  }
}

function sendRequest(user, command){
  if(user == undefined || command == undefined){
    console.log("Bad Chatbot Request, user or command undefined");
    return;
  }

  let options = {
    url: "http://localhost:3000/game/chat",
    method: "POST",
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      user: user,
      command: command
    })
  }

  request(options, (err,res,body)=>{
    // console.log("request result",res);
  });
}

// Finally, connect to the channel
client.connect()
 .catch((err) => console.log('chatbot error occurred: ', err));

module.exports = client;
