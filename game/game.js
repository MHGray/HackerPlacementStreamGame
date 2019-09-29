const clone = require('lodash').cloneDeep;
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/twitch';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true }).then(()=> console.log("Mongoose Ready"));

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Hacker = require('./../mongoose/models/hacker');
var Node = require('./../mongoose/models/node');
var Item = require('./../mongoose/models/item');
var Augment = require('./../mongoose/models/augment');

let game = {
  name: "HACKY HACKY GAME",
  players: [], // Active players
  chosenPlayer: null,
  nodes: [], //Active nodes
  tickTime: 150000,
  numNodes: 6,

  nodeDeck: [],
  playerDeck: [],
  corpNodeDeck: [],
  ready: {
    nodeDeck: false,
    playerDeck: false,
    corpNodeDeck: true,
    check: function(){
      if (this.nodeDeck && this.playerDeck && this.corpNodeDeck){
        return true;
      }else{
        return false;
      }
    }
  },

  interval: null,

  messageQueue:[],
  eventQueue: [], // Information for overlay to process and draw

  // Game Functions
  load: function(){
    /* this will load  players/items/etc from the database */
    Hacker.find({})
      .then(res=>{
        this.playerDeck = res;
        // Clear previous hacking positions
        this.playerDeck.forEach(player =>{
          if(player.currentNode != -1){
              player.currentNodeId = -1;
              player.save();
          }
        })
        this.ready.playerDeck = true;
      })
      .catch(err =>{
        console.log(err);
      })

    Node.find({})
      .then(res=>{
        this.nodeDeck = res;
        this.ready.nodeDeck = true;
      })
      .catch(err=>{
        console.log(`Node database read error: ${err}`);
      })

    //Call Interval func until loaded
    this.interval = setInterval(()=>{
      if(this.ready.check()){
        clearInterval(this.interval);
        this.init();

      }
    }, 1000)
  },

  init: function(){
    /* initialize game variables */

    for(let i =0; i < this.numNodes; i++){
      this.nodes.push(
        clone(
          this.nodeDeck[randInt(this.nodeDeck.length)]
        )
      );
    }

    this.interval = setInterval(this.tick, this.tickTime);
  },

  tick: async function(){

    // Give all active players +1 credit
    game.players.map(player =>{
      player.credits += 1;
      setTimeout(()=>{
        player.save();
      },1000);
    })

    // For each node reduce time til completion by one if active
    game.nodes.forEach( node => {
      if(node.hacker != null){
        node.integrity--;
        if(node.integrity <= 0){
          game.processNode(node);
        }
      }
    })

    // TODO: Incorporate Corp Class Nodes
    // If corpEmergence is at 0 spawn a corp node and reset the timer
    // Else corpEmergence reduces by one

    //Check all active players to see when there last message was, if it has been longer than 10 minutes remove them from active players
    let currentTime = new Date();
    game.players = game.players.filter(player => {
      return currentTime - player.lastMsg < 600000;
    })
    // console.log("tick");

    //Remove last chosen players
    game.chosenPlayer = null;
    // Set random nonplaced player as the active player

    let eligiblePlayers = game.players.filter(player => {
      return player.currentNodeId == -1;
    })
    if(eligiblePlayers.length > 0){
          game.chosenPlayer = eligiblePlayers[randInt(game.players.length)];
          game.sendChat(`@${game.chosenPlayer.user}, It is your turn . . . !hack # to hack a node . . . !nodes to get a list of nodes`);
    }
  },

  processNode: async function(node){
    // get the hacker from playerDeck
    let hacker = this.players.find(player => player.user = node.hacker);
    //let hacker = await Hacker.findOne({user: node.hacker});
    if(hacker == undefined){
      console.log("Error in proccessing node, player not found");
      return;
    }

    // reduce the hackers resources based on node requirements
    let reqs = node.requirements;
    let metReqs = false;
    let randRewards = {
      credits: randInt(15),
      favors: randInt(5),
      secrets: randInt(1),
      programs: randInt(1)
    }
    if( hacker.credits >= reqs.credits &&
        hacker.secrets >= reqs.secrets &&
        hacker.favors >= reqs.favors &&
        hacker.programs >= reqs.programs){
      hacker.credits -= reqs.credits;
      hacker.secrets -= reqs.secrets;
      hacker.favors -= reqs.favors;
      hacker.programs -= reqs.programs;
      metReqs = true;
    }else{
      hacker.credits += randRewards.credits;
      hacker.secrets += randRewards.secrets;
      hacker.favors += randRewards.favors;
      hacker.programs += randRewards.programs;
    }

    if(metReqs){
      let rewards = node.rewards;
      hacker.credits += rewards.credits;
      hacker.secrets += rewards.secrets;
      hacker.favors += rewards.favors;
      hacker.programs += rewards.programs;
      this.sendChat(node.completionDesc);
      let totalsStr = `@${hacker.user} Earned: ${rewards.credits} Credits, `+
                      `${rewards.secrets} Secrets, ` +
                      `${rewards.favors} Favors, and ` +
                      `${rewards.programs} Programs`;
      this.sendChat(totalsStr);
    }else{
      this.sendChat(`@${hacker.user} Couldn't complete the mission `+
                    `but acquired: ${rewards.credits} Credits, `+
                                  `${rewards.secrets} Secrets, ` +
                                  `${rewards.favors} Favors, and ` +
                                  `${rewards.programs} Programs`);
    }

    hacker.currentNodeId = -1;
    game.players.find(pl => {
      return pl.user == hacker.user;
    }).currentNodeId = -1;

    let updatedHacker = await hacker.save();

    // replace node with random node from nodeDeck
    // TODO: Implement Corp Nodes and replace them with regular nodes here
    let curIndex = this.nodes.findIndex(nd => node.hacker == nd.hacker);
    this.nodes.splice(curIndex, 1);
    this.nodes.push(clone(this.nodeDeck[randInt(this.nodeDeck.length)]));
    return true;
  },

  // Helper Functions
  activatePlayer: function(doc){
    doc.lastMsg = new Date();
    let plyr = game.players.find(player =>{
      return doc.user == player.user;
    });
    if(plyr == undefined){
      game.players.push(doc);
    }else{
      plyr.lastMsg = new Date();
      plyr.currentNodeId = doc.currentNodeId;
    }
  },

  handleCommand: function(user, command){
    /* Takes a users command and executes the correct function */
    return new Promise((resolve,reject) =>{

      switch (command.name) {
        case 'active':
          Hacker.findOne({user:user})
            .then(res=>{
              if(res == null){
                this.createNewHacker(user);
              }else{
                this.activatePlayer(res);
                res.save()
                  .then(final => resolve("updated"));
              }
            })
          break;

        case 'hack':
          if(this.chosenPlayer == null){
            resolve(`@${user}, It isn't currently your turn`);
            return;
          }
          if(user != this.chosenPlayer.user){
            resolve(`@${user}, It isn't currently your turn`);
            return;
          }
          Hacker.findOne({user:user})
            .then(res=>{
              if(res == null){
                this.createNewHacker(user);
              }else{

                if(this.nodes[command.target] == undefined){
                  resolve(`@${user}, node ${command.target} doesn't exist`);
                  return;
                } else if(this.nodes[command.target].hacker != null){
                  resolve(`@${user}, you try to hack node ${command.target}, but somone is already there!`);
                  return;
                }

                // if it is put them as the hacker on the node and set current node on hacker to that number.
                this.nodes[command.target].hacker = user;
                res.currentNodeId = command.target;

                // chat  node description
                this.sendChat(this.nodes[command.target].description);

                // set chosen player to null
                this.chosenPlayer = null;

                this.activatePlayer(res);

                res.save()
                  .then(final => resolve("Hack Success"))
                  .catch(err => console.log("uh oh", err));
              }
            })
            .catch(err =>{
              console.log(err);
            })

          break;

        case 'node':
          Hacker.findOne({user:user})
            .then(res=>{
              if(res == null){
                this.createNewHacker(user);
              }else{
                this.activatePlayer(res);
                res.save();
              }
            })
            .catch(err =>{
              console.log(err);
            });
          if( command.target >= this.nodes.length ||
              command.target < 0){
                resolve(`@${user}, Could not find node ${command.target}`);
                return;
          }
          let curNode = this.nodes[command.target];
          let nodeStr = `[${command.target}] - ` +
                        `${curNode.name} - ` +
                        `Credits: ${curNode.requirements.credits} - ` +
                        `Favors: ${curNode.requirements.favors} - ` +
                        `Secrets: ${curNode.requirements.secrets} - ` +
                        `Programs: ${curNode.requirements.programs}`;
          resolve(nodeStr);

          break;

        case 'nodelist':
          Hacker.findOne({user:user})
            .then(res=>{
              if(res == null){
                this.createNewHacker(user);
              }else{
                this.activatePlayer(res);
                let nodeListStr = "Available Nodes: ";
                for(let i = 0; i < game.nodes.length; i++){
                  let nd = game.nodes[i];
                  if(nd.hacker == null){
                    nodeListStr += `[${i}] - ${nd.name} . . `
                  }
                }
                this.sendChat(nodeListStr);
              }
            })
            .catch(err =>{
              console.log(err);
            })

          break;
        case 'stats':
          Hacker.findOne({user:user})
            .then(res=>{
              if(res == null){
                this.createNewHacker(user);
              }else{
                this.activatePlayer(res);
                let statsStr =  `@${user}, `+
                                `Credits: ${res.credits} . . ` +
                                `Favors: ${res.favors} . . ` +
                                `Secrets: ${res.secrets} . . ` +
                                `Programs: ${res.programs}`;
                this.sendChat(statsStr);
                res.save();
              }
            })
            .catch(err =>{
              console.log(err);
            })

          break;
        case 'craft':

          break;
        case 'offer':

          break;
        case 'accept':

          break;
        case 'confirm':

          break;
        case 'test':

      }
    })

    // !craft: Displays the list of available crafting options.
    // !craft {id}: Craft a particular recipe.
    // !offer {item} {player}: Offers an item to a player.
    // !accept {player} {item(optional)}: Accepts and offers item in exchange optional.
    // !confirm {player}: Finishes the offer command and will swap items.
  },

  sendChat: function(message){
    this.messageQueue.push(message);
  },

  createNewHacker: async function(user){
    let newUser = new Hacker({user:user});
    let final = await newUser.save();

    game.playerDeck.push(final);
    console.log(game.playerDeck);

    final.save();
    return "New Hacker Created";
  },

  getMessageQueue: function(){
    let messages = this.messageQueue;
    this.messageQueue = [];
    return messages;
  }
}

function randInt(range){
  return Math.floor(Math.random() * range);
}

game.load();

module.exports = game;
