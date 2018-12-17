import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController  } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Auth } from '../../services/auth';

import { PonyboxPage } from '../ponybox/ponybox';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    public loginGroup : FormGroup

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private formBuilder: FormBuilder,
        private alertCtrl : AlertController,
        private loadingCtrl : LoadingController,
        private authService : Auth
    ) {
        this.loginGroup = this.formBuilder.group({
            username: ['', [Validators.required, Validators.maxLength(100)]],
            password: ['', [Validators.required, Validators.maxLength(100)]],
        });
    }

    submit() {
        let loading = this.loadingCtrl.create();
        loading.present();
        this.authService.login(this.loginGroup.value.username, this.loginGroup.value.password).then((data: any) => {
            loading.dismiss();
            if (data.valid === true) {
                this.authService.connect(data.user.id, data.user.token).then((data : any) => {
                    if (data.valid === true) {
                        this.navCtrl.setRoot(PonyboxPage);
                    } else {
                        let alert = this.alertCtrl.create({
                            title: 'Erreur de connexion',
                            message: data.message,
                            buttons: [
                                {
                                    text: 'Ok',
                                    role: 'cancel'
                                },
                            ]
                        });
                        alert.present();
                    }
                });
            } else {
                let message = 'Erreur inconnu, veuillez contacter un administrateur.';
                switch(data.error) {
                    case 'LOGIN_ERROR_USERNAME' : message = 'Pseudo inconnu'; break;
                    case 'LOGIN_ERROR_PASSWORD' : message = 'Mot de passe incorrect' ; break;
                    default :;
                }
                let alert = this.alertCtrl.create({
                    title: 'Erreur de connexion',
                    message: message,
                    buttons: [
                        {
                            text: 'Ok',
                            role: 'cancel'
                        },
                    ]
                });
                alert.present();
            }
        });
        
    }

}
