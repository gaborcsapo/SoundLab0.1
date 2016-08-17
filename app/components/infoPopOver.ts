import {NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
    templateUrl: './build/components/infoPopOver.html'
})
export class infoPopOver{
    constructor(private navParams: NavParams){}
    
    text:string;
    
    ngOnInit() {
        if (this.navParams.data) 
            this.text = this.navParams.data.data;
    }
}