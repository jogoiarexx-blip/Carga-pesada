import * as THREE from './vendor/three.module.js';

// Modelo exclusivo do Aurora 90. A cabine olha para -Z e a roda esterça em Y.
// Preserva dimensões, encaixes de acessórios, economia e saves existentes.
export function buildAuroraCab({cab,box,profile,rod,paint,chrome,black,glass,lamp,orange}){
 const seal=new THREE.MeshStandardMaterial({color:'#101c21',roughness:.82});
 const grille=new THREE.MeshStandardMaterial({color:'#28383b',metalness:.22,roughness:.69});
 const steel=new THREE.MeshStandardMaterial({color:'#818d8b',metalness:.48,roughness:.51});
 const warm=new THREE.MeshStandardMaterial({color:'#dfaa65',metalness:.28,roughness:.54});
 const lightGlass=new THREE.MeshPhysicalMaterial({color:'#8daab1',metalness:.06,roughness:.23,transparent:true,opacity:.93,clearcoat:.43});
 const backWindow=new THREE.MeshStandardMaterial({color:'#243f4c',metalness:.28,roughness:.28});
 const tyreBlack=new THREE.MeshStandardMaterial({color:'#101619',roughness:.9});
 const bolt=new THREE.MeshStandardMaterial({color:'#b2b6a9',metalness:.52,roughness:.35});

 // Cabine avançada: vinco do capô, teto arredondado e arco de roda recortado.
 profile(cab,[[.11,.96],[.11,2.40],[.39,2.92],[.63,3.08],[2.22,3.08],[2.55,2.83],[2.57,.96],[2.25,.96],[2.13,1.14],[1.93,1.32],[1.50,1.39],[1.09,1.32],[.91,1.13],[.80,.96]],2.28,paint,'Aurora 90 — cabine perfilada');
 box(cab,2.22,.10,2.13,paint,0,3.03,1.38,'teto metálico arredondado');
 box(cab,2.31,.075,2.12,steel,0,3.07,1.36,'calha da cabine');
 box(cab,2.18,.04,2.07,paint,0,3.105,1.35,'chapa superior do teto');

 // Vidros grandes com divisor central e borrachas de vedação.
 box(cab,2.19,.80,.14,seal,0,2.39,.036,'moldura superior do para-brisa');
 for(const side of [-1,1]){
  box(cab,1.035,.68,.155,glass,side*.527,2.39,-.057,'vidro dianteiro fumê');
  box(cab,.025,.70,.16,bolt,side*1.05,2.40,-.094,'coluna A cromada');
  box(cab,.055,.06,1.65,paint,side*1.08,2.97,1.20,'linha do teto');
 }
 box(cab,.068,.74,.19,seal,0,2.39,-.10,'divisor central do para-brisa');
 box(cab,2.20,.075,.17,black,0,2.005,-.115,'borracha inferior para-brisa');
 box(cab,2.20,.09,.15,paint,0,2.80,-.10,'moldura superior parabrisas');
 for(const side of [-1,1]){
  rod(cab,new THREE.Vector3(side*.73,2.02,-.172),new THREE.Vector3(side*.12,2.32,-.169),.016,seal);
  rod(cab,new THREE.Vector3(side*.12,2.32,-.174),new THREE.Vector3(side*.30,2.37,-.173),.027,tyreBlack);
  box(cab,.055,.025,.035,chrome,side*.63,2.02,-.18,'esguicho de água');
 }

 // Grade frontal profunda, molduras dos faróis quadrados e piscas.
 box(cab,2.17,1.04,.085,paint,0,1.50,-.015,'painel frontal estampado');
 box(cab,1.36,.65,.13,grille,0,1.45,-.095,'radiador com profundidade');
 box(cab,1.37,.044,.17,steel,0,1.79,-.144,'grade superior');
 for(let row=0;row<6;row++)
  box(cab,1.26,.045,.035,steel,0,1.19+row*.105,-.170,'frisos da grade frontal');
 for(const side of [-1,1]){
  const x=side*.91;
  box(cab,.49,.31,.13,seal,x,1.33,-.106,'encaixe farol quadrado');
  box(cab,.36,.22,.14,lightGlass,x,1.35,-.198,'farol com lente e profundidade');
  box(cab,.40,.025,.035,chrome,x,1.49,-.199,'pestana cromada do farol');
  box(cab,.34,.10,.13,orange,x,1.60,-.184,'seta dianteira âmbar');
  box(cab,.31,.045,.025,steel,x,1.19,-.18,'friso sob farol');
  box(cab,.18,.07,.065,grille,side*.9,1.93,-.085,'entrada de ventilação');
 }
 box(cab,2.31,.23,.27,chrome,0,.87,-.135,'para-choque de aço Aurora');
 box(cab,2.08,.12,.085,grille,0,.82,-.30,'borracha do para-choque Aurora');
 box(cab,.43,.17,.06,seal,0,.91,-.296,'placa de registro dianteira');
 for(const side of [-1,1])box(cab,.25,.10,.065,lamp,side*.79,.90,-.305,'milha embutido');

 // Laterais: portas realmente separadas, vidros, frisos, estribo e para-lama.
 for(const side of [-1,1]){
  const x=side*1.157;
  box(cab,.056,.75,1.30,seal,x,2.40,.93,'moldura janela da porta');
  box(cab,.067,.59,1.14,backWindow,x+side*.012,2.42,.92,'vidro lateral porta');
  box(cab,.074,.027,1.14,steel,x+side*.018,2.27,.93,'divisor de vidro lateral');
  box(cab,.068,.71,.06,chrome,x+side*.017,2.40,.45,'coluna dianteira porta');
  box(cab,.06,.69,.06,seal,x+side*.016,2.40,1.50,'coluna traseira da janela');
  box(cab,.030,.87,.035,steel,x+side*.028,1.54,.42,'linha da porta frontal');
  box(cab,.030,.85,.035,steel,x+side*.028,1.55,1.95,'linha da porta traseira');
  box(cab,.05,.085,.24,seal,x+side*.04,1.86,1.23,'cavidade maçaneta');
  box(cab,.055,.055,.18,chrome,x+side*.071,1.88,1.23,'maçaneta da porta');
  box(cab,.035,.10,1.70,warm,x+side*.035,1.25,1.10,'friso lateral original Aurora');
  box(cab,.06,.045,1.25,chrome,x+side*.04,1.36,1.06,'vinco lateral de chapa');
  box(cab,.08,.15,.26,orange,side*1.16,1.46,.32,'pisca lateral');
  const fender=new THREE.Mesh(new THREE.TorusGeometry(.695,.045,6,26,Math.PI),tyreBlack);
  fender.rotation.y=Math.PI/2;
  fender.position.set(side*1.17,.59,1.5);
  fender.name='moldura curva do para-lama';fender.castShadow=true;cab.add(fender);
  box(cab,.48,.11,.81,steel,side*1.28,.78,.36,'estribo inferior reforçado');
  for(let slot=0;slot<4;slot++)
   box(cab,.33,.015,.06,seal,side*1.34,.84,.10+slot*.15,'ranhura antiderrapante');
  box(cab,.08,.19,.39,seal,side*1.145,1.92,2.35,'respiro traseiro da cabine');
  for(let slot=0;slot<3;slot++)
   box(cab,.085,.023,.28,steel,side*1.19,1.85+slot*.057,2.35,'veneziana de respiro');
  rod(cab,new THREE.Vector3(side*1.19,2.69,.53),new THREE.Vector3(side*1.64,2.69,.52),.027,seal);
  rod(cab,new THREE.Vector3(side*1.18,2.28,.62),new THREE.Vector3(side*1.62,2.40,.52),.027,seal);
  box(cab,.15,.19,.23,chrome,side*1.63,2.19,.51,'espelho auxiliar de manobra');
 }

 // Marca fictícia própria. Sem reproduzir logotipos de fabricantes reais.
 box(cab,.60,.10,.065,chrome,0,1.91,-.114,'emblema Aurora 90');
 if(typeof document!=='undefined'&&typeof document.createElement==='function'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;
  const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.clearRect(0,0,512,96);ctx.font='900 64px Arial, sans-serif';
   ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillStyle='#f4f0e1';ctx.fillText('AURORA',256,48,490);
   const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
   const badge=new THREE.Mesh(new THREE.PlaneGeometry(.57,.07),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
   badge.position.set(0,1.91,-.154);badge.rotation.y=Math.PI;
   badge.name='logotipo frontal Aurora';cab.add(badge);
  }
 }
}

