/**
 * Created by Chat on 7/16/16.
 */
var express = require('express'),
mongoose = require('mongoose'),
router = express.Router(),
path = require('path'),
FlashCardsModel = require('../models/flashCardsModel'),
passport = require('passport'),
Account = require('../models/account'),
azure = require('azure-storage'),
fs = require("fs"),
zipFolder = require('zip-folder');

var auth = function(req, res, next){
  !req.isAuthenticated() ? res.send(401) : next();
};

/* sort get instruction by appName */
router.get('/', auth, function (req, res) {
    FlashCardsModel.
      find({learningAppOwner: req.user._id}).
      select('appName _id appDescription').
      exec(function (err, list) {
        console.log(err);
        console.log(list);
        if (err) {
            res.send("No such subject");
        }
        res.json(list);
    });
})

/* get a specific flashcard by id*/
router.get('/:id', auth, function (req, res){
    FlashCardsModel.find({
      _id: req.params.id,
      learningAppOwner: req.user._id
    },function(err,fcard){
        if(err){
            res.send("Invalid flashcard");
        }
        res.send(fcard);
    });
})

router.post('/', auth, function(req, res){
    var newCard = req.body;
    console.log(newCard);
    var flashCard = new FlashCardsModel(newCard);

    flashCard.learningAppOwner = req.user._id;
    flashCard.save(function(err,data){
        if(err){
            res.send("Error ");
        }
        res.json(data._id);

    });
})

router.put('/', auth, function(req, res, next){
    console.log("update the cards.");
    console.log(passport);
    var newCard = req.body;
    FlashCardsModel.findById(newCard._id,
      function (err, flashCardData) {
        if(err){
            res.send("can't find flash card");

        }else{
          flashCardData.appName = newCard.appName;
          flashCardData.appDescription = newCard.appDescription;
          flashCardData.help = newCard.help;
          flashCardData.subject = newCard.subject;
          flashCardData.date = newCard.date;
          flashCardData.learningAppOwner = req.user._id;
          flashCardData.cards = newCard.cards;
          flashCardData.save(function(err,data){
              if(err){
                  res.send("Error ");
              }
              res.json(data);
          });
        }
    });
})

router.delete('/:id', auth, function(req, res){
    console.log("delete the cards.")
    FlashCardsModel.find({
      _id: req.params.id
    }, function(err, fcard) {
        if(err){
            res.send("Error 1");
        }

    }).remove(function(err){
        if(err){
            res.send(err);
        }

        res.send("Deleted")
    });
})

/* load update flashcards view*/
router.get('/export/:id', auth, function (req, res){
    console.log('the export learning function');
    // var blobSvc = azure.createBlobService();
    FlashCardsModel.find({
      _id: req.params.id
    }, function(err, data) {
      if(err) {
          res.send("No such subject");
      }
      var name = data[0].appName + '_learning_' + Date.now();
      fs.unlink('./templates/q-and-a/user-input.json', function(err){
        // if (err) throw err;
        console.log('./templates/q-and-a/user-input.json deleted');

        fs.writeFileSync('./templates/q-and-a/user-input.json',  new Buffer(JSON.stringify(data)), 'utf-8');
        // user-input.json
        zipFolder('./templates/q-and-a', name + '.zip', function(err) {
            if(err) {
                console.log('oh no!', err);
                res.send("failed " + data[0].appName + '_learning_' + Date.now() + '.zip');
            } else {
                console.log('EXCELLENT');
                // blobSvc.createBlockBlobFromLocalFile('zips', name, function(error, result, response){
                //   console.log('blob callback');
                //   if(error){
                //     console.log(error);
                //   }
                //   console.log(result);
                //   console.log();
                //   console.log(response);
                // });
                // DefaultEndpointsProtocol=https;AccountName=<storage account name>;AccountKey=<storage account key>
                res.send("created " + data[0].appName + '_learning_' + Date.now() + '.zip');
            }
        });
      }); //copies directory, even if it has subdirectories or files
  });
})

module.exports = router;
