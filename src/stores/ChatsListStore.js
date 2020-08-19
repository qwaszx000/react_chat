import {decorate, observable, autorun} from 'mobx';

class ChatsStore{
    chats = [];

    constructor(){
        autorun(() => console.log("chats store init"));
    }
}
    

decorate(ChatsStore, {
    chats: observable
})

export default ChatsStore;