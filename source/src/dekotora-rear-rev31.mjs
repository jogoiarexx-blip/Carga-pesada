// REV31: iluminação traseira e montantes cromados sem cobrir a arte do baú.
// A montagem ocorre na mesma origem/pivot da carroceria.
import * as THREE from './vendor/three.module.js';
import {planDekotoraFit} from './dekotora-fit-rev31.mjs';
export function addDekotoraRearRev31({model,group,config,fit,type,box,rod,materials,setCategory}){
 const a=config.accessories,fr=planDekotoraFit(fit,a).rear,b=fit.body;
 const {chrome,dark,edge,glow,lamp,red}=materials;
 const put=(category,name,w,h,d,material,x,y,z)=>{
  setCategory(category);return box(group,name,w,h,d,material,x,y,z,false);
 };
 if(a.rearLampDeck){
  const level=type('rearLampDeck'),count=[6,10,12][level-1],w=2.40,h=[.22,.29,.36][level-1],y=fr.rackY,z=fr.z;
  put('rearLampDeck','painel de lanternas traseiras',w,h,.09,level===1?edge:chrome,0,y,z);
  put('rearLampDeck','fundo das lanternas traseiras',w-.10,h-.09,.025,dark,0,y,z+.062);
  for(let i=0;i<count;i++){
   const x=-1.08+i*2.16/(count-1);
   const lightWidth=level===1?.25:level===2?.17:.14;
   const tint=level===1?red:level===2?(i%3===0?lamp:red):(i%3===0?red:i%3===1?glow:lamp);
   put('rearLampDeck','moldura individual da lanterna',lightWidth+.055,h-.065,.035,chrome,x,y,z+.082);
   put('rearLampDeck','lente traseira decorativa',lightWidth,h-.105,.021,tint,x,y,z+.110);
  }
  if(level>=2){
   put('rearLampDeck','friso de iluminação traseira',w-.07,.028,.032,level===3?glow:edge,0,y+h*.38,z+.09);
   for(const side of [-1,1])put('rearLampDeck','ponteira das lanternas',.07,h,.11,chrome,side*(w/2-.04),y,z);
  }
  if(level===3)for(let i=-5;i<=5;i++)
   put('rearLampDeck','fileira LED complementar',.09,.03,.025,glow,i*.19,y-h*.34,z+.105);
 }
 if(a.rearPillars){
  const level=type('rearPillars'),bottom=fr.pillarBottom,top=fr.pillarTop,h=Math.max(.50,top-bottom),y=(top+bottom)/2;
  for(const side of [-1,1]){
   const x=side*fr.pillarX,z=fr.depth+.09,outerX=side*(fr.pillarX+.055);
   put('rearPillars','montante vertical traseiro',.095,h,.115,chrome,x,y,z);
   put('rearPillars','aba de canto traseiro',.07,h,.15,level===2?edge:chrome,outerX,y,z-.12);
   put('rearPillars','tampa superior do montante',.15,.11,.15,chrome,x,top,z);
   put('rearPillars','tampa inferior do montante',.15,.10,.15,chrome,x,bottom,z);
   if(level===1){
    put('rearPillars','friso rebaixado do montante',.023,h-.16,.018,edge,outerX,y,z+.065);
   }else if(level===2){
    put('rearPillars','painel central escovado',.036,h-.18,.026,dark,outerX,y,z+.075);
    for(let i=0;i<4;i++)put('rearPillars','respiro de montante',.028,.055,.033,chrome,outerX,y-h*.28+i*h*.18,z+.10);
   }else{
    put('rearPillars','faixa luminosa do montante',.025,h-.16,.022,dark,outerX,y,z+.083);
    const n=Math.min(10,Math.max(4,Math.round(h/.27)));
    for(let i=0;i<n;i++){
     const py=bottom+.14+i*(h-.28)/(n-1);
     put('rearPillars','lanterna vertical do canto',.055,.095,.025,i%3===0?red:glow,outerX,py,z+.105);
    }
   }
  }
 }
}
