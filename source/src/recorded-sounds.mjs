const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export class RecordedSounds {
 constructor(AudioClass=Audio,base=document.baseURI){
  this.engine=new AudioClass(new URL('assets/audio/motor.ogg',base).href);
  this.hornSound=new AudioClass(new URL('assets/audio/buzina.ogg',base).href);
  this.crashSound=new AudioClass(new URL('assets/audio/colisao.ogg',base).href);
  this.engine.loop=true;this.engine.preload='auto';this.engine.preservesPitch=false;this.hornSound.preload=this.crashSound.preload='auto';this.lastCrash=-Infinity;this.setVolume(.5);
 }
 setVolume(value){this.volume=clamp(Number.isFinite(Number(value))?Number(value):.5,0,1);this.engine.volume=this.volume*.48;this.hornSound.volume=this.volume*.65;this.crashSound.volume=this.volume*.6;}
 play(sound){try{sound.currentTime=0;const p=sound.play();p?.catch?.(()=>{});}catch{}}
 start(){try{const p=this.engine.play();p?.catch?.(()=>{});}catch{}}
 stop(){this.engine.pause();}
 update(speed){this.engine.playbackRate=clamp(.82+Math.abs(speed)/75,.82,1.45);}
 horn(){this.play(this.hornSound);}
 crash(time){if(time-this.lastCrash<.7)return;this.lastCrash=time;this.play(this.crashSound);}
}
