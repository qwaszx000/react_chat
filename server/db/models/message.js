const mongoose = require("mongoose");

const messageScheme = new mongoose.Schema({
	chat_id: String,
	author_name: String,
	text: String,
	Date: Date
});

mongoose.connect('mongodb://127.0.0.1:27017/kwasmessenger', {useNewUrlParser: true});

const Message = mongoose.model('message', messageScheme, "messages");

module.exports = Message;