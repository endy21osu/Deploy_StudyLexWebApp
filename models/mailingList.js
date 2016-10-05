/**
 * Created by Chat on 7/24/16..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//setting up the schema for the flash cards data model

var Mailer = new Schema({
    mailAddress: {type: String, required: true, unique:true, index:true},
    joined: {type: String, required: true}
});

module.exports = mongoose.model('Mailer', Mailer);
