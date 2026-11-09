import * as THREE from './vendor/three.module.js';

// Cavalo mecânico de capô longo, original do jogo. Eixo local Z aponta para trás.
// Todas as peças usam a pintura dinâmica já aplicada pelo motor à cabine.
export function buildPeregrinoCab({cab,box,profile,rod,paint,chrome,black,glass,lamp,orange}) {
 const tireRubber=new THREE.MeshStandardMaterial({color:'#1b2021',roughness:.90});
 const dark=new THREE.MeshStandardMaterial({color:'#202a30',metalness:.16,roughness:.63});
 const grille=new THREE.MeshStandardMaterial({color:'#1b252a',metalness:.25,roughness:.63});
 const brushed=new THREE.MeshStandardMaterial({color:'#aab3ad',metalness:.62,roughness:.36});
 const polished=new THREE.MeshStandardMaterial({color:'#d3d9d5',metalness:.84,roughness:.21});
 const smoked=new THREE.MeshPhysicalMaterial({color:'#4b7885',metalness:.08,roughness:.21,transparent:true,opacity:.92,clearcoat:.4});
 const amber=new THREE.MeshStandardMaterial({color:'#f7af43',metalness:.10,roughness:.36});

 // Capô amplo, declive da frente, tampa e linhas de chapa. A cabine é elevada
 // atrás da saída do capô; o dormitório é integralmente separado da cabine.
 profile(cab,[[.10,1.08],[.10,2.01],[.34,2.20],[.88,2.38],[1.95,2.54],[2.23,2.55],[2.23,1.07]],2.18,paint,'Peregrino — capô longo perfilado');
 box(cab,2.13,.065,1.52,paint,0,2.50,1.47,'tampa larga do capô Peregrino');
 box(cab,1.92,.025,1.37,brushed,0,2.54,1.48,'vinco central da tampa do motor');
 for(const side of [-1,1]){
  box(cab,.045,.064,1.40,brushed,side*1.01,2.51,1.47,'filete lateral de capô');
  for(let i=0;i<7;i++)box(cab,.045,.023,.13,grille,side*1.105,2.13,1.16+i*.12,'veneziana de ar lateral do capô');
 }

 // Máscara frontal com grade profunda e aletas verticais cromadas.
 box(cab,1.80,1.18,.18,grille,0,1.66,.01,'radiador profundo Peregrino');
 box(cab,1.92,1.30,.055,polished,0,1.66,-.105,'aro da grade monumental Peregrino');
 box(cab,1.70,1.09,.085,dark,0,1.66,-.15,'miolo escuro da grade Peregrino');
 for(let i=-5;i<=5;i++)box(cab,.065,1.00,.06,polished,i*.135,1.66,-.219,'filete vertical do radiador Peregrino');
 box(cab,1.72,.065,.065,polished,0,2.22,-.22,'travessa superior da grade');
 box(cab,1.83,.05,.06,polished,0,1.09,-.22,'travessa inferior da grade');

 // Para-lamas dianteiros e suportes dos faróis circulares em metal.
 for(const side of [-1,1]){
  const x=side*1.08;
  const fender=new THREE.Mesh(new THREE.TorusGeometry(.74,.11,8,26,Math.PI),paint);
  fender.rotation.y=Math.PI/2;fender.position.set(side*1.14,.68,1.72);
  fender.name='arco metálico de para-lama dianteiro Peregrino';fender.castShadow=true;cab.add(fender);
  box(cab,.34,.37,.46,paint,x,1.43,.40,'ombreira do farol Peregrino');
  box(cab,.42,.37,.25,dark,x,1.62,-.07,'suporte de farol redondo Peregrino');
  const bezel=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.10,20),polished);
  bezel.rotation.x=Math.PI/2;bezel.position.set(x,1.62,-.23);
  bezel.name='aro circular cromado de farol Peregrino';cab.add(bezel);
  const lens=new THREE.Mesh(new THREE.CylinderGeometry(.164,.164,.025,20),lamp);
  lens.rotation.x=Math.PI/2;lens.position.set(x,1.62,-.29);
  lens.name='lente do farol circular Peregrino';cab.add(lens);
  box(cab,.22,.095,.13,amber,x,1.98,-.20,'pisca âmbar dianteiro Peregrino');
 }
 box(cab,2.50,.28,.37,polished,0,.90,-.08,'para-choque de aço clássico Peregrino');
 box(cab,2.13,.085,.07,dark,0,.85,-.22,'borracha central do para-choque Peregrino');
 box(cab,.52,.16,.07,grille,0,.93,-.23,'placa frontal Peregrino');
 for(const side of [-1,1])box(cab,.22,.095,.07,lamp,side*.82,.92,-.265,'luz auxiliar do para-choque');

 // Cabine elevada e paralela ao capô; cortinas/vedações, portas e aerografia.
 profile(cab,[[2.03,1.10],[2.03,2.87],[2.39,3.27],[2.70,3.65],[3.71,3.65],[3.94,3.41],[3.94,1.1]],2.44,paint,'Peregrino — cabine elevada original');
 box(cab,2.40,.11,1.55,paint,0,3.65,3.09,'teto da cabine Peregrino');
 box(cab,2.30,.075,1.35,polished,0,3.715,3.08,'calha no teto do Peregrino');
 box(cab,2.31,.85,.14,dark,0,3.03,2.08,'moldura de para-brisa inclinada Peregrino');
 for(const side of [-1,1]){
  box(cab,1.055,.70,.15,smoked,side*.545,3.04,2.02,'vidro panorâmico dianteiro Peregrino');
  rod(cab,new THREE.Vector3(side*.71,2.64,1.93),new THREE.Vector3(side*.17,2.95,1.93),.018,tireRubber);
 }
 box(cab,.065,.80,.17,dark,0,3.05,1.93,'coluna divisória do vidro Peregrino');
 box(cab,2.24,.09,.17,paint,0,3.47,2.00,'moldura superior do para-brisa Peregrino');
 box(cab,2.30,.09,.17,polished,0,2.59,2.00,'friso inferior do para-brisa Peregrino');
 for(const side of [-1,1]){
  const x=side*1.247;
  box(cab,.065,.77,1.11,dark,x,3.12,3.09,'moldura janela da porta Peregrino');
  box(cab,.076,.62,.94,glass,x+side*.01,3.14,3.08,'janela lateral de cabine Peregrino');
  box(cab,.056,.11,.24,dark,x+side*.055,2.43,3.11,'rebaixo maçaneta de porta Peregrino');
  box(cab,.055,.06,.21,polished,x+side*.075,2.45,3.11,'maçaneta cromada Peregrino');
  box(cab,.035,1.13,.06,brushed,x+side*.035,1.86,2.60,'junta dianteira da porta Peregrino');
  box(cab,.035,1.14,.06,brushed,x+side*.035,1.86,3.82,'junta traseira da porta Peregrino');
  box(cab,.055,.12,1.45,polished,x+side*.035,1.66,3.15,'faixa cromada lateral Peregrino');
  box(cab,.067,.13,.34,orange,x,2.16,2.37,'seta lateral do Peregrino');
  box(cab,.56,.15,1.08,polished,side*1.23,.91,3.10,'estribo duplo inferior Peregrino');
  box(cab,.52,.11,.98,brushed,side*1.23,1.18,3.10,'segundo estribo do Peregrino');
  for(let i=0;i<4;i++)box(cab,.40,.02,.065,tireRubber,side*1.29,1.26,2.78+i*.18,'sulco antiderrapante estribo Peregrino');
  rod(cab,new THREE.Vector3(side*1.16,3.29,2.57),new THREE.Vector3(side*1.73,3.28,2.51),.035,dark);
  rod(cab,new THREE.Vector3(side*1.17,2.62,2.70),new THREE.Vector3(side*1.71,2.64,2.52),.035,dark);
  box(cab,.18,.55,.35,dark,side*1.75,3.06,2.51,'carcaça de espelho de caminhão clássico');
  box(cab,.05,.42,.24,polished,side*1.85,3.06,2.51,'lente de espelho lateral Peregrino');
 }

 // Dormitório com teto mais alto que a cabine, janelas próprias e separação de chapa.
 profile(cab,[[3.70,1.15],[3.72,3.94],[4.05,4.25],[4.30,4.32],[5.36,4.32],[5.48,4.07],[5.48,1.15]],2.48,paint,'Peregrino — dormitório alto independente');
 box(cab,2.36,.095,1.13,paint,0,4.34,4.86,'teto elevado do dormitório Peregrino');
 box(cab,2.38,.08,.09,brushed,0,4.39,4.30,'vinco frontal de teto dormitório');
 for(const side of [-1,1]){
  const x=side*1.275;
  box(cab,.08,.58,1.11,dark,x,3.61,4.68,'moldura janela do dormitório Peregrino');
  box(cab,.085,.42,.93,smoked,x+side*.012,3.64,4.68,'janela escura do dormitório Peregrino');
  box(cab,.085,.10,1.42,polished,x+side*.024,2.62,4.72,'friso cromado do dormitório Peregrino');
  for(let k=0;k<5;k++)box(cab,.095,.023,.09,brushed,x+side*.018,2.46,4.36+k*.17,'respiro lateral do dormitório Peregrino');
 }
 box(cab,.16,.08,1.85,brushed,0,4.42,4.79,'travessa de teto dormitório');
 // Luzes de marcação originais (cinco pontos iluminados na cabine).
 for(let i=-2;i<=2;i++){
  box(cab,.14,.10,.13,amber,i*.42,3.74,2.43,'luz de posição da cabine Peregrino');
 }

 // Escapamentos duplos, guardados em grupo dinâmico para ocultá-los quando
 // o jogador instala seu conjunto de escapamento na oficina.
 const exhausts=new THREE.Group();exhausts.name='escapamentos originais Peregrino';
 exhausts.userData.dynamic=true;cab.add(exhausts);
 const metal=new THREE.MeshStandardMaterial({color:'#acb3b4',metalness:.82,roughness:.28});
 for(const side of [-1,1]){
  const x=side*1.47,z=3.99;
  const tube=new THREE.Mesh(new THREE.CylinderGeometry(.095,.13,3.38,12),metal);
  tube.position.set(x,2.60,z);tube.name='chaminé cromada original Peregrino';tube.castShadow=true;exhausts.add(tube);
  const lip=new THREE.Mesh(new THREE.TorusGeometry(.099,.026,6,12),polished);
  lip.rotation.x=Math.PI/2;lip.position.set(x,4.29,z);lip.name='boca escapamento cromado Peregrino';exhausts.add(lip);
  const shield=new THREE.Mesh(new THREE.CylinderGeometry(.128,.128,.9,10,1,true),brushed);
  shield.position.set(x,2.27,z);shield.name='protetor térmico do escapamento Peregrino';exhausts.add(shield);
  for(const yy of [1.65,2.88])rod(cab,new THREE.Vector3(side*1.25,yy,z),new THREE.Vector3(x,yy,z),.025,polished);
 }

 // Emblema original para não copiar marcas reais.
 box(cab,.76,.12,.06,polished,0,2.31,-.15,'emblema frontal Peregrino Clássico');
 if(typeof document!=='undefined'&&typeof document.createElement==='function'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;
  const ctx=canvas.getContext('2d');if(ctx){
   ctx.font='900 57px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillStyle='#f3efde';ctx.fillText('PEREGRINO',256,48,500);
   const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
   const badge=new THREE.Mesh(new THREE.PlaneGeometry(.72,.08),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));
   badge.rotation.y=Math.PI;badge.position.set(0,2.31,-.192);
   badge.name='logotipo frontal Peregrino';cab.add(badge);
  }
 }
 return exhausts;
}

