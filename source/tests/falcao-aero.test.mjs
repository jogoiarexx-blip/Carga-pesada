import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES} from '../src/fleet.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';

const spec=VEHICLES.find(v=>v.id==='falcao');
const create=(body=spec.defaultBody,color=spec.color)=>buildTruck(spec,color,body);
const names=m=>m.userData.components;

test('Falcão Aero recebe capô inclinado e cabine de teto elevado exclusivos',()=>{
 const m=create(),parts=names(m);
 for(const name of [
  'Falcão Aero — capô aerodinâmico esculpido',
  'crista central aerodinâmica do capô',
  'Falcão Aero — cabine com teto alto contínuo',
  'defletor integrado de teto Falcão',
  'fecho superior do teto do Falcão'])assert.ok(parts.includes(name),`Peça ausente: ${name}`);
 assert.ok(!parts.includes('capô aerodinâmico'));
 disposeTruck(m);
});

test('para-brisa panorâmico, vidros laterais e dormitório pertencem ao Falcão',()=>{
 const m=create(),parts=names(m);
 for(const name of ['moldura de para-brisa panorâmico Falcão','para-brisa panorâmico fumê Falcão',
  'vedação da porta Falcão','janela lateral ampla Falcão','janela do dormitório Falcão',
  'carenagem lateral de dormitório Falcão','maçaneta cromada Falcão'])assert.ok(parts.includes(name),name);
 disposeTruck(m);
});

test('frente possui grade profunda, assinatura LED e para-choque aerodinâmico',()=>{
 const m=create(),parts=names(m);
 for(const name of ['máscara de grade frontal profunda Falcão','aletinha cromada de grade Falcão',
  'nicho do farol LED Falcão','assinatura luminosa dianteira Falcão',
  'seta dianteira Falcão','para-choque aerodinâmico Falcão',
  'lâmina do spoiler dianteiro Falcão','emblema central Falcão Aero'])assert.ok(parts.includes(name),name);
 disposeTruck(m);
});

test('cabine ganha estribos, espelhos, para-lamas e saias sem remover acessórios',()=>{
 const m=create(),parts=names(m);
 for(const name of ['estribo superior antiderrapante Falcão','estribo inferior Falcão',
  'retrovisor aerodinâmico Falcão','espelho auxiliar de ponto cego Falcão',
  'arco da roda frontal Falcão','saia aerodinâmica da cabine Falcão',
  'luz de posição superior Falcão'])assert.ok(parts.includes(name),name);
 disposeTruck(m);
});

test('rodas e carreta articulada continuam a girar e esterçar',()=>{
 const m=create();
 assert.equal(m.userData.axles.length,6);
 assert.equal(m.userData.wheels.length,12);
 assert.equal(m.userData.frontWheels.length,2);
 assert.equal(m.userData.trailer.userData.dynamic,true);
 animateTruck(m,.21,22,.2,.17);
 assert.equal(m.userData.frontWheels[0].rotation.y,-.21);
 assert.equal(m.userData.trailer.rotation.y,.17);
 assert.ok(m.userData.wheels.every(w=>w.rotation.x<0));
 disposeTruck(m);
});

test('aros, porcas e sulcos acompanham todos os eixos com materiais reutilizados',()=>{
 const m=create(),parts=names(m);
 for(const name of ['aro aerodinâmico Falcão','dez porcas das rodas Falcão',
  'bloco de pneu do Falcão','base da quinta roda Falcão',
  'tanque carenado do Falcão','para-barro do cavalo Falcão'])assert.ok(parts.includes(name),name);
 for(const w of m.userData.wheels)assert.equal(w.userData.radius,.66);
 disposeTruck(m);
});

test('baú e lona continuam compatíveis com pintura do jogador',()=>{
 for(const body of spec.bodyOptions){
  const m=create(body,'#739fbd');
  assert.equal(m.userData.spec.id,'falcao');
  assert.equal(m.userData.body,body);
  assert.equal(m.userData.paint.color.getHexString(),'739fbd');
  assert.ok(names(m).includes('Falcão Aero — cabine com teto alto contínuo'));
  if(body==='box_trailer')assert.ok(names(m).includes('baú fechado'));
  if(body==='tarp_trailer')assert.ok(names(m).includes('lona com caimento'));
  disposeTruck(m);
 }
});

test('modelo completo mantém dimensões, vértices finitos e draw calls controladas',()=>{
 const m=create(),size=new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3());
 assert.ok(size.z>=spec.length&&size.z<spec.length+.6,`comprimento ${size.z}`);
 assert.ok(size.y>4.4&&size.y<5,`altura ${size.y}`);
 assert.ok(size.x<4.25,`largura ${size.x}`);
 let meshes=0,vertices=0;
 m.traverse(obj=>{if(!obj.isMesh)return;meshes++;const a=obj.geometry.attributes.position;vertices+=a.count;for(const x of a.array)assert.ok(Number.isFinite(x));});
 assert.ok(meshes<70,`meshes: ${meshes}`);
 assert.ok(vertices<200000,`vertices: ${vertices}`);
 disposeTruck(m);
});

test('outros cinco caminhões não herdam a nova cabine Falcão',()=>{
 for(const v of VEHICLES.filter(v=>v.id!=='falcao')){
  const m=buildTruck(v,v.color,v.defaultBody);
  assert.equal(m.userData.spec.id,v.id);
  assert.ok(!names(m).includes('Falcão Aero — capô aerodinâmico esculpido'),v.id);
  disposeTruck(m);
 }
});
