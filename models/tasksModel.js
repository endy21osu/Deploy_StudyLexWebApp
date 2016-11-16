/**
 * Created by jgordon on 11/01/16..
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ActivitySchema = new Schema({
      name: {type: String, required: true},
      taskCompleted: {type: Date}
});

var TasksSchema = new Schema({
    appName: {type: String, required: true},
    appDescription: {type: String, required: true},
    tasksAppOwner: {type: String, required: true},
    timeZone: {type: String, required: true},
    date: {type: Date},
    activities: [ActivitySchema]
});

module.exports = mongoose.model('TasksModel', TasksSchema);
