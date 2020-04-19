import React from 'react';
import './chats_list_object.css';

class ChatsListObject extends React.Component{
	index = this.props.index;
	render(){
		return(
			<li className="border border-dark rounded mb-3 chatobject" onClick={this.props.onClick} id={this.index} key={this.index}>
				<img src="http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image" alt="placeholder" className="rounded-circle" id={this.index}/>
				<h5 id={this.index}>{this.props.text}</h5>
			</li>
		)
	}
}

export default ChatsListObject;