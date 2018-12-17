import { Component, Input } from '@angular/core';
import { User } from '../../class/user';

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

  constructor() {
  }

  blockUser(){
    this.user.blocked = !this.user.blocked;
  }

}
