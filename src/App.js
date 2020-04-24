import React from 'react';
import $ from 'jquery';
import Cookies from 'js-cookie';
import './App.css';
import Header from './objects/header/header.js';
import Chat from './objects/chat_main/chat.js';
import ChatsList from './objects/chats_main/chats_list.js';
import subscriberClient from "./webhooks.js";

class App extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      selected_chat : null,
      userID: "",
      chats: [],
      messages: []
    };

    this.getCurrentUserID()
    this.getUserChatsFromServer();

    this.choiseChat = this.choiseChat.bind(this);
    this.writeMessage = this.writeMessage.bind(this);
    this.addUserToChat = this.addUserToChat.bind(this);
    this.handleServerUpdate = this.handleServerUpdate.bind(this);
    this.updateApp = this.updateApp.bind(this);

    this.subscriberClient = new subscriberClient();
    this.subscriberClient.cookie = Cookies.get('user_cookie');
    this.subscriberClient.handleServerUpdate = this.handleServerUpdate;
    this.subscriberClient.subscribe();
  }


  //rerender self
  updateApp(){
    this.getCurrentUserID()
    this.getUserChatsFromServer();
    this.getMessagesFromServer();
    this.setState(this.state);
  }

  handleServerUpdate(){
    this.getUserChatsFromServer();
    this.getMessagesFromServer();
  }

  getUserChatsFromServer(){
    var state = this.state;
    //if user is guest
    if(Cookies.get("user_cookie") === undefined){
      console.log("log in first");
      state.chats = [];
    } else {
      //send ajax
      $.ajax({
          url: "http://localhost:8080/chats",
          type: "post",
          async: false,
          data: {"user_cookie": Cookies.get("user_cookie")},
          error: (jqXHR, textStatus, error) => {
            console.log(textStatus + " / " + error + " / " + jqXHR.status);
          },
          success: function(res){
            //console.log("Success: " + res);
            if(res.length === 0 || res.code <= -1){
              console.log(res.errmsg);
              return;
            }
            state.chats = res.chats;
          }
      });
    }
    this.state = state;
  }

  getCurrentUserID(){
    var state = this.state;
    //if user is guest
    if(Cookies.get("user_cookie") === undefined){
      state.userID = "";
    } else {
      //send ajax
      $.ajax({
          url: "http://localhost:8080/currID",
          type: "post",
          async: false,
          data: {"cookie": Cookies.get("user_cookie")},
          error: (jqXHR, textStatus, error) => {
            console.log(textStatus + " / " + error + " / " + jqXHR.status);
          },
          success: function(res){
            //console.log("Success: " + res);
            if(res.length === 0 || res.code <= -1){
              console.log(res.errmsg);
              return;
            }
            state.userID = res.id;
          }
      });
    }
    this.state = state;
  }

  //callback function for chats_list
  choiseChat(e){
    e.preventDefault();
    //if user is guest
    if(Cookies.get("user_cookie") === undefined){
      return;
    }

    if(e.target.id === "-1"){
      var name_input = document.createElement("input");
      onEnter = onEnter.bind(this);
      name_input.addEventListener("keyup", onEnter);
      if(e.target.nodeName !== "LI"){
        e.target = e.target.parentElement;
      }
      e.target.replaceChild(name_input, e.target.childNodes[1]);
      return;

      function onEnter(event){
        if(event.keyCode === 13){
          event.preventDefault();
          $.ajax({
              url: "http://localhost:8080/create_chat",
              type: "post",
              async: false,
              data: {"user_cookie": Cookies.get("user_cookie"), "chat_name": name_input.value},
              error: (jqXHR, textStatus, error) => {
                console.log(textStatus + " / " + error + " / " + jqXHR.status);
              },
              success: function(res){
                console.log("Success: " + res);
                if(res.length === 0 || res.code <= -1){
                  console.log(res.errmsg);
                  return;
                }
              }
          });
        }
      }
    }
    var state = this.state;
    state.selected_chat = e.target.id;
    this.setState(state);
    this.getMessagesFromServer();
  }

  getMessagesFromServer(){
    var state = this.state;
    //no chat selected
    if(this.state.selected_chat === null){
      state.messages = [];
    } else if(Cookies.get("user_cookie") === undefined){ //if user is guest
      state.messages = [];
    } else {
      //send ajax
      $.ajax({
          url: "http://localhost:8080/messages",
          type: "post",
          async: false,
          data: {"chat_id": state.selected_chat},
          error: (jqXHR, textStatus, error) => {
            console.log(textStatus + " / " + error + " / " + jqXHR.status);
          },
          success: function(res){
            if(res.length === 0 || res.code <= -1){
              console.log(res.errmsg);
              return;
            }
            state.messages = res.messages;
          }
      });
    }
    this.setState(state);
  }

  writeMessage(text){
    $.ajax({
        url: "http://localhost:8080/message",
        type: "post",
        async: false,
        data: {"chat_id": this.state.selected_chat, "text": text, "author_cookie": Cookies.get("user_cookie")},
        error: (jqXHR, textStatus, error) => {
          console.log(textStatus + " / " + error + " / " + jqXHR.status);
        },
        success: function(res){
          //console.log("Success: " + res);
          if(res.length === 0 || res.code <= -1){
            console.log(res.errmsg);
            return;
          }
        }
    });
  }

  addUserToChat(userID){
    if(this.state.selected_chat === -1 || this.state.selected_chat === null){
      console.log("Select chat");
      return;
    }
    if(userID === undefined || userID === ""){
      console.log("write user id!");
      return;
    }

    $.ajax({
        url: "http://localhost:8080/addToChat",
        type: "post",
        async: false,
        data: {"userID": userID, "chat_id": this.state.selected_chat},
        error: (jqXHR, textStatus, error) => {
          console.log(textStatus + " / " + error + " / " + jqXHR.status);
        },
        success: function(res){
          console.log("Success: " + res);
          if(res.length === 0 || res.code <= -1){
            console.log(res.errmsg);
            return;
          }
        }
    });
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
