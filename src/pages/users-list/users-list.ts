import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PonyboxService } from '../../services/ponybox';
import { ServerInterface } from '../../services/server-interface';

import { User } from '../../class/user';

/**
 * Generated class for the UsersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-users-list',
  templateUrl: 'users-list.html',
})
export class UsersListPage {
    public admins: Array<User> = [];
    public moderators: Array<User> = [];
    public users: Array<User> = [];
    public inactives: Array<User> = [];
    private subscription = null;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public ponyboxService : PonyboxService,
        private serverInterface : ServerInterface
    ) {
       this.subscription = this.serverInterface.observeRefreshUsers().subscribe((data: any) => {
           if (data.channel.name !== this.ponyboxService.ponybox.currentChannel.name) return;
           this._clear();
           for(let i = 0, len = data.users.length; i < len; i++) {
               if (!data.users[i].active) {
                   this.inactives.push(data.users[i].user);
               } else {
                   let user = data.users[i].user;
                   if (user.rights.admin) {
                       this.admins.push(user);
                   } else if (user.rights.modo) {
                       this.moderators.push(user)
                   } else {
                       this.users.push(user);
                   }
               }
           }
        });
    }
    
    _clear() {
        this.admins.splice(0, this.admins.length);
        this.moderators.splice(0, this.moderators.length);
        this.users.splice(0, this.users.length);
        this.inactives.splice(0, this.inactives.length);
    }
    
    swipeEvent(event: any) {
        if (event.direction === 4) { //gauche
            this.navCtrl.pop();
        }
    }

    ionViewWillEnter() {
        this.serverInterface.refreshUsersList(this.ponyboxService.ponybox.currentChannel.name);
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
    }
}
