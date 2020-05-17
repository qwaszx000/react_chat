import React from 'react';
import Cookies from 'js-cookie';
import './App.css';
import Header from './objects/header/header.js';
import Chat from './objects/chat_main/chat.js';
import ChatsList from './objects/chats_main/chats_list.js';
import subscriberClient from './webhooks.js';
import * as functions from './App_functions.js'

class App extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      selected_chat : null,
      userID: "",
      chats: [],
      messages: []
    };

    this.getCurrentUserID = functions.getCurrentUserID.bind(this);
    this.getUserChatsFromServer = functions.getUserChatsFromServer.bind(this);

    this.choiseChat = functions.choiseChat.bind(this);
    this.getMessagesFromServer = functions.getMessagesFromServer.bind(this);

    this.writeMessage = functions.writeMessage.bind(this);
    this.addUserToChat = functions.addUserToChat.bind(this);
    
    this.handleServerUpdate = functions.handleServerUpdate.bind(this);
    this.updateApp = functions.updateApp.bind(this);

    this.subscriberClient = new subscriberClient();
    this.subscriberClient.cookie = Cookies.get("user_cookie");
    this.subscriberClient.handleServerUpdate = functions.handleServerUpdate;
    this.subscriberClient.subscribe();
  }

  async componentDidMount(){
  	this.getCurrentUserID();
  	await this.getUserChatsFromServer();
  }

  render(){
    return (
      <div className="App">
        <Header userID={this.state.userID} addUserToChat={this.addUserToChat} updateAppFunction={this.updateApp}/>
        <div className="container h-100">
          <div className="row h-100">
            <ChatsList chats={this.state.chats} onclickCallback={this.choiseChat}/>
            <Chat messages={this.state.messages} chatId={0} sendMessageCallback={this.writeMessage}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
