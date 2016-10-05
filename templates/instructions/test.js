var thing = require('./index.js');
var c = buildContext();



var e = {
    session: {
        new: true,
    },
    request: {
        type: "LaunchRequest",
        requestId: 13
    }
};

thing.handler(e, c);

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