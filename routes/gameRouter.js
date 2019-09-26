const express = require('express');
const router = express.Router();
var game = require('./../game/game');




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
  game.handleCommand(req.body.user, req.body.command);
  res.send();
});

module.exports = router;
