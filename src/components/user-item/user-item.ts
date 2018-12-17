import { Component, Input } from '@angular/core';
import { User } from '../../class/user';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the UserItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user-item',
  templateUrl: 'user-item.html'
})
export class UserItemComponent {
  @Input() user: User;

  constructor(
    private storage: Storage,
  ) {
  }

  blockUser(){
    this.user.toggleBlock();

    this.storage.get('blocked').then((val) => {
      if (val === null) {
          val = {};
      }
      val[this.user.id] = this.user.blocked;

      this.storage.set(
          'blocked',
          val
      );
  });
  }

}
