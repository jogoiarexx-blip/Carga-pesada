// REV31 — posições normalizadas para carrocerias rígidas e semirreboques.
// Coordenadas do baú no mundo; o offset desloca peças para o pivot da carreta.
export function planDekotoraFit(fit,accessories={}){
 const b=fit.body,c=fit.cab,l=fit.layout,offset=fit.offset;
 const rear={z:b.end+.245-offset,depth:b.end+.13-offset,bodyEnd:b.end-offset,
   rackY:1.265,rackTop:1.265+.36/2,artBottom:1.58,
   pillarX:b.width/2+.095,pillarBottom:b.base+.12,pillarTop:b.top-.13};
 const roofLip=l.front+c.roofZ-c.roofDepth/2;
 const roof={spotZ:roofLip-.02,signZ:roofLip-.04-(accessories.roofSpots?.24:0),
  signY:c.roof+.62+(accessories.roofSpots?.20:0),
  topperZ:roofLip+.43,topperY:c.roof+.23+(accessories.roofRack||accessories.deflector?.30:0),
  topperLift:accessories.roofRack||accessories.deflector?.30:0,
  roofLip};
 return {rear,roof};
}
