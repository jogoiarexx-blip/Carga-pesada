// REV29 — Decoração Dekotora leve para todas as cabines e carrocerias.
// Sem novas fontes de luz dinâmicas: cores emissivas e peças mescladas ao final.
import * as THREE from './vendor/three.module.js';
export function addArtTruckDetails({model,group,root,config,fit,type,box,rod,bar,materials,setCategory}){
 const {cab:c,body:b,layout:l,offset}=fit,a=config.accessories,front=l.front;
 const {chrome,dark,edge,glow,lamp,red}=materials;
 const put=(category,...args)=>{setCategory(category);return box(...args);};
 const rail=(category,...args)=>{setCategory(category);return bar(...args);};
 if(a.rearBumper){
  const lv=type('rearBumper'),w=[2.48,2.64,2.78][lv-1],h=[.29,.39,.47][lv-1],y=[.76,.78,.81][lv-1],z=b.end+.40-offset,face=z+.164;
  put('rearBumper',group,'para-choque traseiro artístico',w,h,.28,lv===1?edge:chrome,0,y,z,false);
  put('rearBumper',group,'faixa inferior traseira',w-.10,.055,.035,dark,0,y-h/2+.04,face,false);
  put('rearBumper',group,'placa central embutida',.66,.18,.04,dark,0,y+.035,face+.02,false);
  for(const side of [-1,1]){
   put('rearBumper',group,'ponteira traseira cromada',.14,h,.35,chrome,side*(w/2-.04),y,z-.025,false);
   if(lv===1){put('rearBumper',group,'refletor traseiro novo',.26,.10,.035,red,side*.92,y+.055,face+.03,false);}
   else{
    put('rearBumper',group,'moldura de lanternas traseiras',.69,.20,.035,dark,side*.91,y+.06,face+.03,false);
    for(let i=0;i<3;i++)put('rearBumper',group,'lanterna traseira art truck',.15,.12,.028,i===0?red:i===1?glow:lamp,side*.91+(i-1)*.18,y+.06,face+.05,false);
    if(lv===3)for(let i=0;i<3;i++)put('rearBumper',group,'LED inferior traseiro',.12,.05,.025,glow,side*(.41+i*.21),y-h*.25,face+.03,false);
   }
  }
  if(lv===3)for(let i=-3;i<=3;i++)put('rearBumper',group,'grade luminosa traseira',.07,.06,.025,glow,i*.12,y+h*.31,face+.025,false);
 }
 if(a.sideLights){
  const lv=type('sideLights'),spacing=[1.7,1.05,.68][lv-1],span=b.length-.52;
  const count=Math.min(20,Math.max(2,Math.floor(span/spacing)+1)),y=b.base+.035;
  for(const side of [-1,1]){
   const x=side*(b.width/2+.112),out=x+side*.032;
   put('sideLights',group,'suporte de iluminação lateral',.045,.065,b.length-.35,lv===1?edge:chrome,x,y,b.start+b.length/2-offset,false);
   for(let i=0;i<count;i++){
    const z=b.start+.26+i*span/(count-1)-offset;
    put('sideLights',group,'moldura de lanterna lateral',.025,.12,lv===3?.25:.19,dark,x,y,z,false);
    put('sideLights',group,'lanterna lateral decorativa',.018,.072,lv===3?.18:.12,lv===1?lamp:glow,out,y,z,false);
    if(lv>=2)put('sideLights',group,'aro inox da lanterna',.018,.022,lv===3?.25:.18,chrome,out,y+.065,z,false);
   }
   if(lv===3)put('sideLights',group,'filete LED longitudinal',.025,.023,b.length-.55,glow,out,y-.11,b.start+b.length/2-offset,false);
  }
 }
 if(a.roofRim){
  const lv=type('roofRim'),y=b.top+.07,mid=b.start+b.length/2-offset;
  for(const side of [-1,1]){
   const x=side*(b.width/2+.015);
   put('roofRim',group,'moldura de teto lateral',.11,.10,b.length-.08,chrome,x,y,mid,false);
   if(lv>=2){
    const count=Math.min(12,Math.max(4,Math.floor(b.length/1.2)));
    for(let i=0;i<count;i++){
     const z=b.start+.32+i*(b.length-.64)/(count-1)-offset;
     put('roofRim',group,'lanterna superior do baú',.07,.07,lv===3?.23:.13,lv===3?glow:lamp,side*(b.width/2+.082),y+.035,z,false);
     if(lv===3)put('roofRim',group,'aro luminoso de cobertura',.085,.022,.29,chrome,side*(b.width/2+.088),y+.095,z,false);
    }
   }
  }
  for(const z of [b.start+.05-offset,b.end-.05-offset])put('roofRim',group,'travessa do topo do baú',b.width+.16,.08,.12,chrome,0,y,z,false);
  if(lv===3)for(let i=-3;i<=3;i++)put('roofRim',group,'fileira de lanternas da tampa',.15,.07,.025,glow,i*.31,y+.055,b.end+.025-offset,false);
 }
 // Detalhamento complementar dos equipamentos que já existiam.
 if(a.bumper){
  const lv=type('bumper'),w=c.width+[.12,.24,.34][lv-1],y=[.86,.84,.82][lv-1],z=front-.40;
  put('bumper',root,'friso frontal inox',w-.10,.045,.035,chrome,0,y+.10,z-.01,false);
  if(lv>=2)for(const side of [-1,1]){
   put('bumper',root,'grade integrada dianteira',.34,.09,.035,dark,side*.36,y-.085,z-.016,false);
   put('bumper',root,'moldura lateral da frente',.10,.22,.045,chrome,side*(w/2-.10),y+.015,z+.005,false);
  }
  if(lv===3){
   for(let i=-4;i<=4;i++)put('bumper',root,'luminária de frente',.11,.042,.025,glow,i*.19,y+.16,z-.03,false);
   rail('bumper',root,'protetor inferior de frente',[-w*.44,y-.22,z],[w*.44,y-.22,z],.025,chrome);
  }
 }
 // Viseiras são construídas inteiramente pelo módulo REV32 acima do para-brisa.
 if(a.roofSpots){
  const lv=type('roofSpots'),z=front+c.roofZ-c.roofDepth/2-.20;
  put('roofSpots',root,'placa inox de faróis',c.width*.91,.07,.09,chrome,0,c.roof+.06,z+.07,false);
  if(lv>=2)for(const side of [-1,1])put('roofSpots',root,'canto decorativo dos faróis',.13,.25,.16,chrome,side*c.width*.42,c.roof+.24,z+.08,false);
  if(lv===3)for(let i=-3;i<=3;i++)put('roofSpots',root,'friso LED dos faróis',.10,.035,.025,glow,i*c.width*.115,c.roof+.39,z-.025,false);
 }
 if(a.exhaust){
  const lv=type('exhaust');
  for(const side of (lv===1?[1]:[-1,1])){
   const x=side*(c.width/2+.13),z=front+c.back-.13;
   put('exhaust',root,'abraçadeira superior inox',.24,.065,.20,chrome,x,c.roof-.30,z,false);
   if(lv>=2)for(let i=0;i<4;i++)put('exhaust',root,'respiro do protetor térmico',.14,.032,.035,dark,x,c.roof-1.3+i*.14,z-.09,false);
   if(lv===3){setCategory('exhaust');rod(root,'bocal reforçado do escapamento',.115,.05,chrome,x,c.roof+.055,z);}
  }
 }
 if(a.horns&&type('horns')>=2){
  const lv=type('horns'),positions=lv===2?[-1,1]:[-1,0,1],z=front+c.roofZ-.47;
  for(const pos of positions)put('horns',root,'aba cromada da corneta',.22,.10,.045,chrome,pos*c.width*.27,c.roof+.35,z,false);
 }
 if(a.mudflaps){
  const lv=type('mudflaps'),last=l.trailerAxles.at(-1)??l.driveAxles.at(-1),z=last+model.userData.wheelRadius+.11-offset;
  for(const side of [-1,1]){
   put('mudflaps',group,'cinta superior do para-barro',.80,.06,.08,chrome,side*1.02,.64,z,false);
   if(lv>=2)for(let i=0;i<3;i++)put('mudflaps',group,'elemento refletivo no para-barro',.12,.045,.015,lv===3?glow:red,side*(.88+i*.13),.38+(lv===3?i*.035:0),z+.047,false);
  }
 }
 if(a.cabSign&&type('cabSign')>=2){
  const lv=type('cabSign'),z=front+c.roofZ-c.roofDepth/2-.14-(a.roofSpots?.24:0),y=c.roof+.86+(a.roofSpots?.20:0);
  for(let i=-2;i<=2;i++)put('cabSign',root,'luminária do letreiro',.17,.06,.05,lv===3?glow:lamp,i*c.width*.115,y,z,false);
 }
 if(a.wheelCovers){
  const lv=type('wheelCovers');
  for(const cover of group.userData.wheelAccessories){
   const wheel=cover.parent,side=wheel.userData.side,r=wheel.userData.radius;
   setCategory('wheelCovers');
   const ring=new THREE.Mesh(new THREE.TorusGeometry(r*(lv===2?.48:.54),.020,5,16),chrome);
   ring.name='aro frisado da calota';ring.userData.category='wheelCovers';ring.rotation.y=Math.PI/2;ring.position.x=side*.245;ring.castShadow=true;cover.add(ring);
   if(lv===3)for(let i=0;i<8;i++){const angle=i*Math.PI/4;put('wheelCovers',cover,'estrela da calota',.025,.075,.035,edge,side*.26,Math.sin(angle)*r*.33,Math.cos(angle)*r*.33,false);}
  }
 }
}
