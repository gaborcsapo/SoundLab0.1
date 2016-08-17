import {Component} from '@angular/core';
import {ModalController, Platform, NavParams, ViewController} from 'ionic-angular';
import {filterService} from '../services/filterService';

@Component({
  templateUrl: './build/components/filterModal.html',
  providers:[filterService]
})
export class filterModal {
  filters:any;
  filterList:any;
  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController, private filterService: filterService) {
      this.filters = this.filterService.getFilters();
      this.filterList = Object.keys(this.filters);
  }

  dismiss() {
      this.viewCtrl.dismiss();
  }
  selectOption(event){
      this.viewCtrl.dismiss(event);
  }
}