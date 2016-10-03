/**
 * Created by Chat on 7/24/16..
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CardSchema = new Schema({
      questionNumber: {type: String, required: true},
      question: {type: String, required: true},
      answer: {type: String, required: true},
      more: {type: String},
      hints: [String]
});
//setting up the schema for the flash cards data model

var flashCardSchema = new Schema({
    appName: {type: String, required: true},
    appDescription: {type: String, required: true},
    help: {type: String, required: true},
    learningAppOwner: {type: String, required: true},
    subject: {type: String, required: true},
    date: {type: Date},
    cards: [CardSchema]
});

module.exports = mongoose.model('flashCardsModel', flashCardSchema);
