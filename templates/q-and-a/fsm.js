module.exports = function(initialState) { 
    var machina = require('machina');

    var fsm = new machina.Fsm({
        initialize: () => {

        },

        namespace: "questions",
        initialState: initialState || "initialize",

        states: {
            initialize: {
                start: function(response) {
                    this.transition("welcome", response);
                }
            },
            welcome: {
                _onEnter: function(response) {
                    this.emit("welcome", response);
                },
                repeat: function(response) {
                    this.transition("repeatWelcome", response);
                },
                yes: function(response) {
                    this.transition("question", response);
                },
                no: function(response) {
                    this.transition("stop", response);
                },
                help: function(response) {
                    this.transition("help", {response: response, step: "welcome"});
                },
                stop: function(response) {
                    this.transition("stop", response);
                }
            },
            repeatWelcome: {
                _onEnter: function(response) {
                    this.emit("repeatWelcome", response);
                    this.transition("welcome", response);
                }
            },

            question: {
                _onEnter: function(response) {
                    console.log("question _onenter");
                    this.emit("question", response);
                },
                repeat: function(response) {
                    this.transition("repeatQuestion", response);
                },
                answer: function(response) {
                    this.transition("answer", response);
                },
                more: function(response) {
                    this.transition("moreInformation", response);
                },
                hint: function(response) {
                    this.transition("hint", response);
                },
                help: function(response) {
                    this.transition("help", {response: response, step: "question"});
                },
                stop: function(response) {
                    this.transition("stop", response);
                }
            },

            answer: {
                _onEnter: function(response) {
                    console.log("answer _onenter");
                    this.emit("answer", response);
                    this.transition("nextQuestion", response);
                }
            },

            moreInformation: {
                _onEnter: function(response) {
                    this.emit("moreInformation", response);
                },
                answer: function(response) {
                    this.transition("answer", response);
                },
                help: function(response) {
                    this.transition("help", {response: response, step: "moreInformation"});
                },
                hint: function(response) {
                    this.transition("hint", response);
                },
                repeat: function(response) {
                    this.transition("moreInformationRepeat", response);
                },
                more: function(response) {
                    this.transition("moreInformationRepeat", response);
                },
                stop: function(response) {
                    this.transition("stop", response);
                }
            },

            moreInformationRepeat: {
                _onEnter: function(response) {
                    console.log("more information repeat");
                    this.emit("moreInformationRepeat", response);
                    this.transition("moreInformation", response);
                }
            },

            hint: {
                _onEnter: function(response) {
                    this.emit("hint", response);
                },
                answer: function(response) {
                    this.transition("answer", response);
                },
                hint: function(response) {
                    this.transition("nextHint", response);
                },
                help: function(response) {
                    this.transition("help", {response: response, step: "hint"});
                },
                more: function(response) {
                    this.transition("moreInformation", response);
                },
                repeat: function(response) {
                    this.transition("repeatHint", response);
                },
                stop: function(response) {
                    this.transition("stop", response);
                }
            },

            nextHint: {
                _onEnter: function(response) {
                    console.log("hint repeat");
                    this.emit("nextHint", response);
                    this.transition("hint", response);
                },
            },

            repeatHint: {
                _onEnter: function(response) {
                    console.log("repeat hint");
                    this.emit("repeatHint", response);
                    this.transition("hint", response);
                }
            },

            nextQuestion: {
                _onEnter: function(response) {
                    console.log("nextQuestion");
                    this.emit("nextQuestion", response);
                    this.transition("question", response);
                }
            },

            repeatQuestion: {
                _onEnter: function(response) {
                    this.emit("repeatQuestion", response);
                    this.transition("question", response);
                }
            },

            help: {
                _onEnter: function(data) {
                    this.emit("help", data.response);
                    this.transition(data.step, data.response);
                }
            },

            stop: {
                _onEnter: function(response) {
                    response.shouldEnd = true;
                    this.emit("stop", response);
                }
            }
        },

        // actions
        start: function(response) {
            this.handle("start", response);
        },

        yes: function(response) {
            console.log('fsm yes')
            this.handle("yes", response);
        },

        repeat: function(response) {
            this.handle("repeat", response);
        },

        hint: function(response) {
            this.handle("hint", response);
        },

        no: function(response) {
            this.handle("no", response)
        },

        answer: function(response) {
            this.handle("answer", response)
        },

        more: function(response) {
            this.handle("more", response);
        },

        stop: function(response) {
            this.handle("stop", response);
        }, 

        help: function(response) {
            this.handle("help", response);
        }
    });

    return fsm;
}