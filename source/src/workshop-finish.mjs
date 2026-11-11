// Visual settings are intentionally isolated from the driving simulation.
export function workshopLighting(mode='home',quality='balanced',night=false){
 if(mode==='garage'){
  const high=quality==='high',eco=quality==='eco';
  return {
   hemisphere:eco?1.35:1.68,sun:eco?1.15:1.75,
   exposure:eco?1.12:1.16,shadows:high,
   sky:'#e2ede3',ground:'#6b7368',key:'#fff0d3'
  };
 }
 return {
  hemisphere:night?1:2.3,sun:night?.4:3.1,
  exposure:1.15,shadows:true,
  sky:'#f5e9bd',ground:'#3a6252',key:'#ffdda5'
 };
}
// One 256² procedural tile, deterministic and independent of remote assets.
// Oil/grime and grout lines are baked in pixels: zero per-frame GPU work.
export function workshopConcretePixels(size=256){
 const n=Math.max(16,Math.min(256,Math.floor(Number(size)||256)));
 const pixels=new Uint8ClampedArray(n*n*4);
 let seed=36191;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const stains=[[.24,.33,1.8],[.77,.62,2.3],[.46,.85,1.1]];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const u=x/n,v=y/n,grout=x%64<2||y%64<2?-17:0;
  let oil=0;
  for(const [sx,sy,strength] of stains){
   const dx=(u-sx)*6,dy=(v-sy)*7;
   oil+=strength*11*Math.exp(-(dx*dx+dy*dy)*1.7);
  }
  const grain=(random()-.5)*25;
  const tone=163+grain+grout-oil;
  const i=(y*n+x)*4;
  pixels[i]=tone+3;pixels[i+1]=tone+7;pixels[i+2]=tone+1;pixels[i+3]=255;
 }
 return pixels;
}
