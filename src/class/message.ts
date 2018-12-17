import { User } from './user';
import { Channel } from './channel';
import { RightsMessage } from './rights-message';

export class Message {  
    public rights : RightsMessage;
         
    constructor(
        public id : number,
        public channel: Channel,
        public content: string|any,
        public date : Date,
        public emote : boolean = false,
        public sender : User = null,
        public to : User = null
    ) {
        this.rights = new RightsMessage();
    }
    
    editRight(data: any) {
        this.rights.setFromData(data);
        return this;
    }
    
    isPrivate() {
        return this.to !== null;
    }
}