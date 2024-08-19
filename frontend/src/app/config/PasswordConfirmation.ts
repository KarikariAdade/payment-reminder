import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const controlToCompare = control.get(controlName);
    const matchingControl = control.get(matchingControlName);

    if (!controlToCompare || !matchingControl) {
      return null; // Return null if controls are not found
    }

    // Check if the values of both fields match
    if (controlToCompare.value !== matchingControl.value) {
      matchingControl.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}
