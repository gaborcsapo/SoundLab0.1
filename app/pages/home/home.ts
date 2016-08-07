import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
// import {Filter} from '../../components/filter';
declare var Tuna:any;

@Component({
  templateUrl: 'build/pages/home/home.html',
  // directives:[Filter],
})
export class HomePage {
  constructor(private navCtrl: NavController) {}
  source:any;
  context = new AudioContext();
  filter:any;
  currentFilter:any;
  currentProps:any;
  tuna = new Tuna(this.context);
  filters = {'Chorus': {'displayed': {'rate':{'value': 0, 'min':0.01, 'max':8, 'log':true},
                                      'feedback':{'value': 0, 'min':0, 'max':1, 'log':false},
                                      'delay':{'value': 0, 'min':0, 'max':1, 'log':true}},
                        'type': 'none'},
              'Lowpass':{'displayed': {'frequency':{'value': 20, 'min':20, 'max':22050, 'log':true},
                                      'Q':{'value': 0.001, 'min':0.001, 'max':100, 'log':true},
                                      'gain':{'value': -40, 'min':-40, 'max':40, 'log':true}},
                         'type':'lowpass'},
              'Highpass':{'displayed': {'frequency':{'value': 20, 'min':20, 'max':22050, 'log':true},
                                        'Q':{'value': 0.001, 'min':0.001, 'max':100, 'log':true},
                                        'gain':{'value': -40, 'min':-40, 'max':40, 'log':true}},
                         'type':'highpass'},
              'Bitcrusher': {'displayed': {'bits':{'value': 1, 'min':1, 'max':16, 'log':true},
                                          'normfreq':{'value': 0, 'min':0, 'max':1, 'log':true},
                                          'bufferSize':{'value': 256, 'min':256, 'max':16384, 'log':true}},
                            'type': 'none'}
            }//the filter data should be stored in a service and should be "get" through that

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

  ngOnInit(){
    var audio = <HTMLAudioElement> document.getElementById('sound');
    var url = 'http://api.soundcloud.com/tracks/240955058/stream' +
        '?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';
    audio.src = url;
    audio.autoplay = false;
    this.source = this.context.createMediaElementSource(audio);  
  }
}
