const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

/**
 * Prepara o trecho ESTÁVEL de uma gravação de motor para o som de rodagem.
 * A partida fica fora do loop: não é um efeito procedural nem exige outro áudio.
 * Uma breve emenda cruzada elimina o estalo na junção do trecho gravado.
 */
export function makeEngineIdleBuffer(recording,context){
 if(!recording||!context?.createBuffer||!Number.isFinite(recording.sampleRate)||recording.sampleRate<=0)return null;
 const start=Math.floor(recording.length*.42),end=Math.floor(recording.length*.87),length=end-start;
 if(length<recording.sampleRate*.55)return null;
 const loop=context.createBuffer(recording.numberOfChannels,length,recording.sampleRate);
 const fade=Math.max(1,Math.min(Math.floor(recording.sampleRate*.075),Math.floor(length*.12)));
 for(let channel=0;channel<recording.numberOfChannels;channel++){
  const raw=recording.getChannelData(channel),out=loop.getChannelData(channel);
  out.set(raw.subarray(start,end));
  const boundary=out[0];
  for(let i=0;i<fade;i++){
   // A última amostra deve coincidir com a primeira para eliminar o clique.
   const phase=(i+1)/fade;
   const alpha=phase*phase*(3-2*phase);
   const at=length-fade+i;
   out[at]=out[at]*(1-alpha)+boundary*alpha;
  }
 }
 return loop;
}

export class RecordedSounds {
 constructor(AudioClass=Audio,base=document.baseURI){
  this.engine=new AudioClass(new URL('assets/audio/motor.ogg',base).href);
  this.hornSound=new AudioClass(new URL('assets/audio/buzina.ogg',base).href);
  this.crashSound=new AudioClass(new URL('assets/audio/colisao.ogg',base).href);
  // motor.ogg contém a PARTIDA. Nunca reproduzir esse arquivo inteiro em loop.
  this.engine.loop=false;this.engine.preload='auto';this.engine.preservesPitch=false;
  this.engine.onended=()=>{if(this.running)this.startIdle();};
  this.hornSound.preload=this.crashSound.preload='auto';
  this.running=false;this.startedThisTrip=false;this.idleNode=null;this.idleBuffer=null;
  this.audioContext=null;this.idleGain=null;this.loopPromise=null;this.speedRate=.82;
  this.lastCrash=-Infinity;this.setVolume(.5);
 }
 setVolume(value){
  this.volume=clamp(Number.isFinite(Number(value))?Number(value):.5,0,1);
  this.engine.volume=this.volume*.48;this.hornSound.volume=this.volume*.65;this.crashSound.volume=this.volume*.6;
  if(this.idleGain)this.idleGain.gain.value=this.volume*.36;
 }
 play(sound){try{sound.currentTime=0;const p=sound.play();p?.catch?.(()=>{});}catch{}}
 /**
  * Decodifica o motor gravado uma única vez. Só a PARTE SEM PARTIDA vira loop.
  * Falha de Web Audio / rede: a partida continua tocando apenas uma vez.
  */
 enableAudioLoop(context,fetcher=fetch){
  if(this.loopPromise||!context?.createBufferSource||!context?.createGain||!context?.decodeAudioData)return this.loopPromise;
  this.audioContext=context;this.idleGain=context.createGain();this.idleGain.gain.value=this.volume*.36;
  this.idleGain.connect(context.destination);
  this.loopPromise=Promise.resolve().then(async()=>{
   const response=await fetcher(this.engine.src);
   if(!response.ok)throw new Error('Áudio de motor indisponível');
   const recording=await context.decodeAudioData(await response.arrayBuffer());
   this.idleBuffer=makeEngineIdleBuffer(recording,context);
   if(this.running&&this.engine.ended)this.startIdle();
   return Boolean(this.idleBuffer);
  }).catch(()=>false);
  return this.loopPromise;
 }
 startIdle(){
  if(!this.running||this.idleNode||!this.idleBuffer||!this.audioContext||!this.idleGain)return;
  try{
   const node=this.audioContext.createBufferSource();
   node.buffer=this.idleBuffer;node.loop=true;node.playbackRate.value=this.speedRate;
   node.connect(this.idleGain);node.start();
   this.idleNode=node;
  }catch{}
 }
 stopIdle(){
  if(!this.idleNode)return;
  const node=this.idleNode;this.idleNode=null;
  try{node.stop();node.disconnect();}catch{}
 }
 start(){
  if(this.running)return;
  this.running=true;
  if(this.startedThisTrip){
   if(this.engine.ended)this.startIdle();
   else try{const p=this.engine.play();p?.catch?.(()=>{});}catch{}
   return;
  }
  this.startedThisTrip=true;
  this.engine.currentTime=0;
  try{const p=this.engine.play();p?.catch?.(()=>{});}catch{}
 }
 // Pausar não reinicia o motor: a partida não se repete ao continuar uma fase.
 pause(){this.running=false;this.engine.pause();this.stopIdle();}
 stop(){this.pause();this.startedThisTrip=false;this.engine.currentTime=0;}
 update(speed){
  this.speedRate=clamp(.82+Math.abs(speed)/75,.82,1.45);
  this.engine.playbackRate=this.speedRate;
  if(this.idleNode)this.idleNode.playbackRate.value=this.speedRate;
 }
 horn(){this.play(this.hornSound);}
 crash(time){if(time-this.lastCrash<.7)return;this.lastCrash=time;this.play(this.crashSound);}
}
