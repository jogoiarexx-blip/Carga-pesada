// REV32 — viseira real acima do para-brisa de cada uma das seis cabines.
// Os valores são extraídos do topo dos vidros modelados em cada arquivo de cabine.
// Eixo local -Z aponta para a frente. O Imperador tem 10 cm de offset de cabine.
import * as THREE from './vendor/three.module.js';

const CAB_VISOR_MOUNTS=Object.freeze({
 aurora:    {glassTop:2.73,glassFaceZ:-.135,backZ:.38, backY:3.035,lipZ:-.38,lipY:2.91},
 estradeiro:{glassTop:2.76,glassFaceZ:-.16, backZ:.42, backY:3.13, lipZ:-.39,lipY:2.92},
 rochedo:   {glassTop:3.715,glassFaceZ:-.134,backZ:.43,backY:4.11,lipZ:-.39,lipY:3.88},
 peregrino: {glassTop:3.39,glassFaceZ:1.945, backZ:2.32,backY:3.72,lipZ:1.72,lipY:3.55},
 falcao:    {glassTop:3.475,glassFaceZ:1.955,backZ:2.81,backY:3.90,lipZ:1.77,lipY:3.66},
 imperador: {glassTop:3.845,glassFaceZ:-.206,backZ:.63,backY:4.13,lipZ:-.39,lipY:4.03,cabOffset:.10}
});
export function planCabVisor(spec,style=1){
 const base=CAB_VISOR_MOUNTS[spec?.id];
 if(!base)throw new Error('Cabine sem ponto de montagem da viseira: '+spec?.id);
 const level=[1,2,3].includes(style)?style:1;
 const w=(spec.cab==='rigid'?2.3:2.45)+[.07,.13,.20][level-1];
 const lipZ=base.lipZ-[0,.08,.15][level-1];
 const lipY=base.lipY+[.0,.015,.035][level-1];
 const thickness=[.06,.07,.085][level-1];
 return {...base,level,width:w,lipZ,lipY,thickness,frontOffset:base.cabOffset||0,
  glassClearance:lipY-thickness-base.glassTop};
}
function visorWedge(plan){
 const backHalf=plan.width/2,frontHalf=backHalf-[.05,.085,.115][plan.level-1];
 const {lipY,backY,lipZ,backZ,thickness}=plan;
 const vertices=[
  -frontHalf,lipY,lipZ, frontHalf,lipY,lipZ,
  backHalf,backY,backZ, -backHalf,backY,backZ,
  -frontHalf,lipY-thickness,lipZ, frontHalf,lipY-thickness,lipZ,
  backHalf,backY-.042,backZ,-backHalf,backY-.042,backZ
 ];
 const triangles=[
  0,2,1,0,3,2, 4,5,6,4,6,7,
  0,1,5,0,5,4, 3,7,6,3,6,2,
  0,4,7,0,7,3, 1,2,6,1,6,5
 ];
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 geo.setIndex(triangles);geo.computeVertexNormals();
 return geo;
}
export function addCabVisor(root,spec,fit,style,{chrome,dark,edge,glow,lamp},box,bar){
 const plan=planCabVisor(spec,style),worldZ=fit.layout.front+plan.frontOffset;
 const material=style===1?edge:chrome;
 const mesh=new THREE.Mesh(visorWedge(plan),material);
 mesh.name='viseira decorativa';mesh.userData.category='visor';
 mesh.castShadow=true;mesh.position.z=worldZ;root.add(mesh);
 const centerZ=worldZ+(plan.lipZ+plan.backZ)/2;
 const depth=plan.backZ-plan.lipZ,frontZ=worldZ+plan.lipZ;
 // Borda frontal dobrada: sempre acima do vidro, não no centro do para-brisa.
 box(root,'borda da viseira',plan.width-.10,plan.thickness*.66,.045,style===1?dark:edge,
  0,plan.lipY-plan.thickness*.55,frontZ-.015,false);
 for(const side of [-1,1]){
  const x=side*(plan.width/2-.13);
  box(root,'suporte superior da viseira',.075,.10,.16,chrome,x,plan.backY-.028,worldZ+plan.backZ-.06,false);
  box(root,'ponta lateral da viseira',.058,.048,Math.min(.22,depth*.37),
   style===1?edge:chrome,side*(plan.width/2-.028),plan.lipY+.01,frontZ+.11,false);
  if(style>=2){
   box(root,'aleta lateral touring',.032,.055,Math.min(.28,depth*.42),edge,
    side*(plan.width/2+.016),plan.lipY+.025,frontZ+.16,false);
  }
 }
 if(style>=2){
  bar(root,'friso inox da viseira',[-plan.width*.445,plan.lipY+.012,frontZ-.04],
   [plan.width*.445,plan.lipY+.012,frontZ-.04],.014,chrome);
  for(let i=-2;i<=2;i++)
   box(root,'rebite cromado da viseira',.038,.026,.025,edge,
    i*plan.width*.16,plan.lipY-.022,frontZ-.046,false);
 }
 if(style===3){
  const count=7;
  for(let i=0;i<count;i++){
   const x=(i-(count-1)/2)*plan.width*.127;
   box(root,'moldura de luz da viseira',.145,.063,.038,dark,x,plan.lipY-.040,frontZ-.053,false);
   box(root,'luz decorativa da viseira',.098,.039,.025,i%2?glow:lamp,
    x,plan.lipY-.042,frontZ-.078,false);
  }
  // Chapas escalonadas nos dois cantos, sem descer sobre o para-brisa.
  for(const side of [-1,1])
   box(root,'asa cromada da viseira',.20,.046,.20,chrome,
    side*(plan.width/2-.12),plan.lipY+.052,frontZ+.19,false);
 }
 return plan;
}
