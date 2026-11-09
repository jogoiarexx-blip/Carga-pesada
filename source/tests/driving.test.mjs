import {test} from 'node:test';
import assert from 'node:assert/strict';
import {driveStep,sweptOverlap,trafficSpeed,crossingFraction,VEHICLES,CONTRACTS} from '../src/core.mjs';
import {ROUTES,routeFor,roadCenter,roadCurvature,curveAdvice} from '../src/routes.mjs';
const vehicle=VEHICLES[0],parts={engine:0,brakes:0};
const state=(speed=20)=>({s:0,x:-3.4,speed,lateral:0,elapsed:0,cargo:100,health:100,fuel:100});
test('routes have distinct geometry, seeds and vegetation',()=>{const a=routeFor(CONTRACTS[0]),b=routeFor(CONTRACTS.find(c=>c.id==='m03')),c=routeFor(CONTRACTS.find(c=>c.id==='m04'));assert.notEqual(a.id,b.id);assert.notEqual(b.id,c.id);assert.notEqual(roadCenter(900,a),roadCenter(900,b));assert.notEqual(a.grass,b.grass);assert.notEqual(a.seed,c.seed);});
test('curvature is finite and road remains continuous at route samples',()=>{for(const route of Object.values(ROUTES))for(let d=0;d<route.length;d+=2){assert.ok(Number.isFinite(roadCurvature(d,route)));assert.ok(Math.abs(roadCenter(d+.01,route)-roadCenter(d,route))<.01);}});
test('steering builds gradually, releases smoothly and reverses with the truck',()=>{const r=state();driveStep(r,{steer:1,gas:true},vehicle,parts,CONTRACTS[0],1/60);assert.ok(r.steering>0&&r.steering<.02);for(let i=0;i<30;i++)driveStep(r,{steer:1,gas:true},vehicle,parts,CONTRACTS[0],1/60);const turn=r.steering;driveStep(r,{steer:0},vehicle,parts,CONTRACTS[0],1/60);assert.ok(r.steering<turn&&r.steering>0);const reverse=state(-3);driveStep(reverse,{steer:1},vehicle,parts,CONTRACTS[0],.1);assert.ok(reverse.x< -3.4);});
test('loaded truck takes more distance to stop; upgraded brakes shorten stopping',()=>{function stopping(c,p){const r=state();while(r.speed>.01)driveStep(r,{brake:true,steer:0},vehicle,p,c,1/120);return r.s;}const light=stopping(CONTRACTS[0],parts),heavy=stopping(CONTRACTS.find(c=>c.id==='m03'),parts),upgraded=stopping(CONTRACTS.find(c=>c.id==='m03'),{engine:0,brakes:1});assert.ok(heavy>light);assert.ok(upgraded<heavy);});
test('braking cannot jump directly from forward to reverse on a long frame',()=>{const r=state(.5);driveStep(r,{brake:true},vehicle,parts,CONTRACTS[0],.5);assert.equal(r.speed,0);});
test('swept collision catches opposing traffic crossing in one frame',()=>{assert.ok(sweptOverlap({s:0,x:-3},{s:20,x:-3},{s:15,x:-3},{s:-5,x:-3},5.5,2));assert.equal(sweptOverlap({s:0,x:-3},{s:20,x:-3},{s:15,x:3.5},{s:-5,x:3.5},5.5,2),false);});
test('diagonal paths at different times do not create false collision',()=>{assert.equal(sweptOverlap({s:0,x:0},{s:20,x:0},{s:10,x:10},{s:10,x:0},1,1),false);});
test('traffic follows slower leader and opposing lane does not brake it',()=>{const follower={s:0,x:-3.4,speed:14,cruise:14,direction:1},leader={s:20,x:-3.4,speed:5,cruise:5,direction:1};assert.ok(trafficSpeed(follower,[follower,leader],ROUTES.ipes)<follower.cruise);assert.equal(trafficSpeed(follower,[follower,{...leader,x:3.4,direction:-1}],ROUTES.ipes),14);});
test('finish order uses crossing time and rejects off-road finishes',()=>{const p=crossingFraction({s:99,x:-3},{s:103,x:-3},100),r=crossingFraction({s:98,x:3},{s:102,x:3},100);assert.ok(p<r);assert.equal(crossingFraction({s:99,x:9},{s:103,x:9},100),Infinity);assert.equal(crossingFraction({s:101,x:3},{s:102,x:3},100),Infinity);});
test('curve advisory warns only above the upcoming safe speed',()=>{let s=0;for(let d=0;d<2800;d+=20)if(curveAdvice(d,35,ROUTES.circuito).tight){s=d;break;}const fast=curveAdvice(s,35,ROUTES.circuito),slow=curveAdvice(s,8,ROUTES.circuito);assert.ok(fast.tight&&fast.warning);assert.equal(slow.warning,false);});
test('simulation remains consistent at 30 and 120 Hz',()=>{function sim(hz){const r=state(0);for(let i=0;i<hz*60;i++)driveStep(r,{gas:true,steer:0},vehicle,parts,CONTRACTS[0],1/hz);return r;}const a=sim(30),b=sim(120);assert.ok(Math.abs(a.s-b.s)<1);assert.ok(Math.abs(a.x-b.x)<.1);});
test('all three freight routes remain finishable with cargo using a conservative driver',()=>{
 for(const contract of CONTRACTS.filter(c=>!c.race&&c.chapter===0)){
  const r=state(0);while(r.elapsed<contract.time&&r.s<contract.length){const advise=curveAdvice(r.s,r.speed,routeFor(contract));const limit=Math.min(76,advise.safe-8)/3.6;const steer=Math.max(-1,Math.min(1,(-3.4-r.x)*.65-r.lateral*.2));driveStep(r,{gas:r.speed<limit,brake:r.speed>limit+1,steer},vehicle,parts,contract,1/60);}
  assert.ok(r.s>=contract.length,contract.id+' missed deadline');assert.ok(r.cargo>=contract.min);assert.ok(Math.abs(r.x)<6.2);assert.equal(r.health,100);
 }
});
