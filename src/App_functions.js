//this = App component

function updateApp(){
  this.MainStore.getCurrentUserID()
  this.MainStore.getUserChatsFromServer();
  this.MainStore.getMessagesFromServer();
}

function handleServerUpdate(){
  this.MainStore.getUserChatsFromServer();
  this.MainStore.getMessagesFromServer();
}

export {handleServerUpdate, updateApp};