import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CONTRACTS,VEHICLES,driveStep} from '../src/core.mjs';
import {requirementsFor,entryCheck} from '../src/progression.mjs';
import {missionDifficulty} from '../src/mission-difficulty.mjs';
import {createSession} from '../src/session.mjs';
import {replay} from './helpers/replay-driver.mjs';
const get=n=>CONTRACTS.find(c=>c.id==='m'+String(n).padStart(2,'0'));
test('o prólogo mantém tráfego inicial e a primeira mecânica apresenta freios na serra',()=>{
 assert.equal(missionDifficulty(get(1)).tier,0);
 assert.equal(get(1).time,180);
 assert.equal(createSession(get(1),VEHICLES[0],{health:100,engine:0,brakes:0}).traffic.length,16);
 assert.equal(requirementsFor(get(2)).brakes,0);
 assert.equal(requirementsFor(get(3)).brakes,1);
 assert.equal(requirementsFor(get(4)).engine,1);
 assert.equal(requirementsFor(get(9)).engine,2);
});
test('capítulos avançados aumentam tráfego, carga mínima e rigidez do prazo',()=>{
 const targets=[5,10,15,20,25].map(get);
 let prev=missionDifficulty(get(2));
 for(const c of targets){
  const now=missionDifficulty(c);
  assert.ok(now.tier>prev.tier);
  assert.ok(now.trafficCount>prev.trafficCount);
  assert.ok(now.trafficSpacing<prev.trafficSpacing);
  assert.ok(c.min>prev.cargoMinimum);
  assert.equal(c.time,now.deadline);
  assert.ok(c.time<Math.ceil(c.length/14+35));
  assert.equal(c.fragile,now.fragile);
  prev=now;
 }
 assert.equal(get(30).min,86);
 assert.equal(missionDifficulty(get(30)).trafficCount,26);
});
test('um caminhão sem preparar motor e freios não entra nas missões técnicas',()=>{
 const aurora=VEHICLES[0],baseline={health:100,engine:0,brakes:0};
 assert.equal(entryCheck(get(3),aurora,baseline).ok,false);
 assert.equal(entryCheck(get(3),aurora,{...baseline,brakes:1}).ok,true);
 assert.equal(entryCheck(get(4),aurora,{...baseline,engine:1,brakes:1}).ok,true);
 assert.equal(entryCheck(get(9),aurora,{...baseline,engine:1,brakes:1}).ok,false);
 assert.equal(entryCheck(get(9),aurora,{...baseline,engine:2,brakes:1}).ok,true);
});
test('todos os fretes avançados permanecem resolvíveis com frota e melhorias exigidas',()=>{
 for(const c of [get(5),get(10),get(15),get(20),get(25),get(30)]){
  const s=replay(c);
  assert.equal(s.status,'success',c.id+': '+s.reason+'; prazo '+c.time+'; tempo '+s.run.elapsed.toFixed(1));
  assert.ok(s.run.cargo>=c.min);
 }
});
test('os valores crescem sem alterar a integridade dos upgrades adquiridos',()=>{
 const c=get(25),r=requirementsFor(c),vehicle=VEHICLES.find(v=>v.capacity>=r.capacity&&v.max+r.engine*12>=(r.speed||0));
 assert.ok(vehicle);
 assert.ok(entryCheck(c,vehicle,{engine:r.engine,brakes:r.brakes}).ok);
 const input={gas:true,brake:false,steer:0},base={s:800,x:-3.4,speed:14,lateral:0,steering:0,elapsed:0,cargo:100,health:100,fuel:100};
 const vanilla={...base},tuned={...base};
 for(let i=0;i<90;i++){driveStep(vanilla,input,vehicle,{engine:0,brakes:0},c,1/60);driveStep(tuned,input,vehicle,{engine:2,brakes:2},c,1/60);}
 assert.ok(tuned.speed>vanilla.speed);
});
