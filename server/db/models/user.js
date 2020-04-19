const mongoose = require("mongoose");

const userScheme = new mongoose.Schema({
	name: String,
	pass: String,
	cookie: String
});

mongoose.connect('mongodb://127.0.0.1:27017/kwasmessenger', {useNewUrlParser: true});

const User = mongoose.model('user', userScheme, "users");

module.exports = User;