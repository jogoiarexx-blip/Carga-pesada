import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES} from '../src/fleet.mjs';
import {buildTruck,animateTruck,disposeTruck} from '../src/truck-model.mjs';
const aurora=VEHICLES.find(v=>v.id==='aurora'),create=()=>buildTruck(aurora,aurora.color,aurora.defaultBody);
test('Aurora tem cabine exclusiva, para-brisa e grade de caminhão leve',()=>{
 const m=create(),parts=m.userData.components;
 for(const name of ['Aurora 90 — cabine perfilada','radiador com profundidade','moldura superior do para-brisa','vidro dianteiro fumê','moldura janela da porta','linha da porta frontal','para-choque de aço Aurora'])assert.ok(parts.includes(name),'Faltando '+name);
 assert.equal(parts.includes('cabine frontal'),false);disposeTruck(m);
});
test('Aurora inclui faróis, setas, estribos e para-lamas novos',()=>{
 const m=create(),parts=m.userData.components;
 for(const name of ['grade superior','frisos da grade frontal','encaixe farol quadrado','farol com lente e profundidade','seta dianteira âmbar','emblema Aurora 90','estribo inferior reforçado','moldura curva do para-lama'])assert.ok(parts.includes(name),'Faltando '+name);
 disposeTruck(m);
});
test('as quatro rodas do Aurora giram e esterçam com porcas e aros',()=>{
 const m=create();assert.equal(m.userData.wheels.length,4);assert.equal(m.userData.frontWheels.length,2);
 for(const w of m.userData.wheels){assert.equal(w.userData.radius,.58);assert.ok(w.children.some(o=>o.isMesh))}
 animateTruck(m,.23,16,.2);
 assert.equal(m.userData.frontWheels[0].rotation.y,-.23);assert.ok(m.userData.wheels.every(w=>w.rotation.x<0));
 assert.ok(m.userData.components.includes('porca do aro'));assert.ok(m.userData.components.includes('friso do pneu'));disposeTruck(m);
});
test('geometria do Aurora respeita limites de tamanho e renderização',()=>{
 const m=create(),b=new THREE.Box3().setFromObject(m),s=b.getSize(new THREE.Vector3());
 assert.ok(s.z>=aurora.length&&s.z<aurora.length+.6,'Comprimento '+s.z);
 assert.ok(s.y>3&&s.y<4.2,'Altura '+s.y);assert.ok(s.x<3.8,'Largura '+s.x);
 let draws=0,vertices=0;m.traverse(o=>{if(!o.isMesh)return;draws++;const a=o.geometry.attributes.position.array;vertices+=a.length/3;for(const n of a)assert.ok(Number.isFinite(n));});
 assert.ok(draws<70,'Draw calls: '+draws);assert.ok(vertices<125000,'Vértices: '+vertices);
 disposeTruck(m);
});
test('os cinco caminhões restantes não recebem a cabine Aurora',()=>{
 for(const v of VEHICLES.filter(v=>v.id!=='aurora')){const m=buildTruck(v,v.color,v.defaultBody);assert.ok(!m.userData.components.includes('Aurora 90 — cabine perfilada'));assert.equal(m.userData.spec.id,v.id);disposeTruck(m);}
});
