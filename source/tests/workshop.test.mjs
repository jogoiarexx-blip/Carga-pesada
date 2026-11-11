import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshSave,purchase} from '../src/core.mjs';
import {equipBody} from '../src/fleet.mjs';
import {garageSelection,repairCost,repairTruck,installUpgrade,repaintTruck} from '../src/workshop.mjs';
import {pageFromHash,pageHash} from '../src/navigation.mjs';
function fleet(){const s=freshSave();s.money=100000;s.deliveries=7;purchase(s,'estradeiro');purchase(s,'peregrino');s.selected='aurora';return s;}
test('garage preview and comparison never buy, equip or alter the save',()=>{const save=freshSave(),before=JSON.stringify(save),view=garageSelection(save,'falcao','tarp_trailer');assert.equal(view.vehicle.body,'tarp_trailer');assert.equal(view.owned,false);assert.equal(view.canBuy,false);assert.match(view.reason,/7 entregas/);assert.equal(JSON.stringify(save),before);});
test('maintenance targets the chosen owned truck without changing equipped truck',()=>{const s=fleet();s.fleet.estradeiro.health=70;const before=s.money;assert.equal(repairCost(s.fleet.estradeiro),360);assert.ok(repairTruck(s,'estradeiro'));assert.ok(installUpgrade(s,'estradeiro','brakes'));assert.equal(s.fleet.estradeiro.brakes,1);assert.equal(s.fleet.aurora.brakes,0);assert.equal(s.selected,'aurora');assert.equal(s.money,before-2160);});
test('painting only commits on explicit valid operation and charges once',()=>{const s=fleet(),before=s.money;garageSelection(s,'estradeiro');assert.equal(s.money,before);assert.ok(repaintTruck(s,'estradeiro','#b84c3c'));assert.equal(s.money,before-300);assert.equal(s.fleet.estradeiro.color,'#b84c3c');assert.equal(repaintTruck(s,'estradeiro','#b84c3c'),false);assert.equal(s.money,before-300);assert.equal(s.selected,'aurora');});
test('invalid, unowned and unaffordable services cannot charge or mutate',()=>{const s=freshSave(),before=JSON.stringify(s);assert.equal(installUpgrade(s,'aurora','engine'),false);assert.equal(repaintTruck(s,'imperador','#b84c3c'),false);assert.equal(repaintTruck(s,'aurora','invalid'),false);assert.equal(repairTruck(s,'falcao'),false);assert.equal(equipBody(s,'tarp_trailer','peregrino'),false);assert.equal(JSON.stringify(s),before);});
test('body installation targets a parked tractor and preserves selected Aurora',()=>{const s=fleet(),before=s.money;assert.ok(equipBody(s,'tarp_trailer','peregrino'));assert.equal(s.selected,'aurora');assert.equal(s.fleet.peregrino.body,'tarp_trailer');assert.equal(s.money,before-800);});
test('all menu pages have stable direct hashes and unknown links return home',()=>{for(const page of ['home','contracts','garage'])assert.equal(pageFromHash(pageHash(page)),page);assert.equal(pageHash('garage'),'#garagem');assert.equal(pageFromHash('#garagem'),'garage');assert.equal(pageFromHash('#old-modal'),'home');});


test('a oficina aceita seis motores por caminhão sem alterar os freios',()=>{
 const s=fleet(),id='aurora',originalBrakes=s.fleet[id].brakes;
 s.money=200000;
 for(let level=1;level<=6;level++){
  const previous=s.money;
  assert.equal(installUpgrade(s,id,'engine'),true);
  assert.equal(s.fleet[id].engine,level);
  assert.equal(s.money,previous-2000*2**(level-1));
 }
 assert.equal(s.fleet[id].brakes,originalBrakes);
 const remaining=s.money;
 assert.equal(installUpgrade(s,id,'engine'),false);
 assert.equal(s.money,remaining);
});
