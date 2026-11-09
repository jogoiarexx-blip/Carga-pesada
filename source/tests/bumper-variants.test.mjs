import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VEHICLES} from '../src/fleet.mjs';
import {buildTruck,disposeTruck} from '../src/truck-model.mjs';
import {decorateTruck} from '../src/truck-decoration.mjs';
import {freshSave,loadSave} from '../src/core.mjs';
import {saveDecoration} from '../src/decoration.mjs';

test('cada caminhão recebe opções de para-choque distintas e sem acessórios residuais',async()=>{
 for(const vehicle of VEHICLES){
  const truck=buildTruck(vehicle,vehicle.color,vehicle.body);
  for(const [variant,expected,absent] of [[1,'ponteira urbana','lente LED para-choque'],[2,'luz auxiliar para-choque','lente LED para-choque'],[3,'lente LED para-choque','luz auxiliar para-choque']]){
   await decorateTruck(truck,{accessories:{bumper:true},variants:{bumper:variant}});
   const names=[];truck.userData.decorationLayer.group.userData.cabAccessories.traverse(o=>names.push(o.name));
   assert.ok(names.includes(expected),`${vehicle.id}: ${expected}`);
   assert.ok(names.includes('lateral para-choque'),vehicle.id);
   assert.ok(!names.includes(absent),vehicle.id);
  }
  await decorateTruck(truck,{});
  assert.equal(truck.userData.decorationLayer.group.userData.cabAccessories.getObjectByName('lateral para-choque'),undefined);
  disposeTruck(truck);
 }
});
test('opção de para-choque e sua compra continuam no caminhão após recarregar',()=>{
 const save=freshSave();save.money=10000;assert.ok(saveDecoration(save,save.selected,{accessories:{bumper:true},variants:{bumper:3}}));
 const loaded=loadSave(JSON.stringify(save));assert.equal(loaded.fleet[save.selected].decoration.variants.bumper,3);assert.ok(loaded.fleet[save.selected].partsInventory.owned.includes('bumper:3'));
});
