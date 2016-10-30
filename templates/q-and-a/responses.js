module.exports = function(userData, appState) {
    console.log('responses file');
    console.log(userData, appState);
    var _ = require('lodash'),
        self = this;
    
    self.appState = appState;
    self.userData = userData;

    return {
        handleWelcome: handleWelcome,
        handleQuestion: handleQuestion,
        handleNextQuestion: handleNextQuestion,
        handleAnswer: handleAnswer,
        handleRepeatQuestion: handleRepeatQuestion,
        handleStop: handleStop,
        handleMoreInformation: handleMoreInformation,
        handleHelp: handleHelp,
        handleHint: handleHint,
        handleNextHint: handleNextHint,
        handleRepeatHint: handleRepeatHint,
        buildResponse: buildResponse,
        getCurrentQuestion: getCurrentQuestion,
        getCurrentHintLevel: getCurrentHintLevel
    };

    function handleWelcome(response) {
        var template = _.template(
            "Welcome to <%- appName %>, questions about <%- appDescription %>. Would you like to start?");
        var text = template({appName: userData.appName, appDescription: userData.appDescription});
        console.log(text);
        response.message.push(text);
    }

    function handleQuestion(response) {
        console.log('handle question');
        
        console.log(self.userData);
        console.log(getCurrentQuestion());
        var question = self.userData.cards[getCurrentQuestion()];

        var text;
        if(question) {
            var template = _.template("Question <%= questionNumber %>. <%= question %>.");
            text = template({ questionNumber: question.questionNumber, question: question.question });
        } else {
            var template = _.template("Thank you for using <%= appName %>.");
            text = template({appName: userData.appName });
            response.shouldEnd = true;
        }

        response.message.push(text);
    }

    function handleNextQuestion(response) {
        self.appState.currentQuestion++;
        self.appState.currentHintLevel = 0;
    }

    function handleNextHint(response) {
        self.appState.currentHintLevel++; 
    }

    function handleRepeatHint(response) {
    }

    function handleAnswer(response) {
        var question = self.userData.cards[getCurrentQuestion()],
            template = _.template("<%= answer %>."),
            text = template({ answer: question.answer });

        response.message.push(text);        
    }

    function handleRepeatQuestion(response) {
    }

    function handleHint(response) {
        console.log('hint');
       
        console.log(self.userData);
        console.log(self.appState);

        var question = self.userData.cards[getCurrentQuestion()],
            hintLevel = getCurrentHintLevel(),
            hint = question.hints[hintLevel];

        console.log(question, hintLevel, hint);

        var text;
        if(hint) {
            text = hint;
        } else {
            if(hintLevel == 0) {
                text = "No hints for this question";
            } else {
                text = "No more hints for this question";
            }
        }

        response.message.push(text);
    }

    function handleHelp(response) {
        //TODO this should be pulled from somewhere
        var text = "You can say answer to get this answer for this question and advance to the next question. For any question, you can ask for it to be repeated, for a hint, or for more information. ";
        response.message.push(text);
    }

    function handleMoreInformation(response) {
        var card = self.userData.cards[getCurrentQuestion()];
        
        response.message.push(card.more);
    }

    function handleStop(response) {
        var template = _.template(
            "Thank you for using  <%- appName %>."
        );
        var text = template({appName: userData.appName});
    }

    function buildResponse() {
        return {
            message: [],
            shouldEnd: false
        };
    }

    function getCurrentQuestion() {
        return self.appState.currentQuestion;
    }

    function getCurrentHintLevel() {
        return self.appState.currentHintLevel;
    }
}