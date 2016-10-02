var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    app = express(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// mongoose.connect('mongodb://13.85.68.235:27017/SkillsDB'); // Prod
mongoose.connect('mongodb://40.84.158.230:27017/SkillsDB'); // Dev
// mongoose.connect('mongodb://localhost:27017/SkillsDB');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var account = require('./routes/account');
var cardRoutes = require('./routes/flashcards');
var instructionRoutes = require('./routes/instructions');
// Import routes
app.use('/account', account);
app.use('/flashcards', cardRoutes);
app.use('/instructions', instructionRoutes);

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
