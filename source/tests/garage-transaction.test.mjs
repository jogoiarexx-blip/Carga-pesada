import {test} from 'node:test';
import assert from 'node:assert/strict';
import {commitGarageMutation} from '../src/garage-transaction.mjs';
import {freshSave,purchase} from '../src/core.mjs';
import {equipBody} from '../src/fleet.mjs';
import {repairTruck,installUpgrade,repaintTruck} from '../src/workshop.mjs';
import {saveDecoration} from '../src/decoration.mjs';

function fakeStorage(fail=false){const writes=[];return {writes,setItem(key,value){if(fail)throw Error('QuotaExceededError');writes.push([key,value]);}};}
function prepared(){const save=freshSave();save.money=100000;save.deliveries=8;purchase(save,'peregrino');save.selected='aurora';save.fleet.aurora.health=60;return save;}
const changes=[
 ['comprar caminhão',s=>purchase(s,'estradeiro')],
 ['reparar',s=>repairTruck(s,'aurora')],
 ['melhorar motor',s=>installUpgrade(s,'aurora','engine')],
 ['pintura',s=>repaintTruck(s,'aurora','#b84c3c')],
 ['carroceria',s=>equipBody(s,'tarp_trailer','peregrino')],
 ['personalização',s=>saveDecoration(s,'aurora',{accessories:{skirts:true},variants:{skirts:2}})],
 ['seleção de caminhão',s=>{s.selected='peregrino';return true;}]
];
test('todas as operações da oficina preservam créditos e itens se o save falhar',()=>{
 for(const [name,action] of changes){
  const original=prepared(),before=JSON.stringify(original),storage=fakeStorage(true);
  const result=commitGarageMutation(original,action,storage);
  assert.equal(result.ok,false,name);assert.equal(result.reason,'storage',name);
  assert.equal(JSON.stringify(original),before,name);
  assert.equal(result.save,original,name);
  assert.equal(storage.writes.length,0,name);
 }
});
test('compra bem-sucedida grava uma única vez e conserva o original até confirmar',()=>{
 const original=prepared(),before=JSON.stringify(original),storage=fakeStorage();
 const result=commitGarageMutation(original,s=>saveDecoration(s,'aurora',{accessories:{skirts:true},variants:{skirts:2}}),storage);
 assert.equal(result.ok,true);assert.equal(storage.writes.length,1);assert.equal(storage.writes[0][0],'carga-pesada-v1');
 assert.equal(JSON.stringify(original),before);assert.notEqual(result.save.money,original.money);
 assert.deepEqual(JSON.parse(storage.writes[0][1]),result.save);
});
test('transação rejeitada ou inválida não grava, não gasta e não altera objeto de origem',()=>{
 const original=prepared(),storage=fakeStorage(),before=JSON.stringify(original);
 const failed=commitGarageMutation(original,s=>purchase(s,'aurora'),storage);
 assert.equal(failed.ok,false);assert.equal(failed.reason,'rejected');assert.equal(JSON.stringify(original),before);assert.equal(storage.writes.length,0);
 const invalid=commitGarageMutation(original,s=>{s.money=NaN;return true;},storage);
 assert.equal(invalid.ok,false);assert.equal(invalid.reason,'rejected');assert.equal(storage.writes.length,0);
});
test('selecionar caminhão sem gasto só muda o save após persistência',()=>{
 const original=prepared(),storage=fakeStorage();
 const result=commitGarageMutation(original,s=>{s.selected='peregrino';return true;},storage);
 assert.equal(result.ok,true);assert.equal(result.save.selected,'peregrino');assert.equal(original.selected,'aurora');
});
