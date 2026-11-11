import {test} from 'node:test';
import assert from 'node:assert/strict';
import {workshopLighting,workshopConcretePixels} from '../src/workshop-finish.mjs';

test('iluminação do galpão preserva modos eco, equilibrado e alto',()=>{
 const e=workshopLighting('garage','eco');
 const b=workshopLighting('garage','balanced');
 const h=workshopLighting('garage','high');
 assert.equal(e.shadows,false);
 assert.equal(b.shadows,false);
 assert.equal(h.shadows,true);
 assert.ok(e.hemisphere<b.hemisphere);
 assert.ok(e.sun<=b.sun);
 for(const p of [e,b,h]){
  assert.ok(p.exposure>0&&p.exposure<2);
  assert.ok(p.sun>0&&p.hemisphere>0);
  assert.match(p.sky,/^#[\da-f]{6}$/i);
 }
});
test('o sol da estrada volta ao normal ao sair da oficina',()=>{
 const drive=workshopLighting('drive','eco',false),night=workshopLighting('drive','high',true);
 assert.equal(drive.shadows,true);
 assert.equal(drive.sun,3.1);
 assert.equal(night.sun,.4);
 assert.equal(drive.exposure,1.15);
 assert.equal(workshopLighting('home','eco').hemisphere,2.3);
});
test('textura de concreto é determinística, opaca, com manchas e tamanho limitado',()=>{
 const a=workshopConcretePixels(128),b=workshopConcretePixels(128);
 assert.equal(a.length,128*128*4);
 assert.deepEqual(a,b);
 const values=new Set();
 for(let i=0;i<a.length;i+=4){values.add(a[i]);assert.equal(a[i+3],255);}
 assert.ok(values.size>25,'texture should have visible tonal variation');
 assert.equal(workshopConcretePixels(999).length,256*256*4);
});
