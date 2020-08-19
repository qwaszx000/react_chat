import {decorate, observable, autorun} from 'mobx';

class UserStore{
    selected_chat = null;
    userID = "";

    constructor(){
        autorun(() => console.log("user store init"));
    }
}

decorate(UserStore, {
    selected_chat: observable,
    userID: observable
});

export default UserStore;