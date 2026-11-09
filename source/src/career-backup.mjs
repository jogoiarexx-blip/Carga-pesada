import {loadSave,CONTRACTS,VEHICLES} from './core.mjs';
import {normalizeDecoration} from './decoration.mjs';
export const BACKUP_LIMIT=32*1024*1024;
const plain=o=>o&&typeof o==='object'&&!Array.isArray(o);
export function artReferences(save){return [...new Set(Object.values(save.fleet).flatMap(t=>['left','right','rear'].map(k=>normalizeDecoration(t.decoration)[k])).filter(id=>id.startsWith('art:')))];}
export function makeBackup(save,images,createdAt=new Date().toISOString()){return {format:'carga-pesada-career',version:1,gameVersion:'0.14.0',createdAt,save:JSON.parse(JSON.stringify(save)),images};}
export function parseBackup(text){
 if(typeof text!=='string'||text.length>BACKUP_LIMIT)throw Error('Use um backup JSON de até 32 MB.');
 let b;try{b=JSON.parse(text);}catch{throw Error('O arquivo não contém JSON válido.');}
 if(b?.format!=='carga-pesada-career'||b.version!==1)throw Error('Este arquivo não é um backup compatível de Carga Pesada.');
 const raw=b.save;if(!plain(raw)||raw.version!==1||!Number.isFinite(raw.money)||raw.money<0||!plain(raw.fleet)||!plain(raw.fleet.aurora))throw Error('A carreira no arquivo está incompleta ou inválida.');
 const ids=VEHICLES.map(v=>v.id);if(Object.entries(raw.fleet).some(([id,t])=>!ids.includes(id)||!plain(t)))throw Error('A frota do backup é inválida.');
 const save=loadSave(JSON.stringify(raw));for(const t of Object.values(save.fleet))t.decoration=normalizeDecoration(t.decoration);
 save.best=Object.fromEntries(Object.entries(plain(save.best)?save.best:{}).filter(([id,time])=>CONTRACTS.some(c=>c.id===id)&&Number.isFinite(time)&&time>0));
 const refs=artReferences(save),images=plain(b.images)?b.images:{};if(refs.length>18||Object.keys(images).length>18)throw Error('O backup contém imagens demais.');
 for(const id of refs)if(typeof images[id]!=='string'||images[id].length>4*1024*1024||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(images[id]))throw Error('Uma pintura importada está ausente ou inválida no backup.');
 return {save,images:Object.fromEntries(refs.map(id=>[id,images[id]]))};
}
