import { Injectable } from '@angular/core';
import { ChannelFactory } from './channel-factory';
import { UserFactory } from './user-factory';
import { Message } from '../../class/message';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class MessageFactory {
    constructor(
        private channelFactory : ChannelFactory,
        private userFactory : UserFactory,
        private sanitizer: DomSanitizer
    ) {

    }
    
    create(message : any) {
        let channelObject = this.channelFactory.get(message.channel);
        if (channelObject === null) return null;
        let fromUser = this.userFactory.create(message.from, false);
        let toUser = null;
        if (message.to !== null) {
            toUser = this.userFactory.create(message.to, false);
        }
        let dateMessage = new Date(message.sendDate);
        let emote = (message.type === 2);
        
        let messageObject = new Message(
            message.id,
            channelObject,
            this.sanitizer.bypassSecurityTrustHtml(message.format),
            dateMessage,
            emote,
            fromUser,
            toUser
        );
        messageObject.editRight(message.rights);
        return messageObject;
    }
}



