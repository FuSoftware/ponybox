import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { UserFactory } from './factory/user-factory';
import { ChannelFactory } from './factory/channel-factory';
import { MessageFactory } from './factory/message-factory';
import { User } from '../class/user';
import { Message } from '../class/message';
import { SocketServer } from './socket-server';
import { Ponybox } from '../class/ponybox';
import { ObserverService } from './observer';

@Injectable()
export class ServerInterface {
    subscriptions: any = {};
    subscribers: any = {};
    actualUser: User = null;
    ponybox : Ponybox = null;
    
    constructor(
        private socketServer : SocketServer,
        private userFactory: UserFactory,
        private channelFactory : ChannelFactory,
        private messageFactory : MessageFactory,
        private observerService : ObserverService
    ) {
    
    }
    
    connect() {
        this.socketServer.connect();
    }
    
    protected _observe(typeObserver: string) {
        return new Observable(observer => {
            if (!this.subscribers.hasOwnProperty(typeObserver)) {
                this.subscribers[typeObserver] = [];
            }
            this.subscribers[typeObserver].push(observer);
        });
    }
    
    protected _unobserve(name: string = null) {
        if (name === null) {
            for (var i in this.subscribers) {
                for (var j in this.subscribers[i]) {
                    this.subscribers[i][j].unsubscribe();
                }
            }
            this.subscribers = {};
            return this;
        }
        if (this.subscribers.hasOwnProperty(name)) {
            for (var k in this.subscribers[name]) {
                this.subscribers[name][k].unsubscribe();
            }
            this.subscribers[name] = [];
        }
        return this;
    }
    
    protected _emitToSubscribers(typeObserver: string, data: any = null) {
        if (this.subscribers.hasOwnProperty(typeObserver)) {
            for (var i = 0, len = this.subscribers[typeObserver].length; i < len; i++) {
                this.subscribers[typeObserver][i].next(data);
            }
        }
    }
    
        
    observeNewMessage() {
        return this._observe('new-message');
    }
    
    observeLoadOlderMessages() {
        return this._observe('load-older-messages');
    }
    
    observeRefreshUsers() {
        return this._observe('refresh-users-list');
    }
    
    observeDisconnect() {
        return this._observe('disconnect');
    }
    
    connectUser(user: number, token: string) {
        // On va d'abors initialiser les "subscription"
        // Et les retirer si la connexion est invalide
        // Cela permet de capturer les 1er event qui se déclenche juste après la connexion
        return new Promise(resolve => {
            this.initializeSubscription();
            this.socketServer.emit('create', {user: user, token: token}, (val: any) => {
                if (!val.valid) {
                    this._unsubscribe();
                }
                let data = {
                    valid : val.valid,
                    user : null,
                    message : null
                };
                if (data.valid === true) {
                    data.user = val.data;
                    this.socketServer.emit('login', () => {
                        this.sendRefreshAllChannels();
                        this.joinAllChannels();
                    });
                    data.user.id = parseInt(data.user.uid);
                    resolve(data);
                } else {
                    if (val.data !== null) {
                        let banner = this.userFactory.create(val.data.banner);
                        let endDate = new Date(val.data.end);
                        let reason = val.data.reason;
                        
                        let day = '' + endDate.getDate() + '';
                        let month = '' + endDate.getMonth() + '';
                        let year = '' + endDate.getFullYear() + '';

                        let formatDate = day + '/' + month + '/' + year;
                        
                        let hours = '' + endDate.getHours() + '';
                        if (endDate.getHours() <= 9) {
                            hours = '0' + hours;
                        }
                        let min = '' + endDate.getMinutes() + '';
                        if (endDate.getMinutes() <= 9) {
                            min = '0' + min;
                        }
                        
                        let formatTime = hours + ':' + min;
                        
                        data.message = 'Vous avez été bannis par <b>' + banner.username + '</b> jusqu\'au <u>' + formatDate + ' à ' + formatTime + '</u>';
                        if (reason !== null) {
                            data.message += '<br /><b>Raison</b> : ' + reason;
                        }
                    } else {
                        data.message = val.message;
                    }
                    resolve(data);
                }
            });
        });
    }
    
    disconnectUser() {
        this.actualUser = null;
        this._unsubscribe();
        this._unobserve();
        this.socketServer.emit('disconnect-user');
        this.ponybox.clear();
        this.socketServer.disconnect();
    }
    
    sendRefreshAllChannels() {
        this.socketServer.emit('refresh-all-channels');
    }
    
    joinAllChannels() {
        this.socketServer.emit('join-all-channels');
    }
    
    getOriginalMessage(message: Message) {
        return new Promise((resolve) => {
            this.socketServer.emit('get-original-message', {channel: message.channel.name, message : message.id}, (originalMessage: string) => {
                resolve(originalMessage);
            });
        });
    }
    
    editMessage(channel: string, message: number, newMessage: string) {
        this.socketServer.emit('edit-message', {channel: channel, message : message, newMessage: newMessage});
    }
    
