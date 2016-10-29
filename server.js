var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    app = express(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
// prod
// mongoose.connect('mongodb://elev8incdb:5G9v31PAtU5Vux97spObTDLfUIicUVeLxpHLjaaIjfhEJjugDFiqp7Dy7d9CaQhV1A0pyt2HFI8Hpuoulo1ddA==@elev8incdb.documents.azure.com:10250/?ssl=true'); // PROD
// dev
mongoose.connect('mongodb://54.165.72.62:27017/SkillsDB');
// mongoose.connect('mongodb://elev8incdb:pC2ol1RtDBgn4qX4o5d7gskBno5y6cbRhvchrxOnhPkCuXBfMu8YPJ31FLR4cvSSoDN7Q87VZl3pIgzOjluJHA==@elev8incdev02.documents.azure.com:10250/SkillsDB?ssl=true'); // Dev
// local
// mongoose.connect('mongodb://localhost:27017/SkillsDB'); // Local

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'elev8inc user',
    resave: false,
    saveUninitialized: false
}));
// Dev secret
// secret: 'elev8inc user',
// Prod secret
// secret: 'elev8inc prod user',

app.use(passport.initialize());
app.use(passport.session());

var account = require('./routes/account');
var cardRoutes = require('./routes/flashcards');
var instructionRoutes = require('./routes/instructions');
var splashRoutes = require('./routes/welcome');
// Import routes
app.use('/account', account);
app.use('/flashcards', cardRoutes);
app.use('/instructions', instructionRoutes);
app.use('/welcome', splashRoutes);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


var staticPath = path.join(__dirname, '/public');

console.log('static path: ' + staticPath);
app.use(express.static(staticPath));

app.get('*', function(req, res) {
    var staticPath = path.join(__dirname, '/public/index.html');
    res.sendFile(staticPath);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var env = process.env || {};

var port = env.PORT || 3003;

app.listen(port);

console.log('listening on ' + port + '...');

module.exports = app;
