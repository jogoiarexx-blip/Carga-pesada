import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES,vehicleLayout} from '../src/fleet.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';
import {freshSave,loadSave} from '../src/core.mjs';

const spec=VEHICLES.find(v=>v.id==='imperador');
const create=(body=spec.defaultBody,color=spec.color)=>buildTruck(spec,color,body);
const names=model=>model.userData.components;

test('Imperador possui cabine avançada alta exclusiva, sem capô ou cubo genérico',()=>{
 const m=create(),parts=names(m);
 for(const name of [
  'Imperador Frontal — cabine alta sobre motor',
  'teto alto com cantos arredondados Imperador',
  'calha metálica de teto Imperador',
  'defletor superior discreto Imperador'])assert.ok(parts.includes(name),name);
 assert.equal(parts.includes('cabine frontal'),false);
 assert.equal(parts.includes('capô aerodinâmico'),false);
 disposeTruck(m);
});

test('para-brisa dividido, limpadores e vidros laterais completos',()=>{
 const m=create(),parts=names(m);
 for(const name of ['aro externo do para-brisa Imperador',
  'vidro panorâmico dividido Imperador','coluna central do para-brisa Imperador',
  'guarnição inferior do vidro Imperador','janela lateral grande Imperador'])assert.ok(parts.includes(name),name);
 disposeTruck(m);
});

test('frente com radiador profundo, faróis duplos, piscas e para-choque pesado',()=>{
 const m=create(),parts=names(m);
 for(const name of ['radiador recuado Imperador','núcleo escuro da grade Imperador',
  'lâmina horizontal da grade Imperador','alojamento duplo de farol Imperador',
  'farol superior Imperador','farol inferior Imperador','pisca âmbar Imperador',
  'para-choque pesado com quinas Imperador','emblema frontal Imperador'])assert.ok(parts.includes(name),name);
 disposeTruck(m);
});

test('portas, espelhos, estribos e para-lamas realmente têm geometria própria',()=>{
 const m=create(),parts=names(m);
 for(const name of ['vedação da porta frontal Imperador','maçaneta metálica Imperador',
  'retrovisor principal Imperador','espelho auxiliar de ponto cego Imperador',
  'estribo superior Imperador','estribo inferior Imperador',
  'contorno curvo do para-lama Imperador','saída de ventilação traseira da cabine Imperador',
  'luz de posição no teto Imperador'])assert.ok(parts.includes(name),name);
 disposeTruck(m);
});

test('10 rodas, cinco eixos, direção e carreta articulada continuam corretos',()=>{
 const m=create();
 assert.equal(m.userData.axles.length,5);
 assert.equal(m.userData.wheels.length,10);
 assert.equal(m.userData.frontWheels.length,2);
 assert.equal(m.userData.trailer.userData.dynamic,true);
 animateTruck(m,.24,25,.18,-.14);
 assert.equal(m.userData.frontWheels[0].rotation.y,-.24);
 assert.equal(m.userData.trailer.rotation.y,-.14);
 assert.ok(m.userData.wheels.every(w=>w.rotation.x<0));
 for(const part of ['aro estampado Imperador','parafuso da roda Imperador',
  'banda de rodagem Imperador','para-barro cavalo Imperador','base reforçada da quinta roda Imperador'])
  assert.ok(names(m).includes(part),part);
 disposeTruck(m);
});

test('carreta baú e lona mantêm layout, pintura e encaixe da cabine',()=>{
 const layout=vehicleLayout(spec);
 assert.ok(layout.bodyStart>layout.front+3.21+.15,'cabine encosta na carreta');
 for(const body of spec.bodyOptions){
  const m=create(body,'#5f83b2');
  assert.equal(m.userData.body,body);
  assert.equal(m.userData.paint.color.getHexString(),'5f83b2');
  assert.ok(names(m).includes('Imperador Frontal — cabine alta sobre motor'));
  assert.ok(names(m).includes(body==='box_trailer'?'baú fechado':'lona com caimento'));
  disposeTruck(m);
 }
});

test('dimensões, vértices finitos e chamadas de renderização dentro do orçamento',()=>{
 const m=create(),size=new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3());
 assert.ok(size.z>=spec.length&&size.z<spec.length+.6,`comprimento=${size.z}`);
 assert.ok(size.y>4&&size.y<5,`altura=${size.y}`);
 assert.ok(size.x<4.35,`largura=${size.x}`);
 let meshes=0,vertices=0;
 m.traverse(obj=>{if(!obj.isMesh)return;meshes++;
  const pos=obj.geometry.attributes.position;vertices+=pos.count;
  for(const n of pos.array)assert.ok(Number.isFinite(n));
 });
 assert.ok(meshes<70,`draw calls=${meshes}`);
 assert.ok(vertices<200000,`vertices=${vertices}`);
 disposeTruck(m);
});

test('restante da frota e formato do save da carreira não foram modificados',()=>{
 for(const v of VEHICLES.filter(v=>v.id!=='imperador')){
  const m=buildTruck(v,v.color,v.defaultBody);
  assert.equal(m.userData.spec.id,v.id);
  assert.ok(!names(m).includes('Imperador Frontal — cabine alta sobre motor'),v.id);
  disposeTruck(m);
 }
 const save=freshSave();save.money=1234;
 assert.equal(loadSave(JSON.stringify(save)).money,1234);
});
