/**
 * Created by Chat on 7/24/16..
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StepSchema = new Schema({
      stepnumber: {type: String, required: true},
      instruction: {type: String, required: true},
      help: [String]
});

var InstructionSchema = new Schema({
    appName: {type: String, required: true},
    appDescription: {type: String, required: true},
    instructionAppOwner: {type: String, required: true},
    date: {type: Date},
    steps: [StepSchema]
});

module.exports = mongoose.model('InstructionModel', InstructionSchema);
