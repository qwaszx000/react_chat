require('dotenv').config();
const mongoose = require("mongoose");//.set('debug', true); //debug

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/kwasmessenger', {useNewUrlParser: true})
	.catch(e => {
		console.log(e);
	});

const db = mongoose.connection;

module.exports = db;