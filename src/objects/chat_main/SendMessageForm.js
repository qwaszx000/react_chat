import React from 'react';
import $ from 'jquery';

class SendMessageForm extends React.Component{
	constructor(props){
		super(props);

		this.sendMessage = this.sendMessage.bind(this);
	}
	render(){
		return(
			<center><form className="SendMessageForm form-inline">
				<textarea placeholder="text" className="form-control col-sm-10"></textarea>
				<button className="btn btn-primary col-sm-2" onClick={this.sendMessage}>Send</button>
			</form></center>
		);
	}

	sendMessage(event){
		event.preventDefault();
		this.props.sendMessageCallback($('.SendMessageForm textarea')[0].value);
		$('.SendMessageForm textarea')[0].value = "";
	}
}

export default SendMessageForm;