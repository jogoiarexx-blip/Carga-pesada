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
