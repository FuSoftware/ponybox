import { Channel } from './channel';
import { SmileyCategory } from './smiley-category';
import { Smiley } from './smiley';

export class Ponybox {
    currentChannel : Channel = null;
    openChannels : Array<Channel> = [];
    allChannels : {[key:string] : Array<Channel>} = {};
    smileys: Array<SmileyCategory> = [];
    
    constructor() {

    }
    
    joinChannel(channel : Channel) {
        if (!this.isOpenChannel(channel)) {
            this.openChannels.push(channel);
            if (this.currentChannel === null) {
                this.currentChannel = channel;
                this.currentChannel.open();
            }
        }
    }
    
    changeCurrentChannel(channel: Channel) {
        if (this.currentChannel !== null) {
            this.currentChannel.close();
        }
        this.currentChannel = channel;
        this.currentChannel.open();
    }
    
    isOpenChannel(channel : Channel) {
        for (var i = 0, len = this.openChannels.length; i < len; i++) {
            if (this.openChannels[i].name === channel.name) {
                return true;
            }
        }
        return false;
    }
    
    isCurrentChannel(channel : Channel) {
        return (this.currentChannel !== null && this.currentChannel.name === channel.name);
    }
    
    addChannelsCategory(category: string, channels: Array<Channel>) {
        this.allChannels[category] = channels;
        return this;
    }
    
    isOpen() {
        return (this.currentChannel !== null);
    }
    
    clear() {
        for (var i in this.allChannels) {
            for (var j in this.allChannels[i]) {
                this.allChannels[i][j].clear();
            }
        }
        this.openChannels = [];
        this.allChannels = {};
        this.currentChannel = null;
        this.smileys = [];
    }
    
    initSmileys(rawSmileys: Array<any>) {
        let categories: any = {};
        for (var i in rawSmileys) {
            let rawSmiley = rawSmileys[i];
            if (!categories.hasOwnProperty(rawSmiley.category.name)) {
                let category = new SmileyCategory(rawSmiley.category.name, rawSmiley.category.label);
                categories[rawSmiley.category.name] = category;
                this.smileys.push(category);
            }
            let smileyCategory = categories[rawSmiley.category.name];
            let smiley = new Smiley(smileyCategory, rawSmiley.text, rawSmiley.url, parseInt(rawSmiley.order));
            smileyCategory.addSmiley(smiley);
        }
        
        for (var j in categories) {
            categories[j].sortSmilies();
        }
    }
    
    addCategory(categoryName: string, rawSmilies: any) {
        let category = this._getCategory(categoryName);
        if (category === null) {
            category = new SmileyCategory(categoryName, 'Personnalisé');
            this.smileys.unshift(category);
        }
        category.clear();
        for (var i in rawSmilies) {
            let rawSmiley = rawSmilies[i];
            let smiley = new Smiley(category, rawSmiley.text, rawSmiley.url, parseInt(rawSmiley.order));
            category.addSmiley(smiley);
        }
        category.sortSmilies();
        if (category.smileys.length === 0) {
            this.smileys.shift();
        }
    }
    
    _getCategory(categoryName: string) {
        for (var i = 0, len = this.smileys.length; i < len; i++) {
            if (this.smileys[i].name === categoryName) {
                return this.smileys[i];
            }
        }
        return null;
    }
}