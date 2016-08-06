import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'my-filter',
  templateUrl: 'build/components/filter.html'
})
export class Filter {
  @Output() UpFilter = new EventEmitter<number>();
  
  @Input() item:any;
  @Input() max:number;
  @Input() min:number; 
  value:any;
  
  convert(amount){     
      this.value = amount/(100/(this.max-this.min));
  }
}