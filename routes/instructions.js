/**
 * Created by Chat on 7/16/16.
 */
var express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    path = require('path'),
    InstructionModel = require('../models/instructionModel'),
    SkillModel = require('../models/SkillModel'),
    passport = require('passport'),
    Account = require('../models/account'),
    azure = require('azure-storage'),
    fs = require('fs'),
    fsCli = require('fs-cli'),
    archiver = require('archiver');

var auth = function(req, res, next){
  !req.isAuthenticated() ? res.send(401) : next();
};

/* get a specific flashcard by id*/
router.get('/:id', auth, function (req, res){
    InstructionModel.find({
      _id: req.params.id
    }, function(err, instruction){
        if(err){
            res.send("Invalid instruction");
        }
        res.send(instruction);
    });
})

/* sort get instruction by appName */
router.get('/', auth, function (req, res){
    InstructionModel.
      find({instructionAppOwner: req.user._id}).
      select('appName _id appDescription').
      exec(function(err,instructionList){
        if(err) {
            res.send("No such subject");
        }
        res.json(instructionList);
    });
})

router.post('/', auth, function(req, res){
    var newInstructionApp = req.body;
    var instructionApp = new InstructionModel(newInstructionApp);
    instructionApp.instructionAppOwner = req.user._id;
    instructionApp.save(function(err,data){
        if(err){
            res.send("Error ");
        }
        res.json(data._id);

    });
})

router.put('/', auth, function(req, res, next){
    var newInstruction = req.body;
    InstructionModel.findById(newInstruction._id,
      function (err, instructionData) {
        if(err){
            res.send("can't find flash card");

        }else{
            instructionData.appName = newInstruction.appName;
            instructionData.appDescription = newInstruction.appDescription;
            instructionData.date = newInstruction.date;
            instructionData.steps = newInstruction.steps;

            instructionData.save(function(err,data){
                if(err){
                    res.send("Error ");
                }
                res.json(data);
            });
        }
    });
})

router.delete('/:id', auth, function(req, res){
    InstructionModel.find({_id: req.params.id},function(err,instruction){
        if(err){
            res.send("Error 1");
        }

    }).remove(function(err){
        if(err){
            res.send(err);
        }

        res.send("Deleted")
    });
})

/* load update flashcards view*/
router.get('/export/:id', auth, function (req, res){
    // prod
    // var AZURE_STORAGE_ACCESS_KEY = 'STL9MI5h7OXnwEj5Gq41xJjaWCQEogk8f6Apu67oKQXurOMRA18l9hVOgWrCWat2/egW2F3sC5REZiuV6kmQEw=='
    // var AZURE_STORAGE_ACCOUNT = 'elev8'
    // dev
    var AZURE_STORAGE_ACCESS_KEY = 'xy1E8xEREs4JKBTCiqp9iztByK/j5hu6Npmm1sODg6USIKhd6tlj5DaNhEv0C/UibQyzJfSwbQwQ5KwY6BGxHg==';
    var AZURE_STORAGE_ACCOUNT = 'elev8dev';
    var blobSvc = azure.createBlobService(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY);

    InstructionModel.find({
            _id: req.params.id
        }, function(err, data) {
        if(err) {
            res.send("No such subject");
        }
        var name = data[0].appName + '_instruction_' + Date.now();
        var workingFolder = './working-' + name;
        fsCli.cp('./templates/instructions', workingFolder) || die();
        fs.writeFileSync(workingFolder + '/user-input.json',  new Buffer(JSON.stringify(data[0])), 'utf-8');

        var outputFolder = workingFolder + '/' + name;
        fsCli.mkdir(outputFolder);

        var skillZipFile = workingFolder + '/' + name + '.zip';
        var output = fs.createWriteStream(skillZipFile);

        // called after the alexa zip has been finalized
        output.on('close', () => {
          var zipFileName = name + '.zip';
          var zipFile = workingFolder + '/' + zipFileName;

          blobSvc.createBlockBlobFromLocalFile('skills', zipFileName, zipFile, function(error, result, response) {
              if(error){
                  console.log(error);
              }
              var skillObj = {
                  skill: name,
                  skillId: req.params.id,
                  owner: req.user._id
              }
              var skillModel = new SkillModel(skillObj);
              skillModel.save(function(err,data) {
                  if(err){
                      res.send("Error ");
                  }
                  fsCli.rm(workingFolder) || die();
                  // prod
                  // res.send({url:"https://elev8.blob.core.windows.net/skills/", skillname: zipFileName});
                  // dev
                  res.send({url:"https://elev8dev.blob.core.windows.net/skills/", skillname: zipFileName});
              });
          });
        }); // end callback to output.on

        var archive = archiver('zip', {});
        archive.on('error', (err) => {
            console.log('error in archive', err);
            res.status(500).send({error: err.message});
        });
        archive.on('end', () => {
            console.log('archive wrote %d bytes', archive.pointer());
        });

        archive.pipe(output);

        archive.file(workingFolder + '/fsm.js', {name: 'fsm.js'});
        archive.file(workingFolder + '/index.js', {name: 'index.js'});
        archive.file(workingFolder + '/responses.js', {name: 'responses.js'});
        archive.file(workingFolder + '/package.json', {name: 'package.json'});
        archive.directory(workingFolder + '/node_modules',  'node_modules');
        archive.file(workingFolder + '/user-input.json', {name: 'user-input.json'});
        archive.file(workingFolder + '/intent_utterances.txt', {name: 'intent_utterances.txt'});
        archive.file(workingFolder + '/intent_schema.json', {name: 'intent_schema.json'});

        archive.finalize(); // this writes the zip and kicks off output.on()
    });
})

module.exports = router;