export function detailAuroraChassis({root,wheels,layout,box}){
 const wheelSteel=new THREE.MeshStandardMaterial({color:'#aeb9b5',metalness:.68,roughness:.32});
 const wheelShadow=new THREE.MeshStandardMaterial({color:'#111b1e',roughness:.81});
 const rubber=new THREE.MeshStandardMaterial({color:'#262b2b',roughness:.94});
 const frame=new THREE.MeshStandardMaterial({color:'#69777a',metalness:.45,roughness:.61});
 const reflect=new THREE.MeshStandardMaterial({color:'#d49b35',metalness:.1,roughness:.5});
 for(const wheel of wheels){
  const side=wheel.userData.side,r=wheel.userData.radius;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r*.60,.034,6,18),wheelSteel);
  ring.rotation.y=Math.PI/2;ring.position.x=side*.205;ring.name='anel de roda estampado';wheel.add(ring);
  const inner=new THREE.Mesh(new THREE.TorusGeometry(r*.41,.021,5,18),wheelShadow);
  inner.rotation.y=Math.PI/2;inner.position.x=side*.215;inner.name='aro interno da roda';wheel.add(inner);
  for(let k=0;k<8;k++){
   const angle=k*Math.PI/4;
   const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.027,.027,.022,6),wheelSteel);
   mesh.rotation.z=Math.PI/2;
   mesh.position.set(side*.235,Math.sin(angle)*r*.47,Math.cos(angle)*r*.47);
   mesh.name='porca do aro';wheel.add(mesh);
  }
  for(let k=0;k<12;k++){
   const angle=k*Math.PI/6,mesh=new THREE.Mesh(new THREE.BoxGeometry(.022,.045,.13),rubber);
   mesh.position.set(side*.04,Math.sin(angle)*r*.975,Math.cos(angle)*r*.975);
   mesh.rotation.x=-angle;mesh.name='friso do pneu';wheel.add(mesh);
  }
 }
 for(const side of [-1,1]){
  const rearZ=layout.driveAxles[0];
  box(root,.085,.27,.72,wheelShadow,side*1.20,.46,rearZ+.68,'para-barro traseiro Aurora');
  box(root,.10,.065,.50,reflect,side*1.25,.37,rearZ+.68,'refletor traseiro Aurora');
  box(root,.09,.14,1.09,frame,side*1.20,1.18,layout.bodyStart+.64,'viga lateral do chassi Aurora');
  box(root,.065,.09,.16,reflect,side*1.29,1.32,layout.bodyStart+.15,'luz lateral de posição Aurora');
 }
 for(const z of [layout.bodyStart+.18,layout.bodyStart+layout.bodyLength-.18])
  box(root,2.54,.065,.06,frame,0,3.61,z,'perfil superior do baú Aurora');
}
