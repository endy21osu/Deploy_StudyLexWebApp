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
fs = require("fs"),
zipFolder = require('zip-folder');

var auth = function(req, res, next){
  !req.isAuthenticated() ? res.send(401) : next();
};

/* get a specific flashcard by id*/
router.get('/:id', auth, function (req, res){
    console.log(req.params.id);
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
        console.log(err);
        console.log(instructionList);
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
        console.log(data);
        res.json(data._id);

    });
})

router.put('/', auth, function(req, res, next){
    console.log("update the instruction.");
    console.log(passport);
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
    console.log("delete the steps.")
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
  console.log('the export instruction function');

  var AZURE_STORAGE_ACCESS_KEY = 'xy1E8xEREs4JKBTCiqp9iztByK/j5hu6Npmm1sODg6USIKhd6tlj5DaNhEv0C/UibQyzJfSwbQwQ5KwY6BGxHg==';
  var AZURE_STORAGE_ACCOUNT = 'elev8dev';
  var blobSvc = azure.createBlobService(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY);

  InstructionModel.find({
    _id: req.params.id
  }, function(err, data) {
    if(err) {
        res.send("No such subject");
    }

// ../templates/q-and-a
    var name = data[0].appName + '_instruction_' + Date.now();
    fs.unlink('./templates/instructions/user-input.json', function(err){
      // if (err) throw err;
      console.log('./templates/instructions/user-input.json deleted');

      fs.writeFileSync('./templates/instructions/user-input.json',  new Buffer(JSON.stringify(data)), 'utf-8');
      // user-input.json
      zipFolder('./templates/instructions', name + '.zip', function(err) {
          if(err) {
              console.log('oh no!', err);
              res.send("failed " + name + '.zip');
          } else {
            blobSvc.createBlockBlobFromLocalFile('skills', name + '.zip', name + '.zip', function(error, result, response){
              console.log('blob callback');
              if(error){
                console.log(error);
              }
              console.log(result);
              console.log();
              console.log(response);
              var skillObj = {
                skill: name + '.zip',
                owner: req.user._id
              }
              var skillModel = new SkillModel(skillObj);
              skillModel.save(function(err,data){
                  if(err){
                      res.send("Error ");
                  }
                  console.log(data);
                  res.send({url:"https://elev8dev.blob.core.windows.net/skills/", skillname: name + '.zip'});
              });
            });
          }
      });
    }); //copies directory, even if it has subdirectories or files
  });
})


module.exports = router;
