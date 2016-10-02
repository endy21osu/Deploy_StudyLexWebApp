/**
 * Created by Chat on 7/16/16.
 */
var express = require('express'),
mongoose = require('mongoose'),
router = express.Router(),
path = require('path'),
flashCardsModel = require('../models/flashCardsModel'),
passport = require('passport'),
Account = require('../models/account');


var auth = function(req, res, next){
  !req.isAuthenticated() ? res.send(401) : next();
};


/* list all the flashcards */
router.get('/cards', function (req, res) {
    console.log("pulling the cards.");
    console.log(passport);
    passport.authenticate('local')
    flashCardsModel.find(function(err,fcard){
        if(err){
            res.send(err.message);
        }
        res.send(fcard);
    });
});

/* get a specific flashcard by id*/
router.get('/:id', auth, function (req, res){

    flashCardsModel.find({_id: req.params.id},function(err,fcard){
        if(err){
            res.send("Invalid flashcard");
        }
        res.send(fcard);
    });
})

/* sort flashcards by subjects */
router.get('/subject/:subject', auth, function (req, res, next){

    flashCardsModel.find({subject: req.params.subject},function(err,fcard){
        if(err) {
            res.send("No such subject");
        }
        res.send(fcard);
    });
})

/* load create flashcards view */
router.get('/create',function(request, response, next){

})

router.post('/create', auth, function(req, res){
    console.log("create the cards.")
    console.log(passport);
    // console.log(req, res, req.body, res.body);
    var newCard = req.body;
    console.log(newCard);

    var flashCard = new flashCardsModel(newCard);

    flashCard.save(function(err,data){
        if(err){
            res.send("Error ");
        }
        res.json(data);

    });
})

/* load update flashcards view*/
router.get('/update',function (request, response, next){

})

router.post('/update/', auth, function(req, res, next){
    console.log("update the cards.");
    console.log(passport);
    var newCard = req.body;
    flashCardsModel.findById(newCard._id,function (err, flashCardData) {
        if(err){
            res.send("can't find flash card");

        }else{
            console.log(newCard.question);
            flashCardData.subject = newCard.subject;
            flashCardData.question = newCard.question;
            flashCardData.hint = newCard.hint;
            flashCardData.answer = newCard.answer;
            flashCardData.more = newCard.more;

            console.log(flashCardData);

            flashCardData.save(function(err,data){
                if(err){
                    res.send("Error ");
                }
                res.json(data);
            });
        }
    });
})

/* load delete flashcards view*/
router.get('/delete', function(request, response, next){

})

router.delete('/delete/:id', auth, function(req, res){
    console.log("delete the cards.")
    flashCardsModel.find({_id: req.params.id},function(err,fcard){
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

router.post('/register', function(req, res) {
    console.log('Register');
    console.log(req.body);
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }
        console.log('Registered this');
        passport.authenticate('local')(req, res, function () {
          console.log('Registered now try to redirect.');

          res.send({redirect: 'home'});

        });
    });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
});

router.post('/logout', function(req, res) {
    req.logOut();
    res.send(200);
});

router.get('/loggedin', function(req, res){
    console.log('session Check')
    console.log(req)
    console.log(res)
    res.send(req.isAuthenticated() ? req.user : '0');
});

module.exports = router;
