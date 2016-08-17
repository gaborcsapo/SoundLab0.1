import {Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';

@Component({
  selector: 'media-player',
  templateUrl: 'build/components/mediaPlayer.html',
  styles:[`
    input[type=range]{
        -webkit-transform:rotate(-90deg);
        width:4em;
        padding-top: 15px;
        padding-bottom: 10px;
    }
    
    input[type=range]{
        -webkit-appearance: none;
    }

    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        margin-top: -8px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #387ef5;
        -webkit-transform: scale(0.67);
        transform: scale(0.67);
        -webkit-transition-duration: 120ms;
        transition-duration: 120ms;
        -webkit-transition-property: background-color, border, -webkit-transform;
        transition-property: background-color, border, -webkit-transform;
        transition-property: transform, background-color, border;
        transition-property: transform, background-color, border, -webkit-transform;
        -webkit-transition-timing-function: ease;
        transition-timing-function: ease;
        pointer-events: none;
    }

    input[type=range]:active::-webkit-slider-thumb {
        -webkit-transform: translate3d(0, 0, 0) scale(1);
        transform: translate3d(0, 0, 0) scale(1);
    }

    input[type=range]::-webkit-slider-runnable-track {
        height: 2px;
        background: #bdbdbd;
        cursor: pointer;
    }
    
      
   `]
})
export class mediaPlayer implements AfterViewInit{
    audio = new Audio();
    something:any;
    icon="play";
    currentTime = 0;
    volume:any;
    playbackRate = 100;
    
    getAudio(){
        return this.audio;  
    }

    ngAfterViewInit(){
        this.audio = <HTMLAudioElement> document.getElementById('sound');
        window.setInterval(this.updateKnob, 500);
    }

    togglePlay(){
        if (!this.audio.paused){    
            this.audio.pause();
            this.icon ="play";
            return;
        }
        this.audio.play();
        this.icon ="pause";
        return;
    }

    volumeChange(amount){
        this.audio.volume = amount/100;
    }

    setPlaybackRate(amount){
        this.playbackRate = amount;
        this.audio.playbackRate = amount/100;
    }

    seekTime(time){
        this.audio.currentTime = time;
    }

    updateKnob = () =>{
        this.currentTime = this.audio.currentTime;
    }
}