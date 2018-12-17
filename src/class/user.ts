import { RightsOption } from './rights-option';

export class User {    
    public rights: RightsOption;

    public constructor(
        public id: number,
        public username: string = null,
        public color: string = null,
        public avatar: string = null
    ) {

    }
    
    public setFromData(data: any) {
        this.username = data.username;
        this.color = data.color;
        this.avatar = data.avatar;
        this.rights = new RightsOption(data.rights);
    }
}