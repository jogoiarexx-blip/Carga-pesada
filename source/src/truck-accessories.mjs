import * as THREE from './vendor/three.module.js';
import {variantOf} from './parts-catalog.mjs';
import {truckFit} from './truck-fit.mjs';
import {planSideSkirts} from './side-skirts.mjs';
import {addArtTruckDetails} from './art-truck-details.mjs';
import {addDekotoraRev30} from './cab-art-rev30.mjs';
import {planDekotoraFit} from './dekotora-fit-rev31.mjs';
import {addDekotoraRearRev31} from './dekotora-rear-rev31.mjs';
import {addCabVisor} from './cab-visor-rev32.mjs';
import {bevelBox} from './truck-geometry.mjs';
import {mergeStatic} from './truck-model.mjs';
export function addAccessories(model,group,config){
 const type=k=>variantOf(config,k);let activeCategory=null;
 const a=config.accessories,v=model.userData.spec,{cab:c,body:b,layout:l,skirt:s,offset}=truckFit(v),root=new THREE.Group();root.name='acessórios da cabine';root.userData.dynamic=true;model.add(root);group.userData.cabAccessories=root;group.userData.wheelAccessories=[];if(model.userData.factoryRearLights)model.userData.factoryRearLights.visible=!a.rearLampDeck;if(model.userData.factoryRearBumper)model.userData.factoryRearBumper.visible=!a.rearBumper;if(model.userData.factoryExhaust)model.userData.factoryExhaust.visible=!a.exhaust;
 const chrome=new THREE.MeshStandardMaterial({color:'#c7d1cf',metalness:.82,roughness:.24}),dark=new THREE.MeshStandardMaterial({color:'#182429',roughness:.74}),edge=new THREE.MeshStandardMaterial({color:'#899c9e',metalness:.67,roughness:.40}),glow=new THREE.MeshBasicMaterial({color:config.palette==='amber'?'#ffbf51':config.palette==='cyan'?'#61dcff':'#e17fff'}),lamp=new THREE.MeshBasicMaterial({color:'#fff0c4'}),red=new THREE.MeshBasicMaterial({color:'#d76655'}),front=l.front;
 function box(parent,name,w,h,d,m,x,y,z,bevel=true){const mesh=new THREE.Mesh(bevel?bevelBox(w,h,d):new THREE.BoxGeometry(w,h,d),m);mesh.userData.category=activeCategory;mesh.name=name;mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh;}
 function rod(parent,name,r,length,m,x,y,z,rot=0){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,length,10),m);mesh.userData.category=activeCategory;mesh.name=name;mesh.position.set(x,y,z);mesh.rotation.x=rot;mesh.castShadow=true;parent.add(mesh);return mesh;}
 function bar(parent,name,start,end,r=.025,m=chrome){const a=new THREE.Vector3(...start),delta=new THREE.Vector3(...end).sub(a),mesh=rod(parent,name,r,delta.length(),m,0,0,0);mesh.position.copy(a).addScaledVector(delta,.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return mesh;}
 activeCategory='skirts';if(a.skirts){
  const style=type('skirts'),plan=planSideSkirts(truckFit(v));
  const tone=style===1?new THREE.MeshStandardMaterial({color:'#c6d0cd',metalness:.35,roughness:.48}):style===2?new THREE.MeshStandardMaterial({color:'#465963',metalness:.38,roughness:.47}):chrome;
  const faceMat=style===5?dark:tone;
  for(const side of [-1,1]){
   const x=side*(b.width/2+.055),faceX=side*(b.width/2+.107),off=plan.offset;
   const center=(from,to)=>(from+to)/2-off,length=(from,to)=>to-from;
   // Trilho alto fixado no piso do baú; não atravessa os pneus.
   box(group,'união da saia ao baú',.085,.105,length(plan.start,plan.end),style===2?edge:chrome,x,b.base-.025,center(plan.start,plan.end),false);
   for(const span of plan.panels){
    const w=length(span.start,span.end),z=center(span.start,span.end),h=plan.top-plan.bottom;
    box(group,'saia lateral',.075,h,w,faceMat,x,(plan.top+plan.bottom)/2,z,false);
    box(group,'acabamento inferior da saia',.085,.065,w,style===2?edge:chrome,x,plan.bottom+.025,z,false);
    if(style===1){
     box(group,'linha de carroceria integrada',.012,.043,Math.max(.05,w-.06),edge,faceX,plan.top-.11,z,false);
    }else if(style===2){
     box(group,'rebaixo ventilado da saia',.013,h*.42,Math.max(.10,w-.15),dark,faceX,plan.bottom+h*.55,z,false);
     const count=Math.min(7,Math.max(2,Math.floor(w/.28)));
     for(let i=0;i<count;i++)box(group,'aleta de ventilação lateral',.018,.045,.075,edge,faceX+.005,plan.bottom+h*.57,span.start+(i+1)*w/(count+1)-off,false);
    }else if(style===3){
     box(group,'friso inox superior',.017,.052,Math.max(.06,w-.08),edge,faceX,plan.top-.09,z,false);
     for(const at of [span.start+.08,span.end-.08])for(const y of [plan.bottom+.11,plan.top-.14])
      box(group,'rebite da saia',.023,.035,.035,edge,faceX+.01,y,at-off,false);
    }else if(style===4){
     box(group,'painel artístico retrô',.022,h*.48,Math.max(.09,w-.16),dark,faceX,plan.bottom+h*.55,z,false);
     box(group,'faixa decorativa da saia',.028,.09,Math.max(.09,w-.16),glow,faceX+.01,plan.bottom+h*.59,z,false);
     for(const at of [span.start+.07,span.end-.07])box(group,'moldura vertical retrô',.028,h-.10,.065,chrome,faceX+.01,(plan.top+plan.bottom)/2,at-off,false);
    }else if(style===5){
     box(group,'cassete luminoso lateral',.026,h*.53,Math.max(.09,w-.14),edge,faceX,plan.bottom+h*.54,z,false);
     box(group,'barra LED da saia',.036,.043,Math.max(.09,w-.14),glow,faceX+.018,plan.bottom+.085,z,false);
     const count=Math.min(10,Math.max(2,Math.floor(w/.36)));
     for(let i=0;i<count;i++)box(group,'ponto luminoso da saia',.04,.08,.095,glow,faceX+.025,plan.bottom+h*.61,span.start+(i+.5)*w/count-off,false);
    }
    for(const at of [span.start+.035,span.end-.035])
     box(group,'ponteira da saia',.09,h-.065,.055,style===2?edge:chrome,x,plan.bottom+h/2,at-off,false);
   }
   // O recorte da roda é um espaço livre, não uma textura pintada.
   for(const cut of plan.cuts)for(const at of [cut.start+.035,cut.end-.035])
    box(group,'limite do recorte da roda',.06,.11,.075,style===2?dark:edge,x,plan.top-.10,at-off,false);
   // Finaliza no canto traseiro mesmo quando o último eixo ocupa quase todo o fundo.
   box(group,'continuação traseira da saia',.085,.17,.16,style===2?edge:chrome,x,b.base-.13,plan.end-.08-off,false);
   if(style>=4)box(group,'terminal decorativo traseiro',.025,.10,.12,glow,faceX,b.base-.14,plan.end-.09-off,false);
  }
 }
 activeCategory='visor';if(a.visor)addCabVisor(root,v,{cab:c,layout:l},type('visor'),{chrome,dark,edge,glow,lamp},box,bar);
 activeCategory='roofRack';if(a.roofRack){const z=front+c.roofZ,w=c.width*.85,d=c.roofDepth;for(const side of [-1,1]){for(const dz of [-d/2,d/2])rod(root,'pé do bagageiro',.035,.18,edge,side*w/2,c.roof+.09,z+dz);bar(root,'bagageiro lateral',[side*w/2,c.roof+.24,z-d/2],[side*w/2,c.roof+.24,z+d/2]);}for(const dz of (type('roofRack')===1?[-d/2,d/2]:type('roofRack')===2?[-d/2,0,d/2]:[-d/2,-d/4,0,d/4,d/2]))bar(root,'travessa bagageiro',[-w/2,c.roof+.2,z+dz],[w/2,c.roof+.2,z+dz]);}
 activeCategory='roofSpots';if(a.roofSpots){const z=front+c.roofZ-c.roofDepth/2-.02,y=c.roof+.22;bar(root,'barra de faróis',[-c.width*.43,y-.1,z],[c.width*.43,y-.1,z],.045);for(const k of (type('roofSpots')===1?[-1,0,1]:type('roofSpots')===2?[-2,-1,0,1,2]:[-3,-2,-1,0,1,2,3])){const x=k*c.width*(type('roofSpots')===3?.115:.17);box(root,'carcaça farol teto',c.width*.12,.25,.2,dark,x,y,z);box(root,'aro farol teto',c.width*.125,.26,.06,chrome,x,y,z-.1);box(root,'farol auxiliar',c.width*.095,.18,.025,lamp,x,y,z-.138,false);}}
 activeCategory='bumper';if(a.bumper){
  const level=type('bumper'),width=c.width+[.12,.24,.34][level-1],height=[.25,.34,.42][level-1],y=[.86,.84,.82][level-1],z=front-.19;
  box(root,'para-choque decorativo',width,height,.34,level===1?edge:chrome,0,y,z);
  box(root,'entrada para-choque',width*(level===3?.47:.39),.095,.045,dark,0,y,z-.19,false);
  for(const side of [-1,1]){
   // Wrap around the front corners without extending into the front wheels.
   box(root,'lateral para-choque',.13,height,.48,level===1?edge:chrome,side*(width/2-.055),y,z+.20);
   if(level===1){box(root,'ponteira urbana',.34,.09,.035,dark,side*width*.37,y,z-.19,false);}
   if(level===2){box(root,'moldura luz auxiliar',.40,.19,.045,dark,side*width*.35,y,z-.20,false);box(root,'luz auxiliar para-choque',.30,.11,.025,lamp,side*width*.35,y,z-.23,false);}
   if(level===3){
    box(root,'moldura faixa LED',.68,.12,.04,dark,side*width*.29,y+.025,z-.20,false);
    for(let i=0;i<4;i++)box(root,'lente LED para-choque',.105,.065,.025,lamp,side*(width*.18+i*.15),y+.025,z-.23,false);
    box(root,'refletor lateral para-choque',.025,.08,.24,glow,side*(width/2+.016),y,z+.19,false);
   }
  }
 }
 activeCategory='exhaust';if(a.exhaust)for(const side of (type('exhaust')===1?[1]:[-1,1])){const x=side*(c.width/2+.13),z=front+c.back-.13,height=c.roof-.83;rod(root,'escapamento vertical',type('exhaust')===3?.105:.075,height,chrome,x,.9+height/2,z);rod(root,'abertura escapamento',.054,.016,dark,x,.9+height+.01,z);for(const y of [1.35,c.roof-.25])bar(root,'abraçadeira escapamento',[side*c.width/2,y,z],[x,y,z],.026,edge);rod(root,'protetor escapamento',.095,.8,edge,x,1.5,z);}
 activeCategory='horns';if(a.horns)for(const side of (type('horns')===1?[1]:type('horns')===2?[-1,1]:[-1,0,1])){const x=side*c.width*.27,z=front+c.roofZ-.02,y=c.roof+.35;rod(root,'buzina cromada',.055,.45,chrome,x,y,z,Math.PI/2);const horn=new THREE.Mesh(new THREE.CylinderGeometry(.13,.055,.23,10),chrome);horn.rotation.x=-Math.PI/2;horn.position.set(x,y,z-.32);root.add(horn);rod(root,'boca da buzina',.106,.014,dark,x,y,z-.44,Math.PI/2);rod(root,'suporte buzina',.025,.22,edge,x,c.roof+.11,z);}
 activeCategory='antenna';if(a.antenna)for(const side of (type('antenna')===1?[1]:[-1,1])){const x=side*c.width*.43,z=front+c.roofZ+c.roofDepth/2-.06;rod(root,'base antena',.05,.09,chrome,x,c.roof+.04,z);rod(root,'antena',.011,(v.cab==='rigid'?.75:1)*(type('antenna')===1?.65:1),dark,x,c.roof+(v.cab==='rigid'?.45:.58),z);}
 activeCategory='mudflaps';if(a.mudflaps){const last=l.trailerAxles.at(-1)??l.driveAxles.at(-1),radius=model.userData.wheelRadius;for(const side of [-1,1]){const z=last+radius+.11-offset;box(group,'para-barro',.73,.44,.055,dark,side*1.02,.44,z);box(group,'refletor para-barro',.62,.06,.016,red,side*1.02,.35,z+.034,false);}}
 activeCategory='underglow';if(a.underglow)for(const side of [-1,1]){const x=side*(b.width/2+.08),z=b.start+b.length/2-offset;box(group,'canaleta luminosa',.06,.09,b.length-.4,dark,x,.79,z,false);box(group,'faixa luminosa inferior',.065,.025,b.length-.48,glow,x,.745,z,false);}
 activeCategory='wheelCovers';if(a.wheelCovers)for(const wheel of model.userData.wheels){const cover=new THREE.Group();cover.name='calota cromada';cover.userData.dynamic=true;wheel.add(cover);group.userData.wheelAccessories.push(cover);const side=wheel.userData.side,r=wheel.userData.radius,x=side*.215,disc=rod(cover,'disco da calota',r*[.59,.53,.65][type('wheelCovers')-1],.035,chrome,x,0,0);disc.rotation.z=Math.PI/2;const hub=rod(cover,'cubo da calota',r*.2,.07,edge,side*.24,0,0);hub.rotation.z=Math.PI/2;for(let i=0;i<4+type('wheelCovers')*2;i++){const angle=i*Math.PI*2/(4+type('wheelCovers')*2),bolt=rod(cover,'parafuso da calota',.024,.018,dark,side*.24,Math.sin(angle)*r*.39,Math.cos(angle)*r*.39);bolt.rotation.z=Math.PI/2;}}
 activeCategory='mirrorCovers';if(a.mirrorCovers)for(const side of [-1,1])box(root,'capa cromada retrovisor',[.16,.18,.21][type('mirrorCovers')-1],.5,[.035,.045,.065][type('mirrorCovers')-1],chrome,side*1.61,c.mirrorY,front+c.mirrorZ-.31);
 activeCategory='deflector';if(a.deflector){const mesh=box(root,'defletor de teto',c.width*.94,[.2,.32,.42][type('deflector')-1],.58,chrome,0,c.roof+.18,front+c.roofZ+c.roofDepth/2-.08);mesh.rotation.x=-.2;}
 activeCategory='toolbox';if(a.toolbox)for(const side of (type('toolbox')===1?[1]:[-1,1])){const length=Math.min(1.05,s.length*.62),z=s.start+length/2+.05-offset;box(group,'caixa de ferramentas',.46,.37,length,dark,side*1.12,1.02,z);box(group,'tampa da caixa',.045,.31,length-.08,chrome,side*1.36,1.02,z);box(group,'trava da caixa',.06,.06,.12,dark,side*1.39,1.02,z,false);}
 activeCategory='trim';if(a.trim)for(const side of [-1,1])for(const y of (type('trim')===1?[b.base+.03]:[b.base+.03,b.top-.03]))box(group,'friso cromado',.04,.06,b.length+.04,chrome,side*(b.width/2+.1),y,b.start+b.length/2-offset,false);
 activeCategory='cabSign';if(a.cabSign){const w=c.width*[.55,.7,.75][type('cabSign')-1],roof=planDekotoraFit({cab:c,body:b,layout:l,offset},a).roof,z=roof.signZ,y=roof.signY;for(const side of [-1,1])rod(root,'suporte letreiro',.027,a.roofSpots?.59:.39,chrome,side*w*.37,c.roof+.24+(a.roofSpots?.10:0),z);box(root,'moldura letreiro',w,.37,.13,chrome,0,y,z);let face=lamp;if(typeof document!=='undefined'){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#0c2329';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#d9b969';ctx.lineWidth=6;ctx.strokeRect(4,4,504,120);ctx.font='bold 48px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffe292';ctx.fillText(config.signText,256,66,470);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;face=new THREE.MeshBasicMaterial({map:t});}const sign=new THREE.Mesh(new THREE.PlaneGeometry(w-.1,.28),face);sign.name='letreiro luminoso';sign.rotation.y=Math.PI;sign.position.set(0,y,z-.071);root.add(sign);}

 for(const key of Object.keys(a)){if(!a[key]||type(key)===1)continue;activeCategory=key;const level=type(key),zBody=b.start+b.length/2-offset,xBody=b.width/2+.16;
 if(key==='skirts')continue; // desenho modular já possui seu próprio material e frisos
 // A REV32 integra as pontas da viseira ao conjunto alto, sem peças sobre o vidro.
 if(key==='roofRack'&&level===3){const z=front+c.roofZ;for(const side of [-1,1])bar(root,'grade cesto',[side*c.width*.42,c.roof+.4,z-c.roofDepth/2],[side*c.width*.42,c.roof+.4,z+c.roofDepth/2]);for(const dz of [-c.roofDepth/2,c.roofDepth/2])bar(root,'fecho cesto',[-c.width*.42,c.roof+.4,z+dz],[c.width*.42,c.roof+.4,z+dz]);}
 if(key==='bumper')for(const side of [-1,1])bar(root,'proteção para-choque',[side*c.width*.26,.9,front-.33],[side*c.width*.26,level===3?1.55:1.15,front-.33],.035);
 if(key==='exhaust'&&level===3)for(const side of [-1,1])rod(root,'anel escapamento',.12,.08,chrome,side*(c.width/2+.13),c.roof-.12,front+c.back-.13);
 if(key==='antenna'&&level===3)for(const side of [-1,1])for(let i=0;i<4;i++)rod(root,'bobina antena',.028,.024,chrome,side*c.width*.43,c.roof+.12+i*.04,front+c.roofZ+c.roofDepth/2-.06);
 if(key==='mudflaps')for(const side of [-1,1])for(let i=0;i<level-1;i++)box(group,'faixa para-barro',.62,.035,.016,red,side*1.02,.47+i*.08,(l.trailerAxles.at(-1)??l.driveAxles.at(-1))+model.userData.wheelRadius+.18-offset,false);
 if(key==='underglow')for(const side of [-1,1]){if(level===2)box(group,'segunda linha luminosa',.065,.025,b.length-.48,glow,side*(b.width/2+.08),.84,zBody,false);else for(let z=b.start+.3;z<b.end;z+=.7)box(group,'módulo luminoso',.09,.08,.15,glow,side*xBody,.85,z-offset,false);}
 if(key==='deflector'&&level===3)for(const side of [-1,1])box(root,'aleta defletor',.06,.22,.4,edge,side*c.width*.4,c.roof+.25,front+c.roofZ+c.roofDepth/2-.08);
 if(key==='toolbox'&&level===3)for(const side of [-1,1])for(let i=0;i<3;i++)box(group,'nervura caixa',.025,.025,Math.min(.8,s.length*.5),dark,side*1.39,.94+i*.07,s.start+Math.min(1.05,s.length*.62)/2+.05-offset,false);
 if(key==='trim'&&level===3)for(const side of [-1,1])for(let z=b.start+.15;z<b.end;z+=1.4)box(group,'montante cromado',.03,b.height-.15,.035,chrome,side*(b.width/2+.11),b.base+b.height/2,z-offset,false);
 if(key==='cabSign'&&level===3)box(root,'base letreiro dupla',c.width*.79,.06,.15,edge,0,c.roof+.39,front+c.roofZ-c.roofDepth/2-.04);
 const finish=new THREE.MeshStandardMaterial({color:key==='skirts'&&level===2?'#415c6b':level===2?'#9bafb7':'#d9dfe1',metalness:level===2?.45:.9,roughness:level===2?.38:.22});let used=false;for(const parent of [root,group,...group.userData.wheelAccessories])parent.traverse(o=>{if(o.isMesh&&o.userData.category===key&&o.material===chrome){o.material=finish;used=true;}});if(!used)finish.dispose();
 }
 addArtTruckDetails({model,group,root,config,fit:{cab:c,body:b,layout:l,offset},type,box,rod,bar,materials:{chrome,dark,edge,glow,lamp,red},setCategory:key=>{activeCategory=key;}});
 addDekotoraRev30({model,group,root,config,fit:{cab:c,body:b,layout:l,offset},type,box,bar,materials:{chrome,dark,edge,glow,lamp,red},setCategory:key=>{activeCategory=key;}});
 addDekotoraRearRev31({model,group,config,fit:{cab:c,body:b,layout:l,offset},type,box,rod,materials:{chrome,dark,edge,glow,lamp,red},setCategory:key=>{activeCategory=key;}});
 for(const m of [chrome,dark,edge,glow,lamp,red]){let used=false;for(const parent of [root,group,...group.userData.wheelAccessories])parent.traverse(o=>{if(o.material===m)used=true;});if(!used)m.dispose();}
 for(const parent of [root,group,...group.userData.wheelAccessories])mergeStatic(parent,true);return root;
}
