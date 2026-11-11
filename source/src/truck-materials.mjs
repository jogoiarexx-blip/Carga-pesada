// REV33 — materiais retro eficientes para toda a frota.
// Cada instância de caminhão possui seu cache. Nunca compartilhe materiais mutáveis
// entre veículos: o jogador pode repintar um caminhão e descartar outro.
import * as THREE from './vendor/three.module.js';

export const TRUCK_MATERIAL_PALETTES=Object.freeze({
 aurora:Object.freeze({glass:'#65828d',cargo:'#d8d7cf',doors:'#c6cec9',tarp:'#b9783b',steel:'#aab5b1'}),
 estradeiro:Object.freeze({glass:'#72909b',cargo:'#d7dad7',doors:'#c8d0cb',tarp:'#af824a',steel:'#adb9b5'}),
 rochedo:Object.freeze({glass:'#617e87',cargo:'#d0d5d3',doors:'#bfc9c8',tarp:'#b08b58',steel:'#a2afb0'}),
 peregrino:Object.freeze({glass:'#537681',cargo:'#ddd8cc',doors:'#ccc8bf',tarp:'#b48753',steel:'#c9cfca'}),
 falcao:Object.freeze({glass:'#678998',cargo:'#d8dbd8',doors:'#c6cfce',tarp:'#b48b58',steel:'#bdcbd0'}),
 imperador:Object.freeze({glass:'#6a8792',cargo:'#d8d9d2',doors:'#c7ceca',tarp:'#ae895b',steel:'#b0bec2'})
});
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const safeColor=(value,fallback)=>typeof value==='string'||typeof value==='number'?value:fallback;

/** A cache is scoped to a model, because paint.color is changed at runtime. */
export function createTruckMaterialSet(vehicle,paintColor){
 const style=TRUCK_MATERIAL_PALETTES[vehicle?.id]||TRUCK_MATERIAL_PALETTES.aurora;
 const cache=new Map();
 const make=(role,params={})=>{
  const key=JSON.stringify([role,params]);
  if(cache.has(key))return cache.get(key);
  const opts={flatShading:true};
  const source={...params};
  const brightness=(source.color instanceof THREE.Color)?source.color:undefined;
  if(role==='paint'){
   Object.assign(opts,{color:safeColor(source.color,paintColor),metalness:.17,roughness:.55});
  }else if(role==='cargo'){
   Object.assign(opts,{color:safeColor(source.color,style.cargo),metalness:.10,roughness:.65});
  }else if(role==='doors'){
   Object.assign(opts,{color:safeColor(source.color,style.doors),metalness:.12,roughness:.60});
  }else if(role==='glass'){
   // O vidro é aplicado à frente de uma cabine sólida: transparência/transmission
   // dariam sobreposição e overdraw. Tinta opaca é mais legível no mobile.
   Object.assign(opts,{color:style.glass,metalness:.07,roughness:.24,flatShading:false,depthWrite:true,transparent:false});
  }else if(role==='chrome'){
   Object.assign(opts,{color:safeColor(source.color,style.steel),metalness:.83,roughness:.24,flatShading:false});
  }else if(role==='brushed'){
   Object.assign(opts,{color:safeColor(source.color,style.steel),metalness:.67,roughness:.40,flatShading:false});
  }else if(role==='rubber'){
   Object.assign(opts,{color:safeColor(source.color,'#171c1e'),metalness:0,roughness:.93});
  }else if(role==='grille'){
   Object.assign(opts,{color:safeColor(source.color,'#243239'),metalness:.22,roughness:.71});
  }else if(role==='light'){
   Object.assign(opts,{color:safeColor(source.color,'#e3aa54'),emissive:source.emissive||'#38210e',emissiveIntensity:clamp(source.emissiveIntensity??.10,0,.24),roughness:.43,metalness:0});
  }else if(role==='tarp'){
   Object.assign(opts,{color:style.tarp,metalness:0,roughness:.88});
  }else{
   Object.assign(opts,{color:safeColor(source.color,'#6c7474'),roughness:clamp(source.roughness??.69,.26,.95),metalness:clamp(source.metalness??0,0,.7)});
  }
  const material=new THREE.MeshStandardMaterial(opts);
  material.name='REV33/'+role+'/'+vehicle?.id;
  material.userData={...material.userData,truckRole:role,truckId:vehicle?.id};
  if(brightness&&role==='paint')material.color.copy(brightness);
  cache.set(key,material);
  return material;
 };
 const finish=(params,role='auto')=>{
  const p=params||{};
  if(role!=='auto')return make(role,p);
  if(p.transparent||p.opacity!==undefined||p.clearcoat!==undefined)return make('glass',p);
  if(p.emissive)return make('light',p);
  if((p.metalness??0)>=.72)return make('chrome',p);
  if((p.metalness??0)>=.42)return make('brushed',p);
  if((p.roughness??0)>=.85&&(p.metalness??0)<.10)return make('rubber',p);
  if((p.metalness??0)>=.16&&(p.roughness??0)>=.58)return make('grille',p);
  return make('detail',p);
 };
 return {
  paint:make('paint',{color:paintColor}),
  cargo:make('cargo'),
  doors:make('doors'),
  chrome:make('chrome'),
  brushed:make('brushed'),
  glass:make('glass'),
  rubber:make('rubber'),
  black:make('grille',{color:'#192427'}),
  lamp:make('light',{color:'#f9db92',emissive:'#3e310c',emissiveIntensity:.09}),
  red:make('light',{color:'#bc4d3c',emissive:'#3d0908',emissiveIntensity:.08}),
  orange:make('light',{color:'#df9d43',emissive:'#3d2207',emissiveIntensity:.11}),
  tarp:make('tarp'),
  finish,
  materialCount:()=>cache.size
 };
}
