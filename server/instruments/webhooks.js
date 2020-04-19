const io = require('socket.io')();
const Chat = require('./../db/models/chat.js');
const Message = require('./../db/models/message.js');

class webHooksServer{
	constructor(port = 8000){
		this.webhooks_port = port;
		this.subscribers = []; //cookie: connection

		io.on('connection', (client) => {
			console.log("Connected: ");
			client.on('subscribe', (cookie) => {
				console.log("Client subscribed with cookie: ", cookie);
				this.subscribers.push({
					cookie: cookie,
					connection: client
				});
			});
		});

		this.notifySubscribers = this.notifySubscribers.bind(this);

		io.listen(this.webhooks_port);
	}

	//calls when new message or chat created
	notifySubscribers(){
		console.log("Notifying");
		this.subscribers.forEach( function(subscriber, index) {
			subscriber.connection.emit('update');
		});
		io.emit('update');
	}
}

module.exports = webHooksServer;