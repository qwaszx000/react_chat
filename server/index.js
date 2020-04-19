require('dotenv').config()ж
//modules
const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//DB
const db = require("./db/db.js");
//ROUTES
const UserRoute = require('./routes/user.js');
const ChatRoute = require('./routes/chat.js');
const MessageRoute = require('./routes/message.js');
//NETWORK
const app = express();
const api_port = 8080;
const webHooksServer = require("./instruments/webhooks.js");
const hooksServer = new webHooksServer(8000);

//APP
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser("root"));

db.on('error', console.error.bind(console));


//Routes
app.post('/register', UserRoute.registerUser);
app.post('/login', UserRoute.loginUser);
app.post('/currID', UserRoute.getCurrentUserID);

app.post('/chats', ChatRoute.getUserChats);
app.post('/create_chat', createChat);
app.post('/addToChat', addUserToChat);

app.post('/messages', MessageRoute.getChatMessages);
app.post('/message', sendChatMessage);

function sendChatMessage(req, res){
	hooksServer.notifySubscribers();
	MessageRoute.sendChatMessage(req, res);
}

function createChat(req, res){
	hooksServer.notifySubscribers();
	ChatRoute.createNewChat(req, res);
}

function addUserToChat(req, res){
	hooksServer.notifySubscribers();
	ChatRoute.addUserToChat(req, res);
}

app.listen(api_port);
