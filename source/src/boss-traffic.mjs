// Carros da organização em circuitos fechados: afetam ambos os caminhões.
export const BOSS_TRAFFIC_LANES=[-3.4,3.4];
export const BOSS_CAR_LENGTH=3.8;
export function createBossTraffic(contract){
 if(!contract.race)return [];
 const count=Math.max(5,Math.min(9,Math.floor(contract.length/340)+1));
 const suffix=Number(contract.id.slice(1))||0;
 return Array.from({length:count},(_,i)=>{
  const laneIndex=(i+suffix)%2,cruise=10+(i*3+suffix)%5*1.65;
  return {id:`boss-car-${i}`,s:245+i*205+(suffix%3)*18,
   x:BOSS_TRAFFIC_LANES[laneIndex],speed:cruise,cruise,
   direction:1,cooldown:0,rivalCooldown:0,kind:i%3};
 });
}
export function planRivalTraffic(rival,player,cars,targetSpeed){
 let desired=rival.laneTarget??3.4;
 const ahead=cars.filter(c=>c.direction>0&&Math.abs(c.x-desired)<2.35&&c.s>=rival.s-6&&c.s<rival.s+85)
  .sort((a,b)=>a.s-b.s)[0];
 if(ahead){
  const alternate=desired>0?-3.4:3.4;
  const blocked=cars.some(c=>Math.abs(c.x-alternate)<2.35&&c.s>rival.s-24&&c.s<rival.s+49);
  const playerInLane=Math.abs(player.x-alternate)<2.7&&Math.abs(player.s-rival.s)<32;
  if(!blocked&&!playerInLane&&ahead.s-rival.s>15)desired=alternate;
  else if(ahead.s-rival.s<55)targetSpeed=Math.min(targetSpeed,Math.max(0,ahead.speed+(ahead.s-rival.s-13)*.18));
 }
 return {desired,targetSpeed:Math.max(0,targetSpeed)};
}
