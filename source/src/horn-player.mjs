import {findHorn} from './horn-shop.mjs';

// Cornetas procedurais em camadas, filtradas, com envelopes suaves e harmônicos.
// Sem downloads extras nem processamento contínuo no loop do jogo.
export const HORN_PATTERNS=Object.freeze({
 air:{tones:[130,163,201],shape:'sawtooth',cutoff:1300,level:.19,notes:[[0,.8,1],[.91,.34,1]]},
 double:{tones:[170,216,267],shape:'sawtooth',cutoff:1400,level:.18,notes:[[0,.33,1],[.43,.5,1],[1.04,.25,1]]},
 retro:{tones:[325,403],shape:'triangle',cutoff:2300,level:.20,notes:[[0,.16,1],[.26,.19,1],[.57,.2,.93]]},
 ship:{tones:[78,98,121,155],shape:'sawtooth',cutoff:650,level:.19,notes:[[0,1.3,1]]},
 festival:{tones:[230,345],shape:'triangle',cutoff:1900,level:.20,notes:[[0,.16,1],[.23,.16,1.25],[.46,.17,1.5],[.7,.29,2]]},
 train:{tones:[138,185,235],shape:'sawtooth',cutoff:1050,level:.20,notes:[[0,1.03,1],[1.19,.44,1.04]]},
 triple:{tones:[168,212,268,314],shape:'sawtooth',cutoff:1700,level:.17,notes:[[0,.26,1],[.36,.3,1],[.79,.53,1]]},
 country:{tones:[238,355],shape:'triangle',cutoff:2100,level:.21,notes:[[0,.15,1],[.2,.2,.8],[.45,.2,1.33],[.72,.27,1]]},
 voice:{tones:[275,350],shape:'triangle',cutoff:1850,level:.08,notes:[[0,.10,1],[.17,.1,1.15]]}
});
export const hornDuration=kind=>HORN_PATTERNS[kind]?Math.max(...HORN_PATTERNS[kind].notes.map(n=>n[0]+n[1])):0;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(n))?Number(n):max));
export class HornPlayer{
 constructor({getContext,playFactory,stopFactory,getVolume,getSpeech,getUtterance}={}){
  this.getContext=getContext||(()=>null);
  this.playFactory=playFactory||(()=>{});
  this.stopFactory=stopFactory||(()=>{});
  this.getVolume=getVolume||(()=>.5);
  this.getSpeech=getSpeech||(()=>typeof speechSynthesis!=='undefined'?speechSynthesis:null);
  this.getUtterance=getUtterance||(()=>typeof SpeechSynthesisUtterance!=='undefined'?SpeechSynthesisUtterance:null);
  this.sources=new Set();this.nodes=new Set();this.sequence=0;
 }
 stop(){
  this.sequence++;
  for(const o of this.sources){try{o.onended=null;o.stop();o.disconnect();}catch{}}
  this.sources.clear();
  for(const n of this.nodes){try{n.disconnect();}catch{}}
  this.nodes.clear();
  try{this.stopFactory();}catch{}
  try{this.getSpeech()?.cancel?.();}catch{}
 }
 procedural(ctx,kind,volume){
  const p=HORN_PATTERNS[kind];
  if(!p||!ctx?.createOscillator||!ctx?.createGain||!Number.isFinite(ctx.currentTime)||volume<=0)return false;
  for(const [delay,duration,ratio] of p.notes){
   const start=ctx.currentTime+delay,end=start+duration;
   const attack=Math.min(.055,duration*.24),release=Math.min(.16,duration*.27),peak=Math.max(.0001,volume*p.level);
   const envelope=ctx.createGain();this.nodes.add(envelope);
   envelope.gain.setValueAtTime(.0001,start);
   envelope.gain.linearRampToValueAtTime(peak,start+attack);
   envelope.gain.setValueAtTime(peak,start+Math.max(attack,duration-release));
   envelope.gain.exponentialRampToValueAtTime(.0001,end);
   let terminal=envelope;
   if(ctx.createBiquadFilter){
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.Q.value=.45;
    filter.frequency.setValueAtTime(p.cutoff*.72,start);
    filter.frequency.linearRampToValueAtTime(p.cutoff,start+Math.min(.09,duration*.5));
    envelope.connect(filter);terminal=filter;this.nodes.add(filter);
   }
   terminal.connect(ctx.destination);
   let remaining=p.tones.length;
   p.tones.forEach((frequency,i)=>{
    const oscillator=ctx.createOscillator();oscillator.type=p.shape;
    const freq=frequency*ratio*(1+i*.0025);
    oscillator.frequency.setValueAtTime(freq*.992,start);
    oscillator.frequency.linearRampToValueAtTime(freq*1.007,start+Math.min(.1,duration*.5));
    oscillator.frequency.setValueAtTime(freq,end);
    const layer=ctx.createGain();layer.gain.value=1/(p.tones.length*(1+i*.31));this.nodes.add(layer);
    oscillator.connect(layer);layer.connect(envelope);
    oscillator.onended=()=>{
     this.sources.delete(oscillator);
     try{oscillator.disconnect();layer.disconnect();}catch{}
     this.nodes.delete(layer);
     if(--remaining===0){
      try{envelope.disconnect();if(terminal!==envelope)terminal.disconnect();}catch{}
      this.nodes.delete(envelope);this.nodes.delete(terminal);
     }
    };
    oscillator.start(start);oscillator.stop(end+.015);this.sources.add(oscillator);
   });
  }
  return true;
 }
 play(hornId='factory'){
  const horn=findHorn(hornId)||findHorn('factory');
  this.stop();
  const volume=clamp(this.getVolume(),0,1);
  if(volume<=0)return {kind:horn.kind,voiced:false,silent:true,fallback:false};
  if(horn.kind==='factory'){this.playFactory();return {kind:'factory',voiced:false,fallback:false};}
  const ctx=this.getContext(),generated=this.procedural(ctx,horn.kind,volume);
  let voiced=false,reason='',fallback=false;
  if(horn.kind==='voice'&&horn.phrase){
   const synth=this.getSpeech(),Ctor=this.getUtterance(),current=this.sequence;
   if(!synth||!Ctor)reason='Voz do navegador indisponível.';
   else{
    try{
     const voices=synth.getVoices?.()||[];
     const preferred=voices.find(v=>v.lang?.toLowerCase()==='pt-br')
      ||voices.find(v=>v.lang?.toLowerCase().startsWith('pt'));
     if(voices.length&&!preferred)reason='Sem voz em português neste dispositivo.';
     else{
      const utterance=new Ctor(horn.phrase);utterance.lang='pt-BR';
      utterance.rate=horn.id==='doidao'?1.07:horn.id==='chegando'?.88:.94;
      utterance.pitch=horn.id==='chegando'?.77:horn.id==='doidao'?1.04:.87;
      utterance.volume=volume;if(preferred)utterance.voice=preferred;
      utterance.onerror=()=>{if(current===this.sequence&&!generated)try{this.playFactory();}catch{}};
      synth.speak(utterance);voiced=true;
     }
    }catch{reason='A voz não pôde ser reproduzida.';}
   }
  }
  if(!generated&&!voiced){this.playFactory();fallback=true;}
  return {kind:horn.kind,voiced,fallback,reason,generated};
 }
}
