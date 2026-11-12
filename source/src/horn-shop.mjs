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
 {id:'chegando',name:'Olha o caminhão!',category:'Voz divertida',price:3800,kind:'voice',phrase:'Olha o caminhão chegando!',description:'Aviso engraçado de caminhão grandão.'},
 {id:'train',name:'Corneta de locomotiva',category:'Estrada',price:4300,kind:'train',description:'Um sopro grave e demorado, estilo trem cargueiro.'},
 {id:'triple',name:'Três canos da serra',category:'Estrada',price:4900,kind:'triple',description:'Três ataques potentes de corneta de estrada.'},
 {id:'country',name:'Festa na boleia',category:'Musical',price:5500,kind:'country',description:'Quatro notas cômicas e originais de buzina.'}
]);
const IDS=new Set(HORN_CATALOG.map(h=>h.id));
export const HORN_FILTERS=Object.freeze([{id:'all',label:'TODAS'},{id:'road',label:'ESTRADA'},{id:'fun',label:'DIVERTIDAS'},{id:'voice',label:'FALAS'}]);
export function matchesHornFilter(horn,filter='all'){
 return filter==='all'||(filter==='road'&&['factory','air','double','ship','train','triple'].includes(horn.id))
  ||(filter==='fun'&&['retro','festival','country'].includes(horn.id))
  ||(filter==='voice'&&horn.kind==='voice');
}

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
export function renderHornShop(save,truckId,money,filter='all'){
 const truck=save?.fleet?.[truckId],selected=equippedHorn(truck);
 const activeFilter=HORN_FILTERS.some(f=>f.id===filter)?filter:'all';
 const visible=HORN_CATALOG.filter(h=>matchesHornFilter(h,activeFilter));
 return '<section class="horn-shop" aria-label="Loja de buzinas">'+
  '<h3>LOJINHA DE BUZINAS</h3><p class="workshop-note">Cornetas de estrada, toques musicais e falas engraçadas. Ouça antes de comprar. As compras ficam salvas neste caminhão.</p>'+
  '<p class="horn-voice-note">As falas usam a voz em português disponível no dispositivo; se não houver, toca uma buzina de reserva. Os demais sons funcionam sem internet.</p>'+
  '<div class="horn-preview-tools"><label for="hornPreviewVolume">VOLUME DO TESTE <output id="hornVolumeLabel" for="hornPreviewVolume">85%</output></label>'+
  '<input id="hornPreviewVolume" type="range" min="0" max="100" step="5" value="85" aria-label="Volume da prévia da buzina">'+
  '<button id="stopHornPreview" type="button">■ PARAR SOM</button></div>'+
  '<div class="horn-filters" role="group" aria-label="Filtrar tipos de buzina">'+
  HORN_FILTERS.map(f=>'<button type="button" data-horn-filter="'+f.id+'" aria-pressed="'+(f.id===activeFilter)+'">'+f.label+'</button>').join('')+'</div>'+
  '<p class="horn-filter-summary">'+visible.length+' modelo'+(visible.length===1?'':'s')+' · '+(truck?'Equipamento do seu caminhão':'Prévia gratuita')+'</p>'+
  '<div class="horn-shop-grid">'+visible.map(h=>{
   const offer=hornOffer(save,truckId,h.id),owned=offer.owned;
   const state=!truck?'CAMINHÃO NÃO ADQUIRIDO':offer.equipped?'EQUIPADA':owned?'ADQUIRIDA':'À VENDA';
   const label=!truck?'COMPRE O CAMINHÃO':offer.equipped?'EM USO':owned?'EQUIPAR':offer.reason?'SALDO INSUFICIENTE':'COMPRAR E EQUIPAR';
   return '<article class="horn-shop-card '+(h.id===selected?'selected':'')+'" data-horn-id="'+h.id+'">'+
    '<div class="horn-card-title"><strong>'+h.name+'</strong><span>'+h.category+'</span></div>'+
    '<p>'+h.description+'</p><div class="horn-card-footer"><b>'+(owned?'JÁ ADQUIRIDA':money(h.price))+'</b><small>'+state+'</small></div>'+
    '<div class="horn-actions"><button type="button" data-horn-preview="'+h.id+'" aria-label="Ouvir '+h.name+'">▶ OUVIR</button>'+
    '<button type="button" data-horn-buy="'+h.id+'" '+(!truck||offer.equipped||!!offer.reason?'disabled':'')+'>'+label+'</button></div></article>';
  }).join('')+'</div><p id="hornShopStatus" class="workshop-note" role="status" aria-live="polite">Teste o som sem gastar créditos. Use H na estrada, A no controle ou BUZINA no celular.</p></section>';
}
