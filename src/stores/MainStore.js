import MessagesStore from './MessagesStore';
import UserStore from './UserStore';
import ChatsStore from './ChatsListStore';

import {autorun, decorate, observable, action} from 'mobx';
import Cookies from 'js-cookie';
import $ from 'jquery';

class MainStore{
    UserStore = null;
    ChatsStore = null;
    MessagesStore = null;

    constructor(){
        this.UserStore = new UserStore();
        this.ChatsStore = new ChatsStore();
        this.MessagesStore = new MessagesStore();

        this.getMessagesFromServer = this.getMessagesFromServer.bind(this);
        this.writeMessage = this.writeMessage.bind(this);
        this.addUserToChat = this.addUserToChat.bind(this);
        this.choiseChat = this.choiseChat.bind(this);;
        this.getCurrentUserID = this.getCurrentUserID.bind(this);
        this.getUserChatsFromServer = this.getUserChatsFromServer.bind(this);

        autorun(() => console.log("main store init"));
    }


    async getMessagesFromServer(){
        //no chat selected
        if(this.UserStore.selected_chat === null){
          this.MessagesStore.messages = [];
        } else if(Cookies.get("user_cookie") === undefined){ //if user is guest
            this.MessagesStore.messages = [];
        } else {
          let messages = [];
          //send ajax
          await $.ajax({
              url: "http://localhost:8080/messages",
              type: "post",
              data: {"chat_id": this.UserStore.selected_chat},
              error: (jqXHR, textStatus, error) => {
                console.log(textStatus + " / " + error + " / " + jqXHR.status);
              },
              success: function(res){
                if(res.length === 0 || res.code <= -1){
                  console.log(res.errmsg);
                  return;
                }
                messages = res.messages;
              }
          });
          this.MessagesStore.messages = messages;
        }
    }

    writeMessage(text){
        let selected_chat = this.UserStore.selected_chat
        $.ajax({
            url: "http://localhost:8080/message",
            type: "post",
            data: {"chat_id": selected_chat, "text": text, "author_cookie": Cookies.get("user_cookie")},
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

    async addUserToChat(userID){
        if(this.UserStore.selected_chat === -1 || this.UserStore.selected_chat === null){
          console.log("Select chat");
          return;
        }
        if(userID === undefined || userID === ""){
          console.log("write user id!");
          return;
        }
       
        await $.ajax({
            url: "http://localhost:8080/addToChat",
            type: "post",
            data: {"userID": userID, "chat_id": this.UserStore.selected_chat},
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
        this.UserStore.selected_chat = e.target.id;
        this.getMessagesFromServer();
    }

    async getCurrentUserID(){
      //if user is guest
      if(Cookies.get("user_cookie") === undefined){
          this.UserStore.userID = "";
      } else {
        let id = "";
        //send ajax
        await $.ajax({
            url: "http://localhost:8080/currID",
            type: "post",
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
              id = res.id;
            }
        });
        this.UserStore.userID = id;
      }
    }

    async getUserChatsFromServer(){
      //if user is guest
      if(Cookies.get("user_cookie") === undefined){
        console.log("log in first");
        this.ChatsStore.chats = [];
      } else {
        let chat_list = [];
        //send ajax
        await $.ajax({
          url: "http://localhost:8080/chats",
          type: "post",
          //async: false,
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
            chat_list = res.chats;
          }
        });
        this.ChatsStore.chats = chat_list;
      }
    }
}

decorate(MainStore, {
  UserStore: observable,
  ChatsStore: observable,
  MessagesStore: observable,
  getMessagesFromServer: action,
  writeMessage: action,
  addUserToChat: action,
  choiseChat: action,
  getCurrentUserID: action,
  getUserChatsFromServer: action,
});

export default MainStore;