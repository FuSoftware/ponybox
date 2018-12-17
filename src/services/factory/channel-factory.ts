import { Injectable } from '@angular/core';
import { Channel } from '../../class/channel';

@Injectable()
export class ChannelFactory {
    private saves: any = {};
    
    constructor() {

    }
    
    create(channel : any, update: boolean = true) {
        let channelObject;
        if (this.exists(channel.name)) {
            channelObject = this.saves[channel.name];
            if (update) {
                channelObject.setFromData(channel);
            }
        } else {
            channelObject = new Channel(channel.name, channel.label, channel.description);
            channelObject.setFromData(channel);
        }
        this.save(channelObject);
        return channelObject;
    }
    
    update(channel: Channel|string, data: any) {
        let channelName = (channel instanceof Channel) ? channel.name : channel;
        data.name = channelName;
        return this.create(data);
    }
    
    get(name: string) {
        if (this.exists(name)) {
            return this.saves[name];
        }
        return null;
    }
    
    exists(name: string) {
        return this.saves.hasOwnProperty(name);
    }
    
    save(channel: Channel) {
        this.saves[channel.name] = channel;
    }
}



