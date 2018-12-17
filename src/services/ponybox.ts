import { Injectable } from '@angular/core';
import { Ponybox } from '../class/ponybox';
import { CurrentUser } from './current-user';
import { ServerInterface } from './server-interface';
import { Channel } from '../class/channel';
import { Message } from '../class/message';
import { ObserverService } from './observer';

@Injectable()
export class PonyboxService {
    ponybox: Ponybox = null;
    
    constructor(
        private currentUser : CurrentUser,
        private serverInterface : ServerInterface,
        private observerService : ObserverService
    ) {
        
    }
    
    sendMessage(message: string, receiver : string = null) {
        if (receiver !== null && receiver.trim().length === 0) {
            receiver = null;
        }
        if (this.currentUser.isAuth() && this.ponybox.isOpen()) {
            return this.serverInterface.sendMessage(this.ponybox.currentChannel.name, message, receiver);
        }
        return new Promise((resolve) => {resolve({valid : false, error : 'cb-close'})});
    }
    
    changeCurrentChannel(channel: Channel) {
        this.ponybox.changeCurrentChannel(channel);
        this.observerService.emit('change-channel', channel);
    }
    
    getOlderMessages(channel: Channel) {
        channel.isLoading = true;
        this.serverInterface.getOlderMessages(channel.name, channel.messages[0].id);
    }
    
    editMessage(message: Message, newMessage: string) {
        this.serverInterface.editMessage(message.channel.name, message.id, newMessage);
    }
    
    logout() {
        this.serverInterface.disconnectUser();
        this.observerService.clear();
    }
}