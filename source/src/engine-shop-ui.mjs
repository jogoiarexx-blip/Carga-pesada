import {ENGINE_MAX_LEVEL,engineStages,engineTopSpeed,engineAccelerationMultiplier} from './engine-tuning.mjs';

// Só o próximo estágio é comprável; os demais permanecem visíveis para planejamento.
export function renderEngineCatalog(vehicle,truck,balance,money){
 const current=truck.engine||0;
 const rows=engineStages(vehicle.id).map(stage=>{
  const equipped=stage.level===current,passed=stage.level<current,next=stage.level===current+1;
  const ready=next&&balance>=stage.price;
  const kind=equipped?'equipped':next?'next':passed?'past':'future';
  const status=equipped?'EM USO':passed?'ETAPA CONCLUÍDA':'COMPLETE O MOTOR N'+(stage.level-1);
  const action=next?
   '<button type="button" data-service="engine" '+(ready?'':'disabled')+'>'+
    (ready?'COMPRAR MOTOR N'+stage.level:'FALTAM '+money(stage.price-balance))+
    ' · '+money(stage.price)+'</button>':
   '<span class="engine-stage-status">'+status+'</span>';
  const gain=Math.round((engineAccelerationMultiplier(stage.level)-1)*100);
  return '<article class="engine-stage '+kind+'">'+
   '<div class="engine-stage-top"><span>N'+stage.level+' · '+stage.name+'</span><b>'+money(stage.price)+'</b></div>'+
   '<small>Velocidade '+engineTopSpeed(vehicle,stage.level)+' km/h · aceleração +'+gain+'%</small>'+
   action+'</article>';
 }).join('');
 return '<section class="engine-catalog" aria-label="Motores disponíveis para este caminhão">'+
  '<div class="engine-catalog-header"><strong>CATÁLOGO DE MOTORES</strong><span>N'+current+'/'+ENGINE_MAX_LEVEL+'</span></div>'+
  '<p class="workshop-note">Cada motor custa o dobro do anterior. Melhoria sequencial, opcional para todas as fases.</p>'+
  '<div class="engine-stage-list">'+rows+'</div></section>';
}
