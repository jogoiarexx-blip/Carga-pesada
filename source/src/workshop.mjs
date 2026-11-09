import {VEHICLES,purchaseUnlocked,configuredVehicle} from './fleet.mjs';
export const PAINTS=['#d39142','#538d83','#b84c3c','#e0d6b7','#3b556b'];
export function repairCost(truck){return Math.ceil(Math.max(0,100-truck.health)*12);}
export function repairTruck(save,id){const truck=save.fleet[id];if(!truck)return false;const cost=repairCost(truck);if(!cost||save.money<cost)return false;save.money-=cost;truck.health=100;return true;}
export function upgradeCost(truck,type){if(!['engine','brakes'].includes(type)||truck[type]>=2)return null;return (type==='engine'?2000:1800)*(truck[type]+1);}
export function installUpgrade(save,id,type){const truck=save.fleet[id];if(!truck)return false;const cost=upgradeCost(truck,type);if(cost===null||save.money<cost)return false;save.money-=cost;truck[type]++;return true;}
export function repaintTruck(save,id,color){const truck=save.fleet[id];if(!truck||!PAINTS.includes(color)||truck.color===color||save.money<300)return false;save.money-=300;truck.color=color;return true;}
export function garageSelection(save,id,body){const base=VEHICLES.find(v=>v.id===id)||VEHICLES[0],truck=save.fleet[base.id],vehicle=configuredVehicle(base,body||truck?.body),equipped=base.id===save.selected,unlocked=purchaseUnlocked(base,save);
 const reason=truck?null:!unlocked?`Complete ${base.deliveries} entregas para liberar.`:save.money<base.price?`Faltam CR$ ${(base.price-save.money).toLocaleString('pt-BR')}.`:null;
 return {vehicle,truck,owned:!!truck,equipped,canBuy:!truck&&unlocked&&save.money>=base.price,reason};}
