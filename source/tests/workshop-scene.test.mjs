import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {createWorkshopScene,setWorkshopQuality,WORKSHOP_LIMITS,configureWorkshopVehicle,beginWorkshopService,updateWorkshopService} from '../src/workshop-scene.mjs';
import {VEHICLES} from '../src/fleet.mjs';

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

test('manutenção ativa plataformas, ferramentas e volta ao repouso ao terminar',()=>{
 const scene=createWorkshopScene();
 configureWorkshopVehicle(scene,VEHICLES.find(v=>v.id==='falcao'));

 const rail=scene.userData.serviceRails[0];
 assert.ok(rail.scale.z>=8&&rail.scale.z<=11);
 assert.ok(beginWorkshopService(scene,'repair'));
 assert.equal(scene.userData.serviceRig.visible,true);
 let highest=0;
 for(let i=0;i<30;i++)highest=Math.max(highest,updateWorkshopService(scene,.1).lift);
 assert.ok(highest>.2);
 assert.equal(scene.userData.serviceRig.visible,false);
 assert.equal(scene.userData.service,null);
 assert.equal(updateWorkshopService(scene,.1).lift,0);
});
test('pintura usa pulverização visual sem levantar o caminhão',()=>{
 const scene=createWorkshopScene();
 configureWorkshopVehicle(scene,VEHICLES.find(v=>v.id==='aurora'));
 assert.ok(beginWorkshopService(scene,'paint'));
 assert.equal(scene.userData.serviceSpray.visible,true);
 assert.equal(scene.userData.serviceTrolley.visible,false);
 assert.equal(updateWorkshopService(scene,.5).lift,0);
 for(let i=0;i<20;i++)updateWorkshopService(scene,.1);
 assert.equal(scene.userData.serviceRig.visible,false);
});
test('modo econômico omite detalhes dos efeitos e rejeita serviços desconhecidos',()=>{
 const scene=createWorkshopScene();
 configureWorkshopVehicle(scene,VEHICLES.find(v=>v.id==='estradeiro'));
 setWorkshopQuality(scene,'eco');
 assert.equal(beginWorkshopService(scene,'engine'),true);
 assert.equal(scene.userData.serviceSparks.visible,false);
 assert.equal(beginWorkshopService(scene,'invalid'),false);
});

test('ferramentas e luz de serviço mudam de posição conforme o tipo e o caminhão',async()=>{
 const s=createWorkshopScene(),{VEHICLES}=await import('../src/fleet.mjs');
 configureWorkshopVehicle(s,VEHICLES[0]);
 assert.equal(beginWorkshopService(s,'engine'),true);
 const motor={...s.userData.service.point};
 assert.equal(s.userData.serviceFocus.position.z,motor.z);
 assert.equal(s.userData.serviceSparks.position.z,motor.z);
 assert.equal(beginWorkshopService(s,'brakes'),true);
 const brake={...s.userData.service.point};
 assert.notEqual(brake.z,motor.z);
 assert.equal(s.userData.serviceLight.position.z,brake.z);
 assert.equal(updateWorkshopService(s,.4).focus.type,'brakes');
 configureWorkshopVehicle(s,VEHICLES.find(v=>v.id==='peregrino'));
 assert.equal(s.userData.service,null);
 assert.equal(beginWorkshopService(s,'body'),true);
 assert.ok(s.userData.service.point.z>0);
 const lights=[];s.traverse(o=>{if(o.isLight)lights.push(o)});
 assert.equal(lights.length,1);
});
test('saída da oficina cancela animação e restaura luminária',async()=>{
 const s=createWorkshopScene(),{VEHICLES}=await import('../src/fleet.mjs');
 const {stopWorkshopService}=await import('../src/workshop-scene.mjs');
 configureWorkshopVehicle(s,VEHICLES[1]);
 assert.equal(beginWorkshopService(s,'paint'),true);
 assert.equal(s.userData.serviceSpray.visible,true);
 stopWorkshopService(s);
 assert.equal(s.userData.service,null);
 assert.equal(s.userData.serviceRig.visible,false);
 assert.equal(s.userData.serviceLight.position.y,9.8);
});

test('oficina impede animação sem veículo de contexto',()=>{
 const scene=createWorkshopScene();
 assert.equal(beginWorkshopService(scene,'paint'),false);
 configureWorkshopVehicle(scene,VEHICLES[0]);
 assert.equal(beginWorkshopService(scene,'paint'),true);
});

test('serviço abre no lado visível da câmera, com ferramenta e pulverização espelhadas',()=>{
 const scene=createWorkshopScene();
 configureWorkshopVehicle(scene,VEHICLES.find(v=>v.id==='peregrino'));
 assert.equal(beginWorkshopService(scene,'brakes',{side:1}),true);
 const right=scene.userData.service.point;
 assert.ok(right.x>0);
 assert.ok(scene.userData.serviceTool.position.x>right.x);
 assert.ok(scene.userData.serviceTrolley.position.x>right.x);
 assert.equal(scene.userData.serviceMist.visible,false);
 assert.equal(beginWorkshopService(scene,'paint',{side:-1}),true);
 const left=scene.userData.service.point;
 assert.ok(left.x<0);
 assert.ok(scene.userData.serviceSpray.position.x<left.x);
 assert.equal(scene.userData.serviceSpray.rotation.z,-Math.PI/2);
 assert.equal(scene.userData.serviceMist.visible,true);
 assert.equal(scene.userData.serviceTool.visible,false);
 assert.ok(scene.userData.serviceSpray.material.transparent);
 assert.equal(scene.userData.serviceSpray.material.depthWrite,false);
 assert.equal(scene.userData.serviceMist.children.length,7);
});
test('iluminação de serviço permanece desligada em eco e não acumula luzes dinâmicas',()=>{
 const scene=createWorkshopScene();
 configureWorkshopVehicle(scene,VEHICLES[0]);
 setWorkshopQuality(scene,'balanced');
 assert.equal(scene.userData.serviceLight.visible,false);
 assert.equal(beginWorkshopService(scene,'engine',{side:1}),true);
 assert.equal(scene.userData.serviceLight.visible,true);
 let lamps=0;scene.traverse(o=>{if(o.isLight)lamps++;});
 assert.equal(lamps,1);
 setWorkshopQuality(scene,'eco');
 assert.equal(scene.userData.serviceLight.visible,false);
 assert.equal(scene.userData.serviceMist.visible,false);
 setWorkshopQuality(scene,'high');
 assert.equal(scene.userData.serviceLight.visible,true);
 for(let i=0;i<40;i++)updateWorkshopService(scene,.1);
 assert.equal(scene.userData.serviceLight.visible,true);
 setWorkshopQuality(scene,'balanced');
 assert.equal(scene.userData.serviceLight.visible,false);
});
