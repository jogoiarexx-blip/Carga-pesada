import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CONTRACTS,VEHICLES} from '../src/core.mjs';
import {createSession,stepSession,advanceSession} from '../src/session.mjs';
import {BOSS_CAR_LENGTH,createBossTraffic,planRivalTraffic} from '../src/boss-traffic.mjs';
const race=CONTRACTS.find(c=>c.id==='m04'),parts={health:100,engine:1,brakes:1};
const make=()=>createSession(race,VEHICLES[0],parts);
test('seis provas têm obstáculos em duas faixas sem spawn na largada',()=>{
 const races=CONTRACTS.filter(c=>c.race);assert.ok(races.length>=6);
 for(const c of races){const a=createBossTraffic(c);assert.deepEqual(a,createBossTraffic(c));
  assert.ok(a.length>=5&&a.some(v=>v.x<0)&&a.some(v=>v.x>0),c.id);
  assert.ok(a.every(v=>v.s>200&&v.s<c.length&&v.speed>0&&v.direction===1),c.id);
 }
 assert.equal(createBossTraffic(CONTRACTS[0]).length,0);assert.equal(BOSS_CAR_LENGTH,3.8);
});
test('carro da prova prejudica o jogador',()=>{
 const s=make(),c=s.traffic[0];c.s=32;c.x=-3.4;c.speed=5;c.cruise=5;s.run.s=32;s.run.x=-3.4;s.run.speed=18;s.rival.s=5;s.rival.x=3.4;
 stepSession(s,{gas:true,steer:0});assert.ok(s.events.some(e=>e.type==='boss-traffic-player'));
 assert.ok(s.run.speed<15&&s.run.health<100);assert.ok(s.hitCooldown>0);assert.equal(s.hits,1);
});
test('carro da prova prejudica também o rival',()=>{
 const s=make(),c=s.traffic[0];c.s=35;c.x=3.4;c.speed=6;c.cruise=6;
 s.rival.s=35;s.rival.x=3.4;s.rival.speed=20;s.rival.laneTarget=3.4;s.run.s=20;s.run.x=-3.4;s.hitCooldown=2;
 stepSession(s,{gas:false,steer:0});
 assert.ok(s.events.some(e=>e.type==='boss-traffic-rival'));assert.equal(s.rival.hits,1);
 assert.ok(s.rival.speed<14&&s.rival.hitCooldown>0);assert.equal(s.hits,0);
});
test('IA muda de faixa se livre ou freia se bloqueada',()=>{
 const rival={s:500,x:3.4,laneTarget:3.4},player={s:400,x:-.85},road=[{s:554,x:3.4,speed:10,direction:1}];
 assert.equal(planRivalTraffic(rival,player,road,27).desired,-3.4);
 const b=planRivalTraffic(rival,player,[...road,{s:540,x:-3.4,speed:12,direction:1}],27);
 assert.equal(b.desired,3.4);assert.ok(b.targetSpeed<27);
 const p=planRivalTraffic(rival,{s:500,x:-3.4},road,27);
 assert.equal(p.desired,3.4);assert.ok(p.targetSpeed<27);
});
test('reinício limpa a prova e frete mantém seus 16 carros',()=>{
 const a=make();a.traffic[0].s+=430;a.rival.hits=3;
 const b=make();assert.notEqual(a.traffic[0].s,b.traffic[0].s);assert.equal(b.rival.hits,0);
 const freight=createSession(CONTRACTS[0],VEHICLES[0],parts);
 assert.equal(freight.rival,null);assert.equal(freight.traffic.length,16);
});
test('simulação fixa tem o mesmo resultado a 30 e 120 FPS',()=>{
 const run=hz=>{const s=make();for(let i=0;i<hz*11;i++)advanceSession(s,{gas:true,steer:0},1/hz);return s;};
 const a=run(30),b=run(120);assert.ok(Math.abs(a.run.s-b.run.s)<.01);
 assert.ok(Math.abs(a.rival.s-b.rival.s)<.01);
 assert.deepEqual(a.traffic.map(c=>[c.s,c.x]),b.traffic.map(c=>[c.s,c.x]));
 assert.equal(a.hits,b.hits);assert.equal(a.rival.hits,b.rival.hits);
});