export function detailPeregrinoChassis({root,wheels,layout,box}){
 const bolts=new THREE.MeshStandardMaterial({color:'#323c42',metalness:.42,roughness:.47});
 const metal=new THREE.MeshStandardMaterial({color:'#aeb8b7',metalness:.68,roughness:.30});
 const saddle=new THREE.MeshStandardMaterial({color:'#171f22',metalness:.23,roughness:.61});
 const amber=new THREE.MeshStandardMaterial({color:'#f0ac44',roughness:.48});
 const red=new THREE.MeshStandardMaterial({color:'#c94e39',roughness:.48});
 // Detalhamento ligado aos pivôs de cada roda (incluindo três eixos da carreta).
 for(const wheel of wheels){
  const side=wheel.userData.side,r=wheel.userData.radius;
  // Reusa os três materiais já presentes nas rodas para evitar uma draw call extra
  // por material, por eixo, quando o motor faz mergeStatic no pivot da roda.
  const original=wheel.children.filter(child=>child.isMesh);
  const wheelChrome=original[1].material,wheelDark=original[2].material,wheelRubber=original[0].material;
  const chromeRing=new THREE.Mesh(new THREE.TorusGeometry(r*.60,.028,6,18),wheelChrome);
  chromeRing.rotation.y=Math.PI/2;chromeRing.position.x=side*.208;
  chromeRing.name='aro pesado com anel Peregrino';wheel.add(chromeRing);
  for(let k=0;k<10;k++){
   const a=k*Math.PI/5,lug=new THREE.Mesh(new THREE.CylinderGeometry(.024,.024,.022,6),wheelDark);
   lug.rotation.z=Math.PI/2;lug.position.set(side*.245,Math.sin(a)*r*.43,Math.cos(a)*r*.43);
   lug.name='dez porcas de roda Peregrino';wheel.add(lug);
  }
  for(let k=0;k<14;k++){
   const a=k*2*Math.PI/14;
   const tread=new THREE.Mesh(new THREE.BoxGeometry(.028,.063,.11),wheelRubber);
   tread.position.set(side*.045,Math.sin(a)*r*.982,Math.cos(a)*r*.982);
   tread.rotation.x=-a;tread.name='bloco da banda de rodagem Peregrino';wheel.add(tread);
  }
 }
 // Travessas e fixadores do conjunto tractor, visíveis no intervalo chassi-cabine.
 for(const z of [layout.front+5.6,layout.front+6.2,layout.front+7.3])
  box(root,1.70,.13,.15,saddle,0,1.18,z,'travessa do cavalo mecânico Peregrino');
 for(const side of [-1,1]){
  box(root,.50,.72,1.63,metal,side*1.02,.99,layout.front+5.72,'tanque oval grande Peregrino');
  box(root,.54,.10,1.68,bolts,side*1.02,1.14,layout.front+5.72,'cinta metálica de tanque Peregrino');
  for(const z of layout.driveAxles){
   box(root,.17,.36,.68,saddle,side*1.24,.46,z+.62,'para-barro traseiro cavalo Peregrino');
  }
  box(root,.12,.08,.28,amber,side*1.31,1.30,layout.front+6.30,'refletor lateral chassi Peregrino');
  box(root,.12,.12,.20,red,side*1.25,.62,layout.front+8.00,'lanterna auxiliar traseira Peregrino');
 }
 // Placa e suporte fixos perto da quinta roda; articulação original é preservada.
 box(root,.84,.10,.45,saddle,0,1.29,layout.hitch-.24,'suporte da quinta roda Peregrino');
 box(root,.48,.08,.26,metal,0,1.34,layout.hitch-.08,'guia cromada do engate Peregrino');
}
