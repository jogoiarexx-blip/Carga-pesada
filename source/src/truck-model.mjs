import * as THREE from './vendor/three.module.js';
import {bevelBox,releaseTrees} from './truck-geometry.mjs';
import {truckFit} from './truck-fit.mjs';
import {configuredVehicle,vehicleLayout} from './fleet.mjs';
const material=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:metalness?.38:.82,flatShading:true});
export function buildTruck(vehicle,color,bodyId){
 const v=configuredVehicle(vehicle,bodyId),layout=vehicleLayout(v),root=new THREE.Group();root.name=v.name;
 const paint=new THREE.MeshPhysicalMaterial({color,metalness:.2,roughness:.35,clearcoat:.45,clearcoatRoughness:.24}),white=material('#dedfd4'),doorPaint=material('#c9d0cc'),black=material('#192427'),chrome=material('#bfc7c5',.7),glass=material('#36616e',.25),rubber=material('#182022'),lamp=material('#f9db92'),red=material('#c34732'),orange=material('#e9a338');
 const wheels=[],frontWheels=[],axles=[];root.userData={spec:v,paint,wheels,frontWheels,layout,trailer:null};
 function box(parent,w,h,d,m,x=0,y=0,z=0,name=''){const o=new THREE.Mesh(['baú fechado','fueiros e laterais'].includes(name)?new THREE.BoxGeometry(w,h,d,2,Math.ceil(h/.45),Math.ceil(d/.5)):name&&Math.min(w,h,d)>.12?bevelBox(w,h,d,.035):new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;o.name=name;parent.add(o);return o;}
 function profile(parent,points,width,m,name=''){const shape=new THREE.Shape(points.map(([z,y])=>new THREE.Vector2(-z,y)));const geometry=new THREE.ExtrudeGeometry(shape,{depth:width,bevelEnabled:true,bevelSegments:1,bevelSize:.018,bevelThickness:.018,steps:1});geometry.rotateY(Math.PI/2);geometry.translate(-width/2,0,0);const mesh=new THREE.Mesh(geometry,m);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function cylinder(parent,radius,length,m,x,y,z){const o=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,length,16),m);o.rotation.z=Math.PI/2;o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o;}
 function rod(parent,a,b,r=.025,m=chrome){const delta=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),5),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());parent.add(o);return o;}
 function axle(parent,z,front=false,heavy=true){const r=heavy?.66:.58,entry={parent,z,front,radius:r};axles.push(entry);cylinder(parent,.095,2.3,black,0,r,z);for(const side of [-1,1]){const steering=new THREE.Group();steering.position.set(side*1.17,r,z);parent.add(steering);steering.userData.dynamic=true;const spin=new THREE.Group();spin.userData={side,radius:r};steering.add(spin);const tyreGeometry=new THREE.LatheGeometry([[.58,-.18],[.86,-.18],[.97,-.12],[1,0],[.97,.12],[.86,.18],[.58,.18]].map(([rr,y])=>new THREE.Vector2(rr*r,y)),16),tyre=new THREE.Mesh(tyreGeometry,rubber);tyre.rotation.z=Math.PI/2;spin.add(tyre);cylinder(spin,r*.62,.38,chrome,0,0,0);cylinder(spin,r*.22,.4,black,0,0,0);for(let k=0;k<6;k++){const a=k*Math.PI/3;box(spin,.015,.055,.055,black,side*.2,Math.sin(a)*r*.4,Math.cos(a)*r*.4);}if(!front){cylinder(spin,r,.32,rubber,-side*.32,0,0);}wheels.push(spin);if(front)frontWheels.push(steering);box(parent,.12,.65,.5,black,side*1.24,.68,z+.5,'para-lama');}}
 const cab=new THREE.Group();cab.position.z=layout.front;root.add(cab);
 const heavy=v.cab!=='rigid',cabWidth=heavy?2.45:2.3;
 const chassisLength=v.category==='tractor'?v.tractorLength:v.length;
 for(const x of [-.76,.76])box(root,.2,.28,chassisLength,black,x,1.02,layout.front+chassisLength/2,'longarina');
 box(root,1.9,.18,1.5,chrome,0,1.14,layout.front+chassisLength-.9,'chassi traseiro');
 if(v.cab==='classic'){const factoryExhaust=new THREE.Group();factoryExhaust.userData.dynamic=true;cab.add(factoryExhaust);root.userData.factoryExhaust=factoryExhaust;
  profile(cab,[[.1,1.05],[.1,2.2],[2.15,2.48],[2.15,1.05]],2.05,paint,'capô clássico');
  profile(cab,[[2,1.15],[2.05,3.25],[2.5,3.65],[3.85,3.65],[3.85,1.15]],cabWidth,paint,'cabine clássica');
  profile(cab,[[3.4,1.15],[3.4,4.05],[4.05,4.4],[5.4,4.4],[5.4,1.15]],2.5,paint,'dormitório');
  profile(cab,[[2.16,2.45],[2.38,3.2],[3.22,3.2],[3.22,2.45]],2.48,black);profile(cab,[[2.26,2.55],[2.45,3.1],[3.1,3.1],[3.1,2.55]],2.5,glass);
  box(cab,2.03,1.27,.1,chrome,0,1.75,.04,'grade cromada');for(let i=-5;i<=5;i++)box(cab,.065,1.1,.13,black,i*.16,1.75,-.025);
  box(cab,2.23,.67,.08,glass,0,2.97,2.03);box(cab,2.5,.15,.55,black,0,3.43,2.22,'viseira');
  for(const side of [-1,1]){box(cab,.08,.58,1.1,black,side*1.26,3.78,4.2);box(cab,.09,.42,.88,glass,side*1.28,3.78,4.2);const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,3.6,8),chrome);pipe.position.set(side*1.37,2.75,3.42);factoryExhaust.add(pipe);box(cab,.5,.17,.2,lamp,side*.87,1.47,-.04);box(cab,.2,.1,.16,orange,side*1.05,2.28,.2);}
 }else if(v.cab==='aero'){
  profile(cab,[[.1,1.05],[.12,1.92],[1.08,2.4],[2.3,2.65],[2.3,1.05]],2.25,paint,'capô aerodinâmico');
  profile(cab,[[2.05,1.15],[2.05,3.1],[2.7,3.9],[3.9,4.52],[5.7,4.52],[5.7,1.15]],2.48,paint,'cabine e teto aerodinâmico');
  profile(cab,[[2.2,2.55],[2.72,3.3],[3.58,3.3],[3.58,2.55]],2.51,black);profile(cab,[[2.36,2.66],[2.78,3.2],[3.46,3.2],[3.46,2.66]],2.54,glass);
  box(cab,1.5,.82,.15,black,0,1.55,.05);for(let i=0;i<4;i++)box(cab,1.43,.065,.18,chrome,0,1.24+i*.19,-.02);
  box(cab,2.2,.67,.1,glass,0,2.98,2.04);box(cab,2.55,.14,.5,black,0,3.41,2.24);
  for(const side of [-1,1]){box(cab,.065,.56,1.2,black,side*1.26,3.78,4.47);box(cab,.07,.42,1.02,glass,side*1.29,3.78,4.47);profile(cab,[[.16,1.68],[.36,1.99],[1.18,2.18],[.95,1.92]],2.31,lamp);}
  box(cab,2.6,.2,4,paint,0,.78,3.4,'saia aerodinâmica');
 }else{
  const small=v.cab==='rigid',top=small?3.05:4.08,back=small?2.55:2.85;
  profile(cab,[[.13,.95],[.13,top-.6],[.48,top],[back-.2,top],[back,top-.25],[back,1]],cabWidth,paint,'cabine frontal');
  box(cab,cabWidth-.23,small?.75:.9,.1,black,0,top-1.02,.105,'moldura para-brisa');box(cab,cabWidth-.4,small?.59:.74,.12,glass,0,top-1.02,.08,'para-brisa');
  for(const side of [-1,1]){box(cab,.07,small?.7:.83,1.2,black,side*(cabWidth/2+.025),top-1.02,1.1);box(cab,.08,small?.54:.67,1.02,glass,side*(cabWidth/2+.04),top-1.02,1.1);box(cab,.13,.09,.35,black,side*(cabWidth/2+.05),1.55,1.67);box(cab,.39,.19,.15,lamp,side*.88,1.18,.04);}
  box(cab,cabWidth-.22,small?.55:1.25,.15,black,0,small?1.5:1.65,.08,'grade frontal');for(let i=0;i<(small?3:5);i++)box(cab,cabWidth-.46,.065,.18,chrome,0,small?1.29+i*.17:1.15+i*.25,.005);
  if(!small)box(cab,cabWidth,.12,.65,paint,0,top+.03,1.35,'teto alto');
 }

 // Small details share the existing material batches.
 const windY=v.cab==='rigid'?2.03:v.cab==='frontal'?3.06:2.98,windZ=v.cab==='classic'||v.cab==='aero'?1.975:-.005;
 for(const side of [-1,1])rod(cab,new THREE.Vector3(side*.6,windY-.23,windZ),new THREE.Vector3(side*.17,windY+.12,windZ),.016,black);
 // Shared details: mirrors, doors, tanks, steps, lights and bumper.
 for(const side of [-1,1]){const mirrorZ=v.cab==='classic'?2.35:v.cab==='aero'?2.5:.66,mirrorY=v.cab==='rigid'?2.45:3;
  rod(cab,new THREE.Vector3(side*1.15,mirrorY,mirrorZ),new THREE.Vector3(side*1.6,mirrorY,mirrorZ-.14),.045,black);box(cab,.17,.5,.3,black,side*1.61,mirrorY,mirrorZ-.14,'retrovisor');box(cab,.02,.4,.22,chrome,side*1.71,mirrorY,mirrorZ-.14);
  const stepZ=v.cab==='classic'?2.95:v.cab==='aero'?3.05:1.9;box(cab,.46,.15,1.05,chrome,side*1.25,.97,stepZ,'degrau');box(cab,.36,.12,.9,chrome,side*1.15,1.21,stepZ);
  box(root,.5,.67,v.category==='tractor'?1.55:1.2,chrome,side*1.03,.98,layout.front+(v.category==='tractor'?5.6:3.45),'tanque');
 }
 box(cab,2.62,.26,.26,v.cab==='aero'?paint:chrome,0,.89,.02,'para-choque');for(let i=-2;i<=2;i++)box(cab,.12,.08,.14,orange,i*.38,v.cab==='rigid'?3.12:v.cab==='classic'?3.75:4.18,v.cab==='classic'?2.55:v.cab==='aero'?3.8:1.1);
 axle(root,layout.frontAxle,true,heavy);for(const z of layout.driveAxles)axle(root,z,false,heavy);
 let bodyParent=root,offset=0;
 if(v.category==='tractor'){
  const trailer=new THREE.Group();trailer.name='semirreboque articulado';trailer.userData.dynamic=true;trailer.position.z=layout.hitch;root.add(trailer);root.userData.trailer=trailer;bodyParent=trailer;offset=layout.hitch;
  const fifth=new THREE.Mesh(new THREE.CylinderGeometry(.67,.67,.16,12),black);fifth.position.set(0,1.38,layout.hitch);root.add(fifth);
  box(bodyParent,1.85,.22,layout.bodyLength,black,0,1.15,layout.bodyStart-offset+layout.bodyLength/2,'chassi carreta');
  for(const z of layout.trailerAxles)axle(bodyParent,z-offset,false,true);
  for(const side of [-1,1])box(bodyParent,.11,.5,3.9,chrome,side*1.22,1.02,3.7,'protetor lateral');
 }
 const bodyStart=layout.bodyStart-offset,bodyLength=layout.bodyLength,bodyEnd=bodyStart+bodyLength,base=1.46,bodyHeight=v.body==='short_box'?2.15:v.body==='long_box'?2.58:2.72;
 box(bodyParent,2.53,.17,bodyLength,chrome,0,base,bodyStart+bodyLength/2,'piso carroceria');
 if(v.body==='tarp_trailer'){
  const sideHeight=1.45;box(bodyParent,2.51,sideHeight,bodyLength,white,0,base+sideHeight/2,bodyStart+bodyLength/2,'fueiros e laterais');
  for(let side of [-1,1]){for(let z=bodyStart+.1;z<bodyEnd;z+=1.25){box(bodyParent,.08,1.5,.07,chrome,side*1.28,base+.76,z);rod(bodyParent,new THREE.Vector3(side*1.33,base+.1,z),new THREE.Vector3(side*1.33,base+2.5,Math.min(bodyEnd,z+1.25)),.021,black);}box(bodyParent,.07,.06,bodyLength,chrome,side*1.29,base+.8,bodyStart+bodyLength/2);}
  const tarp=material('#d88c36');profile(bodyParent,[[bodyStart,base+1.38],[bodyStart+.15,base+2.38],[bodyStart+.6,base+2.64],[bodyEnd-.3,base+2.64],[bodyEnd,base+2.4],[bodyEnd,base+1.38]],2.65,tarp,'lona com caimento');
  // Roof ridge makes the fabric read as stretched canvas, not a solid box.
  for(const side of [-1,1])for(let z=bodyStart+.65;z<bodyEnd;z+=1.25)rod(bodyParent,new THREE.Vector3(side*1.33,base+1.38,z),new THREE.Vector3(side*1.34,base+.15,z-.25),.023,black);
 }else{
  box(bodyParent,2.5,bodyHeight,bodyLength,white,0,base+bodyHeight/2,bodyStart+bodyLength/2,'baú fechado');
  for(const side of [-1,1]){for(let z=bodyStart+.08;z<bodyEnd;z+=.3)box(bodyParent,.026,bodyHeight-.1,.025,chrome,side*1.26,base+bodyHeight/2,z);for(const y of [base+.05,base+bodyHeight-.04])box(bodyParent,.05,.07,bodyLength,chrome,side*1.28,y,bodyStart+bodyLength/2);}
  for(const x of [-1.2,1.2])box(bodyParent,.1,bodyHeight+.1,.12,chrome,x,base+bodyHeight/2,bodyEnd+.035);
  for(const side of [-1,1])box(bodyParent,1.14,bodyHeight-.16,.055,doorPaint,side*.6,base+bodyHeight/2,bodyEnd+.035,'folha da porta traseira');
  box(bodyParent,.055,bodyHeight,.13,black,0,base+bodyHeight/2,bodyEnd+.02,'divisão das portas');for(const x of [-.65,.65]){box(bodyParent,.045,bodyHeight-.3,.1,chrome,x,base+bodyHeight/2,bodyEnd+.12,'trava da porta');for(let y=base+.3;y<base+bodyHeight;y+=.8)box(bodyParent,.2,.06,.11,chrome,x,y,bodyEnd+.16);}
 }
 // Rear hardware is physically above the recessed door artwork, with no coplanar caps.
 for(const side of [-1,1]){
  if(v.body!=='tarp_trailer')for(const y of [base+.38,base+bodyHeight-.38]){box(bodyParent,.24,.16,.08,black,side*1.12,y,bodyEnd+.14,'dobradiça traseira');box(bodyParent,.09,.23,.12,chrome,side*1.16,y,bodyEnd+.17);}
  box(bodyParent,.57,.24,.14,black,side*.95,1.1,bodyEnd+.11,'moldura da lanterna');
  for(let i=0;i<3;i++)box(bodyParent,.15,.12,.04,[red,orange,white][i],side*.95+(i-1)*.17,1.1,bodyEnd+.195,'lentes da lanterna');
  box(bodyParent,.65,.045,.05,black,side*.75,.58,bodyEnd+.22,'apoio do para-choque');
  const frontZ=v.cab==='classic'||v.cab==='aero'?.01:-.01;
  box(cab,.46,.25,.06,black,side*.88,1.18,frontZ,'moldura dos faróis');box(cab,.34,.14,.055,lamp,side*.88,1.18,frontZ-.06,'lente dos faróis');
  for(const z of layout.driveAxles)box(root,.13,.12,.48,black,side*1.23,1.28,z,'coroa do para-lama');
 }
 for(const side of [-1,1]){const doorZ=v.cab==='classic'?3.2:v.cab==='aero'?3.38:2.05;box(cab,.025,.75,.035,black,side*(cabWidth/2+.04),1.72,doorZ,'junta da porta');box(cab,.035,.065,.27,chrome,side*(cabWidth/2+.055),2.04,doorZ-.28,'maçaneta');}
 for(let z=bodyStart+.5;z<bodyEnd;z+=1.2)box(bodyParent,2.26,.08,.08,black,0,1.31,z,'travessa do piso');
 for(const side of [-1,1]){box(bodyParent,.48,.16,.15,red,side*.95,1.1,bodyEnd+.1,'lanterna traseira');for(let z=bodyStart+.5;z<bodyEnd;z+=2)box(bodyParent,.07,.09,.18,orange,side*1.29,base+.12,z);}
 for(let i=0;i<8;i++)box(bodyParent,.23,.08,.035,i%2?red:white,-.84+i*.24,1.3,bodyEnd+.21,'faixa refletiva traseira');
 box(bodyParent,2.4,.18,.15,chrome,0,.7,bodyEnd+.22,'para-choque traseiro');box(bodyParent,.7,.17,.08,black,0,.99,bodyEnd+.16,'placa');
 root.userData.wheelRadius=heavy?.66:.58;root.userData.fit=truckFit(v);root.userData.axles=axles;root.userData.body=v.body;root.userData.components=[];root.traverse(o=>{if(o.name)root.userData.components.push(o.name);});for(const wheel of wheels)mergeStatic(wheel);if(root.userData.trailer)mergeStatic(root.userData.trailer);mergeStatic(root);return root;
}
export function animateTruck(model,steering,speed,dt,trailerYaw=0){for(const wheel of model.userData.wheels)wheel.rotation.x-=speed*Math.max(0,dt)/(wheel.userData.radius||model.userData.wheelRadius||.64);for(const pivot of model.userData.frontWheels)pivot.rotation.y=-steering;if(model.userData.trailer)model.userData.trailer.rotation.y=trailerYaw;}
export function disposeTruck(model){model.userData.disposed=true;releaseTrees([model]);}
// Merge static meshes by material while preserving wheel and trailer pivots.
export function mergeStatic(parent,keepNames=false){
 parent.updateWorldMatrix(true,true);const inverse=parent.matrixWorld.clone().invert(),batches=new Map(),sources=[];
 function walk(node){for(const child of node.children){if(child.userData.dynamic)continue;if(child.isMesh){const list=batches.get(child.material)||[];list.push(child);batches.set(child.material,list);sources.push(child);}else walk(child);}}
 walk(parent);
 for(const [material,list] of batches){let count=0;const geometries=list.map(mesh=>{let g=mesh.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,mesh.matrixWorld));if(g.index){const old=g;g=g.toNonIndexed();old.dispose();}count+=g.attributes.position.count;return g;});const positions=new Float32Array(count*3),normals=new Float32Array(count*3),uvs=new Float32Array(count*2);let cursor=0;
  for(const g of geometries){positions.set(g.attributes.position.array,cursor);normals.set(g.attributes.normal.array,cursor);if(g.attributes.uv)uvs.set(g.attributes.uv.array,cursor/3*2);cursor+=g.attributes.position.array.length;g.dispose();}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.BufferAttribute(normals,3));geometry.setAttribute('uv',new THREE.BufferAttribute(uvs,2));geometry.computeBoundingSphere();const combined=new THREE.Mesh(geometry,material);combined.castShadow=true;combined.receiveShadow=true;parent.add(combined);
 }
 if(keepNames){for(const name of new Set(sources.map(o=>o.name).filter(Boolean))){const anchor=new THREE.Group();anchor.name=name;parent.add(anchor);}}
 const oldGeometries=new Set();for(const mesh of sources){mesh.removeFromParent();oldGeometries.add(mesh.geometry);}oldGeometries.forEach(g=>g.dispose());
}
