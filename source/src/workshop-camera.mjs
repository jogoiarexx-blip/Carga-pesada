// Auto framing tailored to a 48° vertical-FOV orbit camera.
const FOV_RAD=48*Math.PI/180;
export function workshopCameraDistance(vehicle,viewportWidth=800,viewportHeight=600,angle=2.45){
 const length=Math.max(4,Number(vehicle?.length)||8);
 const width=3.4; // espelhos, acessórios e carroceria
 const height=vehicle?.cab==='aero'?5:vehicle?.cab==='classic'?4.6:4.3;
 const aspect=Math.max(.35,Math.min(4,viewportWidth/Math.max(1,viewportHeight)));
 const side=Math.abs(Math.sin(angle)),front=Math.abs(Math.cos(angle));
 const projectedWidth=length*side+width*front;
 const projectedHeight=height+.195*(length*front+width*side);
 const depthMargin=.5*(length*front+width*side);
 const tan=Math.tan(FOV_RAD/2);
 const horizontal=projectedWidth/(2*tan*aspect)*1.18;
 const vertical=projectedHeight/(2*tan)*1.15;
 return Math.min(70,Math.max(14,Math.ceil(Math.max(horizontal,vertical)+depthMargin+1.8)));
}


// Fit real mesh bounds with reserved room for the garage controls, at 48° FOV.
// Offset uses the same orbit basis as camera.lookAt in game.js.
export function workshopFitBounds(bounds,width=800,height=600,angle=2.45){
 const w=Math.max(1,Number(width)||800),h=Math.max(1,Number(height)||600),aspect=w/h;
 const normalizer=Math.hypot(1,.2),tan=Math.tan(FOV_RAD/2);
 const top=Math.min(h*.33,Math.max(46,h<450?68:72));
 const bottom=Math.min(h*.36,Math.max(58,h<450?96:90));
 const side=Math.min(w*.18,Math.max(12,Math.min(26,w*.055)));
 const usableW=Math.max(w*.45,w-side*2),usableH=Math.max(h*.3,h-top-bottom);
 const min=bounds?.min,max=bounds?.max;
 if(!min||!max||![...min,...max].every(Number.isFinite))return {distance:24,center:[0,1.85,0]};
 const center=[0,1,2].map(i=>(min[i]+max[i])*.5);
 const right=[Math.cos(angle),0,-Math.sin(angle)];
 const up=[-.2*Math.sin(angle)/normalizer,1/normalizer,-.2*Math.cos(angle)/normalizer];
 const depthVector=[Math.sin(angle)/normalizer,.2/normalizer,Math.cos(angle)/normalizer];
 let distance=14;
 for(const x of [min[0],max[0]])for(const y of [min[1],max[1]])for(const z of [min[2],max[2]]){
  const p=[x-center[0],y-center[1],z-center[2]];
  const dot=v=>p[0]*v[0]+p[1]*v[1]+p[2]*v[2];
  const horizontal=Math.abs(dot(right))/(tan*aspect)*(w/usableW);
  const vertical=Math.abs(dot(up))/tan*(h/usableH);
  distance=Math.max(distance,(Math.max(horizontal,vertical)*1.12+dot(depthVector)+.65)/normalizer);
 }
 return {distance:Math.min(90,Math.ceil(distance)),center};
}
