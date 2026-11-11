import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PARTS,quoteParts,ownedParts} from '../src/parts-catalog.mjs';
import {ACCESSORIES,normalizeDecoration,saveDecoration} from '../src/decoration.mjs';
import {DEKOTORA_PRESETS,applyDekotoraPreset} from '../src/dekotora-presets.mjs';
import {freshSave,loadSave} from '../src/core.mjs';
import {VEHICLES} from '../src/fleet.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';
import {decorateTruck,clearDecoration} from '../src/truck-decoration.mjs';

function signature(m){
 const pieces=[];m.traverse(o=>{
  if(!o.isMesh)return;
  const a=o.geometry.attributes.position.array;
  pieces.push(a.length,Math.round(a[0]*1e3),Math.round(a[Math.floor(a.length/2)]*1e3));
 });
 return pieces.join(',');
}
test('REV30 brings 23 categories / 71 options and geometrically different roof and front trim',async()=>{
 assert.equal(Object.keys(PARTS).length,23);
 assert.equal(Object.values(PARTS).reduce((s,list)=>s+list.length,0),71);
 for(const [key,anchor] of [['cabTopper','base da coroa de cabine'],['frontGarnish','máscara frontal perfilada']]){
  assert.ok(ACCESSORIES[key]);assert.equal(PARTS[key].length,3);
  const versions=[];
  for(let level=1;level<=3;level++){
   const m=buildTruck(VEHICLES[0],VEHICLES[0].color);
   await decorateTruck(m,{accessories:{[key]:true},variants:{[key]:level}});
   assert.ok(m.getObjectByName(anchor),key+' '+level);
   versions.push(signature(m));disposeTruck(m);
  }
  assert.equal(new Set(versions).size,3,key);
 }
});
test('styles only change the preview and preserve artwork/signature',()=>{
 const s=freshSave(),snapshot=JSON.stringify(s);
 const original=normalizeDecoration({left:'aguia',right:'lobo',rear:'arara',signText:'ESTRELA',accessories:{skirts:true}});
 assert.equal(DEKOTORA_PRESETS.length,3);
 for(const preset of DEKOTORA_PRESETS){
  const d=applyDekotoraPreset(original,preset.id);
  assert.equal(d.left,'aguia');assert.equal(d.right,'lobo');assert.equal(d.rear,'arara');
  assert.equal(d.signText,'ESTRELA');assert.equal(d.lights,true);
  assert.equal(d.accessories.cabTopper,true);assert.equal(d.accessories.frontGarnish,true);
  assert.ok(quoteParts(s,'aurora',d).cost>0);
 }
 assert.equal(JSON.stringify(s),snapshot);
 assert.equal(applyDekotoraPreset(original,'festival').variants.skirts,5);
 assert.equal(applyDekotoraPreset(original,'invalid').variants.cabTopper,1);
});
test('new parts are bought independently and reload with the intended version',()=>{
 const s=freshSave();s.money=100000;
 for(const key of ['cabTopper','frontGarnish']){
  const d=normalizeDecoration({accessories:{[key]:true},variants:{[key]:3}});
  assert.equal(quoteParts(s,'aurora',d).cost,PARTS[key][2].price);
  assert.ok(saveDecoration(s,'aurora',d));
  assert.equal(quoteParts(s,'aurora',d).cost,0);
  assert.ok(ownedParts(loadSave(JSON.stringify(s)).fleet.aurora).includes(key+':3'));
 }
});
test('all six trucks with the maximum set stay finite and keep articulated trailers and wheel pivots',async()=>{
 const accessories=Object.fromEntries(Object.keys(ACCESSORIES).map(key=>[key,true]));
 const variants=Object.fromEntries(Object.entries(PARTS).map(([key,items])=>[key,items.at(-1).id]));
 for(const vehicle of VEHICLES)for(const body of vehicle.bodyOptions){
  const m=buildTruck(vehicle,vehicle.color,body);
  await decorateTruck(m,{accessories,variants,lights:true});
  assert.ok(m.getObjectByName('coroa de festival perfilada'),vehicle.id);
  assert.ok(m.getObjectByName('máscara frontal perfilada'),vehicle.id);
  assert.equal(m.userData.decorationLayer.group.parent,m.userData.trailer||m);
  assert.ok(m.userData.decorationLayer.group.getObjectByName('asa traseira angular'),vehicle.id);
  let calls=0,triangles=0;
  m.traverse(o=>{if(o.isMesh){
   calls++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;
   for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n),vehicle.id);
  }});
  assert.ok(calls<160,vehicle.id+' calls '+calls);
  assert.ok(triangles<60000,vehicle.id+' triangles '+triangles);
  animateTruck(m,.18,8,.125,.2);
  assert.ok(m.userData.wheels[0].rotation.x<0);
  if(m.userData.trailer)assert.equal(m.userData.trailer.rotation.y,.2);
  clearDecoration(m);disposeTruck(m);
 }
});
test('style selector in the real workshop is wired to active preview, not automatic checkout',()=>{
 const js=readFileSync(new URL('../src/game.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../src/menu.css',import.meta.url),'utf8');
 assert.match(js,/data-deko-preset/);
 assert.match(js,/applyDekotoraPreset\(draftDecoration,button.dataset.dekoPreset\)/);
 assert.match(css,/\.deko-preset-grid\{/);
});
