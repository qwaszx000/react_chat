import React from 'react';
import './chats_list.css';
import ChatsListObject from './chats_list_object.js';

class ChatsList extends React.Component{
	render(){
		return(
				<ul className="chatslist border h-100">
					{this.props.chats.map((chat) => {
						return (<ChatsListObject text={chat.name} index={chat._id} onClick={this.props.onclickCallback} key={chat._id}/>);
					})}
					<ChatsListObject text="New chat" index={-1} onClick={this.props.onclickCallback}/>
				</ul>
		);
	}
}

export default ChatsList;