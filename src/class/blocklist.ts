import { User } from './user';
import { Message } from './message';

export class BlockList {    
    public blocked: Array<User>;
    public active : boolean;

    public constructor() {
        this.active = true;
    }

    public addUser(user : User){
        if(this.blocked.indexOf(user) > -1) this.blocked[this.blocked.length] = user;
    }

    public removeUser(user : User){
        var index = this.blocked.indexOf(user);
        if (index > -1) this.blocked.splice(index, 1);
    }

    public isUserBlocked(user : User){
        return this.blocked.indexOf(user) > -1 && this.active;
    }

    public isMessageBlocked(message : Message){
        return this.isUserBlocked(message.sender) && this.active;
    }
}