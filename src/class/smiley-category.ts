import { Smiley } from './smiley';

export class SmileyCategory {    
    smileys : Array<Smiley> = [];
    
    public constructor(
        public name: string,
        public label : string
    ) {
        
    }
    
    addSmiley(smiley: Smiley) {
        this.smileys.push(smiley);
        return this;
    }
    
    clear() {
        this.smileys.slice(0, this.smileys.length);
    }
    
    sortSmilies() {
        this.smileys.sort((s1, s2) => {
            return s1.order - s2.order;
        });
    }
}