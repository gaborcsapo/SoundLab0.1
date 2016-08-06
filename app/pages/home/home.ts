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
  filters = {'chorus': {'rate':{'value': 0, 'min':0.01, 'max':8},
                        'feedback':{'value': 0, 'min':0, 'max':1},
                        'delay':{'value': 0, 'min':0, 'max':1},
                        'bypass':{'value': 0, 'min':0, 'max':1}}
            }//the filter data should be stored in a service and should be "get" through that
  
  chooseFilter(event){
    // first i have to diconnect the previous one
    this.currentFilter = this.filters['chorus'];
    this.currentProps = Object.keys(this.currentFilter);//read this !!!https://webcake.co/object-properties-in-angular-2s-ngfor/ implement as a pipe and only input currentFilter in the end
    this.filter = new this.tuna['Chorus']({
        rate: 1.5,
        feedback: 0.2,
        delay: 0.0045,
        bypass: 0
    });
    this.source.connect(this.filter);
    this.filter.connect(this.context.destination);
  }

  update(item, amount){
    var change = amount/(100/(this.currentFilter[item]['max']-this.currentFilter[item]['min']));
    console.log(change);
    this.currentFilter[item]['value'] = change;
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
