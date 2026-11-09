export const MEDALS={1:'Bronze',2:'Prata',3:'Ouro'};
export function freightMedal(contract,stats,success=true){if(!success||contract.race||stats.elapsed>contract.time||stats.cargo<contract.min)return 0;if(stats.cargo>=98&&stats.healthLost<=1&&stats.elapsed<=contract.time*.65)return 3;if(stats.cargo>=90&&stats.healthLost<=5&&stats.elapsed<=contract.time*.85)return 2;return 1;}
export function normalizeMedals(raw,completed=[]){return Object.fromEntries(Object.entries(raw&&typeof raw==='object'?raw:{}).filter(([id,rank])=>completed.includes(id)&&[1,2,3].includes(rank)));}
