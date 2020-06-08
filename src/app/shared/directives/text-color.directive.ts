import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTextColor]'
})
export class TextColorDirective {

  constructor(elRef: ElementRef) {
    elRef.nativeElement.style.color = 'green';
  }

}



