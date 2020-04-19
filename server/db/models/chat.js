const mongoose = require("mongoose");

const chatScheme = new mongoose.Schema({
	name: String,
	users_id: [String]
});

mongoose.connect('mongodb://127.0.0.1:27017/kwasmessenger', {useNewUrlParser: true});

const Chat = mongoose.model('chat', chatScheme, "chats");

module.exports = Chat;