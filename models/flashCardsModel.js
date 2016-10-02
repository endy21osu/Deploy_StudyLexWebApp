/**
 * Created by Chat on 7/24/16..
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//setting up the schema for the flash cards data model

var flashCardSchema = new Schema({
    card: {type: String},
    question: {type: String, required: true},
    answer: {type: String, required: true},
    hint: {type: String},
    more: {type: String},
    subject: {type: String, required: true}
});

module.exports = mongoose.model('flashCardsModel', flashCardSchema);
