const TwitchJS = require('twitch-js');
const request = require('request');
const options = require('./secrets').options

// https://github.com/twitch-apis/twitch-js/blob/master/docs/Chat/Configuration.md
const client = new TwitchJS.client(options);
client.on('chat',handleMessage);

let messageQueue = [];

//Get Message Queue
setInterval(getMessageQueue,2000);

function handleMessage(channel, user, message, self){
  if (self) return;

  //if this isn't a command, take a hike
  if(message.slice(0,1) != "!"){
    sendRequest(user.username, {name: "active", target: null})
      .catch(err=>{
        console.log("Chatbot Active message request error: ", err);
      })
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
        sendRequest(user.username, data)
          .then(res => {
            client.say(channel, res);
          })
          .catch(err =>{
            console.log("Hack Command Response Error");
          })
      }else{
        client
          .say(channel, "That is an invalid node number")
          .then((res) => console.log("Message Sent")  )
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
        sendRequest(user.username, data)
          .then(res => {
            client.say(channel, res);
          })
          .catch(err =>{
            console.log("Node Command Response Error");
          })
      }else{
        client
          .say(channel, "That is an invalid node number")
          .then(() => console.log("Message Sent")  )
          .catch((err) => console.log("Couldn't send message:", err))
      }
      break;
    case "!nodes":
      sendRequest(user.username, {name: "nodelist", target: null});
      break;
    case "!stats":
      sendRequest(user.username, {name: "stats", target: null});
      break;
    case "!craft":
      //TODO Build crafting stuffs
      break;
    case "!test":
      sendRequest(user.username, {name: "test", target: null});

      break;
  }
}

function sendRequest(user, command){
  return new Promise((resolve,reject)=>{
    if(user == undefined || command == undefined){
      reject("Bad Chatbot Request, user or command undefined");
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
      if(err){
        reject(err);
      }
      if(res == undefined){
        reject("request respopnse is undefined in ChatBot");
        return;
      }
      if(res.statusCode >= 200 && res.statusCode < 300){
        resolve(res.body);
      }
    });
  })
}

function getRequest(command){
  return new Promise((resolve, reject) => {
    if(command == undefined){
      reject("Bad Chatbot Command getRequest");
    }

    let options = {
      url: "http://localhost:3000/game/chat?command="+ command,
      method: "GET",
    }

    request(options, (err,res,body)=>{
      if(err){
        reject(err);
      }
      if(res.statusCode >= 200 && res.statusCode < 300){
        resolve(JSON.parse(res.body));
      }
    })
  })
}

function getMessageQueue(){
  getRequest("messages")
    .then(msgs =>{
      messageQueue = messageQueue.concat(msgs)
    })
    .catch(err =>{
      console.log(err);
    })

  if(messageQueue.length > 0){
    console.log(messageQueue);
    client.say(options.channels[0], messageQueue.shift());
  }
}

// Finally, connect to the channel
client.connect()
 .catch((err) => console.log('chatbot error occurred: ', err));

module.exports = client;
