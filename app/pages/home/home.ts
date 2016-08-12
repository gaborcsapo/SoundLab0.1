import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {NavController, ModalController, Platform, NavParams, ViewController, PopoverController} from 'ionic-angular';
import {filterService} from '../../services/filterService';
import {filterModal} from '../../components/filterModal';
import {infoPopOver} from '../../components/infoPopOver';
import {mediaPlayer} from '../../components/mediaPlayer';
declare var Tuna:any;
declare var PWorker:any;

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives:[mediaPlayer],
  providers:[filterService]
})
export class HomePage implements AfterViewInit{
  constructor(private navCtrl: NavController, private filterService: filterService, private modalCtrl: ModalController, 
              private popoverController : PopoverController) {}
  source:any;
  context = new AudioContext();
  filter:any;
  currentFilter:any;
  currentProps:any;
  tuna = new Tuna(this.context);
  filters = this.filterService.getFilters();
  filterList = Object.keys(this.filters);
  @ViewChild(mediaPlayer)
  private mediaPlayer:mediaPlayer;
    
  chooseFilter(event){   
    if (this.filter != undefined)
      this.filter.disconnect();
  
    this.currentFilter = this.filters[event];

    if (this.filters[event]['type'] != 'none'){
      this.filter = new this.tuna['Filter']();
      this.filter['filterTpye'] = this.currentFilter['type'];
    } else {
      this.filter = new this.tuna[event]();
    }
    
    this.currentProps = Object.keys(this.currentFilter['displayed']);//read this !!!https://webcake.co/object-properties-in-angular-2s-ngfor/ implement as a pipe and only input currentFilter in the end
    for (var item of this.currentProps) {
      this.filter[item] = this.currentFilter['displayed'][item]['min']
    }
    
    this.source.connect(this.filter);
    this.filter.connect(this.context.destination);
  }

  update(item, amount){
    var toChange = this.currentFilter['displayed'][item]
    var change = toChange['min']+(amount/100)*(toChange['max']-toChange['min']);
    if (toChange['log'] == true) {
      change = toChange['min'] + (Math.pow(2, amount*(Math.log2(toChange['max']-toChange['min']+1)/100))-1);
    }
    this.currentFilter['displayed'][item]['value'] = change;
    this.filter[item] = change;  
  }

  ngAfterViewInit(){
    var audio = this.mediaPlayer.getAudio();    
    var url = 'http://api.soundcloud.com/tracks/240955058/stream' +
        '?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';
    audio.src = url;
    this.source = this.context.createMediaElementSource(audio);  
  }
  
  openModal(){
    let modal = this.modalCtrl.create(filterModal);
    modal.onDidDismiss(data => {
      this.chooseFilter(data);
    });
    modal.present();
  }

  openPopOver(){
    let popover = this.popoverController.create(infoPopOver);
    popover.present();
  }
}
