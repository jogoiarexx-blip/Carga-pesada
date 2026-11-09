import * as THREE from './vendor/three.module.js';
import {roadCenter,roadSlope} from './routes.mjs';
import {mergeStatic} from './truck-model.mjs';
// Authored metre-based roadside footprints; the 19 m shoulder corridor stays clear.
export const LANDMARKS={
 ipes:[['village',85,-1,'VILA DOS IPÊS'],['station',390,1,'POSTO FAROL'],['village',870,1,'COMUNIDADE DOS IPÊS'],['silos',1490,-1,'COOPERATIVA DOS IPÊS']],
 porto:[['containers',170,-1,'PÁTIO SALGUEIRO'],['station',530,1,'POSTO DO CAIS'],['crane',1150,-1,'TERMINAL SALGUEIRO'],['containers',1880,1,'ARMAZÉM 17']],
 vale:[['silos',190,-1,'GRÃOS DO VALE'],['station',750,1,'PARADA RIO GRANDE'],['village',1700,-1,'VILA DA CERÂMICA'],['silos',2680,1,'COOPERATIVA DO VALE']],
 circuito:[['stands',140,-1,'TORCIDA DOS IPÊS'],['stands',950,1,'CURVA DO COIOTE'],['station',1740,-1,'APOIO FAROL'],['stands',2500,-1,'FESTIVAL DAS LUZES']]
};
export function sceneryPlan(route){return (LANDMARKS[route.id]||[]).filter(p=>p[1]<route.length).map(([kind,s,side,label])=>({kind,s,side,label,x:side*(kind==='containers'?52:kind==='crane'?46:36),halfLength:kind==='village'?54:kind==='containers'?42:30}));}
export function sceneryClearance(s,x,route){return sceneryPlan(route).every(p=>Math.abs(s-p.s)>p.halfLength+12||Math.abs(x-p.x)>25);}
export function buildScenery(route,textSign){
 const root=new THREE.Group();root.name='regional-landmarks';const materials=new Map();
 const material=(color,emissive=false)=>{const key=color+emissive;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.85,emissive:emissive?color:0,emissiveIntensity:emissive?.65:0}));return materials.get(key);};
 function box(g,w,h,d,color,x,y,z,glow=false){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(color,glow));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;}
 function cylinder(g,r,h,color,x,y,z){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,10),material(color));mesh.position.set(x,y,z);mesh.castShadow=true;g.add(mesh);}
 for(const p of sceneryPlan(route)){
  const g=new THREE.Group();g.name=p.label;g.userData.landmark=p;g.position.set(roadCenter(p.s,route)+p.x,0,-p.s);g.rotation.y=-Math.atan(roadSlope(p.s,route));
  // Buildings face the highway from either verge.
  const local=new THREE.Group();local.rotation.y=p.side<0?Math.PI/2:-Math.PI/2;g.add(local);
  if(p.kind==='village')for(let i=0;i<4;i++){const x=-37+i*25,z=-10,color=['#b98a63','#d0bd88','#87a9a1','#bb826e'][i];box(local,12,4.8,15,color,x,2.4,z);const roof=box(local,13,.5,16,'#895441',x,5,z);roof.rotation.z=.08;box(local,2.1,3,.2,'#35564c',x,1.5,z+7.6);for(const offset of [-4,4])box(local,2,1.4,.22,'#e8cf89',x+offset,2.8,z+7.65,true);box(local,13,.2,3,'#b3a88b',x,.1,z+9);}
  if(p.kind==='station'){box(local,26,.15,34,'#a3a18c',0,.04,0);box(local,18,4.5,7,'#b5ad88',0,2.25,-11);box(local,12,2,.2,'#4a7270',0,2.5,-7.4);box(local,24,.65,16,'#466c61',0,5.6,1);for(const x of [-10,10])box(local,.4,5.4,.4,'#c9c6ac',x,2.7,1);for(const x of [-6,0,6]){box(local,1.5,1.8,1,'#d4b35e',x,.9,2);box(local,1.1,.55,1.05,'#1a3a35',x,1.3,2);box(local,3,.18,1,'#e6d599',x,5.15,2,true);}}
  if(p.kind==='silos'){box(local,20,5,16,'#b8aa7f',0,2.5,-10);box(local,22,.6,18,'#79694e',0,5.2,-10);for(const x of [-8,0,8]){cylinder(local,3.5,12,'#b3bcb1',x,6,9);const cap=new THREE.Mesh(new THREE.ConeGeometry(3.7,3,10),material('#788c82'));cap.position.set(x,13.5,9);local.add(cap);box(local,.3,13,.3,'#5b7067',x+3.55,6.5,9);}for(let i=0;i<8;i++)box(local,26,.3,.4,'#b6aa70',0,.3,-24-i*2);}
  if(p.kind==='containers')for(let i=0;i<12;i++){const x=(i%3-1)*7,z=Math.floor(i/3)*13-20;box(local,6,3,12,['#9b604e','#6e8c83','#a39766'][i%3],x,1.5+(i%4===0?3:0),z);if(i%4===0)box(local,6,3,12,'#617e86',x,1.5,z);for(let j=0;j<5;j++)box(local,.12,2.6,12.08,'#465d55',x-2.5+j*1.2,1.5,z);}
  if(p.kind==='crane'){box(local,26,.3,30,'#8e9c8f',0,.1,0);for(const x of [-10,10]){box(local,1.6,21,2,'#c1a458',x,10.5,0);box(local,3,.7,22,'#596e64',x,.8,0);}box(local,24,2,3,'#c1a458',0,21,0);box(local,2,2,34,'#b59a53',0,22,-5);box(local,3,3,4,'#557e7a',0,19,5);for(const x of [-2,2])box(local,.12,13,.12,'#304d48',x,14,-17);box(local,6,.5,4,'#d2bb72',0,7.5,-17);}
  if(p.kind==='stands'){for(let row=0;row<5;row++){box(local,24,.5,2.6,'#9aab9b',0,.4+row*.65,-row*2.5);for(let i=0;i<12;i++)box(local,.65,.8,.55,['#ba765d','#e1c47b','#618e9c'][i%3],-11+i*2,1.05+row*.65,-row*2.5);}box(local,27,.45,17,'#42685f',0,7,-5);for(const x of [-12,12])box(local,.3,7,.3,'#879e92',x,3.5,-5);for(const x of [-13,13]){box(local,.16,9,.16,'#b6bba8',x,4.5,5);box(local,2,1.2,.08,'#d5a755',x+1,8.3,5);}}
  // A small illuminated fascia makes the landmark legible at night as well.
  const face=textSign(p.label,14,2.1);face.position.set(0,6.5,12);local.add(face);
  mergeStatic(local);root.add(g);
 }
 return root;
}
