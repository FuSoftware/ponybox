export class RightsMessage {    
    public edit : boolean = false;
    public delete : boolean = false;
    public read: boolean = false;
    
    public constructor(
        data: any = {}
    ) {
        this.setFromData(data);
    }
    
    setFromData(data: any) {
        let variables = ['edit', 'delete', 'read'];
        for (var i = 0, len = variables.length; i < len; i++) {
            if (data.hasOwnProperty(variables[i])) {
                this[variables[i]] = data[variables[i]];
            }
        }
    }
}