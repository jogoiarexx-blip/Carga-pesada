import {poseOf} from './motion.mjs';
import {entryCheck,rivalProfile} from './progression.mjs';
import {driveStep,clamp,sweptOverlap,trafficSpeed,crossingFraction,settlement,completeContract} from './core.mjs';
import {VEHICLES,configuredVehicle} from './fleet.mjs';
import {routeFor,roadCurvature,roadSlope} from './routes.mjs';
import {createBossTraffic,planRivalTraffic,BOSS_CAR_LENGTH} from './boss-traffic.mjs';
export const FIXED_STEP=1/60;
export function createSession(contract,vehicle,parts){
 vehicle=configuredVehicle(vehicle,parts.body);
 const run={s:0,x:-3.4,speed:0,lateral:0,steering:0,elapsed:0,cargo:100,health:parts.health,initialHealth:parts.health,fuel:100,slip:0,boost:0,boostCooldown:0,trailerYaw:0};
 const traffic=contract.race?createBossTraffic(contract):Array.from({length:16},(_,i)=>({s:125+i*170,speed:i%3===0?-13:10+i%4*1.2,cruise:i%3===0?13:10+i%4*1.2,direction:i%3===0?-1:1,x:i%3===0?3.4:-3.4,cooldown:0}));
 return {contract,vehicle,parts:{...parts},run,traffic,rival:contract.race?{s:0,speed:0,x:3.4,length:VEHICLES.find(v=>v.id===rivalProfile(contract).vehicleId).length,laneTarget:3.4,hitCooldown:0,hits:0}:null,status:entryCheck(contract,vehicle,parts).ok?'running':'failed',reason:entryCheck(contract,vehicle,parts).reason||null,events:[],hitCooldown:0,accumulator:0,hits:0,boosts:0,result:null};
}
function failure(run,contract){
 if(run.health<=0)return 'O caminhão precisa de reparos. Seu Nilo mandou o resgate.';
 if(run.fuel<=0)return 'O combustível acabou. Seu Nilo vai ajudar no resgate.';
 if(run.cargo<contract.min)return 'A carga ficou abaixo da integridade mínima do contrato.';
 return null;
}
function end(session,success,reason=null){session.status=success?'success':'failed';session.reason=reason;session.events.push({type:'finish',success,reason});}
export function stepSession(session,input,dt=FIXED_STEP){
 if(session.status!=='running'||dt<=0)return;
 const {contract,vehicle,parts,run,traffic,rival}=session,route=routeFor(contract);
 const previous={s:run.s,x:run.x},rivalPrevious=rival?{s:rival.s,x:rival.x}:null;
 // Respect the exact deadline; crossing at the deadline still counts.
 const step=Math.min(dt,Math.max(0,contract.time-run.elapsed));
 if(step<=1e-9){end(session,false,'O prazo do contrato terminou. Prepare-se para uma nova tentativa.');return;}
 driveStep(run,input,vehicle,parts,contract,step);
 if(vehicle.category==='tractor'){const target=clamp(Math.atan(roadSlope(run.s,route))-Math.atan(roadSlope(run.s-8,route))+(run.steering||0),-.45,.45);run.trailerYaw+=(target-run.trailerYaw)*(1-Math.exp(-step*Math.max(.5,Math.abs(run.speed)/7)));}
 session.hitCooldown=Math.max(0,session.hitCooldown-step);
 if(run.boost>0)run.boost=Math.max(0,run.boost-step);
 const snapshot=traffic.map(car=>({...car}));
 const carPrevious=traffic.map(car=>({s:car.s,x:car.x}));
 for(let i=0;i<traffic.length;i++){
  const car=traffic[i],before={s:car.s,x:car.x};car.speed+=clamp(trafficSpeed(snapshot[i],snapshot,route)-car.speed,-4*step,1.8*step);car.s+=car.speed*step;car.cooldown=Math.max(0,car.cooldown-step);
  let recycled=false;if(car.s<run.s-100){car.s=run.s+700+i*65;recycled=true;}
  if(!recycled&&car.cooldown===0&&session.hitCooldown===0&&sweptOverlap(previous,run,before,car,(vehicle.length+BOSS_CAR_LENGTH)/2,2.05)){
   const severity=clamp(Math.abs(run.speed-car.speed)/3,2,14);run.speed*=contract.race?.58:.34;run.health=Math.max(0,run.health-severity);run.cargo=Math.max(0,run.cargo-severity*contract.fragile);car.cooldown=3;session.hitCooldown=1.5;session.hits++;session.events.push({type:contract.race?'boss-traffic-player':'collision'});
  }
 }
 if(rival){
  const curve=Math.abs(roadCurvature(rival.s+35,route)),profile=rivalProfile(contract),baseTarget=Math.min(profile.max/3.6,Math.sqrt(profile.grip/Math.max(.0001,curve)));
  rival.hitCooldown=Math.max(0,(rival.hitCooldown||0)-step);
  for(const car of traffic)car.rivalCooldown=Math.max(0,(car.rivalCooldown||0)-step);
  const plan=planRivalTraffic(rival,run,traffic,baseTarget);
  rival.laneTarget=plan.desired;
  rival.x+=clamp(rival.laneTarget-rival.x,-3.8*step,3.8*step);
  rival.speed+=clamp(plan.targetSpeed-rival.speed,-4*step,profile.accel*step);rival.s+=rival.speed*step;
  for(let i=0;i<traffic.length;i++){
   const car=traffic[i];
   if(rival.hitCooldown>0||car.rivalCooldown>0)continue;
   if(sweptOverlap(rivalPrevious,rival,carPrevious[i],car,(rival.length+BOSS_CAR_LENGTH)/2,2.05)){
    const severity=clamp(Math.abs(rival.speed-car.speed)/3,2,14);
    rival.speed=Math.max(0,rival.speed*.54);rival.hitCooldown=1.7;car.rivalCooldown=2.5;rival.hits++;
    session.events.push({type:'boss-traffic-rival',severity,carId:car.id});
   }
  }
  if(session.hitCooldown===0&&sweptOverlap(previous,run,rivalPrevious,rival,(vehicle.length+rival.length)/2,2.3)){
   run.speed*=.55;rival.speed*=.72;run.health=Math.max(0,run.health-5);session.hitCooldown=2;session.hits++;session.events.push({type:'collision'});
  }
  const gap=rival.s-run.s;run.boostCooldown=Math.max(0,run.boostCooldown-step);
  if(gap>12&&gap<40&&Math.abs(run.x-rival.x)<1.8&&run.boostCooldown<=0)run.slip+=step;else run.slip=Math.max(0,run.slip-step);
  if(run.slip>=2){run.boost=3;run.boostCooldown=12;run.slip=0;session.boosts++;session.events.push({type:'boost'});}
 }
 // Resolve damage after every collision, including the final frame.
 const reason=failure(run,contract);if(reason){end(session,false,reason);return;}
 const crossed=crossingFraction(previous,run,contract.length);
 if(rival){const rivalCrossed=crossingFraction(rivalPrevious,rival,contract.length);if(Number.isFinite(crossed)&&crossed<=rivalCrossed){run.won=true;end(session,true);return;}if(Number.isFinite(rivalCrossed)){run.won=false;end(session,false,(contract.rival||'Coiote')+' cruzou a linha primeiro. Treine as curvas e tente a revanche.');return;}}
 else if(Number.isFinite(crossed)){end(session,true);return;}
 if(run.s>contract.length+45){end(session,false,'Você passou ao lado da entrega. Cruze o portal verde por dentro da pista.');return;}
 if(run.elapsed>=contract.time-1e-9)end(session,false,'O prazo do contrato terminou. Prepare-se para uma nova tentativa.');
}
export function advanceSession(session,input,seconds){
 session.events=[];if(session.status!=='running')return;
 session.accumulator+=Math.max(0,seconds);
 while(session.accumulator+1e-9>=FIXED_STEP&&session.status==='running'){
  session.previousPose=poseOf(session.run);session.previousRival=session.rival?poseOf(session.rival):null;
  stepSession(session,typeof input==='function'?input(session):input,FIXED_STEP);session.accumulator=Math.max(0,session.accumulator-FIXED_STEP);
 }
}
export function resolveSession(session,save){
 if(session.status==='running')return null;if(session.result)return session.result;
 const {run,contract}=session,stats={cargo:run.cargo,fuelUsed:100-run.fuel,healthLost:run.initialHealth-run.health,elapsed:run.elapsed,won:run.won===true};
 const result=session.status==='success'?completeContract(save,contract,stats):{...settlement(contract,stats),success:false,net:0,bonus:0,first:false,next:null};
 save.fleet[session.vehicle.id].health=result.success?run.initialHealth:Math.max(15,run.health);
 session.result=result;return result;
}
