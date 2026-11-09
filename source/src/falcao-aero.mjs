import * as THREE from './vendor/three.module.js';

// Cavalo mecânico aerodinâmico contemporâneo, modelado com geometria leve.
// O eixo local +Z aponta para o fundo do caminhão, -Z para a frente.
// Nenhuma peça altera colisão, física, encaixes da carreta ou dados salvos.
export function buildFalcaoCab({cab,box,profile,rod,paint,chrome,black,glass,lamp,orange}){
 const shadow=new THREE.MeshStandardMaterial({color:'#14232c',metalness:.18,roughness:.65});
 const grille=new THREE.MeshStandardMaterial({color:'#283e4a',metalness:.35,roughness:.59});
 const brushed=new THREE.MeshStandardMaterial({color:'#a3b4ba',metalness:.62,roughness:.34});
 const shiny=new THREE.MeshStandardMaterial({color:'#d4dfe1',metalness:.79,roughness:.24});
 const smoked=new THREE.MeshPhysicalMaterial({color:'#547986',metalness:.06,roughness:.19,transparent:true,opacity:.91,clearcoat:.44});
 const marker=new THREE.MeshStandardMaterial({color:'#e4a751',metalness:.08,roughness:.34});
 const accent=new THREE.MeshStandardMaterial({color:'#405865',metalness:.24,roughness:.48});
 const tyreTrim=new THREE.MeshStandardMaterial({color:'#111a20',roughness:.88});

 // Capô longo e inclinado. A linha de cintura sobe progressivamente em direção à cabine.
 profile(cab,[[.10,1.02],[.10,1.68],[.29,1.91],[.86,2.13],[1.45,2.38],[2.33,2.64],[2.49,2.59],[2.49,1.02]],2.28,paint,'Falcão Aero — capô aerodinâmico esculpido');
 profile(cab,[[.18,1.78],[.62,2.05],[1.43,2.35],[2.26,2.58],[2.33,2.48]],2.04,paint,'crista central aerodinâmica do capô');
 for(const side of [-1,1]){
  box(cab,.035,.046,1.70,brushed,side*1.05,2.40,1.45,'filete lateral do capô Falcão');
  for(let i=0;i<4;i++)box(cab,.05,.04,.14,grille,side*1.133,1.96,1.45+i*.18,'respiro lateral do motor Falcão');
 }

 // Conjunto de cabine alta e dormitorío perfilado, com transição suave e teto integrado.
 profile(cab,[[2.16,1.08],[2.20,2.82],[2.48,3.36],[2.84,3.80],[3.40,4.22],[3.98,4.49],[5.43,4.54],[5.59,4.31],[5.59,1.08]],2.48,paint,'Falcão Aero — cabine com teto alto contínuo');
 profile(cab,[[3.24,3.91],[3.65,4.37],[4.17,4.53],[5.30,4.53],[5.46,4.36]],2.30,paint,'defletor integrado de teto Falcão');
 box(cab,2.29,.07,1.13,paint,0,4.57,4.82,'fecho superior do teto do Falcão');
 box(cab,2.31,.06,.09,brushed,0,4.60,4.15,'calha transversal superior Falcão');
 for(const side of [-1,1]){
  // Molduras altas do dormitório integram-se à parede lateral e reduzem o vão aerodinâmico.
  box(cab,.09,1.18,1.42,accent,side*1.26,3.25,4.69,'carenagem lateral de dormitório Falcão');
  box(cab,.085,.56,1.05,shadow,side*1.32,3.62,4.69,'moldura de janela dormitório Falcão');
  box(cab,.092,.43,.92,smoked,side*1.34,3.62,4.70,'janela do dormitório Falcão');
  box(cab,.085,.13,1.30,paint,side*1.30,4.01,4.69,'pala da janela do dormitório Falcão');
 }

 // Para-brisa panorâmico, sem copiar marcas reais, com vedação e dois limpadores.
 box(cab,2.29,.96,.17,shadow,0,3.08,2.14,'moldura de para-brisa panorâmico Falcão');
 box(cab,2.10,.79,.18,smoked,0,3.08,2.045,'para-brisa panorâmico fumê Falcão');
 box(cab,2.23,.07,.17,brushed,0,3.57,2.04,'friso superior de vidro Falcão');
 box(cab,2.25,.07,.17,shadow,0,2.61,2.03,'vedação inferior do vidro Falcão');
 for(const side of [-1,1]){
  rod(cab,new THREE.Vector3(side*.91,2.66,1.94),new THREE.Vector3(side*.25,3.15,1.93),.018,tyreTrim);
  rod(cab,new THREE.Vector3(side*.25,3.15,1.93),new THREE.Vector3(side*.42,3.17,1.92),.024,tyreTrim);
 }

 // Frente em V discreto, grade com lâminas e duas entradas de ar inferiores.
 box(cab,1.65,1.05,.15,grille,0,1.56,-.015,'máscara de grade frontal profunda Falcão');
 box(cab,1.58,.88,.08,shadow,0,1.59,-.100,'miolo da grade em V Falcão');
 for(let i=0;i<6;i++)box(cab,1.45,.042,.055,shiny,0,1.26+i*.127,-.155,'aletinha cromada de grade Falcão');
 box(cab,1.68,.09,.10,brushed,0,2.17,-.11,'borda superior da grade Falcão');
 for(const side of [-1,1]){
  const x=side*.96;
  box(cab,.49,.31,.17,shadow,x,1.68,-.083,'nicho do farol LED Falcão');
  box(cab,.38,.13,.18,lamp,x,1.75,-.18,'assinatura luminosa dianteira Falcão');
  box(cab,.35,.055,.19,shiny,x,1.59,-.20,'friso cromado no farol Falcão');
  box(cab,.16,.11,.13,orange,side*1.09,1.99,-.16,'seta dianteira Falcão');
  box(cab,.22,.20,.13,grille,side*.83,1.15,-.11,'entrada de ar de freio Falcão');
 }
 box(cab,2.50,.31,.31,paint,0,.88,-.12,'para-choque aerodinâmico Falcão');
 box(cab,1.92,.12,.11,shadow,0,.82,-.23,'entrada inferior de ar Falcão');
 box(cab,2.27,.07,.10,brushed,0,.69,-.245,'lâmina do spoiler dianteiro Falcão');
 box(cab,.52,.12,.07,shadow,0,.98,-.245,'placa dianteira Falcão');
 for(const side of [-1,1])box(cab,.28,.10,.09,lamp,side*.93,.93,-.255,'farol auxiliar embutido Falcão');

 // Portas altas com janelas independentes, espelhos externos e frisos.
 for(const side of [-1,1]){
  const x=side*1.273;
  box(cab,.060,.86,1.29,shadow,x,3.31,3.27,'vedação da porta Falcão');
  box(cab,.07,.70,1.12,glass,x+side*.014,3.32,3.27,'janela lateral ampla Falcão');
  box(cab,.035,1.24,.042,brushed,x+side*.025,2.04,2.73,'junta dianteira da porta Falcão');
  box(cab,.035,1.25,.042,brushed,x+side*.025,2.03,3.91,'junta traseira da porta Falcão');
  box(cab,.065,.10,.28,shadow,x+side*.06,2.49,3.48,'rebaixo da maçaneta Falcão');
  box(cab,.065,.05,.22,shiny,x+side*.075,2.52,3.48,'maçaneta cromada Falcão');
  box(cab,.068,.14,1.25,brushed,x+side*.039,1.72,3.28,'friso de porta Falcão');
  box(cab,.095,.21,.23,marker,x,2.10,2.46,'repetidor de seta lateral Falcão');
  box(cab,.58,.13,1.03,brushed,side*1.23,1.01,3.28,'estribo superior antiderrapante Falcão');
  box(cab,.53,.14,1.02,shiny,side*1.22,.81,3.28,'estribo inferior Falcão');
  for(let i=0;i<4;i++)box(cab,.40,.021,.065,tyreTrim,side*1.26,.89,3.0+i*.19,'ranhura antiderrapante Falcão');
  rod(cab,new THREE.Vector3(side*1.16,3.71,2.65),new THREE.Vector3(side*1.73,3.59,2.60),.038,shadow);
  rod(cab,new THREE.Vector3(side*1.15,2.85,2.74),new THREE.Vector3(side*1.72,3.09,2.62),.036,shadow);
  box(cab,.19,.58,.35,shadow,side*1.74,3.32,2.60,'retrovisor aerodinâmico Falcão');
  box(cab,.045,.47,.26,shiny,side*1.85,3.32,2.60,'face do retrovisor Falcão');
  box(cab,.11,.24,.24,shadow,side*1.67,2.84,2.55,'espelho auxiliar de ponto cego Falcão');
  // Para-lama fica acima do giro da roda dianteira.
  const arch=new THREE.Mesh(new THREE.TorusGeometry(.76,.071,7,24,Math.PI),paint);
  arch.rotation.y=Math.PI/2;arch.position.set(side*1.19,.67,1.82);
  arch.name='arco da roda frontal Falcão';arch.castShadow=true;cab.add(arch);
  box(cab,.105,.24,1.46,paint,side*1.19,1.19,1.83,'saia de capô Falcão');
 }

 // Cintura lateral aerodinâmica sob a cabine, descontínua na direção dos pneus.
 for(const side of [-1,1]){
  box(cab,.095,.26,1.46,paint,side*1.27,.82,3.50,'saia aerodinâmica da cabine Falcão');
  box(cab,.07,.10,1.32,accent,side*1.32,.90,3.52,'vinco de saia do Falcão');
 }

 // Luzes no teto e badge de marca fictícia.
 for(let i=-2;i<=2;i++)box(cab,.12,.083,.10,marker,i*.41,4.59,4.16,'luz de posição superior Falcão');
 box(cab,.90,.11,.065,shiny,0,2.26,-.14,'emblema central Falcão Aero');
 if(typeof document!=='undefined'&&typeof document.createElement==='function'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;
  const ctx=canvas.getContext('2d');if(ctx){
   ctx.clearRect(0,0,512,96);ctx.font='900 62px Arial,sans-serif';ctx.textAlign='center';
   ctx.textBaseline='middle';ctx.fillStyle='#f5f4ed';ctx.fillText('FALCÃO AERO',256,50,492);
   const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
   const badge=new THREE.Mesh(new THREE.PlaneGeometry(.81,.086),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
   badge.rotation.y=Math.PI;badge.position.set(0,2.26,-.181);badge.name='logotipo frontal Falcão Aero';cab.add(badge);
  }
 }
}

export function detailFalcaoChassis({root,wheels,layout,box}){
 const frame=new THREE.MeshStandardMaterial({color:'#35464c',metalness:.39,roughness:.59});
 const light=new THREE.MeshStandardMaterial({color:'#b2c5cc',metalness:.64,roughness:.34});
 const amber=new THREE.MeshStandardMaterial({color:'#e9ac51',roughness:.45});
 const rubber=new THREE.MeshStandardMaterial({color:'#191f23',roughness:.88});
 // As rodas originais do motor têm três materiais por pivot. Reutilizamos esses
 // materiais para preservar as draw calls mesmo com 12 rodas articuladas.
 for(const wheel of wheels){
  const side=wheel.userData.side,r=wheel.userData.radius;
  const original=wheel.children.filter(mesh=>mesh.isMesh);
  const wheelMetal=original[1].material,wheelDark=original[2].material,wheelTread=original[0].material;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r*.61,.030,6,18),wheelMetal);
  ring.rotation.y=Math.PI/2;ring.position.x=side*.215;ring.name='aro aerodinâmico Falcão';wheel.add(ring);
  for(let i=0;i<10;i++){
   const a=i*Math.PI/5,lug=new THREE.Mesh(new THREE.CylinderGeometry(.026,.026,.023,6),wheelDark);
   lug.rotation.z=Math.PI/2;lug.position.set(side*.245,Math.sin(a)*r*.43,Math.cos(a)*r*.43);
   lug.name='dez porcas das rodas Falcão';wheel.add(lug);
  }
  for(let i=0;i<12;i++){
   const a=i*Math.PI/6,tread=new THREE.Mesh(new THREE.BoxGeometry(.023,.059,.12),wheelTread);
   tread.position.set(side*.046,Math.sin(a)*r*.981,Math.cos(a)*r*.981);
   tread.rotation.x=-a;tread.name='bloco de pneu do Falcão';wheel.add(tread);
  }
 }
 for(const side of [-1,1]){
  const x=side*1.10;
  box(root,.48,.64,1.30,light,x,1.00,layout.front+5.90,'tanque carenado do Falcão');
  box(root,.50,.08,1.32,frame,x,1.33,layout.front+5.90,'cinta do tanque do Falcão');
  for(const z of layout.driveAxles){
   box(root,.14,.32,.60,rubber,side*1.23,.53,z+.58,'para-barro do cavalo Falcão');
  }
  box(root,.12,.085,.22,amber,side*1.31,1.28,layout.front+6.58,'refletor de lateral Falcão');
 }
 for(const z of [layout.front+5.50,layout.front+6.45,layout.front+7.30])
  box(root,1.75,.11,.13,frame,0,1.24,z,'travessa estrutural cavalo Falcão');
 box(root,1.05,.08,.34,frame,0,1.30,layout.hitch-.18,'base da quinta roda Falcão');
}