    initializeSubscription() {
        let subscriptionJoinChannel = this.socketServer.observe('join-channel').subscribe((data : any) => {
            this.ponybox.joinChannel(this.channelFactory.create(data));
        });
           
        let subscriptionChannelMessages = this.socketServer.observe('get-older-message').subscribe((data:any) => {
            let channel = this.channelFactory.get(data.channel);
            if (channel === null) return;
            let messages = [];
            data.messages.reverse();
            for (var i = 0, len = data.messages.length; i < len; i++) {
                let message = this.messageFactory.create(data.messages[i]);
                messages.unshift(message);
                channel.addMessage(message, true);
            }
            this._emitToSubscribers('load-older-messages', {channel : channel, messages : messages});
        });
        
        let subscriptionNewMessage = this.socketServer.observe('new-message').subscribe((data: any) => {
            let message = this.messageFactory.create(data);
            if (message !== null) {
                message.channel.addMessage(message);
            }

            if (!this.ponybox.isCurrentChannel(message.channel)) {
                this.observerService.emit('new-message-other-channel');
            }
            this._emitToSubscribers('new-message', message);
        });
        
        let subscriptionEditMessage = this.socketServer.observe('edit-message').subscribe((data: any) => {
            let message = this.messageFactory.create(data);
            if (message !== null) {
                message.channel.replaceMessage(message);
            }
        }); 
        
        let subscriptionDeleteMessage = this.socketServer.observe('delete-message').subscribe((data: any) => {
            let channel = this.channelFactory.get(data.channel);
            if (channel === null) return;
            channel.deleteMessage(data.id);
        });
        
        let subscriptionClearChannel = this.socketServer.observe('clear-channel').subscribe((channel: string) => {
            let channelObject = this.channelFactory.get(channel);
            if (channelObject === null) return;
            channelObject.clear();
        });
        
        let subscriptionUsersList = this.socketServer.observe('refresh-channel-users').subscribe((data: any) => {
            let channel = this.channelFactory.get(data.channel);
            if (channel === null) return;
            
            let users = [];
            for (let i = 0, len = data.users.length; i < len; i++) {
                let user = this.userFactory.create(data.users[i]);
                if (user !== null) {
                    users.push({user : user, active : data.users[i].isActive});
                }
            }
            
            this._emitToSubscribers('refresh-users-list', {channel : channel, users : users});
        });
        
        let subscriptionChannelsList = this.socketServer.observe('refresh-all-channels').subscribe((channels: any) => {
            for (var channelName in channels) {
                let channelsCategory = [];
                for (let i = 0, len = channels[channelName].length; i < len; i++) {
                    let channelObject = this.channelFactory.create(channels[channelName][i]);
                    if (channelObject !== null) {
                        channelsCategory.push(channelObject);
                    }
                }
                this.ponybox.addChannelsCategory(channelName, channelsCategory);
            }
        });
        
        let subscriptionSmileyList = this.socketServer.observe('smiley-list').subscribe((rawSmileys: any) => {
            this.ponybox.initSmileys(rawSmileys);
        });
        
        let subscriptionSmileyListCategory = this.socketServer.observe('smiley-list-category').subscribe((rawSmileys: any) => {
            this.ponybox.addCategory(rawSmileys.category, rawSmileys.smilies);
        });
        
        let subscriptionDisconnect = this.socketServer.observe('disconnect').subscribe(() => {
            this._emitToSubscribers('disconnect');
        });
        
        this._subscribe('new-message', subscriptionNewMessage);
        this._subscribe('join-channel', subscriptionJoinChannel);
        this._subscribe('channel-messages', subscriptionChannelMessages);
        this._subscribe('edit-message', subscriptionEditMessage);
        this._subscribe('delete-message', subscriptionDeleteMessage);
        this._subscribe('clear-channel', subscriptionClearChannel);
        this._subscribe('refresh-channel-users', subscriptionUsersList);
        this._subscribe('refresh-all-channels', subscriptionChannelsList);
        this._subscribe('smiley-list', subscriptionSmileyList);
        this._subscribe('smiley-list-category', subscriptionSmileyListCategory);
        this._subscribe('disconnect', subscriptionDisconnect);
    }
    
    sendMessage(channel: string, message : string, receiver : string = null) {
        let oParams = {
            channel : channel,
            message : message,
            to : receiver
        }
        return new Promise((resolve) => {
            this.socketServer.emit('send-message', oParams, (data) => {
                resolve(data);
            });
        });
    }
    
    getOlderMessages(channel: string, start: number) {
        this.socketServer.emit('get-older-messages', {channel : channel, start : start});
    }
    
    refreshUsersList(channel: string) {
        this.socketServer.emit('refresh-channel-users', {channel : channel});
    }
    
    protected _unsubscribe(name: string = null) {
        if (name === null) {
            for (var i in this.subscriptions) {
                this.subscriptions[i].unsubscribe();
            }
            return this;
        }
        if (this.subscriptions.hasOwnProperty(name)) {
            this.subscriptions[name].unsubscribe();
        }
        return this;
    }
    
    protected _subscribe(name: string, subscription: Subscription) {
        // On enleve la subscription si elle existe déjà
        this._unsubscribe(name);
        this.subscriptions[name] = subscription;
        return this;
    }
}