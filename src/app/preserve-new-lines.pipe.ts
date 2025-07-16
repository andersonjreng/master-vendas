import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'preserveNewLines',
})
export class PreserveNewLinesPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/(\r\n|\n|\r)/g, '<br>');
  }
}
