const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/twitch';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true }).then(()=> console.log("Mongoose Ready"));

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Hacker = require('./../mongoose/models/hacker.js');

Hacker.findOne({user:"billy"})
  .then(res=>{
    if(res == null){

    }else{
      res.credits += 20;
      res.save();
    }
  })
  .catch(err =>{
    console.log(err);
  })

router.get('/', function(req,res,next){
  // console.log("Query: ", req.query);
  res.render('workerPlacement');
});

router.post('/overlay', function(req,res,next){
  console.log('got a post request: ', req.body)
  res.send();
});

const fs = require('fs');

router.post('/chat',function(req,res,next){
  console.log(req.body)
  res.send();
});

module.exports = router;
