let game = {
  // variables
  this.allPlayers = [], // All players
  this.players = [], // Active players
  this.nodes = [], // Active nodes
  this.nodeDeck = [], // All normal nodes
  this.corpNodeDeck = [], // All corp nodes
  this.eventQueue = [], //Information for overlay to process and draw

  // functions
  this.load = function(){
    /* this will load  players/items/etc from the database */

    //Make database call. Return an array of Players
    let plyrs = [];

    plyrs.forEach(player => {
      this.allPlayers.push(player);
    })
  },

  this.init = function(){
    /* initialize game variables */
  },

  this.handleCommand = function(user, command){
    /* Takes a users command and executes the correct function */
  },

  this.tick = function(){
    /* process a game tick */
  },


}
