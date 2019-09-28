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
  tickTime: 15000,
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

    //Call Interval until loaded
    this.interval = setInterval(()=>{
      if(this.ready.check()){
        clearInterval(this.interval);
        this.init();

      }
    }, 1000)
  },

  init: function(){
    /* initialize game variables */
  
    // for(let i =0; i < this.numNodes; i++){
    //
    // }

    this.interval = setInterval(this.tick, this.tickTime);
  },

  tick: function(){
    // Set random nonplaced player as the active player
    if(game.players.length > 0){
      game.chosenPlayer = game.players[randInt(game.players.length)];
      console.log(game.chosenPlayer);
    }
    // Give all active players +1 credit
    game.players.map(player =>{
      player.credits += 1;
      player.save();
    })

    // For each node reduce time til completion by one
    // If time til completion is zero run node completion fire

    // For each completed node, remove it from the board.
    // If corpEmergence is at 0 spawn a corp node and reset the timer
    // Else corpEmergence reduces by one
    // For each empty node slot, add a random node

    //Check all active players to see when there last message was, if it has been longer than 10 minutes remove them from active players
    let currentTime = new Date();
    game.players = game.players.filter(player => {
      return currentTime - player.lastMsg < 600000;
    })
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
                let newUser = new Hacker({user:user});
                newUser.save()
                  .then(final => resolve("New Hacker Created"));
              }else{

                this.activatePlayer(res);
                res.save()
                  .then(final => resolve("updated"));
              }
            })
          break;

        case 'hack':
          Hacker.findOne({user:user})
            .then(res=>{
              if(res == null){
                let newUser = new Hacker({user:user});
                newUser.save()
                  .then(final => resolve("New Hacker Created"));
              }else{
                res.credits += 20;
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
                let newUser = new Hacker({user:user});
                newUser.save();
              }else{
                res.credits += 20;
                this.activatePlayer(res);
                res.save();
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
                let newUser = new Hacker({user:user});
                newUser.save();
              }else{
                res.credits += 20;
                this.activatePlayer(res);
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
        default:
      }
    })



    // !hack {node #}: If you are active player hack the numbered node
    // !stats: Display current cr, fvr, scrt, prgm, inf, and items.
    // !craft: Displays the list of available crafting options.
    // !craft {id}: Craft a particular recipe.
    // !offer {item} {player}: Offers an item to a player.
    // !accept {player} {item(optional)}: Accepts and offers item in exchange optional.
    // !confirm {player}: Finishes the offer command and will swap items.
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
