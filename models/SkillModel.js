/**
 * Created by gordonj on 10/04/16..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//setting up the schema for the flash cards data model

var SkillModel = new Schema({
    skill: {type: String, required: true, unique:true, index:true},
    skillId: {type: String, required: true},
    owner: {type: String, required: true}
});

module.exports = mongoose.model('SkillModel', SkillModel);
