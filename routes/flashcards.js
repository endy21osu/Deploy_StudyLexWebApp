/**
 * Created by Chat on 7/16/16.
 */
var express = require('express'),
mongoose = require('mongoose'),
router = express.Router(),
path = require('path'),
FlashCardsModel = require('../models/flashCardsModel'),
passport = require('passport'),
Account = require('../models/account');


var auth = function(req, res, next){
  !req.isAuthenticated() ? res.send(401) : next();
};


/* list all the flashcards */
// router.get('/', auth, function (req, res) {
//     console.log("pulling the cards.");
//     console.log(passport);
//
//     FlashCardsModel.find({cardOwner: req.user._id},function(err,fcard){
//         if(err){
//             res.send(err.message);
//         }
//         res.send(fcard);
//     });
// });

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

/* sort flashcards by subjects */
router.get('/subject/:subject', auth, function (req, res, next){

    FlashCardsModel.find({
      subject: req.params.subject,
      cardOwner: req.user._id
    },function(err,fcard){
        if(err) {
            res.send("No such subject");
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
    }, function(err,fcard){
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
router.get('/export/:id', auth, function (request, response, next){

      FlashCardsModel.find({
        subject: req.params.subject,
        cardOwner: req.user._id
      },function(err,fcard){
          if(err) {
              res.send("No such subject");
          }
          res.send(fcard);
      });

})

module.exports = router;
