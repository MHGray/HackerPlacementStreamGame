### Cyberpunk Worker Placement Stream game

#### Commands
!hack {node #}: If you are active player hack the numbered node
!stats: Display current cr, fvr, scrt, prgm, inf, and items.
!craft: Displays the list of available crafting options.
!craft {id}: Craft a particular recipe.
!offer {item} {player}: Offers an item to a player.
!accept {player} {item(optional)}: Accepts and offers item in exchange optional.
!confirm {player}: Finishes the offer command and will swap items.

#### Turn Structure
function tick(){
  // Set random nonplaced player as the active player
  // If no nonplaced player available, give all placed players +1 credit

  // For each node reduce time til completion by one
  // If time til completion is zero run node completion fire

  // For each completed node, remove it from the board.
  // If corpEmergence is at 0 spawn a corp node and reset the timer
  // Else corpEmergence reduces by one
  // For each empty node slot, add a random node

  //Check all active players to see when there last message was, if it has been longer than 10 minutes remove them from active players
}

Every Tick(minute) someone will have a chance to place there hacker on a node. For that minute they can type a chat command in order to place there hacker. Once they place their hacker they will receive the benefit of the node once it is completed, whether that is a resource, or a sound/visual effect playing, or a stock of a sound/visual effect.

Once the minute is up, the next player takes their turn. A player can't go on a spot taken by another player. If a player can't receive the benefit of a node (because it requires resource they don't have) they will receive 10 credits. Credits can be used in crafting to make other resources.

#### Hackers
hacker{
  user: "TwitchUserName",
  x: 32,
  y: 24,
  image: 'baseCostume',
  active: false,
  lastMsg: {Date Object}
  credits: 150,
  favors: 36,
  secrets: 15,
  programs: 2,
  infamy: 12,
  currentNodeName: node1,
  costumes: ['pirate hat', 'sweet rig'],
  augments: [subscriber, 3DayBoost], //3Day boost will get updated when a !day command is called
  items: ['soundplay','songrequest','picturedrawing','customcode','nameANode']
}

Hackers are entities that you place on a node to get a certain effect/resource. A Hacker will occupy a node for a certain amount of time before giving the benefit, and other Hackers can't visit that node while there is a Hacker there.

Subscribing to the channel automatically Augments a Hacker with a module that doubles their effectiveness. Other Augments can be crafted or found during Corp raids.

Hackers will gain infamy as they hack more nodes and is just a sort of overall points tracker for a potential leaderboard.

#### Nodes
Node{
  name: "google.com",
  type: "normal | corp",
  requirements: [
    {
      type: "credits",
      amount: 20
    },
    {
      type: "favors",
      amount: 5
    }
  ]
  reward: {
    type: "credits",
    amount: 20
  },
  currentHacker: null,
  integrity: 5, //ticks til node breaks
}

Nodes are an area to put hackers on. A node will give a benefit to the player who put their hacker there. Benefits can be resources, instant rewards, permanent changes to nodes, or an item that allows the player to activate a stream feature at a later time. Nodes are subject to change based on events, player actions, and number of players.

Nodes will also kick off hackers after a certain amount of time based on how many current nodes there are. So if there are 6 nodes currently on the board, then a node can be occupied for 3 or 4 turns before it kicks that person off.

Special Nodes called Corps will pop up from time to time that have special loot but require many resources to acquire. They will show up about once every 20 turns or so. The Program resource is always required to take a Corp Node.

#### Resources
//Resources are just a number, there are no particular properties that will go along with them.

There are 4 kinds of resources with a variety of rarities:

1. Credits: Are used in most Crafting Recipes and in nodes that allow players to get favors.
2. Favors: Favors are used in a lot of Crafting Recipes and in nodes that allow players to get Secrets.
3. Secrets: Secrets are used in rare Crafting Recipes and in nodes that allow players to acquire Programs.
4. Programs:  Programs are exclusively used on nodes to attain special items such as Costumes, Hacker Augments, Node Modifications and unlocking new Nodes.

Resources are acquired by Hacking Nodes. Credits are always attainable by hacking a node that has too many requirements for that player.

#### Crafting/Recipes
recipe{
  id: 1,
  name: "Credits to Favors",
  ingredients: {
    credits: 50
  }
  output: {
    favors: 10
  }  
}

Players can craft a variety of things with the resources they obtain. In general a resource can always be broken down, but is very expensive to craft up. So a Program can be crafted into 10 Secrets, but it would cost 20 Secrets, 40 Favors, and 100 Credits to craft a Program. Crafting can also be used to make special items such Stream Rewards, Costume Shards, and more.

#### Trading
Eventually players should be able to trade with each other, pretty much anything for anything.
