import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {createWorkshopScene,setWorkshopQuality,WORKSHOP_LIMITS} from '../src/workshop-scene.mjs';

test('Oficina Farol 3D contém galpão, bancada, luminárias e adereços low-poly',()=>{
 const scene=createWorkshopScene(),names=[];
 scene.traverse(obj=>names.push(obj.name));
 for(const name of ['oficina-farol-3d','estrutura','equipamentos','luminarias','piso-de-concreto','pneus-reserva','tambor-de-oleo','luminaria-led','luz-de-servico'])
  assert.ok(names.includes(name),name);
 assert.ok(WORKSHOP_LIMITS.width>30&&WORKSHOP_LIMITS.depth>60);
 assert.ok(scene.children.every(g=>g.isGroup));
});

test('elementos estáticos agrupados e luzes sem sombras reduzem custo do cenário',()=>{
 const scene=createWorkshopScene(),instances=[],lights=[];
 scene.traverse(o=>{if(o.isInstancedMesh)instances.push(o);if(o.isLight)lights.push(o);});
 assert.ok(instances.length>=8&&instances.length<=18,instances.length);
 assert.ok(instances.some(o=>o.count>25),'sem lote para pequenas geometrias');
 assert.equal(lights.length,1);
 assert.ok(lights.every(o=>!o.castShadow));
});

test('qualidade econômica remove detalhes; alta liga iluminação sem recriar a cena',()=>{
 const scene=createWorkshopScene(),details=scene.userData.detailGroup,light=scene.userData.serviceLight;
 assert.equal(details.visible,true);assert.equal(light.visible,false);
 setWorkshopQuality(scene,'eco');assert.equal(details.visible,false);assert.equal(light.visible,false);
 setWorkshopQuality(scene,'high');assert.equal(details.visible,true);assert.equal(light.visible,true);
 setWorkshopQuality(scene,'balanced');assert.equal(details.visible,true);assert.equal(light.visible,false);
});
