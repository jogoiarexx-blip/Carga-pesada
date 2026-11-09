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
