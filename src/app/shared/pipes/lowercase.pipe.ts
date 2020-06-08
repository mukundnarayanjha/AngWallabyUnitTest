import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLowerPipe'
})
export class LowercasePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // return null;
    return value.toLowerCase();
  }

}