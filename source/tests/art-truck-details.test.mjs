import {test} from 'node:test';import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES} from '../src/fleet.mjs';
import {PARTS,ownedParts,quoteParts} from '../src/parts-catalog.mjs';
import {normalizeDecoration,saveDecoration,ACCESSORIES} from '../src/decoration.mjs';
import {freshSave,loadSave} from '../src/core.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';
import {decorateTruck,clearDecoration} from '../src/truck-decoration.mjs';
const categories=['rearBumper','sideLights','roofRim'];
function signature(m){const values=[];m.traverse(o=>{if(o.isMesh){const a=o.geometry.attributes.position.array;values.push(a.length,Math.round(a[0]*1000),Math.round(a[Math.min(20,a.length-1)]*1000));}});return values.join(',');}
test('new Art Truck parts have three different styles and are listed in the workshop',async()=>{
 assert.equal(Object.keys(PARTS).length,23);
 for(const key of categories){
  assert.equal(PARTS[key].length,3);assert.ok(ACCESSORIES[key]);
  const hashes=[];for(let id=1;id<=3;id++){const m=buildTruck(VEHICLES[0],VEHICLES[0].color);await decorateTruck(m,normalizeDecoration({accessories:{[key]:true},variants:{[key]:id}}));hashes.push(signature(m));disposeTruck(m);}
  assert.equal(new Set(hashes).size,3,key);
 }
});
test('new parts are bought independently per truck and save their chosen version',()=>{
 const s=freshSave();s.money=100000;
 for(const key of categories){
  const d=normalizeDecoration({accessories:{[key]:true},variants:{[key]:3}});
  assert.equal(quoteParts(s,'aurora',d).cost,PARTS[key][2].price);assert.ok(saveDecoration(s,'aurora',d));
  assert.equal(quoteParts(s,'aurora',d).cost,0);assert.ok(ownedParts(loadSave(JSON.stringify(s)).fleet.aurora).includes(key+':3'));
 }
 assert.equal(normalizeDecoration({variants:{roofRim:9}}).variants.roofRim,1);
});
test('new rear and roof pieces attach to the truck body, including articulated trailers',async()=>{
 for(const v of VEHICLES)for(const body of v.bodyOptions){
  const m=buildTruck(v,v.color,body);
  await decorateTruck(m,normalizeDecoration({accessories:{rearBumper:true,sideLights:true,roofRim:true},variants:{rearBumper:3,sideLights:3,roofRim:3}}));
  const g=m.userData.decorationLayer.group;assert.equal(g.parent,m.userData.trailer||m);
  for(const name of ['para-choque traseiro artístico','suporte de iluminação lateral','moldura de teto lateral'])
   assert.ok(g.getObjectByName(name),v.id+' '+body+' '+name);
  const bounds=new THREE.Box3().setFromObject(g);assert.ok(Number.isFinite(bounds.min.x)&&Number.isFinite(bounds.max.z));assert.ok(bounds.max.y<5.3);
  if(m.userData.trailer){animateTruck(m,.11,10,.1,.24);assert.equal(m.userData.trailer.rotation.y,.24);}
  clearDecoration(m);assert.equal(g.parent,null);disposeTruck(m);
 }
});
test('high-detail full set remains within geometry budgets for all six trucks',async()=>{
 const enabled=Object.fromEntries(Object.keys(ACCESSORIES).map(k=>[k,true]));
 for(const v of VEHICLES)for(const body of v.bodyOptions){
  const m=buildTruck(v,v.color,body);
  await decorateTruck(m,normalizeDecoration({accessories:enabled,variants:Object.fromEntries(Object.keys(ACCESSORIES).map(k=>[k,k==='skirts'?5:3])),lights:true}));
  let calls=0,triangles=0;
  m.traverse(o=>{if(o.isMesh){calls++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));}});
  assert.ok(calls<160,v.id+' calls '+calls);assert.ok(triangles<60000,v.id+' triangles '+triangles);
  disposeTruck(m);
 }
});
