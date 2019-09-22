const express = require('express');
const router = express.Router();
//Database Stuffs
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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/game', function(req,res,next){
  res.render('workerPlacement');
});

module.exports = router;
