// Catálogo de motores independente da cabine e do renderer.
// A oficina instala os estágios na ordem; os preços dobram a cada evolução.
export const ENGINE_MAX_LEVEL=6;
export const ENGINE_SPEED_GAIN=12;
export const ENGINE_ACCEL_GAIN=.14;
export const ENGINE_SERIES=Object.freeze({
 aurora:Object.freeze({name:'A90 Diesel',basePrice:2000}),
 estradeiro:Object.freeze({name:'E120 Estradeiro',basePrice:3000}),
 rochedo:Object.freeze({name:'R160 Rochedo',basePrice:4000}),
 peregrino:Object.freeze({name:'Peregrino Classic',basePrice:5000}),
 falcao:Object.freeze({name:'Falcão Aero',basePrice:6000}),
 imperador:Object.freeze({name:'Imperador Frontal',basePrice:5500})
});
export const ENGINE_STAGES=Object.freeze([
 'Original de fábrica','Diesel reforçado','Turbo de estrada','Turbo intercooler',
 'Biturbo de alto torque','Diesel de competição','Série Farol extrema'
]);
export function engineUpgradePrice(vehicleId,level){
 if(!ENGINE_SERIES[vehicleId]||!Number.isInteger(level)||level<1||level>ENGINE_MAX_LEVEL)return null;
 return ENGINE_SERIES[vehicleId].basePrice*2**(level-1);
}
export function engineStages(vehicleId){
 const series=ENGINE_SERIES[vehicleId];
 if(!series)return [];
 return Array.from({length:ENGINE_MAX_LEVEL},(_,i)=>{
  const level=i+1;
  return {level,name:series.name+' · '+ENGINE_STAGES[level],price:engineUpgradePrice(vehicleId,level)};
 });
}
export function engineTopSpeed(vehicle,level=0){
 return vehicle.max+ENGINE_SPEED_GAIN*Math.max(0,Math.min(ENGINE_MAX_LEVEL,Number(level)||0));
}
export function engineAccelerationMultiplier(level=0){
 return 1+ENGINE_ACCEL_GAIN*Math.max(0,Math.min(ENGINE_MAX_LEVEL,Number(level)||0));
}
