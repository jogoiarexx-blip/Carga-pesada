import * as THREE from './vendor/three.module.js';

// Imperador Frontal: cavalo 4x2, cabine avançada SOBRE o motor.
// Todo o detalhe é geometria real. A frente aponta para -Z; o engate permanece intacto.
// Materiais repetidos são compartilhados para reduzir chamadas de renderização após mergeStatic.
export function buildImperadorCab({cab,box,profile,rod,paint,chrome,black,glass,lamp,orange}){
 const charcoal=new THREE.MeshStandardMaterial({color:'#1a292e',metalness:.14,roughness:.71});
 const brushed=new THREE.MeshStandardMaterial({color:'#899a9d',metalness:.65,roughness:.32});
 const glassTint=new THREE.MeshPhysicalMaterial({color:'#547c8d',metalness:.07,roughness:.23,transparent:true,opacity:.91,clearcoat:.44});
 const rubber=new THREE.MeshStandardMaterial({color:'#151b1e',roughness:.91});
 const inset=new THREE.MeshStandardMaterial({color:'#314650',metalness:.27,roughness:.57});

 // Proporções de caminhão pesado europeu/brasileiro com cabine avançada.
 // O conjunto ocupa só 3,27 m atrás da frente, deixando folga até o semirreboque.
 profile(cab,[[.10,1.00],[.10,3.10],[.33,3.74],[.68,4.12],[1.11,4.29],
  [2.71,4.29],[3.02,4.04],[3.21,3.68],[3.21,1.05]],2.48,paint,
  'Imperador Frontal — cabine alta sobre motor');
 box(cab,2.46,.11,1.94,paint,0,4.30,1.76,'teto alto com cantos arredondados Imperador');
 box(cab,2.28,.065,1.80,brushed,0,4.37,1.76,'calha metálica de teto Imperador');
 // Defletor instalado sobre o teto, mas não sobre a área da quinta roda.
 profile(cab,[[2.17,4.26],[2.44,4.56],[2.73,4.60],[3.02,4.31]],2.20,paint,
  'defletor superior discreto Imperador');
 for(const side of [-1,1]){
  box(cab,.08,.23,1.13,paint,side*1.23,4.24,2.30,'ombro aerodinâmico do teto Imperador');
  box(cab,.07,.12,.96,brushed,side*1.25,4.13,2.26,'calha lateral do teto Imperador');
 }

 // Para-brisa dividido e levemente inclinado, com braços de limpador independentes.
 box(cab,2.23,.98,.16,charcoal,0,3.42,-.020,'aro externo do para-brisa Imperador');
 for(const side of [-1,1]){
  box(cab,1.02,.83,.19,glassTint,side*.54,3.43,-.111,'vidro panorâmico dividido Imperador');
  rod(cab,new THREE.Vector3(side*.98,2.98,-.21),new THREE.Vector3(side*.20,3.40,-.22),.019,rubber);
  rod(cab,new THREE.Vector3(side*.20,3.40,-.22),new THREE.Vector3(side*.36,3.45,-.225),.025,rubber);
  box(cab,.08,.07,.08,brushed,side*.93,2.98,-.205,'ancoragem do limpador Imperador');
 }
 box(cab,.075,.94,.19,black,0,3.43,-.207,'coluna central do para-brisa Imperador');
 box(cab,2.27,.080,.15,black,0,2.91,-.207,'guarnição inferior do vidro Imperador');
 box(cab,2.25,.085,.14,paint,0,3.95,-.115,'guarnição superior de cabine Imperador');

 // Painel frontal com 3 zonas: faixa da marca, radiador em profundidade e para-choque.
 box(cab,2.32,1.25,.135,paint,0,1.99,-.025,'máscara da cabine frontal Imperador');
 box(cab,1.65,.95,.18,charcoal,0,1.94,-.132,'radiador recuado Imperador');
 box(cab,1.54,.82,.09,inset,0,1.94,-.240,'núcleo escuro da grade Imperador');
 for(let i=0;i<7;i++){
  box(cab,1.52,.045,.08,brushed,0,1.60+i*.12,-.295,'lâmina horizontal da grade Imperador');
 }
 box(cab,1.76,.055,.105,chrome,0,2.46,-.205,'borda superior cromada da grade Imperador');
 for(const side of [-1,1]){
  const x=side*.96;
  box(cab,.48,.41,.12,charcoal,x,1.62,-.145,'alojamento duplo de farol Imperador');
  box(cab,.33,.14,.155,lamp,x,1.72,-.240,'farol superior Imperador');
  box(cab,.33,.11,.155,lamp,x,1.54,-.240,'farol inferior Imperador');
  box(cab,.31,.068,.08,brushed,x,1.62,-.319,'separador cromado dos faróis Imperador');
  box(cab,.17,.10,.13,orange,side*1.09,1.98,-.236,'pisca âmbar Imperador');
  box(cab,.25,.17,.09,inset,side*.91,1.24,-.175,'respiro inferior de freio Imperador');
 }
 box(cab,2.54,.30,.27,chrome,0,.92,-.185,'para-choque pesado com quinas Imperador');
 box(cab,2.24,.115,.095,rubber,0,.82,-.329,'borracha do para-choque Imperador');
 box(cab,.61,.14,.06,charcoal,0,.99,-.328,'suporte da placa frontal Imperador');
 for(const side of [-1,1])box(cab,.27,.115,.08,lamp,side*.90,.94,-.335,'farol de neblina Imperador');

 // Cabine, portas, janelas e divisor traseiro não se confundem com um simples cubo.
 for(const side of [-1,1]){
  const x=side*1.275;
  box(cab,.065,.94,1.39,charcoal,x,3.34,1.14,'vedação da porta frontal Imperador');
  box(cab,.077,.76,1.24,glassTint,x+side*.014,3.35,1.13,'janela lateral grande Imperador');
  box(cab,.07,.14,.78,black,x+side*.025,2.98,1.21,'pestana inferior da janela Imperador');
  box(cab,.027,1.36,.044,brushed,x+side*.024,2.19,.51,'junta dianteira da porta Imperador');
  box(cab,.027,1.36,.045,brushed,x+side*.024,2.19,2.22,'junta traseira da porta Imperador');
  box(cab,.064,.12,.31,charcoal,x+side*.064,2.41,1.65,'rebaixo de maçaneta Imperador');
  box(cab,.064,.052,.24,chrome,x+side*.083,2.44,1.65,'maçaneta metálica Imperador');
  box(cab,.064,.12,1.44,brushed,x+side*.03,1.70,1.40,'friso da porta Imperador');
  box(cab,.09,.13,.22,orange,x+side*.06,1.96,.50,'repetidor lateral de direção Imperador');

  // Dois degraus realmente separados, sobre piso antiderrapante.
  box(cab,.53,.14,1.07,brushed,side*1.25,1.12,1.26,'estribo superior Imperador');
  box(cab,.56,.13,1.09,chrome,side*1.25,.84,1.26,'estribo inferior Imperador');
  for(let i=0;i<5;i++)box(cab,.38,.019,.058,rubber,side*1.30,.914,.91+i*.17,'ranhura dos degraus Imperador');

  // Suporte duplo de espelho (não na posição da câmera frontal).
  rod(cab,new THREE.Vector3(side*1.19,3.68,.55),new THREE.Vector3(side*1.74,3.54,.43),.034,charcoal);
  rod(cab,new THREE.Vector3(side*1.18,2.77,.65),new THREE.Vector3(side*1.73,3.02,.44),.031,charcoal);
  box(cab,.20,.58,.37,charcoal,side*1.76,3.28,.44,'retrovisor principal Imperador');
  box(cab,.048,.46,.26,brushed,side*1.89,3.28,.44,'vidro do retrovisor principal Imperador');
  box(cab,.16,.22,.23,charcoal,side*1.70,2.75,.52,'espelho auxiliar de ponto cego Imperador');

  // Saia e curva de recorte da roda dianteira com folga para esterçar.
  const fender=new THREE.Mesh(new THREE.TorusGeometry(.765,.065,6,25,Math.PI),paint);
  fender.rotation.y=Math.PI/2;fender.position.set(side*1.25,.73,1.52);
  fender.name='contorno curvo do para-lama Imperador';fender.castShadow=true;cab.add(fender);
  box(cab,.09,.19,.58,paint,side*1.24,1.15,2.42,'saia atrás do para-lama Imperador');
  box(cab,.075,.16,.66,inset,side*1.31,2.50,2.68,'saída de ventilação traseira da cabine Imperador');
  for(let i=0;i<3;i++)box(cab,.080,.022,.50,brushed,side*1.36,2.44+i*.055,2.68,'veneziana de respiro Imperador');
 }

 // Luzes de posição na borda superior e identificação fictícia do fabricante.
 for(let i=-2;i<=2;i++)box(cab,.11,.076,.10,orange,i*.45,4.36,.41,'luz de posição no teto Imperador');
 box(cab,.90,.12,.07,brushed,0,2.64,-.162,'emblema frontal Imperador');
 if(typeof document!=='undefined'&&typeof document.createElement==='function'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=80;
  const ctx=canvas.getContext('2d');if(ctx){
   ctx.clearRect(0,0,512,80);ctx.font='900 61px Arial, sans-serif';ctx.textAlign='center';
   ctx.textBaseline='middle';ctx.fillStyle='#fbf7e8';ctx.fillText('IMPERADOR',256,42,490);
   const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
   const badge=new THREE.Mesh(new THREE.PlaneGeometry(.80,.078),
     new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));
   badge.rotation.y=Math.PI;badge.position.set(0,2.64,-.204);
   badge.name='logotipo frontal Imperador';cab.add(badge);
  }
 }
}

