import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'sigFig'
})
export class SigFigPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: string, precision?: number): unknown {
    return Number.parseFloat(value).toPrecision(isNaN(precision) ? 3 : precision);
  }

}
