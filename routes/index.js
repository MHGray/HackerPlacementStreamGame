const express = require('express');
const router = express.Router();
//Database Stuffs
const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/twitch';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/game', function(req,res,next){
  res.render('workerPlacement');
});

module.exports = router;
