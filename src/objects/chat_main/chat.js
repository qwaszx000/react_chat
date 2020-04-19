import React from 'react';
import Message from './message.js';
import SendMessageForm from './SendMessageForm.js';
import './chat.css';

class Chat extends React.Component{
	render(){
		return(
			<div className="chatmain border">
				<div className="chatMessages">
					{this.props.chatId === -1 &&
						<center>Select chat</center>
					}
					{this.props.chatId !== -1 && this.props.messages.length === 0 &&
						<center>There no messages</center>
					}
					{this.props.messages.map( (message) => {
						return (<Message author={message.author_name} text={message.text} key={message._id}/>);
					} )}
				</div>
				{this.props.chatId !== -1 && 
					<SendMessageForm sendMessageCallback={this.props.sendMessageCallback}/>
				}

			</div>
		);
	}
}

export default Chat;