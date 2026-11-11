import * as THREE from './vendor/three.module.js';

// A Oficina Farol possui um único cenário compartilhado pelos seis caminhões.
// Geometrias estáticas são agrupadas por material (InstancedMesh) para limitar draw calls.
export const WORKSHOP_LIMITS=Object.freeze({width:64,depth:88,height:12.8});
export function createWorkshopScene(){
 const root=new THREE.Group();root.name='oficina-farol-3d';
 const materials={
  concrete:new THREE.MeshStandardMaterial({color:'#707c75',roughness:.98}),
  slab:new THREE.MeshStandardMaterial({color:'#52655b',roughness:.93}),
  wall:new THREE.MeshStandardMaterial({color:'#455b55',roughness:.92,metalness:.12}),
  upper:new THREE.MeshStandardMaterial({color:'#6c8980',roughness:.84,metalness:.2}),
  steel:new THREE.MeshStandardMaterial({color:'#202f2d',roughness:.58,metalness:.55}),
  chrome:new THREE.MeshStandardMaterial({color:'#b9c7bb',roughness:.42,metalness:.64}),
  yellow:new THREE.MeshStandardMaterial({color:'#d2a447',roughness:.8}),
  red:new THREE.MeshStandardMaterial({color:'#a65341',roughness:.7}),
  dark:new THREE.MeshStandardMaterial({color:'#132321',roughness:.85}),
  tools:new THREE.MeshStandardMaterial({color:'#bfcac4',roughness:.5,metalness:.4}),
  timber:new THREE.MeshStandardMaterial({color:'#736653',roughness:.94}),
  white:new THREE.MeshBasicMaterial({color:'#f6e5bd'}),
  glass:new THREE.MeshBasicMaterial({color:'#fbd99a'})
 };
 const structural=new THREE.Group();structural.name='estrutura';root.add(structural);
 const details=new THREE.Group();details.name='equipamentos';root.add(details);
 const lights=new THREE.Group();lights.name='luminarias';root.add(lights);
 const batches=new Map();
 function addBox(parent,key,x,y,z,w,h,d){
  const id=(parent===details?'detail:':'structure:')+key;
  let batch=batches.get(id);
  if(!batch){batch={parent,material:materials[key],transforms:[]};batches.set(id,batch);}
  batch.transforms.push([x,y,z,w,h,d]);
 }
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(64,88),materials.concrete);
 floor.name='piso-de-concreto';floor.rotation.x=-Math.PI/2;floor.position.y=-.11;floor.receiveShadow=true;structural.add(floor);
 // Faixa central de serviço e marcações, visíveis sem custosos mapas de sombras.
 addBox(structural,'slab',0,-.075,0,18,.035,52);
 for(const x of [-8.5,8.5])addBox(structural,'yellow',x,-.048,0,.12,.015,51);
 for(let z=-23;z<=23;z+=5){
  addBox(structural,'upper',-8.4,-.04,z,1,.016,.13);
  addBox(structural,'upper',8.4,-.04,z,1,.016,.13);
 }
 for(const x of [-4.2,4.2]){addBox(structural,'steel',x,-.012,-21,.42,.055,6);addBox(structural,'steel',x,-.012,21,.42,.055,6);}
 // Galpão com entrada aberta, garantindo espaço para todas as posições da câmera.
 addBox(structural,'wall',0,5.7,-43,64,11.4,.55);
 addBox(structural,'wall',-31.5,5.7,-7,.55,11.4,72);
 addBox(structural,'upper',0,10.8,-42.58,64,1.2,.2);
 for(const x of [-30,30])for(const z of [-36,-12,12,34]){
  addBox(structural,'steel',x,6,z,.48,12,.48);
  addBox(structural,'yellow',x,1,z,.55,.22,.55);
 }
 for(const z of [-35,-12,11,33]){
  addBox(structural,'steel',0,12,z,62,.4,.54);
  for(const x of [-20,0,20])addBox(structural,'chrome',x,11.72,z,5.2,.07,.3);
 }
 // Faixa de esquadrias, painel de serviços e porta lateral.
 for(let z=-33;z<=25;z+=7)addBox(structural,'upper',-31.15,7,z,.17,3.7,.17);
 for(let x=-28;x<=28;x+=6.2)addBox(structural,'upper',x,8.2,-42.55,.12,2.2,.18);
 addBox(structural,'steel',-18,4.9,-42.22,15,6.9,.12);
 addBox(structural,'red',-18,4.8,-42.12,13.5,5.7,.12);
 for(let x=-24;x<=-12;x+=1.5)addBox(structural,'upper',x,4.8,-42.03,.09,5.5,.12);
 addBox(structural,'steel',17,5.5,-42.16,11,5,.14);
 for(let i=0;i<3;i++)addBox(structural,'yellow',17,4.05+i*1.35,-42.06,9.6,.10,.15);
 // Ferramental lateral: bancada, gavetas, compressores e prateleiras.
 addBox(details,'steel',-22,1.15,-12,8,2.1,2.5);
 addBox(details,'timber',-22,2.27,-12,8.8,.25,3.2);
 for(const x of [-25,-22,-19])for(const y of [.65,1.35]){
  addBox(details,'red',x,y,-10.64,2.2,.53,.12);
  addBox(details,'chrome',x,y,-10.55,.8,.07,.06);
 }
 addBox(details,'steel',-22,4.25,-13.2,8.5,3.2,.18);
 for(let i=0;i<10;i++){
  const x=-25.6+(i%5)*1.8, y=3.1+Math.floor(i/5)*1.1;
  addBox(details,'tools',x,y,-12.95,.10,.7,.08);
  addBox(details,'yellow',x,y-.25,-12.84,.18,.22,.12);
 }
 for(const x of [-26,-23])for(const y of [1.05,2.8,4.7]){
  addBox(details,'steel',x,y,18,.2,.22,7.6);
  addBox(details,'steel',x,3.0,18,.18,5.9,.18);
 }
 for(let i=0;i<12;i++){
  const x=-26+(i%3)*1.45,y=1.55+Math.floor(i/3)*.76;
  addBox(details,i%3===0?'yellow':i%3===1?'red':'slab',x,y,17.5+(i%2)*2,1.1,.65,1.3);
 }
 // Postes do elevador, fora da área de colisão do caminhão.
 for(const x of [-10.5,10.5])for(const z of [-9.2,9.2]){
  addBox(details,'steel',x,2.45,z,.65,4.9,.72);
  addBox(details,'yellow',x,4.95,z,.75,.24,.86);
  addBox(details,'chrome',x+(x<0?.36:-.36),1,z,.55,.18,1.1);
 }
 for(const x of [-25,25])for(const z of [-24,28]){
  addBox(details,'steel',x,.52,z,1.5,.25,1.7);
  addBox(details,'yellow',x,1.1,z,.9,.9,.95);
  addBox(details,'steel',x,1.66,z,1.1,.24,1.1);
 }
 const circleGeo=new THREE.CylinderGeometry(.82,.82,.5,10);
 const tyreMat=new THREE.MeshStandardMaterial({color:'#151c1c',roughness:1});
 for(const z of [20,22.6])for(let layer=0;layer<3;layer++){
  const tyre=new THREE.Mesh(circleGeo,tyreMat);
  tyre.position.set(22,layer*.52+.25,z);tyre.name='pneus-reserva';details.add(tyre);
 }
 const barrelGeo=new THREE.CylinderGeometry(.56,.56,1.5,10);
 for(const x of [-25,-23.6])for(const z of [-28,-26.6]){
  const barrel=new THREE.Mesh(barrelGeo,materials.red);
  barrel.name='tambor-de-oleo';barrel.position.set(x,.75,z);details.add(barrel);
 }
 // Instanciamento: um único draw call por cor e por área.
 const dummy=new THREE.Object3D(),unit=new THREE.BoxGeometry(1,1,1);
 for(const [id,batch] of batches){
  const mesh=new THREE.InstancedMesh(unit,batch.material,batch.transforms.length);
  mesh.name=id;mesh.receiveShadow=true;mesh.frustumCulled=false;
  batch.transforms.forEach(([x,y,z,w,h,d],i)=>{
   dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.rotation.set(0,0,0);
   dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate=true;batch.parent.add(mesh);
 }
 // Luminárias emissivas: poucos objetos e luzes sem sombras adicionais.
 for(const z of [-25,0,24])for(const x of [-16,16]){
  addLightFixture(x,z);
 }
 function addLightFixture(x,z){
  const m=new THREE.Mesh(new THREE.BoxGeometry(3,.13,.58),materials.white);
  m.name='luminaria-led';m.position.set(x,11.5,z);lights.add(m);
 }
 const point=new THREE.PointLight('#ffdb9a',14,43,2);
 point.name='luz-de-servico';point.position.set(0,9.8,-4);point.castShadow=false;lights.add(point);
 // Placa da oficina: textura procedural minúscula, carregada só ao abrir a garagem.
 if(typeof document!=='undefined'){
  const c=document.createElement('canvas');c.width=512;c.height=128;
  const ctx=c.getContext('2d');
  if(ctx){
   ctx.fillStyle='#163c35';ctx.fillRect(0,0,512,128);
   ctx.fillStyle='#d2a447';ctx.fillRect(10,10,492,5);ctx.fillRect(10,113,492,5);
   ctx.fillStyle='#f9dfad';ctx.textAlign='center';ctx.font='bold 42px Arial';
   ctx.fillText('OFICINA FAROL',256,63);
   ctx.font='bold 17px Arial';ctx.fillText('MECÂNICA  •  PEÇAS  •  PINTURA',256,94);
   const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
   const sign=new THREE.Mesh(new THREE.PlaneGeometry(14.5,3.6),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
   sign.position.set(0,7.4,-42.52);sign.name='placa-oficina-farol';structural.add(sign);
  }
 }
 root.userData.detailGroup=details;root.userData.serviceLight=point;
 setWorkshopQuality(root,'balanced');
 return root;
}
export function setWorkshopQuality(root,preset='balanced'){
 if(!root)return;
 root.userData.detailGroup.visible=preset!=='eco';
 root.userData.serviceLight.visible=preset==='high';
}
