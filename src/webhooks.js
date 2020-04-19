import openSocket from "socket.io-client";

class subscriberClient{
	constructor(){
		this.socket = openSocket("http://localhost:8000");
		this.cookie = undefined;
		this.handleServerUpdate = () => {};
	}

	subscribe(){
		if(this.cookie === undefined){
			return;
		}
		this.socket.emit('subscribe', this.cookie);
		this.socket.on('update', this.handleServerUpdate);
	}
}
export default subscriberClient;