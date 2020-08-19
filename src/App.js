import React from 'react';
import Cookies from 'js-cookie';
import './App.css';
import Header from './objects/header/header.js';
import Chat from './objects/chat_main/chat.js';
import ChatsList from './objects/chats_main/chats_list.js';
import subscriberClient from './webhooks.js';
import * as functions from './App_functions.js'
import {observer} from 'mobx-react';

class App extends React.Component{

  constructor(props){
    super(props);

    this.MainStore = this.props.MainStore;
    this.UserStore = this.MainStore.UserStore;
    this.MessagesStore = this.MainStore.MessagesStore;
    this.ChatsStore = this.MainStore.ChatsStore;
    
    this.handleServerUpdate = functions.handleServerUpdate.bind(this);
    this.updateApp = functions.updateApp.bind(this);

    this.subscriberClient = new subscriberClient();
    this.subscriberClient.cookie = Cookies.get("user_cookie");
    this.subscriberClient.handleServerUpdate = this.handleServerUpdate;
    this.subscriberClient.subscribe();
  }

  componentDidMount(){
    this.MainStore.getCurrentUserID();
    this.MainStore.getUserChatsFromServer();
    console.log(this.ChatsStore.chats);
  }

  render(){
    return (
      <div className="App">
        <Header userID={this.UserStore.userID} addUserToChat={this.MainStore.addUserToChat} updateAppFunction={this.updateApp}/>
        <div className="container h-100">
          <div className="row h-100">
            <ChatsList chats={this.ChatsStore.chats} onclickCallback={this.MainStore.choiseChat}/>
            <Chat messages={this.MessagesStore.messages} chatId={0} sendMessageCallback={this.MainStore.writeMessage}/>
          </div>
        </div>
      </div>
    );
  }
}

export default observer(App);
