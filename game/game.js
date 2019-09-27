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
  players: [], // Active players
  nodes: [], //Active nodes

  nodeDeck: [],
  playerDeck: [],
  corpNodeDeck: [],
  
  eventQueue: [], //Information for overlay to process and draw

  // functions
  load: function(){
    /* this will load  players/items/etc from the database */
    Hacker.find({})
      .then(res=>{
        this.playerDeck = res;
      })
      .catch(err =>{
        console.log(err);
      })

    Node.find({})
      .then(res=>{
        this.nodeDeck = res;
      })
      .catch(err=>{
        console.log(`Node database read error: ${err}`);
      })
    //Make database call. Return an array of Players
  },

  init: function(){
    /* initialize game variables */
    return console.log('working');
  },

  test: function(test){
    this.allPlayers.push(test);
    console.log(this.allPlayers);
  },

  handleCommand: function(user, command){
    /* Takes a users command and executes the correct function */


    switch (command.name) {
      case 'hack':
        Hacker.findOne({user:user})
          .then(res=>{
            if(res == null){
              let newUser = new Hacker({user:user});
              newUser.save();
            }else{
              res.credits += 20;
              res.save();
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
              res.save();
            }
          })
          .catch(err =>{
            console.log(err);
          })

        break;
      case 'stats':

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
        //bad command

    }

    // !hack {node #}: If you are active player hack the numbered node
    // !stats: Display current cr, fvr, scrt, prgm, inf, and items.
    // !craft: Displays the list of available crafting options.
    // !craft {id}: Craft a particular recipe.
    // !offer {item} {player}: Offers an item to a player.
    // !accept {player} {item(optional)}: Accepts and offers item in exchange optional.
    // !confirm {player}: Finishes the offer command and will swap items.
  },

  tick: function(){
    /* process a game tick */
  },
}

game.load();

module.exports = game;
