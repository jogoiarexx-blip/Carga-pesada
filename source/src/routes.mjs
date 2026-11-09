// Road position is shared by rendering, driving, traffic and collision checks.
export const ROUTES={
 porto:{id:'porto',name:'Acesso ao Porto Salgueiro',theme:'Armazéns e peças',seed:6184,grass:'#8b967b',leaf:'#617c65',shoulder:'#a9a498',sky:'#b1c1bf',hill:'#798c81',treeCount:260,width:14,length:2750,signs:[[180,'PORTO SALGUEIRO  →'],[1050,'DISTRITO DOS ARMAZÉNS'],[2070,'ARMAZÉM 17 · ENTREGA']],curves:[[26,.0027],[7,.0062]]},
 ipes:{id:'ipes',name:'Estrada dos Ipês',theme:'Verde dos Ipês',seed:761,grass:'#788b60',leaf:'#536c46',shoulder:'#b6a582',sky:'#a6bbb0',hill:'#6c8069',treeCount:720,width:14,length:2200,signs:[[140,'VILA DOS IPÊS  →'],[780,'COOPERATIVA  1 km'],[1460,'ENTREGA ADIANTE']],curves:[[35,.0019],[9,.0048]]},
 vale:{id:'vale',name:'Vale do Rio Grande',theme:'Terra e cerâmica',seed:1943,grass:'#9b9167',leaf:'#727449',shoulder:'#b99673',sky:'#c1b9a1',hill:'#9d8666',treeCount:450,width:14,length:3600,signs:[[170,'VALE DO RIO GRANDE'],[950,'CURVAS · REDUZA'],[2100,'COOPERATIVA DO VALE'],[2850,'ENTREGA ADIANTE']],curves:[[66,.0033],[15,.008]]},
 circuito:{id:'circuito',name:'Circuito dos Ipês',theme:'Coiote em pista fechada',seed:4081,grass:'#617b69',leaf:'#3d6251',shoulder:'#9a947b',sky:'#97b5b2',hill:'#527366',treeCount:520,width:14,length:3200,signs:[[120,'PROVA AUTORIZADA'],[850,'CURVA · FREIE ANTES'],[1750,'RETA DA ULTRAPASSAGEM'],[2450,'CHEGADA  350 m']],curves:[[54,.0046],[12,.0105]]}
};
export function routeFor(contract){return ROUTES[contract?.roadId]||ROUTES.ipes;}
export function roadCenter(s,route=ROUTES.ipes){return route.curves.reduce((sum,[a,f])=>sum+a*Math.sin(s*f),0);}
export function roadSlope(s,route=ROUTES.ipes){return route.curves.reduce((sum,[a,f])=>sum+a*f*Math.cos(s*f),0);}
export function roadCurvature(s,route=ROUTES.ipes){const slope=roadSlope(s,route);return route.curves.reduce((sum,[a,f])=>sum-a*f*f*Math.sin(s*f),0)/Math.pow(1+slope*slope,1.5);}
// Lookahead includes reaction time and the current truck's loaded braking power.
export function curveAdvice(s,speed,route,braking=5){
 let best={safe:110,curvature:0,distance:0};
 for(let d=15;d<=200;d+=5){const curvature=roadCurvature(s+d,route),safe=Math.min(110,Math.sqrt(1.7/Math.max(.0001,Math.abs(curvature)))*3.6);if(safe<best.safe-.1)best={safe,curvature,distance:d};}
 const safe=Math.round(best.safe/5)*5,velocity=Math.max(0,speed),stopping=Math.max(0,(velocity*velocity-(safe/3.6)**2)/(2*Math.max(.5,braking)))+velocity*.8;
 const tight=Math.abs(best.curvature)>.0012,warning=tight&&velocity*3.6>safe+5;
 return {safe,tight,warning,distance:best.distance,brakeNow:warning&&best.distance<=stopping+15,direction:best.curvature>0?'À DIREITA':'À ESQUERDA'};
}
