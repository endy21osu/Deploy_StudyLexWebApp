module.exports = function(userData, appState) {
    console.log('responses file');
    console.log(userData, appState);
    var _ = require('lodash'),
        self = this;
    
    self.appState = appState;
    self.userData = userData;

    return {
        handleWelcome: handleWelcome,
        handleStep: handleStep,
        handleNextStep: handleNextStep,
        handleRepeatStep: handleRepeatStep,
        handleStop: handleStop,
        handleMoreInformation: handleMoreInformation,
        handleNextInformation: handleNextInformation,
        handleHelp: handleHelp,
        buildResponse: buildResponse,
        getCurrentStep: getCurrentStep,
        getCurrentMoreInformationLevel: getCurrentMoreInformationLevel
    };

    function handleWelcome(response) {
        //TODO build off of userData
        var template = _.template(
            "Welcome to <%- appName %>, instructions to <%- appDescription %>. Would you like to start.");
        var text = template({appName: userData.appName, appDescription: userData.appDescription});
        console.log(text);
        response.message.push(text);
    }

    function handleStep(response) {
        console.log('handle step');
        
        console.log(self.userData);
        console.log(getCurrentStep());
        var step = self.userData.steps[getCurrentStep()];

        var text;
        if(step) {
            var template = _.template("Step <%= num %>. <%= step %>.");
            text = template({ num: step.stepnumber, step: step.instruction });
        } else {
            var template = _.template("Thank you for using <%= appName %>.");
            text = template({appName: userData.appName });
            response.shouldEnd = true;
        }

        response.message.push(text);
    }

    function handleNextStep(response) {
        self.appState.currentStep++;
        self.appState.currentMoreInformationLevel = 0;
    }

    function handleRepeatStep(response) {
    }

    function handleMoreInformation(response) {
        console.log('moreInformation');
        console.log(getCurrentStep(), getCurrentMoreInformationLevel());

        var step = self.userData.steps[getCurrentStep()],
            moreInfoLevel = getCurrentMoreInformationLevel(),
            moreInfo = step.help[moreInfoLevel];

        var text;
        if(moreInfo) {
            text = moreInfo;
        } else {
            if(moreInfoLevel == 0) {
                text = "No additional information for this step";
            } else {
                text = "No more additional information for this step";
            }
        }

        response.message.push(text);
    }

    function handleNextInformation(response) {
        self.appState.currentMoreInformationLevel++;
    }

    function handleHelp(response) {
        response.message.push(self.userData.help);
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

    function getCurrentStep() {
        return self.appState.currentStep;
    }

    function getCurrentMoreInformationLevel() {
        return self.appState.currentMoreInformationLevel;
    }
}