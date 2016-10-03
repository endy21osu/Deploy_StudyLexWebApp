/**
 * Created by Chat on 7/16/16.
 */
var express = require('express'),
mongoose = require('mongoose'),
router = express.Router(),
path = require('path'),
InstructionModel = require('../models/instructionModel'),
passport = require('passport'),
Account = require('../models/account'),
AdmZip = require('adm-zip'),
azure = require('azure-storage');

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
router.get('/export/:id', auth, function (request, response, next){
  console.log('the export function');
  var zip = new AdmZip();
  zip.addLocalFile('data/demo.txt');
  zip.writeZip('zip.zip');

  InstructionModel.find({
    _id: req.params.id
  },function(err,data){
    console.log(data);
      if(err) {
          res.send("No such subject");
      }
      res.send(fcard);
  });
})


module.exports = router;
