import * as THREE from './vendor/three.module.js';

// Rochedo 160: cabine de caminhão rígido pesado e conjunto de quatro eixos.
// Todas as peças ficam no sistema de coordenadas do caminhão existente:
// o nariz aponta para -Z e os pivôs de roda são mantidos pelo truck-model.
export function buildRochedoCab({cab,box,profile,rod,paint,chrome,black,glass,lamp,orange}) {
 const gasket=new THREE.MeshStandardMaterial({color:'#101b20',roughness:.87});
 const grill=new THREE.MeshStandardMaterial({color:'#25343b',metalness:.25,roughness:.63});
 const mesh=new THREE.MeshStandardMaterial({color:'#121d21',metalness:.28,roughness:.75});
 const brushed=new THREE.MeshStandardMaterial({color:'#9aa6a6',metalness:.72,roughness:.37});
 const window=new THREE.MeshPhysicalMaterial({color:'#36616b',metalness:.18,roughness:.17,clearcoat:.52,transparent:true,opacity:.91,depthWrite:false});
 const darkPaint=new THREE.MeshStandardMaterial({color:'#536569',metalness:.35,roughness:.55});
 const orangeLight=new THREE.MeshStandardMaterial({color:'#d88d3a',roughness:.35,emissive:'#4a2505',emissiveIntensity:.22});
 const redLight=new THREE.MeshStandardMaterial({color:'#b64337',roughness:.38});
 const tireTrim=new THREE.MeshStandardMaterial({color:'#131e21',roughness:.92});

 // Cabine alta com teto chanfrado e traseira marcada — não reaproveita a caixa frontal genérica.
 profile(cab,[[.08,1.04],[.08,3.42],[.36,3.92],[.82,4.18],[2.49,4.18],[2.83,3.94],[2.91,1.04],
  [2.55,1.04],[2.29,1.25],[1.92,1.36],[1.25,1.36],[.89,1.25],[.73,1.04]],2.50,paint,'Rochedo 160 — cabine alta exclusiva');
 box(cab,2.42,.10,2.10,paint,0,4.15,1.44,'teto reforçado do Rochedo');
 box(cab,2.39,.07,.20,brushed,0,4.13,.36,'calha superior da cabine pesada');
 for(const side of [-1,1]){
  box(cab,.07,.13,1.58,darkPaint,side*1.18,4.08,1.43,'vinco estrutural do teto');
  box(cab,.20,.11,.18,orangeLight,side*.85,4.21,.26,'luz de cabine no teto');
 }
 box(cab,.24,.11,.18,orangeLight,0,4.21,.26,'luz central de cabine');

 // Para-brisa com vedação, duas folhas e divisória. O vidro recua junto ao topo da cabine.
 box(cab,2.29,.94,.095,gasket,0,3.30,-.01,'moldura do para-brisa do Rochedo');
 for(const side of [-1,1]){
  box(cab,1.025,.77,.108,window,side*.541,3.33,-.080,'vidro principal do Rochedo');
  box(cab,.035,.83,.13,brushed,side*1.125,3.33,-.10,'coluna lateral do para-brisa');
  rod(cab,new THREE.Vector3(side*.94,2.85,-.17),new THREE.Vector3(side*.20,3.22,-.17),.018,gasket);
  box(cab,.07,.034,.06,black,side*.88,2.84,-.18,'base do limpador de caminhão pesado');
 }
 box(cab,.067,.88,.14,gasket,0,3.31,-.105,'divisor central do para-brisa pesado');
 box(cab,2.26,.09,.11,paint,0,3.77,-.02,'viseira inferior do teto');
 box(cab,2.22,.095,.12,brushed,0,2.79,-.06,'friso inferior do vidro');

 // Frontal próprio do pesado. A grade tem profundidade e elementos horizontais escalonados.
 box(cab,2.35,1.57,.12,paint,0,1.91,-.020,'painel dianteiro fundido Rochedo');
 box(cab,1.66,1.20,.16,gasket,0,1.91,-.12,'rebaixo da grade de radiador Rochedo');
 box(cab,1.54,1.04,.17,mesh,0,1.93,-.19,'tela interna do radiador');
 for(let n=0;n<8;n++)box(cab,1.47,.050,.064,brushed,0,1.48+n*.137,-.28,'aleta horizontal do radiador');
 box(cab,1.56,.055,.07,chrome,0,2.48,-.28,'travessa superior cromada');
 box(cab,1.58,.07,.07,chrome,0,1.40,-.28,'travessa inferior cromada');
 for(const side of [-1,1]){
  const x=side*1.02;
  box(cab,.53,.44,.16,gasket,x,1.65,-.13,'carcaça de farol pesado Rochedo');
  box(cab,.40,.17,.16,lamp,x,1.71,-.233,'lente de farol baixo Rochedo');
  box(cab,.35,.14,.16,lamp,x,1.49,-.233,'lente de farol alto Rochedo');
  box(cab,.39,.085,.15,orangeLight,x,1.95,-.214,'pisca frontal pesado');
  box(cab,.10,.45,.09,darkPaint,side*1.23,1.65,-.116,'moldura vertical do painel frontal');
  box(cab,.15,.11,.06,mesh,side*1.07,2.49,-.126,'respiro superior do painel');
 }
 box(cab,2.62,.27,.31,chrome,0,.92,-.10,'para-choque pesado do Rochedo');
 box(cab,2.48,.12,.12,gasket,0,.84,-.285,'batente de borracha do para-choque pesado');
 box(cab,.62,.18,.09,gasket,0,.94,-.32,'placa de registro pesada');
 for(const side of [-1,1])box(cab,.27,.12,.08,lamp,side*.98,.94,-.33,'farol auxiliar do para-choque');

 // Portas com juntas, janela bipartida, maçanetas e estribos em dois níveis.
 for(const side of [-1,1]){
  const x=side*1.27;
  box(cab,.065,1.14,1.48,gasket,x,3.10,1.05,'guarnição lateral de janela pesada');
  box(cab,.068,.91,1.29,window,x+side*.012,3.12,1.05,'janela lateral ampla Rochedo');
  box(cab,.07,.85,.045,brushed,x+side*.04,2.23,.48,'vinco da porta dianteira pesada');
  box(cab,.07,.82,.045,brushed,x+side*.04,2.28,1.80,'vinco da porta traseira pesada');
  box(cab,.054,.095,.30,gasket,x+side*.05,2.28,1.31,'rebaixo de maçaneta pesada');
  box(cab,.056,.055,.22,chrome,x+side*.083,2.31,1.31,'maçaneta externa Rochedo');
  box(cab,.078,.11,1.63,darkPaint,x+side*.028,1.67,1.34,'friso de reforço lateral do Rochedo');
  box(cab,.11,.16,.37,orangeLight,side*1.25,1.95,.37,'seta de lateral de cabine');
  for(const y of [.75,1.00]){
   box(cab,.49,.10,.87,brushed,side*1.34,y,.56,'estribo duplo antiderrapante Rochedo');
   for(let i=0;i<4;i++)box(cab,.34,.015,.045,gasket,side*1.38,y+.057,.30+i*.16,'ranhura antiderrapante do estribo');
  }
  const fender=new THREE.Mesh(new THREE.TorusGeometry(.79,.058,7,28,Math.PI),tireTrim);
  fender.rotation.y=Math.PI/2;fender.position.set(side*1.27,.68,1.52);fender.name='arco de para-lama pesado Rochedo';cab.add(fender);
  rod(cab,new THREE.Vector3(side*1.24,3.52,.51),new THREE.Vector3(side*1.78,3.52,.42),.035,gasket);
  rod(cab,new THREE.Vector3(side*1.24,2.79,.58),new THREE.Vector3(side*1.76,2.97,.42),.035,gasket);
  box(cab,.19,.38,.33,black,side*1.79,3.13,.42,'retrovisor principal de caminhão pesado');
  box(cab,.17,.22,.25,brushed,side*1.76,2.68,.42,'espelho de ponto cego Rochedo');
  box(cab,.15,.31,.44,mesh,side*1.21,2.56,2.55,'saída de ar lateral do Rochedo');
  for(let i=0;i<3;i++)box(cab,.15,.025,.32,brushed,side*1.29,2.48+i*.08,2.55,'veneziana de ventilação lateral');
 }
 box(cab,.65,.11,.07,chrome,0,2.63,-.136,'emblema Rochedo 160');
 // Baixo custo de triângulos: identidade é inscrita apenas no mesh opcional do navegador.
 if(typeof document!=='undefined'&&typeof document.createElement==='function'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=80;
  const ctx=canvas.getContext('2d');if(ctx){
   ctx.font='900 57px Arial, sans-serif';ctx.fillStyle='#f4f2e9';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillText('ROCHEDO 160',256,40,480);
   const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
   const badge=new THREE.Mesh(new THREE.PlaneGeometry(.64,.081),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
   badge.position.set(0,2.63,-.174);badge.rotation.y=Math.PI;
   badge.name='marca Rochedo na grade frontal';cab.add(badge);
  }
 }
}

export function detailRochedoAxles({root,wheels,layout,box,chrome,black,rubber}){
 // Reutiliza os materiais das rodas que já entram no merge por material.
 // Evita três draw calls extras POR RODA sem perder porcas, aros e banda do pneu.
 const polished=chrome||new THREE.MeshStandardMaterial({color:'#aab5b3',metalness:.65,roughness:.32});
 const shadow=black||new THREE.MeshStandardMaterial({color:'#1b2528',metalness:.3,roughness:.69});
 const tread=rubber||new THREE.MeshStandardMaterial({color:'#1a2022',roughness:.96});
 const chassis=new THREE.MeshStandardMaterial({color:'#515f62',metalness:.41,roughness:.64});
 const reflector=new THREE.MeshStandardMaterial({color:'#db9639',roughness:.40});
 const mudflapRubber=rubber||new THREE.MeshStandardMaterial({color:'#131b1e',roughness:.95});
 for(const wheel of wheels){
  const side=wheel.userData.side,r=wheel.userData.radius;
  const lip=new THREE.Mesh(new THREE.TorusGeometry(r*.62,.036,6,20),polished);
  lip.rotation.y=Math.PI/2;lip.position.x=side*.214;lip.name='aro pesado Rochedo';wheel.add(lip);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r*.39,.027,6,20),shadow);
  ring.rotation.y=Math.PI/2;ring.position.x=side*.221;ring.name='anel central de roda pesada';wheel.add(ring);
  for(let n=0;n<10;n++){
   const angle=n*Math.PI/5;
   const nut=new THREE.Mesh(new THREE.CylinderGeometry(.030,.030,.026,6),polished);
   nut.rotation.z=Math.PI/2;nut.position.set(side*.236,Math.sin(angle)*r*.45,Math.cos(angle)*r*.45);
   nut.name='porca de roda Rochedo';wheel.add(nut);
  }
  for(let n=0;n<14;n++){
   const angle=n*2*Math.PI/14;
   const rib=new THREE.Mesh(new THREE.BoxGeometry(.028,.075,.12),tread);
   rib.position.set(side*.055,Math.sin(angle)*r*.972,Math.cos(angle)*r*.972);
   rib.rotation.x=-angle;rib.name='ranhura pneu carga pesada';wheel.add(rib);
  }
 }
 // Três eixos traseiros, com para-barros e suportes próprios.
 for(const z of layout.driveAxles){
  for(const side of [-1,1]){
   box(root,.11,.21,.65,mudflapRubber,side*1.29,.57,z+.62,'saia de para-barro da tração');
   box(root,.085,.09,.25,reflector,side*1.33,.57,z+.65,'refletor por eixo de tração');
   box(root,.15,.11,1.28,chassis,side*1.13,1.25,z,'viga de suspensão traseira');
  }
 }
 for(const side of [-1,1]){
  box(root,.095,.13,1.22,chassis,side*1.20,1.34,layout.bodyStart+.66,'protetor lateral pesado Rochedo');
  box(root,.11,.13,.31,reflector,side*1.27,1.41,layout.bodyStart+.19,'lanterna de posição lateral Rochedo');
 }
 // Perfil superior do baú alongado, sem alterar sua geometria ou pontos de encaixe.
 const zEnd=layout.bodyStart+layout.bodyLength;
 for(const z of [layout.bodyStart+.20,zEnd-.20])box(root,2.56,.07,.08,chassis,0,4.05,z,'reforço superior do baú Rochedo');
}
