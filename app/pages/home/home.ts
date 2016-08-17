import {Component, ViewChild, AfterViewInit, ApplicationRef} from '@angular/core';
import {NavController, ModalController, Platform, NavParams, ViewController, PopoverController} from 'ionic-angular';
import {filterService} from '../../services/filterService';
import {filterModal} from '../../components/filterModal';
import {infoPopOver} from '../../components/infoPopOver';
import {mediaPlayer} from '../../components/mediaPlayer';
// import * as soundcloud from 'soundcloud';
declare var Tuna:any;
// declare var SC: any;

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives:[mediaPlayer],
  providers:[filterService]
})
export class HomePage implements AfterViewInit{
  constructor(private navCtrl: NavController, private filterService: filterService, private modalCtrl: ModalController, 
              private popoverController : PopoverController, private appRef: ApplicationRef) {}
  source:any;
  context = new AudioContext();
  filter:any;
  currentFilter:any;
  currentFilterName = "No Filter"
  currentProps:any;
  tuna = new Tuna(this.context);
  filters = this.filterService.getFilters();
  audio:any;
  @ViewChild(mediaPlayer)
  private mediaPlayer:mediaPlayer;
  
  ngAfterViewInit(){
    this.audio = this.mediaPlayer.getAudio(); 

    //The beta version I am using is not yet functional on Ionic 2... SO I'm just using this static way to get a song.

    var url = 'http://api.soundcloud.com/tracks/274454627/stream' +
        '?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';
    this.audio.src = url;
    this.source = this.context.createMediaElementSource(this.audio);
  }

  chooseFilter(event){   
    if (this.filter != undefined) //disconnect if there is a filter already
      this.filter.disconnect();
    //saving new filter
    this.currentProps = [];
    this.currentFilter = this.filters[event];
    this.currentFilterName = event;
    //creating the filter depending on type
    if (this.filters[event]['type'] != 'none'){
      this.filter = new this.tuna['Filter']();
      this.filter['filterTpye'] = this.currentFilter['type'];
    } else {
      this.filter = new this.tuna[event]();
    }
    //adjust the data to make displaying easier
    this.currentProps = Object.keys(this.currentFilter['displayed']);//read this !!!https://webcake.co/object-properties-in-angular-2s-ngfor/ implement as a pipe and only input currentFilter in the end
    for (var item of this.currentProps) {
      this.filter[item] = this.currentFilter['displayed'][item]['min']
    }
    
    this.source.connect(this.filter);
    this.filter.connect(this.context.destination);
  }
  //when chagning the range sliders, updaing the sound attributes
  update(item, amount){
    var toChange = this.currentFilter['displayed'][item];
    var change;
    //human sound perception happens on a logarithmic scale, so to make the changes appear linear, the values change non-linearly
    if (toChange['log'] == true) {
      change = toChange['min'] + (Math.pow(2, amount*(Math.log2(toChange['max']-toChange['min']+1)/100))-1);
    } else {
      change = toChange['min']+(amount/100)*(toChange['max']-toChange['min']);
    }
    this.currentFilter['displayed'][item]['value'] = change;
    this.filter[item] = change;  
  }
  //choosing filter
  openModal(){
    let modal = this.modalCtrl.create(filterModal);
    modal.onDidDismiss(data => {
      this.chooseFilter(data);
    });
    modal.present();
  }
  //info about current filter
  openPopOver(){
    let popover = this.popoverController.create(infoPopOver, {'data':this.currentFilter.description});
    popover.present();
  }
}
