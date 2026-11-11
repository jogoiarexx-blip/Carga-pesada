import {test} from 'node:test';
import assert from 'node:assert/strict';
import {HORN_CATALOG,findHorn,equippedHorn,ownedHorns,normalizeTruckHorn,hornOffer,buyOrEquipHorn,renderHornShop} from '../src/horn-shop.mjs';
import {freshSave,loadSave,purchase} from '../src/core.mjs';
import {commitGarageMutation} from '../src/garage-transaction.mjs';
import {HornPlayer} from '../src/horn-player.mjs';
test('catálogo inclui a buzina original, estilos variados e duas falas cômicas',()=>{
 assert.ok(HORN_CATALOG.length>=9);
 assert.equal(new Set(HORN_CATALOG.map(h=>h.id)).size,HORN_CATALOG.length);
 assert.equal(HORN_CATALOG[0].price,0);
 assert.ok(HORN_CATALOG.slice(1).every(h=>h.price>0));
 assert.equal(findHorn('arreda').phrase,'Arreda aí!');
 assert.equal(findHorn('doidao').phrase,'Sai da frente, doidão!');
 assert.equal(findHorn('inexistente'),null);
});
test('compra individual cobra uma vez, permite reequipar gratuitamente e mantém o caminhão selecionado',()=>{
 const s=freshSave();s.money=10000;s.deliveries=10;purchase(s,'estradeiro');
 s.selected='aurora';const initial=s.money;
 assert.equal(buyOrEquipHorn(s,'estradeiro','air'),true);
 assert.equal(s.money,initial-450);
 assert.equal(equippedHorn(s.fleet.estradeiro),'air');
 assert.equal(equippedHorn(s.fleet.aurora),'factory');
 assert.equal(buyOrEquipHorn(s,'estradeiro','air'),false);
 assert.equal(s.money,initial-450);
 assert.equal(buyOrEquipHorn(s,'estradeiro','factory'),true);
 assert.equal(buyOrEquipHorn(s,'estradeiro','air'),true);
 assert.equal(s.money,initial-450);
 const restored=loadSave(JSON.stringify(s));
 assert.equal(equippedHorn(restored.fleet.estradeiro),'air');
 assert.deepEqual(ownedHorns(restored.fleet.estradeiro),['factory','air']);
 assert.equal(restored.selected,'aurora');
});
test('falta de saldo e caminhão não adquirido não gastam créditos nem alteram dados',()=>{
 const s=freshSave(),before=JSON.stringify(s);
 assert.equal(buyOrEquipHorn(s,'falcao','air'),false);
 assert.equal(buyOrEquipHorn(s,'aurora','chegando'),false);
 assert.equal(buyOrEquipHorn(s,'aurora','unknown'),false);
 assert.equal(JSON.stringify(s),before);
 assert.equal(hornOffer(s,'aurora','factory').equipped,true);
});
test('save antigo é atualizado, sem aceitar identificadores inválidos',()=>{
 const old=freshSave();delete old.fleet.aurora.horn;delete old.fleet.aurora.hornsOwned;
 const parsed=loadSave(JSON.stringify(old));assert.equal(equippedHorn(parsed.fleet.aurora),'factory');
 const truck={horn:'unknown',hornsOwned:['factory','unknown','air','air']};
 normalizeTruckHorn(truck);assert.equal(truck.horn,'factory');assert.deepEqual(truck.hornsOwned,['factory','air']);
});
test('transação atomicamente revertida quando persistência falha',()=>{
 const s=freshSave();s.money=8000;const before=JSON.stringify(s);
 const res=commitGarageMutation(s,draft=>buyOrEquipHorn(draft,'aurora','arreda'),{setItem(){throw Error('quota')}});
 assert.equal(res.ok,false);assert.equal(JSON.stringify(s),before);
});
test('UI de buzinas tem ouvir e botão de compra e não bloqueia prévia',()=>{
 const s=freshSave();
 const html=renderHornShop(s,'aurora',n=>'CR$ '+n);
 assert.equal((html.match(/data-horn-preview=/g)||[]).length,HORN_CATALOG.length);
 assert.equal((html.match(/data-horn-buy=/g)||[]).length,HORN_CATALOG.length);
 assert.match(html,/LOJINHA DE BUZINAS/);
 assert.match(html,/▶ OUVIR/);
 assert.match(html,/EQUIPADA/);
 assert.match(html,/voz em português/);
});
test('buzina original continua gravada; alternativas não exigem internet',()=>{
 let factory=0,calls=0,utterances=[];
 const speech={cancel(){},speak(u){utterances.push(u)},getVoices:()=>[{lang:'pt-BR'}]};
 class Utterance{constructor(s){this.text=s;}}
 const player=new HornPlayer({getContext:()=>null,playFactory:()=>factory++,getVolume:()=>.6,
  getSpeech:()=>speech,getUtterance:()=>Utterance});
 assert.equal(player.play('factory').kind,'factory');assert.equal(factory,1);
 const voice=player.play('arreda');
 assert.equal(voice.voiced,true);assert.equal(utterances[0].text,'Arreda aí!');
 assert.equal(utterances[0].lang,'pt-BR');
 player.play('air');assert.equal(factory,2); // sem Web Audio, modo reserva
});