export function detailImperadorChassis({root,wheels,layout,box}){
 // Reaproveita as três classes de material das rodas originais e não acrescenta
 // novos lotes de renderização em cada pivot de roda.
 const shadow=new THREE.MeshStandardMaterial({color:'#1a272a',roughness:.84});
 const frame=new THREE.MeshStandardMaterial({color:'#566568',metalness:.47,roughness:.49});
 const amber=new THREE.MeshStandardMaterial({color:'#e9a84f',metalness:.05,roughness:.48});
 for(const wheel of wheels){
  const side=wheel.userData.side,r=wheel.userData.radius;
  const parts=wheel.children.filter(o=>o.isMesh);
  const tyre=parts[0].material,metal=parts[1].material,dark=parts[2].material;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r*.63,.031,6,16),metal);
  ring.rotation.y=Math.PI/2;ring.position.x=side*.213;
  ring.name='aro estampado Imperador';wheel.add(ring);
  const inner=new THREE.Mesh(new THREE.TorusGeometry(r*.41,.019,5,16),dark);
  inner.rotation.y=Math.PI/2;inner.position.x=side*.220;
  inner.name='anel interno das rodas Imperador';wheel.add(inner);
  for(let i=0;i<10;i++){
   const a=i*Math.PI/5,bolt=new THREE.Mesh(new THREE.CylinderGeometry(.023,.023,.022,5),metal);
   bolt.rotation.z=Math.PI/2;
   bolt.position.set(side*.245,Math.sin(a)*r*.45,Math.cos(a)*r*.45);
   bolt.name='parafuso da roda Imperador';wheel.add(bolt);
  }
  for(let i=0;i<10;i++){
   const a=i*Math.PI/5,tread=new THREE.Mesh(new THREE.BoxGeometry(.022,.051,.125),tyre);
   tread.position.set(side*.045,Math.sin(a)*r*.980,Math.cos(a)*r*.980);
   tread.rotation.x=-a;tread.name='banda de rodagem Imperador';wheel.add(tread);
  }
 }
 for(const side of [-1,1]){
  box(root,.12,.32,.73,shadow,side*1.23,.54,layout.driveAxles[0]+.54,'para-barro cavalo Imperador');
  box(root,.08,.09,.45,amber,side*1.30,.37,layout.driveAxles[0]+.55,'refletor do para-barro Imperador');
  box(root,.51,.65,.95,frame,side*1.05,.94,layout.front+4.76,'tanque lateral Imperador');
  box(root,.53,.10,.97,shadow,side*1.05,1.27,layout.front+4.76,'faixa de tanque Imperador');
  box(root,.08,.10,.22,amber,side*1.31,1.25,layout.front+5.40,'luz de posição lateral Imperador');
  box(root,.10,.33,.66,frame,side*1.09,1.07,layout.front+3.52,'fechamento da lateral Imperador');
 }
 for(const z of [layout.front+4.24,layout.front+4.82,layout.front+5.55])
  box(root,1.62,.12,.15,frame,0,1.19,z,'travessa de chassi Imperador');
 box(root,1.00,.10,.42,shadow,0,1.31,layout.hitch-.14,'base reforçada da quinta roda Imperador');
}
