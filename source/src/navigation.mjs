const hashes={home:'#inicio',contracts:'#contratos',garage:'#garagem'};
export function pageHash(page){return hashes[page]||hashes.home;}
export function pageFromHash(hash){return Object.keys(hashes).find(page=>hashes[page]===hash)||'home';}
