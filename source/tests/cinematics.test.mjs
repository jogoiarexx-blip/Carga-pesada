import {test} from 'node:test';
import assert from 'node:assert/strict';
import {INTRO_SCENES,CREDIT_SCENES,sceneAt,shouldPlayIntro,shouldPlayCredits} from '../src/cinematics.mjs';
test('abertura e créditos percorrem cenas e terminam sem ficar presos',()=>{
 for(const scenes of [INTRO_SCENES,CREDIT_SCENES]){assert.ok(scenes.length>=3);assert.equal(sceneAt(scenes,0).index,0);const total=scenes.reduce((n,s)=>n+s.duration,0);assert.equal(sceneAt(scenes,total),null);assert.equal(sceneAt(scenes,-1).index,0);for(const scene of scenes)assert.ok(scene.title&&scene.text&&scene.duration>0);}
});
test('abertura apenas no primeiro início da missão inicial e créditos na primeira conclusão',()=>{
 assert.equal(shouldPlayIntro('m01',[],false),true);assert.equal(shouldPlayIntro('m01',[],true),false);assert.equal(shouldPlayIntro('m01',['m01'],false),false);assert.equal(shouldPlayIntro('m02',[],false),false);
 assert.equal(shouldPlayCredits('m30',true,true),true);assert.equal(shouldPlayCredits('m30',true,false),false);assert.equal(shouldPlayCredits('m30',false,true),false);assert.equal(shouldPlayCredits('m29',true,true),false);
});

test('regressão: iniciar primeiro frete não acessa variável introShownThisSession indefinida',async()=>{
 const {readFileSync}=await import('node:fs');
 const code=readFileSync(new URL('../src/game.js',import.meta.url),'utf8');
 assert.match(code,/\blet introShownThisSession\s*=\s*false\s*;/);
 assert.match(code,/shouldPlayIntro\(c\.id,save\.campaign\.completed,introShownThisSession\)/);
 assert.match(code,/introShownThisSession\s*=\s*true;startCinematic\('intro',launchMission\)/);
 // O flag é de memória (não muda o save) e só é inicializado uma vez por carga.
 assert.equal((code.match(/\blet introShownThisSession\s*=/g)||[]).length,1);
 assert.equal(shouldPlayIntro('m01',[],false),true);
 assert.equal(shouldPlayIntro('m01',[],true),false);
});
