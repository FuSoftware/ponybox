import { Message } from './message';

export class Channel {
    messages: Array<Message> = [];
    isFullLoad : boolean = false;
    isLoading : boolean = false;
    notReadMessages : number = 0;
    active : boolean = false
    
    constructor(
        public name: string,
        public label: string,
        public description : string,
        public locked : boolean = false
    ) {
        
    }
    
    open() {
        this.notReadMessages = 0;
        this.active = true;
    }
    
    close() {
        this.active = false;
    }

    visibleMessages(){
        return this.messages.filter(m=>!m.sender.blocked);
    }
    
    addMessage(message: Message, prepend: boolean = false) {
        if (prepend) {
            this.messages.unshift(message);
        } else {
            this.messages.push(message);
            if (this.messages.length > 200) {
                this.messages.shift();
            }
            if (!this.active) {
                this.notReadMessages++;
            }
        }
        return this;
    }
    
    replaceMessage(message: Message) {
        for (var i = 0, len = this.messages.length ; i < len; i++) {
            if (this.messages[i].id === message.id) {
                this.messages.splice(i, 1, message);
                break;
            }
        }
        return this;
    }
    
    deleteMessage(message: number) {
        for (var i = 0, len = this.messages.length ; i < len; i++) {
            if (this.messages[i].id === message) {
                this.messages.splice(i, 1);
                break;
            }
        }
        return this;
    }
    
    clear() {
        this.messages.splice(0, this.messages.length);
        this.notReadMessages = 0;
        this.isLoading = false;
        this.isFullLoad = false;
        this.notReadMessages = 0;
        return this;
    }
    
    setFromData(data: any) {
        let variables = ['locked'];
        for (var i = 0, len = variables.length; i < len; i++) {
            if (data.hasOwnProperty(variables[i])) {
                this[variables[i]] = data[variables[i]];
            }
        }
    }
}