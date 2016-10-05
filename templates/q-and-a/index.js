exports.handler = function(event, context) {
    var _ = require("lodash");

    var template = _.template("applicationId: <%- appId %> || requestId: <%- reqId %> || sessionId: <%- sessId %>");
    console.log(template({ 
        appId: event && event.session && event.session.application && event.session.application.applicationId,
        reqId: event && event.request && event.request.requestId,
        sessId: event && event.session && event.session.sessionId
    }));

    // probably a better way to handle this
    event.session.attributes = event.session.attributes || {};

    if (event.session.new) {
    }

    if(event.request.type === "LaunchRequest") {
        //TODO refactor into promise
        handleLaunchRequest(event, context);
    } else if(event.request.type === "IntentRequest") {
        //TODO refactor into promise
        handleIntentRequest(event, context);
    }

    function handleIntentRequest(event, context) {
        console.log("intent request");
        console.log(event);
        var intent = event.request.intent,
            intentName = intent.name,
            attributes = event.session.attributes,
            responses = loadResponses(attributes.userData, attributes.appState),
            fsm = buildFsm(responses, attributes.fsmState),
            response = responses.buildResponse();

        if(intentName === "AnswerIntent") {
            fsm.answer(response);
        } else if(intentName === "AMAZON.HelpIntent") {
            fsm.help(response);
        } else if(intentName === "AMAZON.RepeatIntent") {
            fsm.repeat(response);
        } else if(intentName === "AMAZON.StopIntent") {
            fsm.stop(response);
        } else if(intentName === "AMAZON.YesIntent") {
            fsm.yes(response);
        } else if(intentName === "AMAZON.NoIntent") {
            fsm.no(response);
        } else if(intentName == "MoreInformationIntent") {
            fsm.more(response);
        } else if(intentName == "HintIntent") {
            fsm.hint(response);
        } else {
            context.fail("Unknown intent");
        }

        attributes.fsmState = fsm.state;
        attributes.appState.currentQuestion = responses.getCurrentQuestion();
        attributes.appState.currentHintLevel = responses.getCurrentHintLevel();
   
        var alexaResponse = buildAlexaResponse(event, response);
        context.succeed(alexaResponse);
    }

    function handleLaunchRequest(event, context) {
        var attributes = event.session.attributes;
        console.log("handle launch");

        loadUserData(attributes.userData).then(ud => {
            console.log("promise resolved");
            attributes.userData = ud;
            attributes.appState = {
                currentQuestion: 0,
                currentHintLevel: 0,
            };
            var responses = loadResponses(
                attributes.userData, attributes.appState); 
            var fsm = buildFsm(responses);

            var response = responses.buildResponse();
            fsm.start(response);
            attributes.fsmState = fsm.state;
            attributes.appState.currentQuestion = responses.getCurrentQuestion();
            attributes.appState.currentHintLevel = responses.getCurrentHintLevel();

            console.log(attributes);
            var alexaResponse = buildAlexaResponse(event, response);
            context.succeed(alexaResponse);
        }, obj => {
            console.log("it failed", obj);
        }).catch(err => {
            context.fail(err);
        });
    }

    function buildAlexaResponse(event, response) {
        var msg = _.join(response.message, " "),
            template = _.template("<speak><%- msg %></speak>"),
            output = template({msg: msg});

        return {
            version: "1.0",
            sessionAttributes: event.session.attributes,
            response: {
                outputSpeech: {
                    type: "SSML",
                    ssml: output
                },
                // card?
                reprompt: {
                    outputSpeech: {
                        type: "SSML",
                        ssml: output
                    }
                },
                shouldEndSession: response.shouldEnd
            },
        };
    }

    function loadResponses(userData, appState) {
        return obj = require('./responses.js')(userData, appState);
    }

    function loadUserData(userData) {
        if(userData) {
            return new Promise(function(resolve, reject) {
                resolve(userData);
            });
        } else {
            var fs = require('fs');
            return new Promise(function(resolve, reject) {
                resolve(JSON.parse(fs.readFileSync('user-input.json')));
            });
        }        
    }

    function buildFsm(responses, initialState) {
        try {
            var fsmGenerator = require('./fsm.js'),
                fsm = fsmGenerator(initialState);

            fsm.on('transition', function(data) {
            });

            fsm.on('welcome', function(response) {
                responses.handleWelcome(response);
            });

            fsm.on('question', function(response) {
                responses.handleQuestion(response);
            });

            fsm.on('nextQuestion', function(response) {
                responses.handleNextQuestion(response);
            });

            fsm.on('answer', function(response) {
                responses.handleAnswer(response);
            });

            fsm.on('repeatQuestion', function(response) {
                responses.handleRepeatQuestion(response);
            });

            fsm.on('moreInformation', function(response) {
                responses.handleMoreInformation(response);
            });

            fsm.on('hint', function(response) {
                responses.handleHint(response);
            })

            fsm.on('help', function(response) {
                responses.handleHelp(response);
            })

            fsm.on('stop', function(response) {
                responses.handleStop(response);
            });

            fsm.on('nextHint', function(response) {
                responses.handleNextHint(response);
            });

            fsm.on('repeatHint', function(response) {
                responses.handleRepeatHint(response);
            });

            return fsm;
        } catch(ex) {
            console.log(ex.stack);
        }
    }
};