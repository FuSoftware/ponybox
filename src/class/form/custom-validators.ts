import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    
    public static inList(list : Array<any>) : ValidatorFn {
        return (input: AbstractControl) => {
            let value = input.value;
            if (list.indexOf(value) !== -1) {
                return null;
            }
            return {
                inList: true
            }
        }
    }
    
    public static notEmpty() : ValidatorFn {
        return (input: AbstractControl) => {
            let value = input.value;
            if (value.trim() !== '') {
                return null;
            }
            return {
                empty: true
            };
        }
    }
    
    public static date() : ValidatorFn {
        return (input: AbstractControl) => {
            let value = input.value;
            if (value instanceof Date) {
                return null;
            } else {
                return {
                    date:  true
                };
            }
        }
    }
}
