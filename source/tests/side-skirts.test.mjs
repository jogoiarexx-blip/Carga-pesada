import {test} from 'node:test';import assert from 'node:assert/strict';
import {VEHICLES} from '../src/fleet.mjs';
import {truckFit} from '../src/truck-fit.mjs';
import {planSideSkirts} from '../src/side-skirts.mjs';
test('skirt panels stay attached to the body and leave all rear wheels free',()=>{
 for(const v of VEHICLES)for(const body of v.bodyOptions){
  const fit=truckFit(v,body),plan=planSideSkirts(fit);
  assert.ok(plan.start>=fit.body.start&&plan.end<=fit.body.end);
  assert.ok(plan.top>fit.body.base-.05&&plan.top<=fit.body.base);
  assert.ok(plan.bottom>.58&&plan.bottom<.75);
  assert.ok(plan.panels.length>0,v.id);
  for(const p of plan.panels)for(const z of plan.axles)
   assert.ok(p.end<=z-fit.wheelRadius-.119||p.start>=z+fit.wheelRadius+.119,v.id+' wheel overlap');
  assert.equal(plan.axles.length,(fit.layout.trailerAxles.length?fit.layout.trailerAxles:fit.layout.driveAxles).length);
 }
});
test('rear skirt continues behind the drive wheel on Aurora and Estradeiro',()=>{
 for(const v of VEHICLES.filter(v=>['aurora','estradeiro'].includes(v.id))){
  const fit=truckFit(v),p=planSideSkirts(fit),z=fit.layout.driveAxles.at(-1);
  const rear=p.panels.find(item=>item.start>z+fit.wheelRadius);
  assert.ok(rear,v.id);assert.ok(Math.abs(rear.end-(fit.body.end-.06))<.0001);
 }
});
test('triple-axle trailers keep the long front skirt and joint rail',()=>{
 for(const v of VEHICLES.filter(v=>v.category==='tractor')){
  const p=planSideSkirts(truckFit(v));assert.equal(p.axles.length,3);
  assert.ok(p.cuts.length<=3&&p.end-p.start>10);
  assert.ok(p.panels[0].end-p.panels[0].start>3);
 }
});
