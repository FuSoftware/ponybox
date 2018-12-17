import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { CurrentUser } from '../../services/current-user';

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public currentUser : CurrentUser
    ) {
    
    }
    
    showModeratorHelp() {
        return (this.currentUser.isAuth() && this.currentUser.user.rights.modo);
    }
    
    dismiss() {
        this.viewCtrl.dismiss();
    }
}
