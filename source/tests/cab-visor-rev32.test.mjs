import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {VEHICLES} from '../src/fleet.mjs';
import {truckFit} from '../src/truck-fit.mjs';
import {PARTS,quoteParts,ownedParts} from '../src/parts-catalog.mjs';
import {normalizeDecoration,saveDecoration} from '../src/decoration.mjs';
import {freshSave,loadSave} from '../src/core.mjs';
import {planCabVisor} from '../src/cab-visor-rev32.mjs';
import {buildTruck,disposeTruck} from '../src/truck-model.mjs';
import {decorateTruck,clearDecoration} from '../src/truck-decoration.mjs';
import {readFileSync} from 'node:fs';

test('REV32 uses real upper windshield edges, not the middle of the glass',()=>{
 assert.equal(VEHICLES.length,6);
 for(const vehicle of VEHICLES)for(const level of [1,2,3]){
  const p=planCabVisor(vehicle,level),fit=truckFit(vehicle);
  assert.ok(p.glassClearance>=.075,vehicle.id+': visor bottom not above glass '+p.glassClearance);
  assert.ok(p.lipZ<p.glassFaceZ-.12,vehicle.id+': no forward projection');
  assert.ok(p.backZ>p.glassFaceZ+.12,vehicle.id+': unsupported plate');
  assert.ok(p.backY>p.lipY,vehicle.id+': the canopy should slope down toward front');
  assert.ok(p.backY-p.lipY<.4,vehicle.id+': visor slope too steep');
  assert.ok(Math.abs(fit.cab.visorY-planCabVisor(vehicle,1).lipY)<.001,vehicle.id);
 }
});
test('all three redesigned visors render fully above all six windshield openings',async()=>{
 for(const vehicle of VEHICLES)for(const body of vehicle.bodyOptions){
  const m=buildTruck(vehicle,vehicle.color,body),signatures=new Set();
  for(let level=1;level<=3;level++){
   await decorateTruck(m,normalizeDecoration({accessories:{visor:true},variants:{visor:level}}));
   const root=m.userData.decorationLayer.group.userData.cabAccessories;
   const bounds=new THREE.Box3().setFromObject(root),p=planCabVisor(vehicle,level);
   assert.ok(Number.isFinite(bounds.min.y));
   assert.ok(bounds.min.y>p.glassTop+.055,
    vehicle.id+': visor '+level+' covers windshield: '+bounds.min.y+' <= '+p.glassTop);
   assert.ok(bounds.min.z<fitGlobalFront(vehicle)+p.glassFaceZ-.12,vehicle.id+': visor does not project forward');
   assert.ok(root.getObjectByName('viseira decorativa'),vehicle.id+': missing visor');
   assert.ok(root.getObjectByName('borda da viseira'),vehicle.id+': missing edging');
   assert.ok(root.getObjectByName('suporte superior da viseira'),vehicle.id+': missing mounts');
   if(level===1)assert.equal(root.getObjectByName('luz decorativa da viseira'),undefined);
   if(level===2)assert.ok(root.getObjectByName('aleta lateral touring'));
   if(level===3)assert.ok(root.getObjectByName('luz decorativa da viseira'));
   let count=0,checksum=0;
   root.traverse(o=>{if(o.isMesh){const a=o.geometry.attributes.position.array;count+=a.length;for(let i=0;i<a.length;i+=37){assert.ok(Number.isFinite(a[i]));checksum+=Math.round(a[i]*1000);}}});
   signatures.add(count+':'+checksum);
  }
  assert.equal(signatures.size,3,vehicle.id+' variants must be different geometries');
  clearDecoration(m);disposeTruck(m);
 }
});
function fitGlobalFront(vehicle){
 const fit=truckFit(vehicle);
 return fit.layout.front+(vehicle.id==='imperador'?.10:0);
}
test('visor variants retain original IDs, purchases and imported career saves',()=>{
 const v=PARTS.visor;
 assert.equal(v.length,3);
 assert.deepEqual(v.map(x=>x.id),[1,2,3]);
 assert.ok(v[0].name.includes('Pala'));assert.ok(v[2].name.includes('luzes'));
 const s=freshSave();s.money=10000;
 for(const level of [1,2,3]){
  const selection=normalizeDecoration({accessories:{visor:true},variants:{visor:level}});
  const price=quoteParts(s,'aurora',selection).cost;
  assert.equal(price,v[level-1].price);
  assert.ok(saveDecoration(s,'aurora',selection));
  assert.equal(quoteParts(s,'aurora',selection).cost,0);
 }
 const reloaded=loadSave(JSON.stringify(s));
 for(const id of [1,2,3])assert.ok(ownedParts(reloaded.fleet.aurora).includes('visor:'+id));
});
test('old visor geometry that cut across glass is no longer generated',()=>{
 const accessory=readFileSync(new URL('../src/truck-accessories.mjs',import.meta.url),'utf8');
 const details=readFileSync(new URL('../src/art-truck-details.mjs',import.meta.url),'utf8');
 assert.match(accessory,/addCabVisor\(/);
 assert.doesNotMatch(accessory,/c\.visorY,front\+c\.windZ/);
 assert.doesNotMatch(details,/if\(a\.visor\)/);
});
