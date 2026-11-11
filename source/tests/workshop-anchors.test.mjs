import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VEHICLES,configuredVehicle,vehicleLayout} from '../src/fleet.mjs';
import {WORKSHOP_SERVICES,workshopServiceAnchor} from '../src/workshop-anchors.mjs';
test('cada serviço acompanha os eixos, cabine ou carroceria em seis modelos',()=>{
 for(const vehicle of VEHICLES)for(const body of vehicle.bodyOptions){
  const v=configuredVehicle(vehicle,body),layout=vehicleLayout(v);
  for(const type of WORKSHOP_SERVICES){
   const anchor=workshopServiceAnchor(v,type);
   assert.equal(anchor.type,type,v.id+' '+type);
   for(const n of [anchor.x,anchor.y,anchor.z])assert.ok(Number.isFinite(n),v.id+' '+type);
   assert.ok(anchor.z>layout.front&&anchor.z<layout.rear,v.id+' '+type);
   assert.ok(anchor.y>=.7&&anchor.y<=3,v.id+' '+type);
  }
  assert.equal(workshopServiceAnchor(v,'brakes').z,layout.frontAxle);
  const bodyZ=workshopServiceAnchor(v,'body').z;
  assert.ok(bodyZ>=layout.bodyStart&&bodyZ<=layout.rear,v.id+' carroceria');
  assert.notEqual(workshopServiceAnchor(v,'engine').z,bodyZ,v.id+' motor vs carroceria');
 }
});
test('serviços desconhecidos não criam ponto de efeito',()=>{
 assert.equal(workshopServiceAnchor(VEHICLES[0],'invalid'),null);
 assert.equal(workshopServiceAnchor(null,'repair'),null);
});

test('os seis modelos aceitam inspeção em ambos os lados sem deslocar eixos',()=>{
 for(const vehicle of VEHICLES)for(const body of vehicle.bodyOptions){
  const v=configuredVehicle(vehicle,body);
  for(const service of WORKSHOP_SERVICES){
   const right=workshopServiceAnchor(v,service,1),left=workshopServiceAnchor(v,service,-1);
   assert.ok(right.x>0&&left.x<0,vehicle.id+' '+service);
   assert.equal(right.x,-left.x);
   assert.equal(right.z,left.z);
   assert.equal(right.y,left.y);
  }
 }
});
