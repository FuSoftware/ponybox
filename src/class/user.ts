import { RightsOption } from './rights-option';

export class User {    
    public rights: RightsOption;
    public blocked : boolean;

    public constructor(
        public id: number,
        public username: string = null,
        public color: string = null,
        public avatar: string = null,
    ) {
        this.blocked = false;
    }
    
    public setFromData(data: any) {
        this.username = data.username;
        this.color = data.color;
        this.avatar = data.avatar;
        this.rights = new RightsOption(data.rights);
        this.blocked = false;
    }

    public toggleBlock(){
        this.blocked = !this.blocked;
    }
}