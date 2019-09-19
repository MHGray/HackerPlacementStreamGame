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
    return console.log('working');
  },

  handleMessage: function(user, msg){
    /* Takes a users command and executes the correct function */
    let command = msg.split(" ")[0];

    switch (command) {
      case '!hack':

        break;
      case '!stats':

        break;
      case '!craft':

        break;
      case '!offer':
        
        break;
      case '!accept':

        break;
      case '!confirm':

        break;
      default:
        //bad command

    }

    !hack {node #}: If you are active player hack the numbered node
    !stats: Display current cr, fvr, scrt, prgm, inf, and items.
    !craft: Displays the list of available crafting options.
    !craft {id}: Craft a particular recipe.
    !offer {item} {player}: Offers an item to a player.
    !accept {player} {item(optional)}: Accepts and offers item in exchange optional.
    !confirm {player}: Finishes the offer command and will swap items.
  },

  tick: function(){
    /* process a game tick */
  },
}
