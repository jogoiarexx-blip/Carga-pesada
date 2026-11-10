import {test} from 'node:test';
import assert from 'node:assert/strict';
import {RecordedSounds,makeEngineIdleBuffer} from '../src/recorded-sounds.mjs';

class FakeAudio{
 constructor(url){this.src=url;this.paused=true;this.currentTime=0;this.played=0;this.ended=false;}
 play(){this.paused=false;this.played++;return Promise.resolve();}
 pause(){this.paused=true;}
 finish(){this.ended=true;this.paused=true;this.onended?.();}
}
test('partida gravada acontece uma vez; pausa e retorno não religam o caminhão',()=>{
 const s=new RecordedSounds(FakeAudio,'https://example.test/game/');
 s.start();s.start();
 assert.equal(s.engine.loop,false,'som de partida não pode repetir automaticamente');
 assert.equal(s.engine.played,1);
 s.update(0);assert.equal(s.engine.playbackRate,1,'partida deve tocar na velocidade original');
 s.update(30);assert.equal(s.engine.playbackRate,1,'acelerar não pode acelerar a gravação de partida');
 s.pause();const previousTime=2.3;s.engine.currentTime=previousTime;
 s.start();assert.equal(s.engine.played,2);assert.equal(s.engine.currentTime,previousTime);
 s.engine.finish();s.start();assert.equal(s.engine.played,2,'não repetir partida após término');
 s.stop();s.start();assert.equal(s.engine.played,3,'nova corrida inicia o motor uma única vez');
});
test('efeitos respeitam volume e supressão de colisões repetidas',()=>{
 const s=new RecordedSounds(FakeAudio,'https://example.test/game/');
 s.setVolume(0);s.start();assert.equal(s.engine.volume,0);
 s.horn();s.crash(10);s.crash(10.1);
 assert.equal(s.hornSound.played,1);assert.equal(s.crashSound.played,1);
 s.crash(11);assert.equal(s.crashSound.played,2);
});
function makePCM(seconds=4,sampleRate=1000){
 const length=seconds*sampleRate;
 const samples=Float32Array.from({length},(_,i)=>i<.42*length?.85*Math.sin(i*.03):.1*Math.sin(i*.07));
 return {numberOfChannels:1,length,sampleRate,getChannelData:()=>samples};
}
const makeContext=()=>{
 const state={nodes:[],gain:null};
 const ctx={
  destination:{},sampleRate:1000,
  createBuffer(channels,length,sampleRate){
   const arrays=Array.from({length:channels},()=>new Float32Array(length));
   return {numberOfChannels:channels,length,sampleRate,getChannelData:i=>arrays[i]};
  },
  createGain(){return state.gain={gain:{value:0},connect(){}}},
  createBufferSource(){
   const node={buffer:null,loop:false,playbackRate:{value:1},started:0,stopped:0,connect(){},disconnect(){},start(){this.started++},stop(){this.stopped++}};
   state.nodes.push(node);return node;
  },
  decodeAudioData:async()=>makePCM()
 };
 return {ctx,state};
};
test('som contínuo usa trecho gravado após a partida, com emenda suave',()=>{
 const {ctx}=makeContext(),recording=makePCM(),loop=makeEngineIdleBuffer(recording,ctx);
 assert.ok(loop);assert.ok(loop.length<recording.length);
 const raw=recording.getChannelData(0),out=loop.getChannelData(0);
 assert.equal(out[0],raw[Math.floor(recording.length*.42)],'trecho deve começar 42% após a partida');
 assert.notEqual(out[0],raw[0],'início da partida não pode ser repetido');
 assert.ok(Math.abs(out[0]-out[out.length-1])<.035,'emenda de loop deve ser suave');
 assert.equal(makeEngineIdleBuffer(makePCM(1),ctx),null,'clipe muito curto não pode virar loop');
});
test('loop gravado só inicia após a partida e para durante a pausa',async()=>{
 const s=new RecordedSounds(FakeAudio,'https://example.test/game/');
 const {ctx,state}=makeContext();let downloads=0;
 const fetcher=async()=>{downloads++;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(4)}};
 const enabled=s.enableAudioLoop(ctx,fetcher);
 s.start();assert.equal(s.engine.played,1);assert.equal(state.nodes.length,0);
 assert.equal(await enabled,true);assert.equal(downloads,1);
 s.engine.finish();assert.equal(state.nodes.length,1);
 assert.equal(state.nodes[0].loop,true);
 s.update(45);assert.ok(state.nodes[0].playbackRate.value>1);
  assert.equal(s.engine.playbackRate,1,'a rotação varia apenas no loop de rodagem');
 s.pause();assert.equal(state.nodes[0].stopped,1);
 s.start();assert.equal(state.nodes.length,2,'retomada só restaura motor contínuo');
 assert.equal(s.engine.played,1,'retomada não repete partida');
 s.stop();assert.equal(state.nodes[1].stopped,1);
 await s.enableAudioLoop(ctx,fetcher);assert.equal(downloads,1,'arquivo só decodificado uma vez');
});
test('falha ao obter áudio contínuo mantém apenas partida sem repetições',async()=>{
 const s=new RecordedSounds(FakeAudio,'https://example.test/game/');
 const {ctx,state}=makeContext();
 const result=await s.enableAudioLoop(ctx,async()=>{throw Error('offline')});
 assert.equal(result,false);s.start();s.engine.finish();
 assert.equal(state.nodes.length,0);assert.equal(s.engine.played,1);
});
