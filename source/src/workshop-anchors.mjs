import {configuredVehicle,vehicleLayout} from './fleet.mjs';
// Posições por modelo e carroceria, em coordenadas locais do caminhão.
export const WORKSHOP_SERVICES=Object.freeze(['repair','engine','brakes','body','paint','parts']);
export function workshopServiceAnchor(vehicle,type,side=1){
 if(!vehicle||!WORKSHOP_SERVICES.includes(type))return null;
 const v=configuredVehicle(vehicle,vehicle.body),layout=vehicleLayout(v);
 const hood=['classic','aero'].includes(v.cab),front=layout.front;
 const cabEnd=v.category==='tractor'?layout.tractorRear:layout.bodyStart;
 const cabZ=front+(hood?2.4:1.2),bodyZ=layout.bodyStart+layout.bodyLength*.45;
 const points={
  repair:{x:-1.95,y:1.8,z:front+Math.min(3.15,(cabEnd-front)*.7)},
  engine:{x:-1.9,y:hood?1.9:2.2,z:front+(hood?2.05:.9)},
  brakes:{x:-1.78,y:.75,z:layout.frontAxle},
  body:{x:-1.85,y:2.35,z:bodyZ},
  paint:{x:-1.95,y:2.45,z:cabZ},
  parts:{x:-1.92,y:2.5,z:front+(hood?3:1.55)}
 };
 const direction=side<0?-1:1;
 return {...points[type],x:Math.abs(points[type].x)*direction,side:direction,z:Math.max(front+.45,Math.min(layout.rear-.35,points[type].z)),type};
}
