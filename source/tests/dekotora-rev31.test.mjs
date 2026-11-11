import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES} from '../src/fleet.mjs';
import {PARTS,ownedParts,quoteParts} from '../src/parts-catalog.mjs';
import {ACCESSORIES,normalizeDecoration,saveDecoration,panelLayout} from '../src/decoration.mjs';
import {freshSave,loadSave} from '../src/core.mjs';
import {truckFit} from '../src/truck-fit.mjs';
import {planDekotoraFit} from '../src/dekotora-fit-rev31.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';
import {decorateTruck,clearDecoration} from '../src/truck-decoration.mjs';
const upgrades=['rearLampDeck','rearPillars'];
test('REV31 adds two optional cosmetic categories without changing existing IDs',()=>{
 assert.equal(Object.keys(PARTS).length,23);
 assert.equal(Object.values(PARTS).reduce((sum,items)=>sum+items.length,0),71);
 for(const key of upgrades){assert.ok(ACCESSORIES[key]);assert.equal(PARTS[key].length,3);}
 assert.equal(PARTS.skirts[4].id,5);
 assert.equal(PARTS.rearBumper[2].id,3);
});
test('rear lamps stay below the artwork; pillars stay outside the painted rear panel',()=>{
 for(const vehicle of VEHICLES)for(const body of vehicle.bodyOptions){
  const fit=truckFit(vehicle,body),plan=planDekotoraFit(fit).rear;
  const artwork=panelLayout(fit.layout,body);
  assert.ok(plan.rackTop<artwork.y-artwork.height/2,vehicle.id+' lamps would hide artwork');
  assert.ok(plan.pillarX-.095/2>1.16,vehicle.id+' pillar would cover rear picture');
  assert.ok(plan.pillarTop<fit.body.top&&plan.pillarBottom>fit.body.base,vehicle.id);
  assert.ok(Math.abs(plan.bodyEnd-(fit.body.end-fit.offset))<.001,vehicle.id);
 }
});
test('roof placement separates sign/spot assemblies and lifts crown for roof rack',()=>{
 for(const vehicle of VEHICLES){
  const fit=truckFit(vehicle);
  const simple=planDekotoraFit(fit,{}).roof;
  const crowded=planDekotoraFit(fit,{roofSpots:true,roofRack:true,deflector:true}).roof;
  assert.ok(crowded.signZ<simple.signZ-.2,vehicle.id);
  assert.ok(crowded.signY>simple.signY+.15,vehicle.id);
  assert.ok(crowded.topperY>simple.topperY+.25,vehicle.id);
  assert.ok(crowded.topperZ>crowded.spotZ+.35,vehicle.id);
 }
});
test('factory bumper and lamps are hidden selectively, restored after detaching, including trailers',async()=>{
 for(const vehicle of VEHICLES)for(const body of vehicle.bodyOptions){
  const m=buildTruck(vehicle,vehicle.color,body);
  assert.equal(m.userData.factoryRearLights.visible,true);
  assert.equal(m.userData.factoryRearBumper.visible,true);
  const initial=m.children.length;
  await decorateTruck(m,{accessories:{rearBumper:true}});
  assert.equal(m.userData.factoryRearLights.visible,true);
  assert.equal(m.userData.factoryRearBumper.visible,false);
  await decorateTruck(m,{accessories:{rearLampDeck:true}});
  assert.equal(m.userData.factoryRearLights.visible,false);
  assert.equal(m.userData.factoryRearBumper.visible,true);
  await decorateTruck(m,{accessories:{rearLampDeck:true,rearBumper:true,rearPillars:true},variants:{rearLampDeck:3,rearBumper:3,rearPillars:3}});
  assert.equal(m.userData.factoryRearLights.visible,false);
  assert.equal(m.userData.factoryRearBumper.visible,false);
  const group=m.userData.decorationLayer.group;
  for(const name of ['painel de lanternas traseiras','lanterna vertical do canto','montante vertical traseiro']){
   assert.ok(group.getObjectByName(name),vehicle.id+' '+body+' missing '+name);
  }
  assert.equal(group.parent,m.userData.trailer||m);
  if(m.userData.trailer){
   animateTruck(m,.1,10,.1,.21);
   assert.equal(m.userData.trailer.rotation.y,.21);
  }
  clearDecoration(m);
  assert.equal(m.userData.factoryRearLights.visible,true);
  assert.equal(m.userData.factoryRearBumper.visible,true);
  assert.equal(m.children.length,initial);
  disposeTruck(m);
 }
});
test('six variants are geometrically distinct, purchasable, and persistent',async()=>{
 const signatures=m=>{let s=0,position=0;m.traverse(o=>{if(o.isMesh){const arr=o.geometry.attributes.position.array;s+=arr.length;position+=Math.round(arr[Math.floor(arr.length/3)]*1000);}});return s+':'+position;};
 for(const key of upgrades){
  const variants=new Set();
  for(let level=1;level<=3;level++){
   const vehicle=VEHICLES[0],m=buildTruck(vehicle,vehicle.color);
   await decorateTruck(m,normalizeDecoration({accessories:{[key]:true},variants:{[key]:level}}));
   variants.add(signatures(m));disposeTruck(m);
  }
  assert.equal(variants.size,3,key);
  const s=freshSave();s.money=100000;
  const d=normalizeDecoration({accessories:{[key]:true},variants:{[key]:3}});
  assert.equal(quoteParts(s,'aurora',d).cost,PARTS[key][2].price);
  assert.ok(saveDecoration(s,'aurora',d));
  assert.equal(quoteParts(s,'aurora',d).cost,0);
  assert.ok(ownedParts(loadSave(JSON.stringify(s)).fleet.aurora).includes(key+':3'));
 }
});
test('all maximum-decorated vehicle bodies have bounded draw calls and finite geometry',async()=>{
 const accessories=Object.fromEntries(Object.keys(ACCESSORIES).map(key=>[key,true]));
 const variants=Object.fromEntries(Object.entries(PARTS).map(([key,values])=>[key,values.at(-1).id]));
 for(const vehicle of VEHICLES)for(const body of vehicle.bodyOptions){
  const m=buildTruck(vehicle,vehicle.color,body);
  await decorateTruck(m,{accessories,variants,lights:true});
  const group=m.userData.decorationLayer.group,box=new THREE.Box3().setFromObject(group);
  assert.ok(Number.isFinite(box.min.x)&&Number.isFinite(box.max.z),vehicle.id);
  let calls=0,triangles=0;
  m.traverse(o=>{if(o.isMesh){
   calls++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;
   for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));
  }});
  assert.ok(calls<160,vehicle.id+' excessive draw calls '+calls);
  assert.ok(triangles<60000,vehicle.id+' triangles '+triangles);
  clearDecoration(m);disposeTruck(m);
 }
});
