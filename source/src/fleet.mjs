export const BODY_TYPES={
 short_box:{id:'short_box',name:'Baú curto',type:'rigid',length:4.5,height:2.3},
 long_box:{id:'long_box',name:'Baú longo',type:'rigid',length:8.7,height:2.7},
 box_trailer:{id:'box_trailer',name:'Carreta baú',type:'trailer',length:12.2,height:2.8},
 tarp_trailer:{id:'tarp_trailer',name:'Carreta com lona',type:'trailer',length:12.2,height:2.5}
};
export const VEHICLES=[
 {id:'aurora',name:'Aurora 90',capacity:3,price:0,max:92,accel:2.65,brake:5.5,length:7.3,axles:2,color:'#d39142',cab:'rigid',category:'rigid',bodyOptions:['short_box'],defaultBody:'short_box',description:'Cabine compacta, baú curto e dois eixos.',deliveries:0},
 {id:'estradeiro',name:'Estradeiro 120',capacity:5,price:12000,max:112,accel:3.0,brake:6.4,length:8.8,axles:2,color:'#548d83',cab:'rigid',category:'rigid',bodyOptions:['long_box'],defaultBody:'long_box',description:'Chassi alongado e baú fechado para fretes gerais.',deliveries:3},
 {id:'rochedo',name:'Rochedo 160',capacity:12,price:24000,max:96,accel:2.4,brake:5.8,length:11.8,axles:4,color:'#cbd0bf',cab:'frontal',category:'rigid',bodyOptions:['long_box'],defaultBody:'long_box',description:'Cabine frontal, baú longo e quatro eixos no chassi.',deliveries:5},
 {id:'peregrino',name:'Peregrino Clássico',capacity:20,price:34000,max:104,accel:2.3,brake:5.4,length:18.2,tractorLength:8.3,axles:3,color:'#275c86',cab:'classic',category:'tractor',bodyOptions:['box_trailer','tarp_trailer'],defaultBody:'box_trailer',description:'Americano clássico: capô longo, dormitório e escapamentos cromados.',deliveries:6},
 {id:'falcao',name:'Falcão Aero',capacity:22,price:44000,max:110,accel:2.6,brake:6,length:18.4,tractorLength:8,axles:3,color:'#dce0d6',cab:'aero',category:'tractor',bodyOptions:['box_trailer','tarp_trailer'],defaultBody:'box_trailer',description:'Americano moderno: capô inclinado e teto aerodinâmico alto.',deliveries:7},
 {id:'imperador',name:'Imperador Frontal',capacity:18,price:39000,max:103,accel:2.5,brake:6.1,length:15.8,tractorLength:6.8,axles:2,color:'#e4dfce',cab:'frontal',category:'tractor',bodyOptions:['box_trailer','tarp_trailer'],defaultBody:'tarp_trailer',description:'Cabine sobre o motor, grade larga e conjunto mais curto.',deliveries:6}
];
export function configuredVehicle(vehicle,bodyId){const body=vehicle.bodyOptions.includes(bodyId)?bodyId:vehicle.defaultBody;return {...vehicle,body,totalAxles:vehicle.axles+(vehicle.category==='tractor'?3:0)};}
export function vehicleLayout(vehicle){const v=configuredVehicle(vehicle,vehicle.body),front=-v.length/2,rear=v.length/2;
 if(v.category==='tractor'){const hitch=front+(v.cab==='classic'?6.8:v.cab==='aero'?7:4.4);return {front,rear,hitch,bodyStart:hitch-.8,bodyLength:12.2,tractorRear:front+v.tractorLength,frontAxle:front+(v.cab==='frontal'?1.6:1.7),driveAxles:v.axles===3?[front+v.tractorLength-2.2,front+v.tractorLength-.9]:[front+v.tractorLength-1.25],trailerAxles:[rear-3.1,rear-1.8,rear-.5]};}
 const cabLength=v.cab==='rigid'?2.65:2.9,bodyStart=front+cabLength+.15;
 return {front,rear,hitch:null,bodyStart,bodyLength:rear-bodyStart-.1,tractorRear:rear,frontAxle:front+1.5,driveAxles:v.axles===4?[rear-4.4,rear-2.9,rear-1.4]:[rear-1.4],trailerAxles:[]};
}
export function purchaseUnlocked(vehicle,save){return save.deliveries>=vehicle.deliveries;}
export function equipBody(save,bodyId,vehicleId=save.selected){const vehicle=VEHICLES.find(v=>v.id===vehicleId),truck=save.fleet[vehicleId];if(!truck||!vehicle?.bodyOptions.includes(bodyId)||truck.body===bodyId||save.money<800)return false;save.money-=800;truck.body=bodyId;return true;}
