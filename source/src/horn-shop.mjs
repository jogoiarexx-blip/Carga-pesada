// Buzinas exclusivas de cada caminhão. Compra permanente; equipar uma já comprada é grátis.
export const HORN_CATALOG=Object.freeze([
 {id:'factory',name:'Buzina original',category:'Clássica',price:0,kind:'factory',description:'Som de fábrica, já instalado.'},
 {id:'air',name:'Corneta pneumática',category:'Estrada',price:450,kind:'air',description:'Toque longo e poderoso.'},
 {id:'double',name:'Dupla de estrada',category:'Estrada',price:850,kind:'double',description:'Duas cornetas tocando juntas.'},
 {id:'retro',name:'Fom-fom retrô',category:'Retrô',price:1200,kind:'retro',description:'Dois toques curtos e engraçados.'},
 {id:'ship',name:'Buzina de navio',category:'Especial',price:1800,kind:'ship',description:'Grave e imponente.'},
 {id:'festival',name:'Festa do asfalto',category:'Musical',price:2400,kind:'festival',description:'Sequência musical original de quatro notas.'},
 {id:'arreda',name:'Arreda aí!',category:'Voz divertida',price:2800,kind:'voice',phrase:'Arreda aí!',description:'Uma chamada bem-humorada na estrada.'},
 {id:'doidao',name:'Sai da frente, doidão!',category:'Voz divertida',price:3200,kind:'voice',phrase:'Sai da frente, doidão!',description:'Brincadeira de caminhoneiro.'},
 {id:'chegando',name:'Olha o caminhão!',category:'Voz divertida',price:3800,kind:'voice',phrase:'Olha o caminhão chegando!',description:'Aviso engraçado de caminhão grandão.'}
]);
const IDS=new Set(HORN_CATALOG.map(h=>h.id));
export function findHorn(id){return HORN_CATALOG.find(h=>h.id===id)||null;}
export function ownedHorns(truck){
 const raw=Array.isArray(truck?.hornsOwned)?truck.hornsOwned:[];
 return ['factory',...new Set(raw.filter(id=>typeof id==='string'&&IDS.has(id)&&id!=='factory'))];
}
export function equippedHorn(truck){
 return IDS.has(truck?.horn)&&ownedHorns(truck).includes(truck.horn)?truck.horn:'factory';
}
export function normalizeTruckHorn(truck){
 truck.hornsOwned=ownedHorns(truck);
 truck.horn=equippedHorn(truck);
 return truck;
}
export function hornOffer(save,truckId,hornId){
 const item=findHorn(hornId),truck=save?.fleet?.[truckId]||null;
 if(!item)return {valid:false,price:0,owned:false,equipped:false,reason:'Buzina desconhecida.'};
 if(!truck)return {valid:false,price:item.price,owned:false,equipped:false,reason:'Compre este caminhão para instalar a buzina.'};
 const owned=ownedHorns(truck).includes(item.id),price=owned?0:item.price;
 return {valid:true,item,price,owned,equipped:equippedHorn(truck)===item.id,
  reason:save.money<price?'Créditos insuficientes.':''};
}
export function buyOrEquipHorn(save,truckId,hornId){
 const q=hornOffer(save,truckId,hornId);
 if(!q.valid||q.reason||q.equipped||!Number.isFinite(save.money))return false;
 const truck=save.fleet[truckId];
 save.money-=q.price;
 truck.hornsOwned=ownedHorns(truck);
 if(!truck.hornsOwned.includes(hornId))truck.hornsOwned.push(hornId);
 truck.horn=hornId;
 return true;
}
export function renderHornShop(save,truckId,money){
 const truck=save?.fleet?.[truckId],selected=equippedHorn(truck);
 return '<section class="horn-shop" aria-label="Loja de buzinas">'+
  '<h3>LOJINHA DE BUZINAS</h3><p class="workshop-note">Ouça antes de comprar. Cada buzina fica salva neste caminhão. Sem bônus de velocidade ou potência.</p>'+
  '<p class="horn-voice-note">As falas usam a voz em português disponível no dispositivo; se ela não estiver disponível, toca uma buzina de reserva.</p>'+
  '<div class="horn-shop-grid">'+HORN_CATALOG.map(h=>{
   const offer=hornOffer(save,truckId,h.id),owned=offer.owned;
   const state=!truck?'CAMINHÃO NÃO ADQUIRIDO':offer.equipped?'EQUIPADA':owned?'ADQUIRIDA':'À VENDA';
   const label=!truck?'COMPRE O CAMINHÃO':offer.equipped?'EM USO':owned?'EQUIPAR':offer.reason?'SALDO INSUFICIENTE':'COMPRAR E EQUIPAR';
   return '<article class="horn-shop-card '+(h.id===selected?'selected':'')+'">'+
    '<div class="horn-card-title"><strong>'+h.name+'</strong><span>'+h.category+'</span></div>'+
    '<p>'+h.description+'</p><div class="horn-card-footer"><b>'+(owned?'JÁ ADQUIRIDA':money(h.price))+'</b><small>'+state+'</small></div>'+
    '<div class="horn-actions"><button type="button" data-horn-preview="'+h.id+'" aria-label="Ouvir '+h.name+'">▶ OUVIR</button>'+
    '<button type="button" data-horn-buy="'+h.id+'" '+(!truck||offer.equipped||!!offer.reason?'disabled':'')+'>'+label+'</button></div></article>';
  }).join('')+'</div><p id="hornShopStatus" class="workshop-note" role="status">H na estrada ou botão BUZINA no celular: toca o som equipado.</p></section>';
}
