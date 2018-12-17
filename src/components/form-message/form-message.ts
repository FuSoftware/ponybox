import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { ToastController } from 'ionic-angular';

import { PonyboxService } from '../../services/ponybox';
import { ObserverService } from '../../services/observer';
import { Config } from '../../services/config';

import { User } from '../../class/user';
import { SmileyCategory } from '../../class/smiley-category';
/**
 * Generated class for the FormMessageComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'form-message-component',
  templateUrl: 'form-message.html'
})
export class FormMessageComponent {
    public messageGroup : FormGroup
    public destLocked: boolean = false
    public showSmileys: boolean = false
    public activeCategory: SmileyCategory = null

    constructor(
        private formBuilder: FormBuilder,
        public ponyboxService : PonyboxService,
        private observerService : ObserverService,
        public config : Config,
        private toastCtrl: ToastController
    ) {
        this.messageGroup = this.formBuilder.group({
            to: ['', [Validators.maxLength(100)]],
            message: ['', [Validators.required, Validators.maxLength(5000)]]
        });
        
        this.observerService.observe('click-user').subscribe((user: User) => {
            this.messageGroup.patchValue({to: user.username});
        });
    }
    
    submit() {
        if (this.messageGroup.valid) {
            let lastMessage = this.messageGroup.value.message;
            let to = this.messageGroup.value.to;
            if (!this.destLocked) {
                this.messageGroup.patchValue({to : ''});
            }
            this.messageGroup.patchValue({message : ''});
            this.showSmileys = false;
            this.ponyboxService.sendMessage(lastMessage, to).then((data: any) => {
                if (!data.valid) {
                    this.messageGroup.patchValue({message : lastMessage, to : to});
                    let toast = this.toastCtrl.create({
                        message : 'L\'utilisateur "' + to + '" n\'existe pas',
                        duration : 3000,
                        position: 'bottom',
                        showCloseButton : true,
                        closeButtonText : 'OK',
                        dismissOnPageChange : true
                    });
                    
                    toast.present();
                }
            });
        }
    }
    
    clickLock() {
        this.destLocked = !this.destLocked;
    }
    
    clickSmileys() {
        if (this.activeCategory === null) {
            this.activeCategory = this.ponyboxService.ponybox.smileys[0];
        }
        this.showSmileys = !this.showSmileys;
    }

    changeCategory(category: SmileyCategory) {
        this.activeCategory = category;
    }
    
    getSmilies() {
        if (this.activeCategory === null) return [];
        return this.activeCategory.smileys;
    }
    
    clickSmiley(s) {
        let message = this.messageGroup.value.message + s.text;
        this.messageGroup.patchValue({message : message});
    }
}
