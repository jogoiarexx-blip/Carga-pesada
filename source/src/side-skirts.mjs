// Saia modular no mesmo sistema de coordenadas do baú (eixo Z para trás).
export function planSideSkirts(fit){
 const {body,layout,wheelRadius}=fit;
 const start=body.start+.07,end=body.end-.06,top=body.base-.02,bottom=.66;
 const axles=(layout.trailerAxles.length?layout.trailerAxles:layout.driveAxles)
  .filter(z=>z+wheelRadius+.12>start&&z-wheelRadius-.12<end);
 const cuts=[];
 for(const z of axles){
  const lo=Math.max(start,z-wheelRadius-.12),hi=Math.min(end,z+wheelRadius+.12);
  if(cuts.length&&lo<=cuts.at(-1).end+.015)cuts.at(-1).end=Math.max(cuts.at(-1).end,hi);
  else cuts.push({start:lo,end:hi});
 }
 const panels=[];let cursor=start;
 for(const cut of cuts){if(cut.start-cursor>.11)panels.push({start:cursor,end:cut.start});cursor=Math.max(cursor,cut.end);}
 if(end-cursor>.11)panels.push({start:cursor,end});
 return {start,end,top,bottom,axles,cuts,panels,offset:fit.offset,wheelRadius};
}
