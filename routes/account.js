/**
 * Created by Chat on 7/16/16.
 */
var express = require('express'),
mongoose = require('mongoose'),
router = express.Router(),
path = require('path'),
passport = require('passport'),
Account = require('../models/account'),
MailingList = require('../models/mailingList');

var auth = function(req, res, next){
  !req.isAuthenticated() ? res.send(401) : next();
};

router.post('/register', function(req, res) {
    console.log('Register');
    console.log(req.body);

    Account.register(new Account({
      username : req.body.username,
      email : req.body.email
    }), req.body.password, function(err, account) {
      console.log(err);
        if (err) {
            return res.sendStatus(500);
        }
        console.log('Registered this');
        passport.authenticate('local')(req, res, function () {
          console.log('Registered now try to redirect.');

          res.send({redirect: 'home'});

        });
    });
});

//route to save email adresses
router.post('/savemail', function(req,res){
    console.log('subscribe');
    var mailObj = req.body;
    console.log(mailObj);
    var mailingListModel = new MailingList(mailObj);
    console.log('subscribing');

    mailingListModel.save(function(err,data){

        var duplicateEmailCode = 11000;

        if(err){
            if(err.code == duplicateEmailCode){
                res.send("Email already saved.");
            }else{
                res.send(err);
            }
        }
        else{
            res.json(data);
        }
    });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
});

router.post('/logout', function(req, res) {
    req.logOut();
    res.sendStatus(200);
});

router.get('/loggedin', function(req, res){
    console.log('session Check');
    res.send(req.isAuthenticated() ? req.user : '0');
});

module.exports = router;
