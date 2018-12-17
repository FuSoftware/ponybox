import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PonyboxService } from '../../services/ponybox';
import { Channel } from '../../class/channel';

/**
 * Generated class for the ChannelsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-channels-list',
  templateUrl: 'channels-list.html',
})
export class ChannelsListPage {
    categories : Array<string> = [];
    
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public ponyboxService : PonyboxService
    ) {
    
    }
    
    openChannel(channel : Channel) {
        this.ponyboxService.changeCurrentChannel(channel);
        this.navCtrl.pop();
    }
    
    swipeEvent(event: any) {
        if (event.direction === 2) {
            this.navCtrl.pop();
        }
    }
    
    ionViewWillEnter() {
        this.categories = Object.keys(this.ponyboxService.ponybox.allChannels);
    }
}
