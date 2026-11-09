export const INTRO_SCENES=[
 {title:'PORTO SALGUEIRO',text:'Depois de anos longe de casa, Lia Duarte volta à Oficina Farol.',duration:6},
 {title:'O LEGADO DE TERESA',text:'Sua mãe ajudou famílias durante a enchente. Agora, dívidas ameaçam fechar a oficina.',duration:7},
 {title:'UM CAMINHÃO. UMA PROMESSA.',text:'O velho Aurora ainda pode voltar à estrada. Seu Nilo tem um primeiro frete esperando.',duration:7},
 {title:'CARGA PESADA',text:'Toda estrada começa com uma escolha. O legado agora está em suas mãos.',duration:6}
];
export const CREDIT_SCENES=[
 {title:'O NOME DE TERESA',text:'A documentação chegou às autoridades. A Rota Imperial está sob investigação.',duration:7},
 {title:'A OFICINA FAROL CONTINUA',text:'Lia, Seu Nilo e Bia mantêm as portas abertas. Os amigos se reúnem para homenagear Teresa.',duration:7},
 {title:'CARGA PESADA',text:'Uma história original de estrada, amizade e recomeço em Santa Brava.',duration:7},
 {title:'OBRIGADO POR JOGAR',text:'Desenvolvido com Three.js. A estrada continua: sua frota e seus contratos esperam por você.',duration:7}
];
export function sceneAt(scenes,elapsed){let time=Math.max(0,elapsed);for(let index=0;index<scenes.length;index++){if(time<scenes[index].duration)return {index,scene:scenes[index],time};time-=scenes[index].duration;}return null;}
export function shouldPlayIntro(id,completed,shown){return id==='m01'&&!shown&&!completed.includes('m01');}
export function shouldPlayCredits(id,success,first){return id==='m30'&&success&&first;}
