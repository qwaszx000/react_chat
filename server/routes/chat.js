const User = require('./../db/models/user.js');
const Chat = require('./../db/models/chat.js');
const checkExist = require('./../instruments/checks.js').checkExist;

//returns array of users chats
function getUserChats(req, res){
	const user_cookie = req.body.user_cookie;

	if(!checkExist(user_cookie)){
		res.send({"code": -1, "errmsg": "Login first"});
		return;
	}
	
	//get user id
	var user_id;
	User.find({'cookie': user_cookie}, (err, docs) => {
		if(err || docs.length === 0){
			console.error(err);
			res.send({"code": -2, "errmsg": "User not found"});
			return;
		}
		user_id = docs[0]._id;
		sendChats(res, user_id)
	});

	//find chats by user id and send it to app
	function sendChats(res, user_id){
		Chat.find({'users_id':{$elemMatch:{$eq: user_id}}}, (err, docs) => {
			if(err){
				console.error(err);
				res.send({"code": -3, "errmsg": "Error while searching chat: " + err});
				return;
			}
			res.send({"code": 2, "chats": docs});
		});
	}
}

function createNewChat(req, res){
	const cookie = req.body.user_cookie;
	const chat_name = req.body.chat_name;
	if(!checkExist(cookie) || !checkExist(chat_name)){
		return;
	}

	User.find({'cookie': cookie}, (err, docs) => {
		if(err || docs.length === 0){
			console.error(err);
			res.send({"code": -2, "errmsg": "User not found"});
			return;
		}
		const user_id = docs[0]._id;
		createChat(res, user_id, chat_name)
	});

	function createChat(res, user_id, chat_name){
		Chat.create({'users_id':[user_id], "name": chat_name}, (err, doc) => {
			if(err){
				console.error(err);
				res.send({"code": -5, "errmsg": "Error while creating chat: " + err});
				return;
			}
			res.send({"code": 9, "msg": "Chat created"});
		});
	}
}

function addUserToChat(req, res){
	const userID = req.body.userID;
	const chat_id = req.body.chat_id;

	if(!checkExist(userID) || !checkExist(chat_id)){
		res.send({"code": -10, "errmsg": "Error while adding user to chat: userID or cchatID is empty"});
		return;
	}

	Chat.updateOne({'_id': chat_id}, {$push:{"users_id": userID}}, (err, doc) => {
		if(err){
			console.error(err);
			res.send({"code": -11, "errmsg": "Error while adding user to chat: " + err});
			return;
		}
		console.log(doc);
		res.send({"code": 11, "msg": "User added"});
	});
}

module.exports.getUserChats = getUserChats;
module.exports.createNewChat = createNewChat;
module.exports.addUserToChat = addUserToChat;