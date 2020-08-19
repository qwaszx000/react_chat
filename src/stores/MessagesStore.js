import {decorate, observable, autorun} from 'mobx';

class MessagesStore{
    messages = [];

    constructor(){
        autorun(() => console.log("messages store init"));
    }
}

decorate(MessagesStore, {
    messages: observable
})

export default MessagesStore;