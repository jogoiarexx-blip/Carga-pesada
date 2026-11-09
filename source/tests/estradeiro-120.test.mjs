import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES} from '../src/fleet.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';

const estradeiro=VEHICLES.find(v=>v.id==='estradeiro');
const create=()=>buildTruck(estradeiro,estradeiro.color,estradeiro.defaultBody);

test('Estradeiro 120 tem cabine exclusiva mais próxima de um caminhão rígido real',()=>{
 const model=create(),parts=model.userData.components;
 for(const name of ['Estradeiro 120 — cabine regional','grade de refrigeração Estradeiro','moldura para-brisa Estradeiro','vidro dianteiro Estradeiro','moldura do farol Estradeiro','para-choque frontal do Estradeiro']) assert.ok(parts.includes(name),name);
 assert.equal(parts.includes('cabine frontal'),false);
 disposeTruck(model);
});

test('Estradeiro 120 ganhou portas, estribos, para-lamas e identidade própria',()=>{
 const model=create(),parts=model.userData.components;
 for(const name of ['vidro lateral do Estradeiro','maçaneta do Estradeiro','estribo do Estradeiro','para-lama curvo do Estradeiro','retrovisor principal do Estradeiro','emblema frontal Estradeiro 120']) assert.ok(parts.includes(name),name);
 disposeTruck(model);
});

test('rodas do Estradeiro continuam animando com aro e sulcos novos',()=>{
 const model=create();
 assert.equal(model.userData.wheels.length,4);
 animateTruck(model,.18,14,.2);
 assert.equal(model.userData.frontWheels[0].rotation.y,-.18);
 assert.ok(model.userData.wheels.every(w=>w.rotation.x<0));
 assert.ok(model.userData.components.includes('parafuso da roda Estradeiro'));
 assert.ok(model.userData.components.includes('sulco do pneu Estradeiro'));
 disposeTruck(model);
});

test('geometria do Estradeiro respeita tamanho e custo de renderização',()=>{
 const model=create();
 const b=new THREE.Box3().setFromObject(model),s=b.getSize(new THREE.Vector3());
 assert.ok(s.z>=estradeiro.length&&s.z<estradeiro.length+.8,`comprimento ${s.z}`);
 assert.ok(s.y>3.1&&s.y<4.4,`altura ${s.y}`);
 assert.ok(s.x<3.9,`largura ${s.x}`);
 let draws=0,positions=0;
 model.traverse(o=>{if(!o.isMesh)return;draws++;positions+=o.geometry.attributes.position.count;});
 assert.ok(draws<75,`draws ${draws}`);
 assert.ok(positions<140000,`vertices ${positions}`);
 disposeTruck(model);
});

test('a melhoria é exclusiva do Estradeiro e não substitui o Aurora nem os pesados',()=>{
 for(const vehicle of VEHICLES.filter(v=>v.id!=='estradeiro')){
   const model=buildTruck(vehicle,vehicle.color,vehicle.defaultBody);
   assert.ok(!model.userData.components.includes('Estradeiro 120 — cabine regional'),vehicle.id);
   disposeTruck(model);
 }
});
