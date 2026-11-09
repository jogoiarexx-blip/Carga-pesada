import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES,vehicleLayout} from '../src/fleet.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';

const rochedo=VEHICLES.find(v=>v.id==='rochedo');
const create=()=>buildTruck(rochedo,rochedo.color,rochedo.defaultBody);

test('Rochedo 160 possui cabine alta exclusiva e frente própria de caminhão pesado',()=>{
 const model=create(),parts=model.userData.components;
 for(const name of ['Rochedo 160 — cabine alta exclusiva','moldura do para-brisa do Rochedo','vidro principal do Rochedo',
  'rebaixo da grade de radiador Rochedo','aleta horizontal do radiador','carcaça de farol pesado Rochedo',
  'lente de farol alto Rochedo','lente de farol baixo Rochedo','para-choque pesado do Rochedo'])
  assert.ok(parts.includes(name),`Peça ausente: ${name}`);
 assert.ok(!parts.includes('cabine frontal'),'não pode usar a cabine genérica');
 disposeTruck(model);
});

test('cabine do Rochedo inclui portas, retrovisores, estribos duplos, para-lamas e lanternas',()=>{
 const model=create(),parts=model.userData.components;
 for(const name of ['janela lateral ampla Rochedo','maçaneta externa Rochedo','retrovisor principal de caminhão pesado',
   'espelho de ponto cego Rochedo','estribo duplo antiderrapante Rochedo','arco de para-lama pesado Rochedo',
   'luz de cabine no teto','saída de ar lateral do Rochedo','emblema Rochedo 160'])
  assert.ok(parts.includes(name),`Peça ausente: ${name}`);
 disposeTruck(model);
});

test('Rochedo conserva os quatro eixos, oito rodas, direção e animação',()=>{
 const model=create(),layout=vehicleLayout(rochedo);
 assert.equal(model.userData.axles.length,4);
 assert.equal(layout.driveAxles.length,3);
 assert.equal(model.userData.wheels.length,8);
 assert.equal(model.userData.frontWheels.length,2);
 assert.ok(model.userData.components.includes('porca de roda Rochedo'));
 assert.ok(model.userData.components.includes('ranhura pneu carga pesada'));
 animateTruck(model,.19,20,.16);
 assert.equal(model.userData.frontWheels[0].rotation.y,-.19);
 assert.ok(model.userData.wheels.every(w=>w.rotation.x<0));
 disposeTruck(model);
});

test('Rochedo mantém dimensões e custo gráfico controlados',()=>{
 const model=create(),size=new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
 assert.ok(size.z>rochedo.length&&size.z<rochedo.length+.8,`comprimento: ${size.z}`);
 assert.ok(size.y>4&&size.y<4.7,`altura: ${size.y}`);
 assert.ok(size.x<4,`largura com retrovisores: ${size.x}`);
 let calls=0,vertices=0;
 model.traverse(obj=>{if(!obj.isMesh)return;calls++;vertices+=obj.geometry.attributes.position.count;
   for(const n of obj.geometry.attributes.position.array)assert.ok(Number.isFinite(n),'coordenada inválida');});
 assert.ok(calls<78,`excesso de draw calls: ${calls}`);
 assert.ok(vertices<100000,`geometria pesada: ${vertices}`);
 disposeTruck(model);
});

test('customização de cor e baú mantém o ID e geometria do Rochedo',()=>{
 const model=buildTruck(rochedo,'#b9452d','long_box');
 assert.equal(model.userData.spec.id,'rochedo');
 assert.equal(model.userData.body,'long_box');
 assert.ok(model.userData.components.includes('baú fechado'));
 assert.ok(model.userData.components.includes('reforço superior do baú Rochedo'));
 assert.equal(model.userData.paint.color.getHexString(),'b9452d');
 disposeTruck(model);
});

test('cinco caminhões não recebem a nova cabine do Rochedo',()=>{
 for(const v of VEHICLES.filter(v=>v.id!=='rochedo')){
  const model=buildTruck(v,v.color,v.defaultBody);
  assert.ok(!model.userData.components.includes('Rochedo 160 — cabine alta exclusiva'),v.id);
  assert.equal(model.userData.spec.id,v.id);
  disposeTruck(model);
 }
});
