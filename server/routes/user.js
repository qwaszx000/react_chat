const User = require('./../db/models/user.js');
const checkExist = require('./../instruments/checks.js').checkExist;

//returns finded by pass and login users cookie or none 
function loginUser(req, res){
	const body = req.body;
	const login = body.login;
	const pass = body.password;

	User.find({'name': login, 'pass': pass}, (err, docs) => {
		if(err){
			console.error(err);
			res.send({"code": -6, "errmsg": "Error while login"});
			return;
		}
		res.send({"code": 0, "cookie": docs[0].cookie, "msg": "Successfull login"});
	});
}

//create user. Returns cookie or error
function registerUser(req, res){
	const body = req.body;
	const login = body.login;
	const pass = body.password;

	User.create({'name': login, 'pass': pass, 'cookie': generateCookie(login, pass)}, (err, doc) => {
		
		if(err){
			console.error(err);
			res.send({"code": -7, "errmsg": "Cant create user"});
			return;
		}
		res.send({"code": 1, "cookie": doc.cookie, "msg": "Successfull register"});
	});
	
}

function getCurrentUserID(req, res){
	const cookie = req.body.cookie;

	User.find({'cookie': cookie}, (err, docs) => {
		if(err){
			console.error(err);
			res.send({"code": -6, "errmsg": "Error while getting id"});
			return;
		}
		res.send({"code": 10, "id": docs[0]._id});
	});
}

function generateCookie(login, pass){
	return login+pass;
}

module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;
module.exports.getCurrentUserID = getCurrentUserID;