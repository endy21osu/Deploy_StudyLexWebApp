var thing = require('./index.js');
var c = buildContext();



var requestBody ={
  "version": "string",
  "session": {
    "new": true,
    "sessionId": "string",
    "application": {
      "applicationId": "string"
    },
    "attributes": {
      "string": {}
    },
    "user": {
      "userId": "string",
      "accessToken": "string"
    }
  },
  "context": {
    "System": {
      "application": {
        "applicationId": "string"
      },
      "user": {
        "userId": "string",
        "accessToken": "string"
      },
      "device": {
        "supportedInterfaces": {
          "AudioPlayer": {}
        }
      }
    },
    "AudioPlayer": {
      "token": "string",
      "offsetInMilliseconds": 0,
      "playerActivity": "string"
    }
  },
  "request": {}
}


thing.handler(requestBody, c);

setTimeout(() => console.log("message:", c.message), 5000);



// e.request = {
//     type: "IntentRequest",
//     intent: {
//         name: "AnswerIntent"
//     },
//     requestId: 13
// };
// thing.handler(e, c);
// console.log("message:", c.message);


// e.request = {
//     type: "IntentRequest",
//     intent: {
//         name: "RepeatQuestionIntent",
//     },
//     requestId: 13
// };
// thing.handler(e, c);
// console.log("message:", c.message);


// e.request = {
//     type: "IntentRequest",
//     intent: {
//         name: "QuitIntent",
//     },
//     requestId: 13
// };
// thing.handler(e, c);
// console.log("message:", c.message);


function buildContext() {
    var c = {message: ""};
    c.succeed = function(msg) {
        c.message = msg;
    };
    return c;
}