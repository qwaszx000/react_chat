import React from 'react';

class Message extends React.Component{
	render(){
		return(
			<div className="message border">
				<strong className="author">{this.props.author}</strong>
				<p className="text">{this.props.text}</p>
			</div>
		);
	}
}

export default Message;