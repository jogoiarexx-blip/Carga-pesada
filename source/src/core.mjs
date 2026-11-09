import {freightMedal,normalizeMedals} from './achievements.mjs';
import {freightTimeBonus} from './progression.mjs';
import {EXTRA_CONTRACTS} from './story-expansion.mjs';
import {installUpgrade} from './workshop.mjs';
import {normalizeCampaign,missionUnlocked,recordMission} from './campaign.mjs';
import {roadCurvature,routeFor} from './routes.mjs';
import {VEHICLES,configuredVehicle,purchaseUnlocked} from './fleet.mjs';
export {VEHICLES} from './fleet.mjs';
export const CONTRACTS = [
 {id:'m01',roadId:'ipes',tag:'01 · FRETE DE RECOMEÇO',name:'A Aurora Desperta',route:'Porto Salgueiro → Vila dos Ipês',description:'Ferramentas para a cooperativa. Um frete curto para reencontrar o caminho.',length:1800,time:180,weight:1.2,pay:1500,min:30,fragile:1,toll:0},
 {id:'m02',roadId:'porto',tag:'02 · PRIMEIRO CONTRATO',name:'O Primeiro Frete',route:'Porto Salgueiro → Armazém 17',description:'Peças de reposição para o porto. O primeiro contrato da Oficina Farol.',length:2400,time:210,weight:1.8,pay:1800,min:45,fragile:1.2,toll:0},
 {id:'m03',roadId:'vale',tag:'03 · CUIDADO COM A CARGA',name:'Não Arranhe a Pintura',route:'Porto Salgueiro → Vale do Rio Grande',description:'Cerâmicas artesanais. Freie antes das curvas e preserve a carga.',length:3200,time:250,weight:2.5,pay:2500,min:65,fragile:1.8,toll:60},
 {id:'m04',roadId:'circuito',tag:'04 · PROVA AUTORIZADA',name:'Coiote na Pista',route:'Circuito fechado · Estrada dos Ipês',description:'Rafa Coiote espera na largada. Dispute posição em um trecho fechado.',length:2800,time:220,weight:0,pay:2200,min:0,fragile:0,toll:0,race:true}
];
CONTRACTS.forEach((c,i)=>{c.chapter=0;c.night=i===1;});CONTRACTS.push(...EXTRA_CONTRACTS);for(const c of CONTRACTS){if(c.chapter>0&&!c.race){c.time=Math.ceil(c.length/(c.chapter>=4?16:14)+35);c.weight=c.chapter===1?2.5:c.chapter===2?4.5:c.chapter===3?9:c.chapter===4?14:16;c.min=Math.max(c.min,55);}}
export function freshSave(){return {version:1,money:1200,deliveries:0,wins:0,reputation:0,selected:'aurora',fleet:{aurora:{health:100,engine:0,brakes:0,color:VEHICLES[0].color,body:VEHICLES[0].defaultBody}},best:{},medals:{},campaign:{version:1,completed:[],bonusesClaimed:[],legacyAvailable:[]}};}
export function loadSave(raw){try {const s=JSON.parse(raw);if(s.version!==1||!Number.isFinite(s.money)||s.money<0||!s.fleet?.aurora) return freshSave();for(const [id,t] of Object.entries(s.fleet)){if(!VEHICLES.some(v=>v.id===id))delete s.fleet[id];else{t.health=clamp(Number(t.health)||1,1,100);t.engine=clamp(Number(t.engine)||0,0,2);t.brakes=clamp(Number(t.brakes)||0,0,2);t.body=configuredVehicle(VEHICLES.find(v=>v.id===id),t.body).body;if(!/^#[0-9a-f]{6}$/i.test(t.color))t.color=VEHICLES.find(v=>v.id===id).color;}}if(!s.fleet[s.selected])s.selected='aurora';return {...freshSave(),...s,deliveries:Math.max(0,Number(s.deliveries)||0),wins:Math.max(0,Number(s.wins)||0),best:s.best||{},campaign:normalizeCampaign(s),medals:normalizeMedals(s.medals,normalizeCampaign(s).completed)};}catch{return freshSave();}}
export function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
export function isUnlocked(c,s){return missionUnlocked(c.id,s);}
export function settlement(c,{cargo,fuelUsed,healthLost,elapsed,won}){const success=cargo>=c.min&&elapsed<=c.time&&(!c.race||won);const gross=success?Math.round(c.pay*(c.race?1:clamp(cargo/100,.4,1))):0;const timeBonus=success?freightTimeBonus(c,{cargo,healthLost,elapsed}):0;const fuel=Math.ceil(fuelUsed*8);const repairs=Math.ceil(healthLost*8);return {success,gross,timeBonus,fuel,repairs,toll:c.toll,net:success?Math.max(0,gross+timeBonus-fuel-repairs-c.toll):0};}
export function purchase(s,id){const v=VEHICLES.find(v=>v.id===id);if(!v||s.fleet[id]||s.money<v.price||!purchaseUnlocked(v,s))return false;s.money-=v.price;s.fleet[id]={health:100,engine:0,brakes:0,color:v.color,body:v.defaultBody};s.selected=id;return true;}
export function upgrade(s,type){return installUpgrade(s,s.selected,type);}
export function driveStep(state,input,vehicle,parts,contract,dt){
 const boosted=contract.race&&state.boost>0;
 const top=(vehicle.max+parts.engine*12+(boosted?15:0))/3.6,load=1-contract.weight/(vehicle.capacity*5);
 const acceleration=vehicle.accel*load*(1+parts.engine*.14),massFactor=1+contract.weight/vehicle.capacity*.3;
 const braking=vehicle.brake*(1+parts.brakes*.25)/massFactor;
 if(input.gas)state.speed+=(acceleration+(boosted?4:0))*dt;
 if(input.brake)state.speed=state.speed>0?Math.max(0,state.speed-braking*dt):state.speed-1.8*dt;
 if(input.hard)state.speed-=Math.sign(state.speed)*Math.min(Math.abs(state.speed),braking*1.7*dt);
 if(!input.gas&&!input.brake)state.speed*=Math.exp(-.12*dt);
 state.speed=clamp(state.speed,-3.5,top);
 const steer=clamp(input.steer||0,-1,1),response=vehicle.category==='tractor'?2.8:vehicle.id==='estradeiro'?3.4:4.3;
 const target=steer*.22/(1+Math.abs(state.speed)/18)*(vehicle.category==='tractor'?.82:1);
 state.steering=(state.steering||0)+(target-(state.steering||0))*(1-Math.exp(-dt*response));
 const curve=roadCurvature(state.s,routeFor(contract));
 const drift=-curve*state.speed*state.speed*.4*massFactor;
 const lateralTarget=Math.sin(state.steering)*state.speed+drift;
 state.lateral+=(lateralTarget-state.lateral)*(1-Math.exp(-dt*3.5));
 state.x=clamp(state.x+state.lateral*dt,-12,12);
 const turnForce=Math.abs(curve*state.speed*state.speed)+Math.abs(state.steering*state.speed*.45);
 state.stability=clamp(100-turnForce*17*massFactor,0,100);
 if(turnForce>3.4&&Math.abs(state.speed)>10){state.speed*=Math.exp(-.1*dt);state.cargo=clamp(state.cargo-(turnForce-3.4)*contract.fragile*dt*.3,0,100);}
 if(Math.abs(state.x)>7.5){state.speed*=Math.exp(-.8*dt);if(Math.abs(state.speed)>5){state.cargo=clamp(state.cargo-dt*contract.fragile*.7,0,100);state.health=clamp(state.health-dt*.2,0,100);}}
 state.s=Math.max(0,state.s+state.speed*dt);state.fuel=Math.max(0,state.fuel-dt*(.013+Math.abs(state.speed)*.001));state.elapsed+=dt;
}
// Sweep the relative motion through a rectangle: no tunnelling between frames.
export function sweptOverlap(a0,a1,b0,b1,halfLength,halfWidth){
 let enter=0,leave=1;
 for(const [axis,extent] of [['s',halfLength],['x',halfWidth]]){
  const start=a0[axis]-b0[axis],delta=(a1[axis]-a0[axis])-(b1[axis]-b0[axis]);
  if(Math.abs(delta)<1e-9){if(Math.abs(start)>extent)return false;continue;}
  let t0=(-extent-start)/delta,t1=(extent-start)/delta;if(t0>t1)[t0,t1]=[t1,t0];
  enter=Math.max(enter,t0);leave=Math.min(leave,t1);if(enter>leave)return false;
 }
 return enter<=leave;
}
export function trafficSpeed(car,peers,route){
 const curvature=Math.abs(roadCurvature(car.s+35,route));
 let target=Math.min(car.cruise,Math.sqrt(1.8/Math.max(curvature,.0001)));
 if(car.direction<0)return -target;
 for(const other of peers){if(other===car||other.direction<0||Math.abs(other.x-car.x)>2)continue;const gap=other.s-car.s;if(gap>0&&gap<12+car.speed*1.6)target=Math.min(target,Math.max(0,other.speed+(gap-12-car.speed*1.6)*.4));}
 return target;
}
export function crossingFraction(previous,current,finish){
 if(previous.s>=finish||current.s<finish||current.s<=previous.s)return Infinity;
 const fraction=(finish-previous.s)/(current.s-previous.s),x=previous.x+(current.x-previous.x)*fraction;
 return Math.abs(x)<=6.2?fraction:Infinity;
}

export function completeContract(save,contract,stats){
 const result=settlement(contract,stats);
 if(!result.success||!isUnlocked(contract,save))return {...result,success:false,net:0,bonus:0,first:false,next:null};
 const progress=recordMission(save,contract.id);
 save.money+=result.net+progress.bonus;if(contract.race)save.wins++;else save.deliveries++;
 save.reputation=Math.min(100,save.reputation+5);
 const newBest=!save.best[contract.id]||stats.elapsed<save.best[contract.id],medal=freightMedal(contract,stats);save.medals=normalizeMedals(save.medals,save.campaign.completed);if(medal)save.medals[contract.id]=Math.max(save.medals[contract.id]||0,medal);
 if(newBest)save.best[contract.id]=stats.elapsed;
 return {...result,...progress,medal,newBest};
}
