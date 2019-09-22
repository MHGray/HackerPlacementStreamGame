const TwitchJS = require('twitch-js');
const request = require('request');

// Setup the client with your configuration; more details here:
// https://github.com/twitch-apis/twitch-js/blob/master/docs/Chat/Configuration.md
const options = {
  channels: ["#phlip45"],
  identity: {
    username: "mushroomkingdombot",
    password: "oauth:hhjjlkaxohsfzoxhkfnygm9bhqfwri"
  },
};

const client = new TwitchJS.client(options);

// Add chat event listener that will respond to "!command" messages with:
// "Hello world!".
client.on('chat', (channel, user, message, self) => {
  // Do not repond if the message is from the connected identity.
  if (self) return;

  //TODO: update player activity when this comes around.
  //if this isn't a command, take a hike
  if(message.slice(0,1) != "!"){
    return;
  }

  let command = message.split(" ")[0];

  switch(command){
    case "!hack":

      break;
    case "!node":

      break;
    case "!stats":

      break;
    case "!craft":

      break;
  }

 //  if (options.identity && message === '!command') {
 //    // If an identity was provided, respond in channel with message.
 //    client.say(channel, 'Hello world!');
 // }
});

// Finally, connect to the channel
client.connect();

module.exports = client;
