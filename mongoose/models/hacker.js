const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Hacker = new Schema({
  user: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  active: {
    type: Boolean,
    required: true
  },
  lastMsg: {
    type: Date,
    required: false
  },
  credits: {
    type: Number,
    required: true
  },
  favors: {
    type: Number,
    required: true
  },
  secrets: {
    type: Number,
    required: true
  },
  programs: {
    type: Number,
    required: true
  },
  infamy: {
    type: Number,
    required: true
  },
  currentNodeName: {
    type: String,
    required: false
  },
  costumes: {
    type: Array,
    required: false
  },
  augments: {
    type: Array,
    required: false
  },
  items: {
    type: Array,
    required: false
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
