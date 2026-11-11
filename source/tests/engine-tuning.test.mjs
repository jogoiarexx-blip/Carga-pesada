import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VEHICLES,CONTRACTS,driveStep,freshSave,loadSave,purchase} from '../src/core.mjs';
import {ENGINE_MAX_LEVEL,ENGINE_SPEED_GAIN,ENGINE_SERIES,engineStages,engineUpgradePrice,engineTopSpeed,engineAccelerationMultiplier} from '../src/engine-tuning.mjs';
import {installUpgrade,upgradeCost} from '../src/workshop.mjs';
import {renderEngineCatalog} from '../src/engine-shop-ui.mjs';
import {commitGarageMutation} from '../src/garage-transaction.mjs';

test('seis linhas únicas com seis motores cada e preços exatamente dobrados',()=>{
 assert.equal(ENGINE_MAX_LEVEL,6);
 assert.equal(Object.keys(ENGINE_SERIES).length,VEHICLES.length);
 const names=new Set();
 for(const v of VEHICLES){
  const stages=engineStages(v.id);
  assert.equal(stages.length,6);
  assert.ok(!names.has(ENGINE_SERIES[v.id].name));names.add(ENGINE_SERIES[v.id].name);
  for(let i=0;i<stages.length;i++){
   const stage=stages[i];
   assert.equal(stage.level,i+1);
   assert.ok(stage.name.includes(ENGINE_SERIES[v.id].name));
   assert.equal(stage.price,engineUpgradePrice(v.id,i+1));
   assert.equal(stage.price,ENGINE_SERIES[v.id].basePrice*2**i);
   if(i)assert.equal(stage.price,2*stages[i-1].price);
   assert.equal(engineTopSpeed(v,stage.level),v.max+stage.level*ENGINE_SPEED_GAIN);
   assert.ok(engineAccelerationMultiplier(stage.level)>engineAccelerationMultiplier(stage.level-1));
  }
 }
});
test('somente o próximo motor é comprado com débito exato por estágio',()=>{
 for(const v of VEHICLES){
  const s=freshSave();s.deliveries=100;s.money=1000000;
  if(v.id!=='aurora')assert.equal(purchase(s,v.id),true);
  const t=s.fleet[v.id];assert.ok(t);
  for(let level=1;level<=ENGINE_MAX_LEVEL;level++){
   const price=engineUpgradePrice(v.id,level);
   assert.equal(upgradeCost(t,'engine',v.id),price);
   const before=s.money;
   assert.equal(installUpgrade(s,v.id,'engine'),true);
   assert.equal(t.engine,level);
   assert.equal(s.money,before-price);
  }
  assert.equal(upgradeCost(t,'engine',v.id),null);
  const balance=s.money;
  assert.equal(installUpgrade(s,v.id,'engine'),false);
  assert.equal(s.money,balance);
 }
});
test('compras sem saldo não cobram créditos',()=>{
 const s=freshSave(),price=engineUpgradePrice('aurora',1);
 s.money=price-1;const before=JSON.stringify(s);
 assert.equal(installUpgrade(s,'aurora','engine'),false);
 assert.equal(JSON.stringify(s),before);
 assert.equal(engineUpgradePrice('aurora',0),null);
 assert.equal(engineUpgradePrice('unknown',1),null);
 assert.equal(engineUpgradePrice('aurora',7),null);
});
test('save antigo e motor N6 sobrevivem à recarga, sem afetar freios',()=>{
 const s=freshSave();s.fleet.aurora.engine=6;
 s.money=100000;s.deliveries=9;purchase(s,'estradeiro');
 s.fleet.estradeiro.engine=4;s.fleet.estradeiro.brakes=2;
 const restored=loadSave(JSON.stringify(s));
 assert.equal(restored.fleet.aurora.engine,6);
 assert.equal(restored.fleet.estradeiro.engine,4);
 assert.equal(restored.fleet.estradeiro.brakes,2);
 restored.fleet.aurora.engine=90;
 assert.equal(loadSave(JSON.stringify(restored)).fleet.aurora.engine,6);
 const old=freshSave();old.fleet.aurora.engine=2;
 assert.equal(loadSave(JSON.stringify(old)).fleet.aurora.engine,2);
});
test('a física usa a aceleração dos novos estágios em todos os caminhões',()=>{
 for(const vehicle of VEHICLES){
  const initial=()=>({s:0,x:-3.4,speed:0,lateral:0,steering:0,elapsed:0,cargo:100,health:100,fuel:100});
  const stock=initial(),strong=initial();
  const contract=CONTRACTS[0],input={gas:true,steer:0};
  for(let i=0;i<240;i++){
   driveStep(stock,input,vehicle,{engine:0,brakes:0},contract,1/60);
   driveStep(strong,input,vehicle,{engine:6,brakes:0},contract,1/60);
  }
  assert.ok(strong.speed>stock.speed,vehicle.id);
  assert.ok(engineTopSpeed(vehicle,6)>engineTopSpeed(vehicle,2));
 }
});
test('catálogo mostra próximo motor comprável, etapas futuras e preços',()=>{
 const truck={engine:0,brakes:0},fmt=n=>'CR$ '+n;
 const html=renderEngineCatalog(VEHICLES[0],truck,3000,fmt);
 assert.match(html,/CATÁLOGO DE MOTORES/);
 assert.equal((html.match(/class="engine-stage /g)||[]).length,6);
 assert.equal((html.match(/data-service="engine"/g)||[]).length,1);
 assert.match(html,/COMPRAR MOTOR N1/);
 assert.match(html,/N6/);
 const tooLittle=renderEngineCatalog(VEHICLES[0],truck,900,fmt);
 assert.match(tooLittle,/disabled/);
 assert.match(renderEngineCatalog(VEHICLES[0],{engine:6},0,fmt),/N6\/6/);
});
test('transação de motor é atômica se o armazenamento falhar',()=>{
 const save=freshSave();save.money=5000;
 const before=JSON.stringify(save),fail={setItem(){throw Error('full')}};
 const result=commitGarageMutation(save,draft=>installUpgrade(draft,'aurora','engine'),fail);
 assert.equal(result.ok,false);
 assert.equal(JSON.stringify(save),before);
});
