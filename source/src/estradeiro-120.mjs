import * as THREE from './vendor/three.module.js';

// Estradeiro 120: caminhão rígido médio com cabine mais realista e acabamento utilitário.
export function buildEstradeiroCab({cab,box,profile,rod,paint,chrome,black,glass,lamp,orange}){
 const seal=new THREE.MeshStandardMaterial({color:'#10181c',roughness:.84});
 const grille=new THREE.MeshStandardMaterial({color:'#314448',metalness:.22,roughness:.67});
 const bodyShadow=new THREE.MeshStandardMaterial({color:'#2e555d',metalness:.12,roughness:.58});
 const steel=new THREE.MeshStandardMaterial({color:'#909894',metalness:.55,roughness:.37});
 const darkGlass=new THREE.MeshPhysicalMaterial({color:'#7998a2',metalness:.08,roughness:.2,transparent:true,opacity:.92,clearcoat:.4});
 const indicator=new THREE.MeshStandardMaterial({color:'#dca24d',metalness:.08,roughness:.45});
 const trim=new THREE.MeshStandardMaterial({color:'#1e2b2f',roughness:.72});
 const tireTrim=new THREE.MeshStandardMaterial({color:'#171d20',roughness:.88});

 // Cabine principal: frente curta e mais alta, com teto reto e recuos de porta.
 profile(cab,[[.11,.98],[.11,2.62],[.42,3.02],[.78,3.18],[2.35,3.18],[2.70,2.94],[2.76,2.42],[2.76,.98],[2.26,.98],[2.12,1.16],[1.84,1.28],[1.28,1.32],[.92,1.28],[.72,1.16],[.58,.98]],2.34,paint,'Estradeiro 120 — cabine regional');
 box(cab,2.28,.10,2.18,paint,0,3.12,1.44,'teto utilitário reto');
 box(cab,2.14,.08,1.95,bodyShadow,0,3.17,1.42,'reforço do teto');
 box(cab,2.18,.07,.22,trim,0,2.98,-.02,'calha frontal do teto');

 // Para-brisa mais largo e inclinado, com divisor e borrachas.
 box(cab,2.10,.76,.15,seal,0,2.44,-.05,'moldura para-brisa Estradeiro');
 for(const side of [-1,1]) box(cab,.95,.64,.16,glass,side*.49,2.44,-.08,'vidro dianteiro Estradeiro');
 box(cab,.07,.70,.18,black,0,2.44,-.11,'divisor central do para-brisa Estradeiro');
 box(cab,2.09,.08,.16,trim,0,2.07,-.12,'borracha inferior do para-brisa');
 box(cab,2.09,.07,.16,paint,0,2.83,-.08,'moldura superior do para-brisa Estradeiro');
 for(const side of [-1,1]){
  rod(cab,new THREE.Vector3(side*.58,2.03,-.17),new THREE.Vector3(side*.12,2.34,-.17),.017,black);
  box(cab,.05,.03,.04,chrome,side*.61,2.02,-.18,'base do limpador Estradeiro');
 }

 // Frente com grade de três níveis, nichos de faróis e para-choque robusto.
 box(cab,2.18,1.05,.09,paint,0,1.52,-.01,'painel frontal do Estradeiro');
 box(cab,1.46,.72,.14,grille,0,1.46,-.11,'grade de refrigeração Estradeiro');
 box(cab,1.48,.06,.18,steel,0,1.82,-.15,'barra superior da grade Estradeiro');
 for(let row=0;row<5;row++) box(cab,1.34,.055,.035,steel,0,1.22+row*.13,-.19,'friso da grade Estradeiro');
 for(const side of [-1,1]){
  const x=side*.89;
  box(cab,.52,.33,.14,seal,x,1.34,-.11,'moldura do farol Estradeiro');
  box(cab,.38,.24,.15,lamp,x,1.35,-.205,'conjunto óptico principal Estradeiro');
  box(cab,.17,.095,.14,indicator,x,1.60,-.19,'pisca dianteiro Estradeiro');
  box(cab,.20,.09,.07,grille,side*.92,1.90,-.09,'respiro lateral frontal Estradeiro');
 }
 box(cab,2.44,.26,.26,chrome,0,.88,-.14,'para-choque frontal do Estradeiro');
 box(cab,2.12,.12,.09,trim,0,.83,-.31,'borracha do para-choque Estradeiro');
 box(cab,.50,.17,.06,seal,0,.92,-.302,'placa dianteira Estradeiro');
 for(const side of [-1,1]) box(cab,.22,.11,.07,lamp,side*.83,.90,-.31,'milha auxiliar do Estradeiro');

 // Portas e laterais mais definidas.
 for(const side of [-1,1]){
  const x=side*1.18;
  box(cab,.06,.77,1.28,seal,x,2.38,.95,'moldura lateral da porta Estradeiro');
  box(cab,.07,.60,1.08,darkGlass,x+side*.01,2.40,.93,'vidro lateral do Estradeiro');
  box(cab,.03,.92,.04,steel,x+side*.03,1.60,.48,'vinco da porta Estradeiro');
  box(cab,.035,.92,.04,steel,x+side*.03,1.62,1.92,'linha de porta traseira Estradeiro');
  box(cab,.05,.09,.22,black,x+side*.045,1.90,1.20,'cavidade da maçaneta Estradeiro');
  box(cab,.05,.05,.18,chrome,x+side*.075,1.92,1.20,'maçaneta do Estradeiro');
  box(cab,.07,.13,.30,orange,side*1.16,1.53,.36,'seta lateral Estradeiro');
  box(cab,.54,.11,.84,chrome,side*1.28,.80,.36,'estribo do Estradeiro');
  for(let slot=0;slot<4;slot++) box(cab,.36,.015,.07,black,side*1.33,.86,.08+slot*.17,'ranhura do estribo Estradeiro');
  const fender=new THREE.Mesh(new THREE.TorusGeometry(.70,.05,6,24,Math.PI),tireTrim);
  fender.rotation.y=Math.PI/2;fender.position.set(side*1.19,.60,1.50);fender.name='para-lama curvo do Estradeiro';fender.castShadow=true;cab.add(fender);
  rod(cab,new THREE.Vector3(side*1.18,2.67,.62),new THREE.Vector3(side*1.63,2.67,.60),.026,black);
  rod(cab,new THREE.Vector3(side*1.17,2.28,.68),new THREE.Vector3(side*1.61,2.40,.58),.026,black);
  box(cab,.17,.22,.24,chrome,side*1.64,2.20,.57,'retrovisor principal do Estradeiro');
  box(cab,.15,.16,.20,steel,side*1.60,1.90,.38,'retrovisor de manobra do Estradeiro');
  box(cab,.11,.18,.40,trim,side*1.14,1.92,2.34,'respiro traseiro do Estradeiro');
 }

 // Faixa decorativa e logotipo fictício.
 box(cab,2.30,.08,.08,indicator,0,1.28,1.08,'friso lateral dourado do Estradeiro');
 box(cab,.70,.10,.07,chrome,0,1.92,-.12,'emblema frontal Estradeiro 120');
 if(typeof document!=='undefined'&&typeof document.createElement==='function'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.clearRect(0,0,512,96);ctx.font='900 58px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f3efe4';ctx.fillText('ESTRADEIRO 120',256,48,500);
   const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
   const badge=new THREE.Mesh(new THREE.PlaneGeometry(.82,.08),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
   badge.position.set(0,1.92,-.155);badge.rotation.y=Math.PI;badge.name='logotipo frontal Estradeiro 120';cab.add(badge);
  }
 }
}

