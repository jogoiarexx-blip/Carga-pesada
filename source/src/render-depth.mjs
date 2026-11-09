// Parallel rear faces must be compared along one shared ray. Centroid depth
// varies across a door and can put the box wall on top of a nearer door/decal.
export function rearFaceDepth(point,normal,camera,reference,rear,referenceDepth,fallback){
 if(!reference||normal.x*rear.x+normal.y*rear.y+normal.z*rear.z<.995)return fallback;
 const dx=reference.x-camera.x,dy=reference.y-camera.y,dz=reference.z-camera.z,denominator=normal.x*dx+normal.y*dy+normal.z*dz;
 if(Math.abs(denominator)<1e-6)return fallback;
 const t=(normal.x*(point.x-camera.x)+normal.y*(point.y-camera.y)+normal.z*(point.z-camera.z))/denominator;
 return t>0?referenceDepth*t:fallback;
}
