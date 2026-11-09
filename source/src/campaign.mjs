import {EXTRA_STORY} from './story-expansion.mjs';
export const STORY={
 m01:{previous:null,bonus:250,speaker:'SEU NILO',brief:'O Aurora passou anos parado. Leve as ferramentas até a cooperativa dos Ipês. Se ele fizer esse caminho, a Oficina Farol pode voltar a abrir.',radio:'Sem pressa, Lia. Sinta o freio e cruze o portal verde por dentro da pista.',outro:'Seu Nilo: “Motor acordado, ferramentas entregues. Bia conseguiu nosso primeiro contrato de verdade no porto.”'},
 m02:{previous:'m01',bonus:400,speaker:'BIA · FREQUÊNCIA 17',brief:'O armazém do porto precisa de peças para consertar uma empilhadeira. É o primeiro contrato em nome da Oficina Farol desde a morte de Teresa. Entregue tudo inteiro e faça nosso nome voltar a circular.',radio:'Peças para o Armazém 17. A doca está identificada no fim da rodovia.',outro:'Bia: “O pessoal do porto pagou e recomendou você à cooperativa de cerâmica. Teresa dizia que confiança se constrói entrega por entrega.”'},
 m03:{previous:'m02',bonus:500,speaker:'BIA · FREQUÊNCIA 17',brief:'A cooperativa do Vale confiou a você suas cerâmicas. A carga é frágil e as curvas exigem freio. Entregar sem quebrar abre portas que velocidade nenhuma abre.',radio:'Cerâmicas a bordo. O Vale tem curvas fechadas: acompanhe os avisos.',outro:'Bia: “As cerâmicas chegaram inteiras. Coiote ouviu falar de você e reservou o circuito dos Ipês para uma prova autorizada.”'},
 m04:{previous:'m03',bonus:700,speaker:'RAFA “COIOTE” BRAGA',brief:'“Lia Duarte? Eu conheci sua mãe. Disseram que o Aurora voltou. Vamos ver se você tem mão para ele! Circuito fechado, sem trânsito civil. A gente disputa na pista e conversa no posto.”',radio:'Circuito fechado. Coiote está à direita. Freie antes das curvas!',outro:'Coiote: “Você dirige como ela. No Vale tem gente que ainda guarda os manifestos da Teresa. Quando chegar a hora, eu mostro o caminho.” A conversa abre pistas para a próxima jornada; o próximo capítulo ainda está em produção.'}
};
Object.assign(STORY,EXTRA_STORY);STORY.m04.outro='Coiote: Você dirige como Teresa. A cooperativa do Vale precisa de sementes; Bia já conseguiu o próximo contrato.';
export const MISSION_IDS=Object.keys(STORY);
export function normalizeCampaign(save){
 const valid=ids=>[...new Set((Array.isArray(ids)?ids:[]).filter(id=>MISSION_IDS.includes(id)))];
 if(save.campaign?.version===1)return {...save.campaign,completed:valid(save.campaign.completed),bonusesClaimed:valid(save.campaign.bonusesClaimed),legacyAvailable:valid(save.campaign.legacyAvailable)};
 // Old counters do not identify which contracts were delivered. Only actual best times do.
 const completed=MISSION_IDS.filter(id=>Number.isFinite(save.best?.[id])&&save.best[id]>0);
 return {version:1,completed,bonusesClaimed:[...completed],legacyAvailable:['m03',...(save.deliveries>=1?['m04']:[])]};
}
export function missionUnlocked(id,save){const info=STORY[id];if(!info)return false;const c=save.campaign||normalizeCampaign(save);return !info.previous||c.completed.includes(id)||c.completed.includes(info.previous)||c.legacyAvailable.includes(id);}
export function nextMission(save){const completed=save.campaign?.completed||[];return MISSION_IDS.find(id=>!completed.includes(id))||null;}
export function recordMission(save,id){
 if(!missionUnlocked(id,save))return null;
 save.campaign=save.campaign||normalizeCampaign(save);const c=save.campaign,first=!c.completed.includes(id),bonus=c.bonusesClaimed.includes(id)?0:STORY[id].bonus;
 if(first)c.completed.push(id);if(!c.bonusesClaimed.includes(id))c.bonusesClaimed.push(id);
 return {first,bonus,next:nextMission(save)};
}
export function missionStatus(id,save){if(save.campaign.completed.includes(id))return 'CONCLUÍDA · REPETÍVEL';if(save.campaign.legacyAvailable.includes(id)&&STORY[id].previous&&!save.campaign.completed.includes(STORY[id].previous))return 'DISPONÍVEL · SAVE ANTERIOR';return missionUnlocked(id,save)?'DISPONÍVEL':'CONCLUA '+STORY[id].previous.toUpperCase();}
