import {normalizeDecoration,ACCESSORIES} from './decoration.mjs';
import {PARTS} from './parts-catalog.mjs';
export const DEKOTORA_PRESETS=Object.freeze([
 {id:'classico',name:'CLÁSSICO INOX',palette:'amber',pattern:'steady',enabled:['skirts','bumper','rearBumper','visor','cabTopper','frontGarnish','wheelCovers','mirrorCovers','sideLights','cabSign','rearLampDeck','rearPillars'],levels:{skirts:1,frontGarnish:1,cabTopper:1,rearBumper:1,bumper:1,sideLights:1}},
 {id:'rodoviario',name:'RODOVIÁRIO CROMADO',palette:'cyan',pattern:'pulse',enabled:['skirts','bumper','rearBumper','visor','cabTopper','frontGarnish','deflector','roofSpots','exhaust','horns','wheelCovers','trim','sideLights','roofRim','cabSign','rearLampDeck','rearPillars'],levels:{skirts:3,frontGarnish:2,cabTopper:2,rearBumper:2,bumper:2,roofRim:2,sideLights:2}},
 {id:'festival',name:'FESTIVAL DE LUZES',palette:'festival',pattern:'chase',enabled:Object.keys(ACCESSORIES),levels:{skirts:5}}
]);
export function applyDekotoraPreset(current,id){
 const previous=normalizeDecoration(current),preset=DEKOTORA_PRESETS.find(x=>x.id===id);
 if(!preset)return previous;
 const accessories=Object.fromEntries(Object.keys(ACCESSORIES).map(key=>[key,preset.enabled.includes(key)]));
 const variants=Object.fromEntries(Object.entries(PARTS).map(([key,items])=>[key,preset.levels[key]??(preset.id==='classico'?1:preset.id==='rodoviario'?Math.min(2,items.length):items.at(-1).id)]));
 return normalizeDecoration({...previous,accessories,variants,lights:true,palette:preset.palette,pattern:preset.pattern});
}
