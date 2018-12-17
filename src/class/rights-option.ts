export class RightsOption {    
    public admin: boolean = false;
    public modo: boolean = false;
    public edit : boolean = false;
    public delete : boolean = false;
    public quizz: boolean = false;
    public hot: boolean = false;
    
    public constructor(
        data: any
    ) {
        let variables = ['admin', 'modo', 'edit', 'delete', 'quizz', 'hot'];
        for(var i = 0, len = variables.length; i < len; i++) {
            if (data.hasOwnProperty(variables[i])) {
                this[variables[i]] = data[variables[i]];
            }
        }
    }
}