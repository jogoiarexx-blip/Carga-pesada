import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VEHICLES} from '../src/fleet.mjs';
import {workshopCameraDistance} from '../src/workshop-camera.mjs';

test('os seis caminhões possuem enquadramento finito em vista frontal, traseira e laterais',()=>{
 for(const vehicle of VEHICLES){
  for(const [w,h] of [[360,252],[580,650],[900,600],[1400,800],[300,270]])
   for(const angle of [0,Math.PI/2,2.45,Math.PI,-Math.PI/2]){
    const result=workshopCameraDistance(vehicle,w,h,angle);
    assert.ok(Number.isFinite(result)&&result>=14&&result<=70,vehicle.id);
   }
 }
});
test('visão lateral de cavalo e carreta exige mais recuo que caminhão curto',()=>{
 const small=VEHICLES.find(v=>v.id==='aurora'),long=VEHICLES.find(v=>v.id==='falcao');
 assert.ok(workshopCameraDistance(long,700,500,Math.PI/2)>workshopCameraDistance(small,700,500,Math.PI/2));
});
test('em espaço estreito o enquadramento deve recuar',()=>{
 const v=VEHICLES.find(v=>v.id==='peregrino');
 assert.ok(workshopCameraDistance(v,300,600,Math.PI/2)>workshopCameraDistance(v,1200,600,Math.PI/2));
});
