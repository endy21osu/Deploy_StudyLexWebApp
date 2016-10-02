/**
 * Created by Chat on 7/16/16.
 */
var express = require('express'),
mongoose = require('mongoose'),
router = express.Router(),
path = require('path'),
passport = require('passport'),
Account = require('../models/account');

var auth = function(req, res, next){
  !req.isAuthenticated() ? res.send(401) : next();
};

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
    res.sendStatus(200);
});

router.get('/loggedin', function(req, res){
    console.log('session Check');
    res.send(req.isAuthenticated() ? req.user : '0');
});

module.exports = router;
