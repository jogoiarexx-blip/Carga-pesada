import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES} from '../src/fleet.mjs';
import {createTruckMaterialSet,TRUCK_MATERIAL_PALETTES} from '../src/truck-materials.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';
import {freshSave,loadSave} from '../src/core.mjs';

test('REV33: seis paletas individuais, com cores distintas para vidros e baús',()=>{
 assert.equal(Object.keys(TRUCK_MATERIAL_PALETTES).length,6);
 assert.equal(new Set(VEHICLES.map(v=>TRUCK_MATERIAL_PALETTES[v.id].glass)).size,6);
 for(const vehicle of VEHICLES){
  const p=TRUCK_MATERIAL_PALETTES[vehicle.id];
  assert.ok(/^#[0-9a-f]{6}$/i.test(p.glass));
  assert.ok(/^#[0-9a-f]{6}$/i.test(p.cargo));
  assert.ok(/^#[0-9a-f]{6}$/i.test(p.doors));
 }
});

test('REV33: materiais opacos eficientes, brilho retrô e cache por caminhão',()=>{
 const model=createTruckMaterialSet(VEHICLES[0],'#da8432');
 assert.equal(model.paint.type,'MeshStandardMaterial');
 assert.equal(model.paint.color.getHexString(),'da8432');
 assert.ok(model.paint.roughness>=.48&&model.paint.roughness<=.62);
 assert.ok(model.chrome.metalness>=.8&&model.chrome.roughness<=.3);
 assert.ok(model.brushed.metalness<model.chrome.metalness);
 assert.ok(model.brushed.roughness>model.chrome.roughness);
 assert.equal(model.glass.type,'MeshStandardMaterial');
 assert.equal(model.glass.transparent,false);
 assert.equal(model.glass.depthWrite,true);
 assert.ok(model.glass.roughness<=.3);
 assert.equal(model.rubber.metalness,0);
 assert.ok(model.rubber.roughness>=.88);
 assert.ok(model.cargo.roughness>model.paint.roughness);
 assert.equal(model.finish({color:'#76919c',transparent:true,opacity:.92,clearcoat:.42}),model.glass);
 assert.equal(model.finish({color:'#76919c',transparent:true,opacity:.91,clearcoat:.58}),model.glass);
 assert.equal(model.finish({color:'#b1c2c1',metalness:.80,roughness:.25}),
              model.finish({color:'#b1c2c1',metalness:.87,roughness:.18}));
 const other=createTruckMaterialSet(VEHICLES[0],'#da8432');
 assert.notEqual(other.paint,model.paint);
 assert.notEqual(other.chrome,model.chrome);
});

test('REV33: mudanças de cor não vazam entre caminhões nem entre save antigo e atual',()=>{
 const a=buildTruck(VEHICLES[0],'#a33d26'),b=buildTruck(VEHICLES[1],'#386b96');
 assert.notEqual(a.userData.paint,b.userData.paint);
 a.userData.paint.color.set('#58b36a');
 assert.equal(a.userData.paint.color.getHexString(),'58b36a');
 assert.equal(b.userData.paint.color.getHexString(),'386b96');
 const save=freshSave();save.money=12345;save.fleet.aurora.color='#58b36a';
 const restored=loadSave(JSON.stringify(save));
 assert.equal(restored.fleet.aurora.color,'#58b36a');
 assert.equal(restored.money,12345);
 disposeTruck(a);disposeTruck(b);
});

test('REV33: cada carroceria e cada cabine usa materiais unificados sem reflexos físicos caros',()=>{
 for(const vehicle of VEHICLES)for(const body of vehicle.bodyOptions){
  const m=buildTruck(vehicle,vehicle.color,body),materials=m.userData.materials;
  const used=new Set();let calls=0,vertices=0;
  m.traverse(o=>{if(!o.isMesh)return;calls++;vertices+=o.geometry.attributes.position.count;
   const all=Array.isArray(o.material)?o.material:[o.material];
   for(const material of all){
    used.add(material);
    assert.notEqual(material.type,'MeshPhysicalMaterial',vehicle.id+' contains expensive physical material');
   }
  });
  assert.ok(used.has(materials.paint),vehicle.id+' missing cabin paint');
  assert.ok(used.has(materials.chrome),vehicle.id+' missing chrome');
  assert.ok(used.has(materials.glass),vehicle.id+' missing opaque tinted glass');
  assert.ok(used.has(materials.rubber),vehicle.id+' missing tire rubber');
  assert.ok(used.has(materials.cargo),vehicle.id+' missing cargo paint');
  assert.ok(materials.materialCount()<45,vehicle.id+' too many material variants '+materials.materialCount());
  assert.ok(calls<70,vehicle.id+' too many draw calls '+calls);
  assert.ok(vertices<145000,vehicle.id+' too many vertices '+vertices);
  if(m.userData.trailer){
   animateTruck(m,.11,8,.12,.17);
   assert.equal(m.userData.trailer.rotation.y,.17);
  }
  disposeTruck(m);
 }
});

test('REV33: pintura usada e material órfão são descartados uma vez',()=>{
 const model=buildTruck(VEHICLES[0],VEHICLES[0].color);
 const paint=model.userData.paint;
 const unused=model.userData.materials.finish({color:'#735521',metalness:.47,roughness:.47});
 let pDisposals=0,uDisposals=0;
 paint.addEventListener('dispose',()=>pDisposals++);
 unused.addEventListener('dispose',()=>uDisposals++);
 disposeTruck(model);
 assert.equal(pDisposals,1);
 assert.equal(uDisposals,1);
});