export function detailEstradeiroChassis({root,wheels,layout,box}){
 const wheelSteel=new THREE.MeshStandardMaterial({color:'#aab3ae',metalness:.66,roughness:.31});
 const wheelShadow=new THREE.MeshStandardMaterial({color:'#141c1f',roughness:.78});
 const rubber=new THREE.MeshStandardMaterial({color:'#202727',roughness:.94});
 const frame=new THREE.MeshStandardMaterial({color:'#657378',metalness:.42,roughness:.6});
 const amber=new THREE.MeshStandardMaterial({color:'#d59d3d',metalness:.05,roughness:.5});
 const black=new THREE.MeshStandardMaterial({color:'#10171a',roughness:.85});
 for(const wheel of wheels){
  const side=wheel.userData.side,r=wheel.userData.radius;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r*.61,.032,6,18),wheelSteel);ring.rotation.y=Math.PI/2;ring.position.x=side*.205;ring.name='aro estampado do Estradeiro';wheel.add(ring);
  const inner=new THREE.Mesh(new THREE.TorusGeometry(r*.40,.018,5,18),wheelShadow);inner.rotation.y=Math.PI/2;inner.position.x=side*.215;inner.name='rebaixo interno da roda Estradeiro';wheel.add(inner);
  for(let k=0;k<10;k++){
   const angle=k*Math.PI/5;const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.024,.024,.022,6),wheelSteel);bolt.rotation.z=Math.PI/2;bolt.position.set(side*.235,Math.sin(angle)*r*.46,Math.cos(angle)*r*.46);bolt.name='parafuso da roda Estradeiro';wheel.add(bolt);
  }
  for(let k=0;k<12;k++){
   const angle=k*Math.PI/6;const groove=new THREE.Mesh(new THREE.BoxGeometry(.022,.045,.14),rubber);groove.position.set(side*.04,Math.sin(angle)*r*.98,Math.cos(angle)*r*.98);groove.rotation.x=-angle;groove.name='sulco do pneu Estradeiro';wheel.add(groove);
  }
 }
 for(const side of [-1,1]){
  box(root,.11,.30,.82,black,side*1.21,.44,layout.driveAxles[0]+.72,'para-barro traseiro Estradeiro');
  box(root,.11,.08,.56,amber,side*1.26,.36,layout.driveAxles[0]+.72,'refletor traseiro do Estradeiro');
  box(root,.11,.14,1.22,frame,side*1.22,1.19,layout.bodyStart+.75,'viga lateral do Estradeiro');
  box(root,.08,.10,.18,amber,side*1.30,1.30,layout.bodyStart+.14,'lanterna lateral do Estradeiro');
 }
 for(const z of [layout.bodyStart+.25,layout.bodyStart+layout.bodyLength-.25]) box(root,2.54,.07,.07,frame,0,3.63,z,'perfil superior do baú Estradeiro');
}
