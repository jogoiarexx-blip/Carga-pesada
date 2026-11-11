import {findHorn} from './horn-shop.mjs';
// Buzinas procedurais leves: não baixam áudio, só criam os osciladores ao tocar.
// Falas usam SpeechSynthesis do navegador. Sem voz PT-BR, um toque substituto.
const PATTERNS=Object.freeze({
 air:{tones:[146,187],shape:'sawtooth',notes:[[0,.78],[.87,.32]]},
 double:{tones:[217,274],shape:'square',notes:[[0,.28],[.35,.48],[.9,.22]]},
 retro:{tones:[314,372],shape:'triangle',notes:[[0,.16],[.27,.18],[.55,.16]]},
 ship:{tones:[96,121,146],shape:'sawtooth',notes:[[0,1.12]]},
 festival:{tones:[294],shape:'triangle',notes:[[0,.15,1],[.2,.15,1.25],[.4,.15,1.5],[.6,.3,2]]},
 voice:{tones:[324,407],shape:'triangle',notes:[[0,.1],[.17,.10]]}
});
export class HornPlayer{
 constructor({getContext,playFactory,getVolume,getSpeech,getUtterance}={}){
  this.getContext=getContext||(()=>null);
  this.playFactory=playFactory||(()=>{});
  this.getVolume=getVolume||(()=>.5);
  this.getSpeech=getSpeech||(()=>typeof speechSynthesis!=='undefined'?speechSynthesis:null);
  this.getUtterance=getUtterance||(()=>typeof SpeechSynthesisUtterance!=='undefined'?SpeechSynthesisUtterance:null);
  this.sources=[];
 }
 stop(){
  for(const o of this.sources){try{o.stop();o.disconnect();}catch{}}
  this.sources=[];
  try{this.getSpeech()?.cancel?.();}catch{}
 }
 play(hornId='factory'){
  const horn=findHorn(hornId)||findHorn('factory');
  this.stop();
  if(horn.kind==='factory'){this.playFactory();return {kind:'factory',voiced:false};}
  const ctx=this.getContext(),pattern=PATTERNS[horn.kind];
  let played=false;
  if(ctx?.createOscillator&&ctx?.createGain&&Number.isFinite(ctx.currentTime)&&pattern){
   const volume=Math.max(0,Math.min(1,Number(this.getVolume())||0));
   for(const [delay,duration,ratio=1] of pattern.notes){
    const amp=ctx.createGain();
    const start=ctx.currentTime+delay,peak=start+.035,end=start+duration;
    amp.gain.setValueAtTime(0,start);
    amp.gain.linearRampToValueAtTime(volume*.12,peak);
    amp.gain.exponentialRampToValueAtTime(.0001,end);
    amp.connect(ctx.destination);
    pattern.tones.forEach((freq,i)=>{
     const o=ctx.createOscillator();o.type=pattern.shape;
     o.frequency.setValueAtTime(freq*ratio*(1+i*.006),start);
     o.connect(amp);o.start(start);o.stop(end+.01);this.sources.push(o);
    });
   }
   played=true;
  }
  let voiced=false;
  if(horn.kind==='voice'&&horn.phrase){
   const synth=this.getSpeech(),Ctor=this.getUtterance();
   if(synth&&Ctor){
    try{
     const utterance=new Ctor(horn.phrase);
     utterance.lang='pt-BR';utterance.rate=.94;utterance.pitch=.89;
     utterance.volume=Math.max(0,Math.min(1,Number(this.getVolume())||0));
     const voices=synth.getVoices?.()||[];
     utterance.voice=voices.find(v=>v.lang?.toLowerCase()==='pt-br')||voices.find(v=>v.lang?.toLowerCase().startsWith('pt'))||null;
     synth.speak(utterance);voiced=true;
    }catch{}
   }
  }
  if(!played&&!voiced)this.playFactory();
  return {kind:horn.kind,voiced};
 }
}
