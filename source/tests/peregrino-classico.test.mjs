import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES,vehicleLayout} from '../src/fleet.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';

const peregrino=VEHICLES.find(v=>v.id==='peregrino');
const create=(body='box_trailer',paint=peregrino.color)=>buildTruck(peregrino,paint,body);

test('Peregrino Clássico tem capô longo e grade original de caminhão de estrada',()=>{
 const truck=create(),p=truck.userData.components;
 for(const name of ['Peregrino — capô longo perfilado','tampa larga do capô Peregrino','radiador profundo Peregrino','aro da grade monumental Peregrino','filete vertical do radiador Peregrino','arco metálico de para-lama dianteiro Peregrino','para-choque de aço clássico Peregrino'])
  assert.ok(p.includes(name),'Peça ausente: '+name);
 assert.ok(!p.includes('capô clássico'),'a cabine genérica não deve ser usada');
 disposeTruck(truck);
});

test('cabine elevada, janelas e dormitório recebem acabamento independente',()=>{
 const truck=create(),p=truck.userData.components;
 for(const name of ['Peregrino — cabine elevada original','vidro panorâmico dianteiro Peregrino','janela lateral de cabine Peregrino','maçaneta cromada Peregrino','Peregrino — dormitório alto independente','janela escura do dormitório Peregrino','respiro lateral do dormitório Peregrino','luz de posição da cabine Peregrino'])
  assert.ok(p.includes(name),'Peça ausente: '+name);
 disposeTruck(truck);
});

test('frente do Peregrino possui faróis circulares e espelhos cromados',()=>{
 const truck=create(),p=truck.userData.components;
 for(const name of ['aro circular cromado de farol Peregrino','lente do farol circular Peregrino','pisca âmbar dianteiro Peregrino','carcaça de espelho de caminhão clássico','lente de espelho lateral Peregrino','estribo duplo inferior Peregrino','emblema frontal Peregrino Clássico'])
  assert.ok(p.includes(name),'Peça ausente: '+name);
 disposeTruck(truck);
});

test('escapamentos originais permanecem dinâmicos para os upgrades da oficina',()=>{
 const truck=create(),group=truck.userData.factoryExhaust;
 assert.ok(group?.isGroup,'escapamentos não encontrados');
 assert.equal(group.userData.dynamic,true);
 assert.equal(group.children.filter(c=>c.name==='chaminé cromada original Peregrino').length,2);
 assert.equal(group.children.filter(c=>c.name==='protetor térmico do escapamento Peregrino').length,2);
 assert.ok(group.visible);group.visible=false;assert.ok(!group.visible);disposeTruck(truck);
});

test('Peregrino preserva cavalo articulado, três eixos próprios e três eixos da carreta',()=>{
 const truck=create(),l=vehicleLayout(peregrino);
 assert.equal(truck.userData.axles.length,6);
 assert.equal(l.driveAxles.length,2);
 assert.equal(l.trailerAxles.length,3);
 assert.equal(truck.userData.wheels.length,12);
 assert.equal(truck.userData.frontWheels.length,2);
 assert.ok(truck.userData.trailer?.userData.dynamic);
 assert.ok(truck.userData.components.includes('suporte da quinta roda Peregrino'));
 assert.ok(truck.userData.components.includes('guia cromada do engate Peregrino'));
 animateTruck(truck,.17,17,.20,.28);
 assert.equal(truck.userData.frontWheels[0].rotation.y,-.17);
 assert.equal(truck.userData.trailer.rotation.y,.28);
 assert.ok(truck.userData.wheels.every(w=>w.rotation.x<0));
 disposeTruck(truck);
});

test('aro e dez porcas acompanham o movimento das rodas sem substituir os eixos',()=>{
 const truck=create(),p=truck.userData.components;
 for(const name of ['aro pesado com anel Peregrino','dez porcas de roda Peregrino','bloco da banda de rodagem Peregrino','para-barro traseiro cavalo Peregrino','tanque oval grande Peregrino'])
  assert.ok(p.includes(name),'Peça ausente: '+name);
 assert.ok(truck.userData.wheels.every(w=>w.userData.radius===.66));
 disposeTruck(truck);
});

test('cavalo e carreta preservam dimensões e geometria dentro do orçamento',()=>{
 const truck=create(),size=new THREE.Box3().setFromObject(truck).getSize(new THREE.Vector3());
 assert.ok(size.z>peregrino.length-1&&size.z<peregrino.length+2,'comprimento: '+size.z);
 assert.ok(size.y>4&&size.y<5.3,'altura: '+size.y);
 assert.ok(size.x<4.25,'largura: '+size.x);
 let meshes=0,vertices=0;
 truck.traverse(obj=>{if(!obj.isMesh)return;meshes++;const a=obj.geometry.attributes.position;vertices+=a.count;for(const c of a.array)assert.ok(Number.isFinite(c));});
 assert.ok(meshes<110,'malhas: '+meshes);
 assert.ok(vertices<200000,'vértices: '+vertices);
 disposeTruck(truck);
});

test('pinturas e os dois tipos de carreta continuam compatíveis',()=>{
 for(const body of ['box_trailer','tarp_trailer']){
  const truck=create(body,'#bb582e');
  assert.equal(truck.userData.spec.id,'peregrino');
  assert.equal(truck.userData.body,body);
  assert.equal(truck.userData.paint.color.getHexString(),'bb582e');
  assert.ok(truck.userData.components.includes('Peregrino — capô longo perfilado'));
  disposeTruck(truck);
 }
});

test('os cinco caminhões restantes conservam as respectivas cabines e categorias',()=>{
 for(const v of VEHICLES.filter(v=>v.id!=='peregrino')){
  const truck=buildTruck(v,v.color,v.defaultBody);
  assert.equal(truck.userData.spec.id,v.id);
  assert.ok(!truck.userData.components.includes('Peregrino — capô longo perfilado'));
  disposeTruck(truck);
 }
});
