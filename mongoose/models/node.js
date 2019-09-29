const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Node = new Schema({
  name: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: false,
    default: ""
  },
  completionDesc: {
    type: String,
    required: true,
    default: "Node Hacked Successfully"
  },
  requirements:{
    credits:{
      type: Number,
      required: true,
      default: 0
    },
    favors:{
      type: Number,
      required: true,
      default: 0
    },
    secrets:{
      type: Number,
      required: true,
      default: 0
    },
    programs:{
      type: Number,
      required: true,
      default: 0
    }
  },
  rewards:{
    credits:{
      type: Number,
      required: true,
      default: 0
    },
    favors:{
      type: Number,
      required: true,
      default: 0
    },
    secrets:{
      type: Number,
      required: true,
      default: 0
    },
    programs:{
      type: Number,
      required: true,
      default: 0
    },
    item:{
      type: String,
      required: false,
    }
  },
  integrity: {
    type: Number,
    required: true,
    default: 5
  },
  hacker:{
    type: String,
    required: false,
    default: null
  },
  difficulty:{
    type: Number,
    required: true,
    default: 1
  }
});

module.exports = mongoose.model('Node', Node);
/*
{

}
*/
