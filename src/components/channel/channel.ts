import { Component, Input, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

import { Channel } from '../../class/channel';
import { Message } from '../../class/message';

import { ServerInterface } from '../../services/server-interface'
import { PonyboxService } from '../../services/ponybox';
import { ObserverService } from '../../services/observer';

/**
 * Generated class for the ChannelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'channel-component',
  templateUrl: 'channel.html'
})
export class ChannelComponent {
    @Input() channel : Channel;
    @ViewChild(Content) content: Content

    constructor(
        public ponyboxService : PonyboxService,
        public serverInterface : ServerInterface,
        private observerService : ObserverService
    ) {
        this.serverInterface.observeLoadOlderMessages().subscribe((data: any) => {
            if (data.messages.length === 0) {
                data.channel.isFullLoad = true;
                data.channel.isLoading = false;
                return;
            }
            let dimensions = this.content.getContentDimensions();
            let lastHeight = dimensions.scrollHeight;
            setTimeout(() => {
                let dimensions = this.content.getContentDimensions();                    
                let diffHeight = dimensions.scrollHeight - lastHeight;
                this.content.scrollTo(0, diffHeight + dimensions.scrollTop, 0);
                data.channel.isLoading = false;
            }, 500);
            
        });
        
        this.serverInterface.observeNewMessage().subscribe((message: Message) => {
            if (message.channel.name === this.ponyboxService.ponybox.currentChannel.name) {
                let dimensions = this.content.getContentDimensions();
                let scrollTop = dimensions.scrollTop + dimensions.contentHeight;
                let mustScroll = dimensions.scrollHeight - scrollTop < 350;
                setTimeout(() => {
                    if (mustScroll) {
                        this.content.scrollToBottom();
                    }
                }, 250);
            }
        });
        
        this.observerService.observe('change-channel').subscribe((channel : Channel) => {
            let dimensions = this.content.getContentDimensions();
            let lastHeight = dimensions.scrollHeight;
            setTimeout(() => {
                let dimensions = this.content.getContentDimensions();                    
                let diffHeight = dimensions.scrollHeight - lastHeight;
                this.content.scrollTo(0, diffHeight + dimensions.scrollTop, 0);
            }, 500);
        });
    }
    
    onScroll(event) {
        if (event === null) return;
        if (this.ponyboxService.ponybox === null) return;
        if (this.ponyboxService.ponybox.currentChannel.isFullLoad || this.ponyboxService.ponybox.currentChannel.isLoading) return;
        if (event.scrollTop <= 200) {
            this.ponyboxService.getOlderMessages(this.ponyboxService.ponybox.currentChannel);
        }
    }

}
