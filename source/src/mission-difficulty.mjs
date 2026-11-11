// Curva de desafio de fretes. Os quatro fretes do prólogo permanecem didáticos.
// Dados compartilhados por menus, simulação e testes, sem dependência de renderização.
const TIERS=[
 {label:'APRENDIZAGEM',average:0,buffer:0,minCargo:0,fragile:1,extraTraffic:0,spacing:170},
 {label:'MODERADA',average:19.3,buffer:28,minCargo:60,fragile:1.20,extraTraffic:2,spacing:150},
 {label:'EXIGENTE',average:20.8,buffer:27,minCargo:67,fragile:1.45,extraTraffic:4,spacing:140},
 {label:'DIFÍCIL',average:22,buffer:25,minCargo:74,fragile:1.70,extraTraffic:6,spacing:130},
 {label:'PESADA',average:23.1,buffer:25,minCargo:80,fragile:1.95,extraTraffic:8,spacing:120},
 {label:'ELITE',average:24,buffer:24,minCargo:86,fragile:2.20,extraTraffic:10,spacing:110}
];
export function missionDifficulty(contract){
 const tier=Math.min(5,Math.max(0,Math.trunc(Number(contract?.chapter)||0)));
 const p=TIERS[tier];
 return {tier,label:p.label,
  averageSpeed:p.average,
  deadline:tier>0&&!contract.race?Math.ceil(contract.length/p.average+p.buffer):contract.time,
  cargoMinimum:tier>0&&!contract.race?p.minCargo:contract.min,
  fragile:tier>0&&!contract.race?p.fragile:contract.fragile,
  trafficCount:contract.race?null:16+p.extraTraffic,
  trafficSpacing:p.spacing
 };
}
export function balanceFreightContract(contract){
 if(contract.chapter<=0||contract.race)return contract;
 const p=missionDifficulty(contract);
 contract.time=p.deadline;
 contract.min=Math.max(contract.min,p.cargoMinimum);
 contract.fragile=p.fragile;
 return contract;
}
