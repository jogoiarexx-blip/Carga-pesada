import {createSession,advanceSession} from '../../src/session.mjs';
import {VEHICLES} from '../../src/core.mjs';
import {requirementsFor} from '../../src/progression.mjs';
import {curveAdvice,routeFor,roadCurvature} from '../../src/routes.mjs';
const parts={health:100,engine:0,brakes:0};
function driver(session){const {run,contract}=session,advice=curveAdvice(run.s,run.speed,routeFor(contract));const raceSafe=Math.sqrt(1.7/Math.max(.0001,Math.abs(roadCurvature(run.s+30,routeFor(contract))),Math.abs(roadCurvature(run.s+60,routeFor(contract)))))*3.6;const limit=Math.min(contract.race?session.vehicle.max+session.parts.engine*12-1:76,contract.race?raceSafe:advice.safe-8)/3.6;return {gas:run.speed<limit,brake:run.speed>limit+.5,steer:Math.max(-1,Math.min(1,(-.85-run.x)*.8-run.lateral*.3))};}
export function replay(contract,vehicle,truckParts,hz=30){const r=requirementsFor(contract);vehicle=vehicle||VEHICLES.find(v=>v.capacity>=r.capacity&&v.max+r.engine*12>=(r.speed||0))||VEHICLES.at(-1);truckParts=truckParts||{health:100,engine:r.engine,brakes:r.brakes};const s=createSession(contract,vehicle,truckParts);for(let i=0;i<hz*(contract.time+2)&&s.status==='running';i++)advanceSession(s,driver,1/hz);return s;}
