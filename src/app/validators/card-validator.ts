import { ValidatorFn, AbstractControl } from '@angular/forms';
import { cardCheck } from '../helpers/card-check.helper';

export function CardValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const isValid = cardCheck(control.value);
    return isValid ? null : { cardCheck: isValid };
  };
}
