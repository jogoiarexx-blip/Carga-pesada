import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VEHICLES} from '../src/fleet.mjs';
import {workshopCameraDistance,workshopFitBounds} from '../src/workshop-camera.mjs';
import * as THREE from '../src/vendor/three.module.js';
import {buildTruck,disposeTruck} from '../src/truck-model.mjs';

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


test('os modelos reais com carreta cabem no enquadramento calculado em cada vista',()=>{
 const views=[0,Math.PI/2,2.45,Math.PI,-Math.PI/2];
 const layouts=[[360,310],[320,325],[900,600],[1440,700]];
 for(const v of VEHICLES)for(const body of v.bodyOptions){
  const model=buildTruck(v,v.color,body);
  model.updateMatrixWorld(true);
  const b=new THREE.Box3().setFromObject(model);
  const bounds={min:b.min.toArray(),max:b.max.toArray()};
  for(const [w,h] of layouts)for(const angle of views){
   const fit=workshopFitBounds(bounds,w,h,angle);
   assert.ok(fit.distance>=14&&fit.distance<=90,v.id+' '+body);
   assert.equal(fit.center.length,3);
   const aspect=w/h,tan=Math.tan(48*Math.PI/360),norm=Math.hypot(1,.2);
   const right=[Math.cos(angle),0,-Math.sin(angle)];
   const up=[-.2*Math.sin(angle)/norm,1/norm,-.2*Math.cos(angle)/norm];
   const forward=[Math.sin(angle)/norm,.2/norm,Math.cos(angle)/norm];
   const dot=(v,u)=>v[0]*u[0]+v[1]*u[1]+v[2]*u[2];
   for(const x of [bounds.min[0],bounds.max[0]])for(const y of [bounds.min[1],bounds.max[1]])for(const z of [bounds.min[2],bounds.max[2]]){
    const pos=[x-fit.center[0],y-fit.center[1],z-fit.center[2]],depth=fit.distance*norm-dot(pos,forward);
    const xx=Math.abs(dot(pos,right)/(depth*tan*aspect)),yy=Math.abs(dot(pos,up)/(depth*tan));
    assert.ok(depth>0&&xx<=1&&yy<=1,body+' angle '+angle+' '+xx+'/'+yy);
   }
  }
  disposeTruck(model);
 }
});
