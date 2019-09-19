let game = {
  // variables
  allPlayers: [], // All players
  players: [], // Active players
  nodes: [], // Active nodes
  nodeDeck: [], // All normal nodes
  corpNodeDeck: [], // All corp nodes
  eventQueue: [], //Information for overlay to process and draw

  // functions
  load: function(){
    /* this will load  players/items/etc from the database */

    //Make database call. Return an array of Players
    let plyrs = [];

    plyrs.forEach(player => {
      this.allPlayers.push(player);
    })
  },

  init: function(){
    /* initialize game variables */
  },

  handleCommand: function(user, command){
    /* Takes a users command and executes the correct function */
  },

  tick: function(){
    /* process a game tick */
  },
}
