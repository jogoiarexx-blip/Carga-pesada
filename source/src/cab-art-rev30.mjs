// REV30: ornamentos Dekotora geometria estática, sem luzes dinâmicas.
import * as THREE from './vendor/three.module.js';
import {planDekotoraFit} from './dekotora-fit-rev31.mjs';
export function addDekotoraRev30({model,group,root,config,fit,type,box,bar,materials,setCategory}){
 const {cab:c,body:b,layout:l,offset}=fit,a=config.accessories,front=l.front;
 const {chrome,dark,edge,glow,lamp,red}=materials;
 const put=(category,parent,name,w,h,d,mat,x,y,z)=>{
  setCategory(category);return box(parent,name,w,h,d,mat,x,y,z,false);
 };
 const stripe=(category,parent,name,start,end,r=.024,mat=chrome)=>{
  setCategory(category);return bar(parent,name,start,end,r,mat);
 };
 function profile(category,parent,name,points,depth,mat,x,y,z){
  setCategory(category);const s=new THREE.Shape();s.moveTo(...points[0]);
  for(const point of points.slice(1))s.lineTo(...point);s.closePath();
  const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth,steps:1,bevelEnabled:false}),mat);
  mesh.name=name;mesh.userData.category=category;mesh.position.set(x,y,z);mesh.castShadow=true;
  parent.add(mesh);return mesh;
 }
 if(a.frontGarnish){
  const lv=type('frontGarnish'),half=c.width/2-.10,y=1.64,z=front-.46;
  profile('frontGarnish',root,'máscara frontal perfilada',[[-half,-.23],[-half+.14,.25],[half-.14,.25],[half,-.23],[half-.10,-.31],[-half+.10,-.31]],.065,lv===1?edge:chrome,0,y,z);
  put('frontGarnish',root,'painel interno da máscara',c.width-.37,.37,.03,dark,0,y-.045,z-.025);
  if(lv===1)for(let i=0;i<4;i++)put('frontGarnish',root,'filete horizontal da grade',c.width-.50,.035,.045,chrome,0,y-.21+i*.10,z-.066);
  if(lv===2){
   for(const side of [-1,1]){
    profile('frontGarnish',root,'asa inox da grade',[[0,-.21],[side*.18,-.14],[side*.37,.17],[side*.59,.17],[side*.43,-.04],[side*.20,-.27]],.08,chrome,side*.12,y,z-.10);
    for(let i=0;i<3;i++)put('frontGarnish',root,'respiro da grade',.18,.035,.037,edge,side*.67,y-.17+i*.13,z-.095);
   }
   put('frontGarnish',root,'emblema geométrico',.25,.17,.05,edge,0,y+.015,z-.125);
  }
  if(lv===3){
   profile('frontGarnish',root,'escudo frontal de festival',[[0,.23],[.29,.08],[.25,-.16],[0,-.30],[-.25,-.16],[-.29,.08]],.085,chrome,0,y,z-.12);
   for(const side of [-1,1]){
    profile('frontGarnish',root,'aba angular iluminada',[[0,-.18],[side*.30,-.02],[side*.72,.11],[side*.74,-.13],[side*.27,-.28]],.075,edge,side*.13,y,z-.095);
    for(let i=0;i<4;i++)put('frontGarnish',root,'LED da grade artística',.13,.046,.027,glow,side*(.35+i*.19),y-.18,z-.139);
   }
   put('frontGarnish',root,'lente central da grade',.13,.11,.03,glow,0,y+.01,z-.223);
  }
  for(const side of [-1,1])put('frontGarnish',root,'canto externo da máscara',.08,.26,.10,chrome,side*(half-.08),y,z-.075);
 }
 if(a.cabTopper){
  const lv=type('cabTopper'),w=c.width-.13,roof=planDekotoraFit(fit,a).roof,z=roof.topperZ,y=roof.topperY;
  put('cabTopper',root,'base da coroa de cabine',w,.13,.36,chrome,0,y,z);
  put('cabTopper',root,'fundo da coroa de cabine',w-.13,.10,.38,dark,0,y+.12,z-.02);
  for(const side of [-1,1]){
   put('cabTopper',root,'suporte da coroa',.075,.24,.16,edge,side*(w/2-.075),y+.12,z);
   if(roof.topperLift>0)put('cabTopper',root,'coluna do suporte de teto',.085,roof.topperLift+.15,.14,edge,side*(w/2-.075),c.roof+.16+roof.topperLift/2,z);
  }
  if(lv===1){
   stripe('cabTopper',root,'varão inox da coroa',[-w*.45,y+.25,z-.20],[w*.45,y+.25,z-.20],.034);
   for(let i=-2;i<=2;i++)put('cabTopper',root,'marcador âmbar da coroa',.12,.06,.037,lamp,i*w*.17,y+.20,z-.21);
  }else if(lv===2){
   profile('cabTopper',root,'arco touring inox',[[-w*.46,-.13],[-w*.36,.15],[-w*.16,.30],[w*.16,.30],[w*.36,.15],[w*.46,-.13]],.065,chrome,0,y+.26,z-.22);
   put('cabTopper',root,'vão do arco touring',w*.51,.10,.035,dark,0,y+.37,z-.244);
   for(let i=-3;i<=3;i++)put('cabTopper',root,'lente âmbar touring',.11,.055,.027,lamp,i*w*.125,y+.47,z-.27);
  }else{
   profile('cabTopper',root,'coroa de festival perfilada',[[-w*.48,-.15],[-w*.37,.12],[-w*.20,.36],[0,.42],[w*.20,.36],[w*.37,.12],[w*.48,-.15]],.09,chrome,0,y+.22,z-.24);
   profile('cabTopper',root,'escudo interno da coroa',[[-.32,-.07],[-.20,.13],[0,.26],[.20,.13],[.32,-.07]],.047,dark,0,y+.27,z-.272);
   for(let i=-4;i<=4;i++)put('cabTopper',root,'lente de festival da coroa',.11,.056,.029,glow,i*w*.095,y+.50-Math.abs(i)*.030,z-.302);
   stripe('cabTopper',root,'travessa externa da coroa',[-w*.42,y+.19,z-.31],[w*.42,y+.19,z-.31],.026,edge);
  }
 }
 if(a.deflector){
  const lv=type('deflector'),rear=front+c.roofZ+c.roofDepth/2-.22,h=[.17,.28,.36][lv-1];
  for(const side of [-1,1]){
   profile('deflector',root,'aleta aerodinâmica perfilada',[[0,-.12],[side*.17,-.04],[side*.25,h],[side*.37,h*.76],[side*.41,-.12]],.16,lv===1?edge:chrome,side*c.width*.36,c.roof+.15,rear);
   stripe('deflector',root,'borda do spoiler',[side*c.width*.40,c.roof+.32,rear-.11],[side*c.width*.46,c.roof+.34+h*.50,rear+.05],.019,edge);
  }
  if(lv===3)for(let i=-3;i<=3;i++)put('deflector',root,'lente da asa aero',.105,.05,.026,glow,i*c.width*.12,c.roof+.38,rear-.15);
 }
 if(a.bumper){
  const lv=type('bumper'),w=c.width+[.12,.24,.34][lv-1],y=[.86,.84,.82][lv-1],z=front-.405;
  for(const side of [-1,1])profile('bumper',root,'ponteira inferior frontal',[[0,-.12],[side*.13,.04],[side*.31,.09],[side*.41,-.15],[side*.23,-.22]],.075,lv===1?edge:chrome,side*(w/2-.42),y-.10,z-.12);
  if(lv===3){
   put('bumper',root,'defletor baixo frontal',w-.32,.08,.15,dark,0,y-.24,z-.18);
   for(let i=-4;i<=4;i++)put('bumper',root,'ponto luminoso do spoiler frontal',.10,.04,.03,glow,i*(w-.48)/9,y-.24,z-.27);
  }
 }
 if(a.rearBumper){
  const lv=type('rearBumper'),w=[2.48,2.64,2.78][lv-1],z=b.end+.58-offset,y=[.76,.78,.81][lv-1];
  for(const side of [-1,1])profile('rearBumper',group,'asa traseira angular',[[0,-.15],[side*.20,-.12],[side*.32,.13],[side*.45,.13],[side*.36,-.23]],.05,lv===1?edge:chrome,side*(w/2-.53),y,z);
  if(lv===3)for(let i=-4;i<=4;i++)put('rearBumper',group,'refletor de rodapé traseiro',.11,.035,.025,glow,i*.20,y-.21,z+.045);
 }
}
