/**
 * Created by Chat on 7/24/16..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

//setting up the schema for the flash cards data model

var Account = new Schema({
    username: {type: String, required: true, unique:true, index:true},
    password: {type: String},
    email: {type: String, required: true, unique:true}
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
