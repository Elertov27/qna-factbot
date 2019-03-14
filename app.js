var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword     
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());
 
// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.QnAKnowledgebaseId, 
    authKey: process.env.QnAAuthKey,
    endpointHostName: process.env.QnAEndpointHostName
});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: "I'm not quite sure what you're asking. Please ask your question again.",
    qnaThreshold: 0.3
});

bot.dialog('basicQnAMakerDialog', basicQnAMakerDialog);

bot.dialog('/',
[
    function (session) {
        session.replaceDialog('basicQnAMakerDialog');
    }
]);