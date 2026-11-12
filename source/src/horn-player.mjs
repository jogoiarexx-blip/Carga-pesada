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
// Entonações disponíveis para as três buzinas faladas, sem alterar as compras.
export const VOICE_STYLES=Object.freeze({
 natural:Object.freeze({label:'Natural',rate:1,pitch:1}),
 grave:Object.freeze({label:'Grave de caminhoneiro',rate:.91,pitch:.80}),
 animada:Object.freeze({label:'Animada',rate:1.12,pitch:1.12})
});
export const SPOKEN_PROFILES=Object.freeze({
 arreda:Object.freeze({rate:1.03,pitch:1.01}),
 doidao:Object.freeze({rate:1.04,pitch:.94}),
 chegando:Object.freeze({rate:.91,pitch:.88})
});
// Prefere fala natural/neural, mas SEMPRE prioriza pt-BR sobre inglês ou pt-PT.
export function selectPortugueseVoice(voices=[]){
 const options=Array.from(voices||[]).filter(v=>typeof v?.lang==='string'&&v.lang.toLowerCase().replace('_','-').startsWith('pt'));
 const score=v=>{
  const lang=v.lang.toLowerCase().replace('_','-'),name=String(v.name||'').toLowerCase();
  return (lang==='pt-br'?1000:lang.startsWith('pt-br')?900:500)+
   (/natural|neural|premium/.test(name)?70:0)+
   (/google|microsoft|apple|siri/.test(name)?25:0)+
   (v.localService?5:0);
 };
 return options.sort((a,b)=>score(b)-score(a))[0]||null;
}
export const hornDuration=kind=>HORN_PATTERNS[kind]?Math.max(...HORN_PATTERNS[kind].notes.map(n=>n[0]+n[1])):0;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(n))?Number(n):max));
export class HornPlayer{
 constructor({getContext,playFactory,stopFactory,getVolume,getSpeech,getUtterance,onVoiceStart,onVoiceEnd,onVoiceStatus}={}){
  this.getContext=getContext||(()=>null);
  this.playFactory=playFactory||(()=>{});
  this.stopFactory=stopFactory||(()=>{});
  this.getVolume=getVolume||(()=>.5);
  this.getSpeech=getSpeech||(()=>typeof speechSynthesis!=='undefined'?speechSynthesis:null);
  this.getUtterance=getUtterance||(()=>typeof SpeechSynthesisUtterance!=='undefined'?SpeechSynthesisUtterance:null);
  this.onVoiceStart=onVoiceStart||(()=>{});
  this.onVoiceEnd=onVoiceEnd||(()=>{});
  this.onVoiceStatus=onVoiceStatus||(()=>{});
  this.sources=new Set();this.nodes=new Set();this.sequence=0;
  this.voiceStyle='natural';this.voiceActive=false;this.cancelPending=null;
 }
 setVoiceStyle(style){
  this.voiceStyle=Object.hasOwn(VOICE_STYLES,style)?style:'natural';
  return this.voiceStyle;
 }
 stop(){
  this.sequence++;
  if(this.cancelPending){try{this.cancelPending();}catch{}this.cancelPending=null;}
  if(this.voiceActive){this.voiceActive=false;this.onVoiceEnd();}
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
 fallbackVoice(volume){
  const generated=this.procedural(this.getContext(),'double',volume);
  if(!generated)this.playFactory();
  return {kind:'voice',voiced:false,fallback:true,generated};
 }
 spoken(horn,volume,synth,Ctor,voices,sequence){
  if(this.sequence!==sequence)return {kind:'voice',voiced:false,stale:true};
  const preferred=selectPortugueseVoice(voices);
  if(voices.length&&!preferred){
   const reason='Nenhuma voz em português instalada; toque alternativo de buzina.';
   this.onVoiceStatus(reason);
   return {...this.fallbackVoice(volume),reason};
  }
  try{
   const profile=SPOKEN_PROFILES[horn.id]||{rate:.98,pitch:.95};
   const style=VOICE_STYLES[this.voiceStyle];
   const utterance=new Ctor(horn.phrase);
   utterance.lang='pt-BR';
   utterance.rate=clamp(profile.rate*style.rate,.70,1.35);
   utterance.pitch=clamp(profile.pitch*style.pitch,.60,1.35);
   utterance.volume=volume;
   if(preferred)utterance.voice=preferred;
   const finish=()=>{
    if(this.sequence!==sequence)return;
    if(this.voiceActive){this.voiceActive=false;this.onVoiceEnd();}
   };
   utterance.onstart=()=>{
    if(this.sequence!==sequence)return;
    if(!this.voiceActive){this.voiceActive=true;this.onVoiceStart();}
    this.onVoiceStatus('Reproduzindo: '+horn.phrase);
   };
   utterance.onend=()=>{finish();this.onVoiceStatus('Fala concluída: '+horn.phrase);};
   utterance.onerror=()=>{
    if(this.sequence!==sequence)return;
    finish();
    this.onVoiceStatus('Voz indisponível. Tocando uma corneta de reserva.');
    this.fallbackVoice(volume);
   };
   synth.speak(utterance);
   return {kind:'voice',voiced:true,voiceName:preferred?.name||'Padrão pt-BR',style:this.voiceStyle,fallback:false};
  }catch{
   const reason='Falha na voz do navegador; toque alternativo de buzina.';
   this.onVoiceStatus(reason);
   return {...this.fallbackVoice(volume),reason};
  }
 }
 play(hornId='factory'){
  const horn=findHorn(hornId)||findHorn('factory');
  this.stop();
  const volume=clamp(this.getVolume(),0,1);
  if(volume<=0)return {kind:horn.kind,voiced:false,silent:true,fallback:false};
  if(horn.kind==='factory'){this.playFactory();return {kind:'factory',voiced:false,fallback:false};}
  if(horn.kind!=='voice'){
   const generated=this.procedural(this.getContext(),horn.kind,volume);
   if(!generated)this.playFactory();
   return {kind:horn.kind,voiced:false,fallback:!generated,generated};
  }
  // Nada de corneta eletrônica por cima da fala: a voz fica nítida.
  const synth=this.getSpeech(),Ctor=this.getUtterance(),sequence=this.sequence;
  if(!synth||!Ctor){
   const reason='Voz em português indisponível neste navegador.';
   this.onVoiceStatus(reason);
   return {...this.fallbackVoice(volume),reason};
  }
  let voices=[];
  try{voices=Array.from(synth.getVoices?.()||[]);}catch{}
  if(!voices.length&&typeof synth.addEventListener==='function'&&typeof setTimeout==='function'){
   // No primeiro clique o Chrome pode ainda estar carregando a lista de vozes.
   let active=true;
   const cancel=()=>{
    if(!active)return;
    active=false;clearTimeout(timer);
    try{synth.removeEventListener?.('voiceschanged',onVoices);}catch{}
    this.cancelPending=null;
   };
   const onVoices=()=>{
    if(this.sequence!==sequence){cancel();return;}
    let available=[];try{available=Array.from(synth.getVoices?.()||[]);}catch{}
    if(available.length){cancel();this.spoken(horn,volume,synth,Ctor,available,sequence);}
   };
   let timer;
   try{synth.addEventListener('voiceschanged',onVoices);}catch{}
   timer=setTimeout(()=>{
    if(!active)return;
    cancel();
    let available=[];try{available=Array.from(synth.getVoices?.()||[]);}catch{}
    this.spoken(horn,volume,synth,Ctor,available,sequence);
   },450);
   this.cancelPending=cancel;
   this.onVoiceStatus('Carregando a voz em português…');
   return {kind:'voice',voiced:false,pending:true,fallback:false};
  }
  return this.spoken(horn,volume,synth,Ctor,voices,sequence);
 }
}
