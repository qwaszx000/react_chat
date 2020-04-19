const User = require('./../db/models/user.js');
const Message = require('./../db/models/message.js');
const checkExist = require('./../instruments/checks.js').checkExist;

//returns array of chat messages
function getChatMessages(req, res){
	const chat_id = req.body.chat_id;
	if(!checkExist(chat_id)){
		res.send({"code": -4, "errmsg": "No chat selected!"});
		return;
	}
	//get messages
	Message.find({"chat_id": chat_id}, (err, docs) => {
		if(err){
			console.error(err);
			res.send({"code": -5, "errmsg": "Error while searching messages: " + err});
			return;
		}
		res.send({"code": 3, "messages": docs});
	});
}

function sendChatMessage(req, res){
	const chat_id = req.body.chat_id;
	const text = req.body.text;
	const author_cookie = req.body.author_cookie;

	//find author name by cookie
	User.find({'cookie': author_cookie}, (err, docs) => {
		if(err || docs.length === 0){
			console.error(err);
			res.send({"code": -2, "errmsg": "User not found"});
			return;
		}
		author = docs[0].name;
		createMessage(res, chat_id, author, text);
	});

	//creates message in db
	function createMessage(res, chat_id, author, text){
		Message.create({"chat_id": chat_id, "author_name": author, "text": text, "date": new Date()}, (err, doc) => {
			if(err){
				console.error(err);
				res.send({"code": -8, "errmsg": "Error while creating message: " + err});
				return;
			}
			res.send({"code": 3, "msg": "Successfull message"});
		});
	}
}

module.exports.getChatMessages = getChatMessages;
module.exports.sendChatMessage = sendChatMessage;