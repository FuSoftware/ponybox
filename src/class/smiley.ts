import { SmileyCategory } from './smiley-category';

export class Smiley {
    public constructor (
        public category : SmileyCategory,
        public text : string,
        public url : string,
        public order: number
    ) {
        
    }
}
