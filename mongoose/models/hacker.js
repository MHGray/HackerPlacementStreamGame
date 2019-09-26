const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Hacker = new Schema({
  user: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false,
    default: ""
  },
  active: {
    type: Boolean,
    required: false,
    default: false

  },
  lastMsg: {
    type: Date,
    required: false,
    default: new Date()
  },
  credits: {
    type: Number,
    required: true,
    default: 1
  },
  favors: {
    type: Number,
    required: true,
    default: 0
  },
  secrets: {
    type: Number,
    required: true,
    default: 0
  },
  programs: {
    type: Number,
    required: true,
    default: 0
  },
  infamy: {
    type: Number,
    required: true,
    default: 0
  },
  currentNodeId: {
    type: Number,
    required: false,
    default: -1
  },
  costumes: {
    type: Array,
    required: false,
    default: []
  },
  augments: {
    type: Array,
    required: false,
    default: []
  },
  items: {
    type: Array,
    required: false,
    default: []
  }
});

module.exports = mongoose.model('Hacker', Hacker);
/*
{
  user: ,
  image: ,
  active: ,
  lastMsg: ,
  credits: ,
  favors: ,
  secrets: ,
  programs: ,
  infamy: ,
  currentNodeName: ,
  costumers: ,
  augments: ,
  items:
}
*/
