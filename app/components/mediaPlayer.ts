import {Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';

@Component({
  selector: 'media-player',
  templateUrl: 'build/components/mediaPlayer.html',
  styleUrls:['./mediaPlayer.css']
})
export class mediaPlayer implements AfterViewInit{
    audio:any;

    getAudio(){
        return this.audio;
    }
    ngAfterViewInit(){
        this.audio = <HTMLAudioElement> document.getElementById('sound');
    }
}