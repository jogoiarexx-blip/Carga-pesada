import {RecordedSounds} from './recorded-sounds.mjs';
import {commitGarageMutation} from './garage-transaction.mjs';
import {INTRO_SCENES,CREDIT_SCENES,sceneAt,shouldPlayIntro,shouldPlayCredits} from './cinematics.mjs';
import {MEDALS} from './achievements.mjs';
import {makeBackup,parseBackup,artReferences,BACKUP_LIMIT} from './career-backup.mjs';
import {exportArt,restoreArt,removeRestoredArt} from './art-store.mjs';
import {presentationPose,cameraPose} from './motion.mjs';
import {buildScenery,sceneryClearance} from './road-scenery.mjs';
import {createHeadlights,updateHeadlights} from './headlights.mjs';
import {requirementsFor,entryCheck,rivalProfile,duelLines} from './progression.mjs';
import {RoadMusic,THEMES} from './road-music.mjs';
import {drawSpeedometer,drawMinimap} from './driving-hud.mjs';
import {normalizeGraphicsQuality,graphicsPixelRatio,hudCanvasDue} from './graphics-settings.mjs';
import {PARTS,quoteParts,ownedParts} from './parts-catalog.mjs';
import * as THREE from './vendor/three.module.js';
import {CompatibilityRenderer} from './compat.js';
import {VEHICLES,CONTRACTS,loadSave,clamp,isUnlocked,purchase,upgrade} from './core.mjs';
import {ROUTES,routeFor,roadCenter,roadSlope,curveAdvice} from './routes.mjs';
import {STORY,nextMission,missionStatus} from './campaign.mjs';
import {createSession,advanceSession,resolveSession} from './session.mjs';
import {BODY_TYPES,configuredVehicle,purchaseUnlocked,equipBody} from './fleet.mjs';
import {buildTruck,animateTruck,disposeTruck} from './truck-model.mjs';
import {PAINTS,repairCost,repairTruck,upgradeCost,installUpgrade,repaintTruck,garageSelection} from './workshop.mjs';
import {pageHash,pageFromHash} from './navigation.mjs';
import {PRESETS,ACCESSORIES,normalizeDecoration,saveDecoration} from './decoration.mjs';
import {decorateTruck,animateDecoration} from './truck-decoration.mjs';
import {studioEnvironment,addContactShadow} from './truck-studio.mjs';
import {createWorkshopScene,setWorkshopQuality,configureWorkshopVehicle,beginWorkshopService,stopWorkshopService,updateWorkshopService} from './workshop-scene.mjs';
import {workshopCameraDistance} from './workshop-camera.mjs';
import {importArt} from './art-store.mjs';
const $=id=>document.getElementById(id),money=n=>'CR$ '+Math.round(n).toLocaleString('pt-BR');
let savedRaw=null;try{savedRaw=localStorage.getItem('carga-pesada-v1');}catch{}
let save=loadSave(savedRaw),mode='home',mission=null,run=null,session=null,player,rival,traffic=[],cameraMode=0,clock=0,toastTimer,radioTimer,saveWarned=false;
// Apenas nesta sessão: evita repetir a abertura ao iniciar o primeiro frete.
let introShownThisSession=false;
let night=false;
const keys={}, scene=new THREE.Scene();scene.background=new THREE.Color('#a6bbb0');scene.fog=new THREE.FogExp2('#a6bbb0',.0019);
let renderer;try{renderer=new THREE.WebGLRenderer({canvas:$('world'),alpha:true,antialias:true,powerPreference:'high-performance'});}catch(e){const replacement=document.createElement('canvas');replacement.id='world';replacement.setAttribute('aria-label','Mundo 3D de Carga Pesada, renderização compatível');$('world').replaceWith(replacement);renderer=new CompatibilityRenderer(replacement);document.querySelector('.build').textContent='v0.32';}
let workshopScene=null;
let graphicsQuality='balanced';try{graphicsQuality=normalizeGraphicsQuality(localStorage.getItem('carga-pesada-graphics'));}catch{}
function applyGraphicsQuality(){renderer.setPixelRatio(graphicsPixelRatio(graphicsQuality,devicePixelRatio));renderer.setSize(innerWidth,innerHeight);if(workshopScene)setWorkshopQuality(workshopScene,graphicsQuality);}
applyGraphicsQuality();renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
scene.environment=studioEnvironment();
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.3,650);const hemi=new THREE.HemisphereLight('#f5e9bd','#3a6252',2.3);scene.add(hemi);const sun=new THREE.DirectionalLight('#ffdda5',3.1);sun.position.set(-40,65,50);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-45;sun.shadow.camera.right=45;sun.shadow.camera.top=50;sun.shadow.camera.bottom=-50;sun.shadow.normalBias=.04;scene.add(sun);scene.add(sun.target);
const mat=(color,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness,flatShading:true});const mats={road:mat('#596560'),shoulder:mat('#b6a582'),grass:mat('#788b60'),stripe:mat('#ded4a0'),bark:mat('#65543f'),leaf:mat('#536c46'),metal:mat('#9ca9a0',.35),dark:mat('#1d3030'),glass:mat('#456964',.25),rubber:mat('#202826'),lamp:mat('#f8d184')};
function box(w,h,d,m,parent,x=0,y=0,z=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof m==='string'?mat(m):m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
const skyImages={};const skyLoader=new THREE.TextureLoader();for(const region of ['vale','porto','ipes','circuito'])for(const time of ['dia','noite'])skyImages[region+'-'+time]=skyLoader.load(new URL('assets/fundo-'+region+'-'+time+'.svg',document.baseURI).href);
let activeRoute=ROUTES.ipes;
function configureWorkshopScene(visible){
 if(!visible)$('workshopServiceStatus').classList.add('hidden');
 if(visible&&!workshopScene){workshopScene=createWorkshopScene();workshopScene.position.copy(point(22,-3.4));scene.add(workshopScene);setWorkshopQuality(workshopScene,graphicsQuality);}
 if(workshopScene){workshopScene.visible=visible;if(!visible)stopWorkshopService(workshopScene);}
}
function center(s){return roadCenter(s,activeRoute);}
function heading(s){return -Math.atan(roadSlope(s,activeRoute));}
function point(s,x=0,y=0){return new THREE.Vector3(center(s)+x,y,-s);}
let seed=761;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
const environment=new THREE.Group();scene.add(environment);
const headlights=createHeadlights(scene);renderer.headlightBeam=headlights.beam;
function textSign(text,w=7,h=2){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#254e43';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#e0dfb7';ctx.lineWidth=5;ctx.strokeRect(6,6,500,116);ctx.fillStyle='#f2edcd';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 34px Arial';ctx.fillText(text,256,64);const tex=new THREE.CanvasTexture(c);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));}

function buildEnvironment(route){
 const geometries=new Set(),materials=new Set();environment.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material&&!Object.values(mats).includes(o.material))materials.add(o.material);});
 environment.clear();geometries.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose();});renderer.colors?.clear();
 activeRoute=route;seed=route.seed;renderer.palette={sky:route.sky,grass:route.grass};scene.background=new THREE.Color(route.sky);scene.fog.color.set(route.sky);
 mats.grass.color.set(route.grass);mats.leaf.color.set(route.leaf);mats.shoulder.color.set(route.shoulder);
const terrain=new THREE.Mesh(new THREE.PlaneGeometry(12000,16000),mats.grass);terrain.rotation.x=-Math.PI/2;terrain.position.set(0,-.09,-3500);terrain.receiveShadow=true;environment.add(terrain);
const roadGroup=new THREE.Group();environment.add(roadGroup);
const segment=12,count=Math.ceil((route.length+150)/segment);
for(let i=-16;i<count;i++){const a=point(i*segment),b=point((i+1)*segment),length=a.distanceTo(b)+.4,mid=a.clone().add(b).multiplyScalar(.5),angle=-Math.atan2(b.x-a.x,-(b.z-a.z));const g=new THREE.Group();g.position.copy(mid);g.rotation.y=angle;roadGroup.add(g);box(19,.1,length,mats.shoulder,g,0,0,0);box(14,.12,length,mats.road,g,0,.035,0);box(.14,.02,length,mats.stripe,g,-6.7,.11,0);box(.14,.02,length,mats.stripe,g,6.7,.11,0);box(.14,.02,4,mats.stripe,g,0,.11,0);if(i%6===0){for(let side of [-1,1]){box(.2,1.1,.2,mats.stripe,g,side*8.5,.5,0);box(.23,.15,.24,mats.lamp,g,side*8.5,.9,-.02);}}}
roadGroup.updateMatrixWorld(true);
const roadBatches=new Map();roadGroup.traverse(o=>{if(!o.isMesh)return;const key=o.material;let list=roadBatches.get(key);if(!list)roadBatches.set(key,list=[]);list.push(o);});
for(const [material,list] of roadBatches){const unit=new THREE.BoxGeometry(1,1,1),batch=new THREE.InstancedMesh(unit,material,list.length),scale=new THREE.Matrix4(),transform=new THREE.Matrix4();list.forEach((o,i)=>{const p=o.geometry.parameters;scale.makeScale(p.width,p.height,p.depth);transform.multiplyMatrices(o.matrixWorld,scale);batch.setMatrixAt(i,transform);o.geometry.dispose();});batch.receiveShadow=true;batch.userData.ground=material===mats.shoulder||material===mats.road||material===mats.stripe;batch.userData.groundLayer=material===mats.shoulder?0:material===mats.road?1:2;environment.add(batch);}environment.remove(roadGroup);

const treeGeo=new THREE.ConeGeometry(1,1,6),trunkGeo=new THREE.CylinderGeometry(.18,.3,1,5);const treeCount=route.treeCount,trees=new THREE.InstancedMesh(treeGeo,mats.leaf,treeCount),trunks=new THREE.InstancedMesh(trunkGeo,mats.bark,treeCount),dummy=new THREE.Object3D();
for(let i=0;i<treeCount;i++){const s=random()*(route.length+300)-180,x=center(s)+(random()>.5?1:-1)*(13+random()*160),h=4+random()*10;if(!sceneryClearance(s,x-center(s),route)){dummy.position.set(0,-1000,0);dummy.scale.setScalar(0);dummy.updateMatrix();trees.setMatrixAt(i,dummy.matrix);trunks.setMatrixAt(i,dummy.matrix);continue;}dummy.position.set(x,h*.63,-s);dummy.scale.set(h*.35,h,h*.35);dummy.rotation.y=random()*6;dummy.updateMatrix();trees.setMatrixAt(i,dummy.matrix);dummy.position.y=h*.18;dummy.scale.set(1,h*.5,1);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);}trees.castShadow=true;environment.add(trees,trunks);
environment.add(buildScenery(route,textSign));
const hills=new THREE.Group();for(let i=0;i<Math.ceil(route.length/180)+3;i++){const mountain=new THREE.Mesh(new THREE.ConeGeometry(90+random()*180,80+random()*160,5),mat(route.hill));mountain.position.set((i%2?1:-1)*(460+random()*300),25,-i*180);hills.add(mountain);}environment.add(hills);
const sunDisk=new THREE.Mesh(new THREE.SphereGeometry(36,16,8),new THREE.MeshBasicMaterial({color:'#f1d2a0',fog:false}));sunDisk.name='route-sun';sunDisk.position.set(-550,370,-1100);environment.add(sunDisk);
function sign(s,text){const g=new THREE.Group();g.position.copy(point(s,11));box(.22,4,.22,mats.metal,g,0,2,0);const face=textSign(text);face.position.set(0,4.1,0);g.add(face);environment.add(g);}for(const [distance,label] of route.signs)sign(distance,label);
const depot=new THREE.Group();depot.position.copy(point(-35,-19));box(16,5,14,'#a68b62',depot,0,2.5,0);box(17,.4,15,'#4d6256',depot,0,5.2,0);box(7,3.7,.1,'#203d39',depot,1.7,1.9,7.1);box(2,2,.15,'#afc3ad',depot,-5,2.8,7.1);const depotSign=textSign('OFICINA FAROL',12,2);depotSign.position.set(0,4.3,7.2);depot.add(depotSign);environment.add(depot);

if(route.id==='porto'){
 for(let i=0;i<8;i++){const d=1050+i*170,g=new THREE.Group(),side=i%2?1:-1;g.position.copy(point(d,side*(34+i%3*8)));g.rotation.y=heading(d);box(22,7,30,i%2?'#8c9c96':'#9e9c87',g,0,3.5,0);box(23,.4,31,'#536e68',g,0,7.2,0);for(let j=0;j<3;j++)box(5,4.5,.15,mats.dark,g,-7+j*7,2.3,15.1);const signFace=textSign(i===7?'ARMAZÉM 17':'PORTO SALGUEIRO',13,2);signFace.position.set(0,6,15.2);g.add(signFace);environment.add(g);}
}
if(route.id==='circuito'){for(let d=50;d<route.length;d+=65)for(const side of [-1,1]){const marker=new THREE.Group();marker.position.copy(point(d,side*9.4));marker.rotation.y=heading(d);box(.4,.7,5,d%130?'#e4cc9b':'#a9543d',marker,0,.35,0);environment.add(marker);}}
}
function makeTruck(v,color,race=false,bodyId){return buildTruck(v,color,bodyId);}
function replacePlayer(vehicleId=save.selected,bodyId){
 if(player){scene.remove(player);disposeTruck(player);renderer.colors?.clear();}
 const base=VEHICLES.find(v=>v.id===vehicleId),parts=save.fleet[vehicleId],v=configuredVehicle(base,bodyId||parts?.body);
 player=makeTruck(v,parts?.color||base.color,false,v.body);scene.add(player);addContactShadow(player);player.position.copy(point(22,-3.4));player.rotation.y=heading(22);
 decorateTruck(player,mode==='garage'&&vehicleId===previewId?draftDecoration:parts?.decoration);
 $('truckLabel').textContent=v.name.toUpperCase();$('truckSpecs').textContent=`${v.totalAxles} EIXOS · ${BODY_TYPES[v.body].name.toUpperCase()} · ${v.capacity} t`;
}
let decorationEpoch=0,draftDecoration=normalizeDecoration(),currentPage='home',garageTab='fleet',previewId=save.selected,previewBody=null,previewAngle=2.55,previewSpin=false,previewDistance=24,paintChoice=null;
const garageCameraFocus=new THREE.Vector3(0,1.85,0);
function applyLighting(){document.body.dataset.night=night?'true':'false';hemi.intensity=night?1.0:2.3;sun.intensity=night?.4:3.1;renderer.night=night;environment.traverse(o=>{if(o.name==='route-sun')o.visible=!night;});if(mode==='drive'||mode==='paused'||mode==='result'){scene.background=skyImages[activeRoute.id+'-'+(night?'noite':'dia')]||new THREE.Color(activeRoute.sky);scene.fog.color.set(night?'#0a1c2d':activeRoute.sky);renderer.palette={sky:night?'#071624':activeRoute.sky,grass:night?'#253a31':activeRoute.grass};}}
function menuStage(on){environment.visible=!on;configureWorkshopScene(on&&mode==='garage');scene.background=on?null:new THREE.Color(activeRoute.sky);applyLighting();}

function cleanupTraffic(){traffic.forEach(t=>{scene.remove(t.mesh);t.mesh.traverse(o=>{o.geometry?.dispose();if(o.material&&!Object.values(mats).includes(o.material))o.material.dispose();});});traffic=[];if(rival){scene.remove(rival.mesh);disposeTruck(rival.mesh);rival=null;}}
function showPage(page,updateHash=true){
 if(mode==='drive'||mode==='paused')return;
 closeMenuPanel();currentPage=page;mode=page;night=false;decorationEpoch++;persist();document.body.dataset.screen=page;
 for(const [id,key] of [['home','home'],['garage','garage'],['contractsPage','contracts']])$(id).classList.toggle('hidden',key!==page);
 for(const id of ['hud','result','pauseScreen','brief','duelIntro'])$(id).classList.add('hidden');$('header').classList.remove('hidden');finishGate.visible=false;cleanupTraffic();menuStage(true);
 document.querySelectorAll('[data-page]').forEach(button=>{button.classList.toggle('active',button.dataset.page===page);if(button.dataset.page===page)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
 if(page==='garage'){if(garageTab!=='store'&&!save.fleet[previewId])previewId=save.selected;renderGarage();updateGaragePreview(true);}else{replacePlayer();player.rotation.y=0;renderHome();}
 if(updateHash&&location.hash!==pageHash(page))location.hash=pageHash(page);
 window.scrollTo({top:0,behavior:'instant'});
}
function garage(){showPage('garage');}
function showroom(id=save.selected){garageTab='store';previewId=id;previewBody=save.fleet[id]?.body||VEHICLES.find(v=>v.id===id).defaultBody;showPage('garage');}
function updateGaragePreview(reset=false){
 const base=VEHICLES.find(v=>v.id===previewId);if(!base.bodyOptions.includes(previewBody))previewBody=save.fleet[previewId]?.body||base.defaultBody;
 if(reset){decorationEpoch++;draftDecoration=normalizeDecoration(save.fleet[previewId]?.decoration);}
 replacePlayer(previewId,previewBody);player.rotation.y=0;if(paintChoice)player.userData.paint.color.set(paintChoice);
 if(workshopScene)configureWorkshopVehicle(workshopScene,configuredVehicle(base,previewBody));
 if(reset){previewAngle=2.45;previewSpin=false;previewDistance=workshopAutoDistance(base);}syncGarageCameraButtons();$('previewZoom').value=previewDistance;renderGarageDetails();
}
function vehicleIcon(v,color){const hood=v.cab==='classic'||v.cab==='aero',rear=v.category==='tractor'?94:88;return `<svg viewBox="0 0 120 50" aria-hidden="true"><path d="M2 41H117" stroke="#a6b294" opacity=".4"/><path d="${hood?'M5 33V24L20 22L25 12H43V35H5Z':'M6 35V15L12 10H33V35Z'}" fill="${color}" stroke="#ced2ab" stroke-width=".7"/><path d="${hood?'M24 22L28 15H38V23Z':'M11 16H27V24H11Z'}" fill="#142c28"/><path d="M${hood?45:36} 14H112V34H${hood?45:36}Z" fill="${v.defaultBody==='tarp_trailer'?'#bb853b':'#a4b5a3'}" stroke="#d4d6bc" stroke-width=".7"/><path d="M44 34H114V38H26V34" fill="#102a24"/><g fill="#10231e" stroke="#b9c2ac" stroke-width="1.2"><circle cx="17" cy="38" r="6"/><circle cx="${rear-5}" cy="38" r="6"/>${v.axles>2||v.category==='tractor'?`<circle cx="${rear+9}" cy="38" r="6"/>`:''}</g></svg>`;}
function renderGarage(){
 const vehicles=garageTab==='store'?VEHICLES:VEHICLES.filter(v=>save.fleet[v.id]);if(!vehicles.some(v=>v.id===previewId)){previewId=save.selected;previewBody=save.fleet[previewId].body;paintChoice=null;}
 $('fleetCount').textContent=Object.keys(save.fleet).length;$('garageListTitle').textContent=garageTab==='store'?'TODOS OS CAMINHÕES':garageTab==='workshop'?'ESCOLHA PARA PERSONALIZAR':'SEUS COMPANHEIROS';$('garageListCount').textContent=vehicles.length+' MODELO'+(vehicles.length>1?'S':'');
 document.querySelectorAll('[data-garage-tab]').forEach(button=>{button.classList.toggle('active',button.dataset.garageTab===garageTab);button.setAttribute('aria-pressed',button.dataset.garageTab===garageTab?'true':'false');});
 $('fleet').innerHTML=vehicles.map(v=>{const truck=save.fleet[v.id];return `<button class="garage-card ${v.id===previewId?'active':''}" data-preview="${v.id}" aria-label="Ver ${v.name}" aria-pressed="${v.id===previewId}">${vehicleIcon(v,truck?.color||v.color)}<span><strong>${v.name}</strong><small>${v.capacity} t · ${v.axles} eixos ${v.category==='tractor'?'+ carreta':''}</small><small class="owned-tag">${save.selected===v.id?'● EM USO':truck?'NA SUA FROTA':money(v.price)}</small></span></button>`;}).join('');
 document.querySelectorAll('[data-preview]').forEach(button=>button.onclick=()=>{previewId=button.dataset.preview;previewBody=save.fleet[previewId]?.body||VEHICLES.find(v=>v.id===previewId).defaultBody;paintChoice=null;renderGarage();updateGaragePreview(true);});
 renderGarageDetails();
}
// Compras e serviços são aplicados primeiro em uma cópia; só entram na carreira após gravação.
function refreshGarage(){renderGarage();updateGaragePreview();}
function commitGarage(action){
 const result=commitGarageMutation(save,action,localStorage);
 if(!result.ok){
  toast(result.reason==='storage'?'Armazenamento indisponível. Nenhum crédito foi descontado.':'Não foi possível concluir o serviço.');
  return false;
 }
 save=result.save;$('balance').textContent=money(save.money);
 refreshGarage();return true;
}
function workshopAutoDistance(vehicle,angle=previewAngle){
 const rect=$('garageStage').getBoundingClientRect();
 return workshopCameraDistance(vehicle,rect.width||800,rect.height||600,angle);
}
function fitWorkshopPreview(){
 const vehicle=VEHICLES.find(v=>v.id===previewId);
 if(!vehicle)return;
 previewDistance=workshopAutoDistance(vehicle);
 $('previewZoom').value=previewDistance;
}
function showWorkshopService(kind){
 if(mode!=='garage'||!workshopScene||!beginWorkshopService(workshopScene,kind))return;
 const labels={repair:'REPARO EM EXECUÇÃO',engine:'MELHORIA DO MOTOR',brakes:'AJUSTE DOS FREIOS',
  body:'INSTALANDO CARROCERIA',paint:'PINTURA DA CABINE',parts:'EQUIPANDO ACESSÓRIOS'};
 $('workshopServiceStatus').textContent=labels[kind]||'SERVIÇO EM EXECUÇÃO';
 $('workshopServiceStatus').classList.remove('hidden');
}
function syncGarageCameraButtons(){document.querySelectorAll('[data-camera-view]').forEach(button=>button.setAttribute('aria-pressed',String(!previewSpin&&Math.abs(previewAngle-Number(button.dataset.cameraView))<.025)));}

function renderGarageDetails(){
 const selection=garageSelection(save,previewId,previewBody),{vehicle:v,truck,owned,equipped,canBuy,reason}=selection,using=VEHICLES.find(item=>item.id===save.selected),usingParts=save.fleet[save.selected],top=v.max+(truck?.engine||0)*12,usingTop=using.max+usingParts.engine*12;
 const delta=(n,unit)=>n===0?'igual ao equipado':(n>0?'+':'')+n+' '+unit+' vs. equipado';
 $('garageStageTag').textContent=`${equipped?'SEU CAMINHÃO EQUIPADO':owned?'PRÉVIA · CAMINHÃO DA SUA FROTA':'PRÉVIA GRATUITA · AINDA NÃO ADQUIRIDO'}`;
 const comparison=`<h3>COMPARAR COM ${using.name.toUpperCase()}</h3><div class="compare-row"><span>Capacidade</span><em class="${v.capacity>using.capacity?'positive':''}">${delta(v.capacity-using.capacity,'t')}</em></div><div class="compare-row"><span>Velocidade</span><em class="${top>usingTop?'positive':''}">${delta(top-usingTop,'km/h')}</em></div>`;
 const bodyControl=`<h3>${garageTab==='workshop'?'CARROCERIA · PRÉVIA':'CONFIGURAÇÃO DA PRÉVIA'}</h3><select id="bodyPreview" aria-label="Carroceria na garagem">${v.bodyOptions.map(id=>`<option value="${id}" ${id===v.body?'selected':''}>${BODY_TYPES[id].name}</option>`).join('')}</select>${owned&&v.body!==truck.body?`<button class="outline body-install" id="installBody" ${save.money<800?'disabled':''}>INSTALAR CARROCERIA · CR$ 800</button><p class="workshop-note">A troca será aplicada ao ${v.name}.</p>`:''}`;
 let actions='';
 if(garageTab==='workshop'&&owned){const repair=repairCost(truck);actions=`<h3>MANUTENÇÃO · ${Math.round(truck.health)}% DE INTEGRIDADE</h3><div class="service-list"><div class="service"><div><span>Reparação</span><b>${money(repair)}</b></div><small>${repair?'Seu Nilo coloca o caminhão em ordem.':'Tudo em dia para a próxima viagem.'}</small><button id="repairTruck" ${repair===0||save.money<repair?'disabled':''}>REPARAR CAMINHÃO</button></div>${['engine','brakes'].map(type=>{const cost=upgradeCost(truck,type);return `<div class="service"><div><span>${type==='engine'?'Motor':'Freios'} · nível ${truck[type]}</span><b>${cost===null?'MÁXIMO':money(cost)}</b></div><small>${type==='engine'?'Mais aceleração e velocidade final.':'Menor distância de parada.'}</small><button data-service="${type}" ${cost===null||save.money<cost?'disabled':''}>INSTALAR MELHORIA</button></div>`;}).join('')}</div><h3>PINTURA DA CABINE · PRÉVIA</h3><div class="paint-swatches">${PAINTS.map((color,i)=>`<button aria-label="Prévia da pintura ${['âmbar','verde','vermelha','marfim','azul'][i]}" data-paint="${color}" class="${(paintChoice||truck.color)===color?'selected':''}" style="background:${color}"></button>`).join('')}</div><button class="outline" id="applyPaint" ${!paintChoice||paintChoice===truck.color||save.money<300?'disabled':''}>APLICAR PINTURA · CR$ 300</button><p class="workshop-note">Peças, pintura e carroceria ficam neste caminhão. Escolher uma cor mostra apenas a prévia.</p>`;}
 else actions=owned?`<button class="primary" id="useTruck" ${equipped?'disabled':''}>${equipped?'● CAMINHÃO EM USO':'USAR ESTE CAMINHÃO ↗'}</button><button class="outline" id="openWorkshop">PERSONALIZAR NA OFICINA ↗</button><p class="disabled-note">Integridade: ${Math.round(truck.health)}% · Motor N${truck.engine} · Freios N${truck.brakes}</p>`:`<div class="garage-price"><small>VALOR DO CONJUNTO</small>${money(v.price)}</div><button class="primary" id="buyTruck" ${canBuy?'':'disabled'}>COMPRAR E USAR ↗</button><p class="disabled-note">${reason||'Inclui a carroceria padrão. O caminhão atual permanece na frota.'}</p>`;
 const workshopOverview=garageTab==='workshop'&&owned?`<div class="workshop-overview"><strong>DIAGNÓSTICO DA OFICINA</strong><span>Condição do caminhão: <b>${Math.round(truck.health)}%</b> · Motor N${truck.engine} · Freios N${truck.brakes}</span><small>Escolha um serviço, veja a prévia e confirme apenas quando estiver satisfeito.</small></div>`:'';
 $('garageDetails').innerHTML=`<span class="eyebrow">${v.category==='tractor'?'CAVALO MECÂNICO + CARRETA':'CAMINHÃO RÍGIDO'}</span><h2>${v.name}</h2><p class="garage-description">${v.description}</p><div class="truck-data"><div><span>CAPACIDADE</span><b>${v.capacity} <small>t</small></b></div><div><span>VELOCIDADE</span><b>${top} <small>km/h</small></b></div><div><span>COMPRIMENTO</span><b>${v.length} <small>m</small></b></div><div><span>EIXOS NO CONJUNTO</span><b>${v.totalAxles}</b></div></div>${garageTab==='workshop'?'':comparison}${workshopOverview}${bodyControl}${garageTab==='workshop'?`<details class="workshop-services" ${serviceOpen?'open':''}><summary>MECÂNICA E PINTURA</summary>${actions}</details>`:actions}${garageTab==='store'||owned&&garageTab==='workshop'?decorationControls():''}`;
 if(document.querySelector('.workshop-services'))document.querySelector('.workshop-services').ontoggle=e=>serviceOpen=e.currentTarget.open;
 bindDecorationControls();
 $('bodyPreview').onchange=e=>{previewBody=e.target.value;updateGaragePreview();};
 if($('installBody'))$('installBody').onclick=()=>{if(commitGarage(draft=>equipBody(draft,previewBody,previewId))){showWorkshopService('body');toast('Carroceria instalada no '+v.name+'.');}};
 if($('useTruck'))$('useTruck').onclick=()=>{if(commitGarage(draft=>{if(!draft.fleet[previewId])return false;draft.selected=previewId;return true;}))toast(v.name+' pronto para a estrada.');};
 if($('buyTruck'))$('buyTruck').onclick=()=>{if(commitGarage(draft=>purchase(draft,previewId))){previewBody=save.fleet[previewId].body;toast(v.name+' adicionado à sua frota.');}};
 if($('openWorkshop'))$('openWorkshop').onclick=()=>{garageTab='workshop';serviceOpen=true;paintChoice=null;renderGarage();updateGaragePreview();};
 if($('repairTruck'))$('repairTruck').onclick=()=>{if(commitGarage(draft=>repairTruck(draft,previewId))){showWorkshopService('repair');toast('Reparação concluída.');}};
 document.querySelectorAll('[data-service]').forEach(button=>button.onclick=()=>{if(commitGarage(draft=>installUpgrade(draft,previewId,button.dataset.service))){showWorkshopService(button.dataset.service);toast('Melhoria instalada no '+v.name+'.');}});
 document.querySelectorAll('[data-paint]').forEach(button=>button.onclick=()=>{paintChoice=button.dataset.paint;player.userData.paint.color.set(paintChoice);renderer.colors?.delete(player.userData.paint);renderGarageDetails();});
 if($('applyPaint'))$('applyPaint').onclick=()=>{if(commitGarage(draft=>repaintTruck(draft,previewId,paintChoice))){paintChoice=null;updateGaragePreview();showWorkshopService('paint');toast('Pintura aplicada no '+v.name+'.');}};
}
let workshopPanel='parts',partGroup='Todas',serviceOpen=true;
function checkoutUI(){if(!$('applyDecoration'))return;const q=quoteParts(save,previewId,draftDecoration),button=$('applyDecoration');button.disabled=!q.valid||!!q.reason;button.textContent=!q.valid?'ADQUIRA O CAMINHÃO PARA EQUIPAR':q.cost?'COMPRAR E EQUIPAR · '+money(q.cost):'EQUIPAR PEÇAS ADQUIRIDAS';$('checkoutCost').textContent=q.valid?(q.items.length+' nova(s) peça(s) · '+money(q.cost)):'Prévia de caminhão da loja';$('checkoutNote').textContent=q.reason||'Peças adquiridas continuam neste caminhão mesmo quando removidas.';}
function decorationControls(){const d=draftDecoration,owned=ownedParts(save.fleet[previewId]);return `<section class="deko"><div class="workshop-nav" aria-label="Personalização">${[['parts','PEÇAS · 48'],['art','ARTE'],['lights','LUZES']].map(([id,label])=>`<button data-workshop-panel="${id}" aria-pressed="${workshopPanel===id}">${label}</button>`).join('')}</div><div class="checkout-summary"><b id="checkoutCost"></b><p id="checkoutNote"></p></div>
<div data-workshop-content="parts"><h3>CATÁLOGO DE PEÇAS</h3><p class="workshop-note">Escolha uma versão para ver no caminhão. Comprar e equipar confirma o valor total.</p><div class="part-groups">${['Todas','Cabine','Carroceria','Rodas','Luzes'].map(g=>`<button data-part-group="${g}" aria-pressed="${partGroup===g}">${g}</button>`).join('')}</div><div class="accessory-options">${Object.entries(ACCESSORIES).map(([key,label])=>`<article class="part-card" data-part-card="${PARTS[key][0].group}"><label class="deko-check"><input type="checkbox" data-accessory="${key}" ${d.accessories[key]?'checked':''}>${label}</label><select data-part-version="${key}" aria-label="Versão de ${label}">${PARTS[key].map(v=>`<option value="${v.id}" ${d.variants[key]===v.id?'selected':''}>${v.name} · ${owned.includes(key+':'+v.id)?'ADQUIRIDA':money(v.price)}</option>`).join('')}</select><small>${PARTS[key][0].group} · Ajustada à cabine e ao chassi</small></article>`).join('')}</div><button class="outline" id="dekoFullPreview">EXPERIMENTAR CONJUNTO COMPLETO</button><label>TEXTO DO LETREIRO<input id="dekoSignText" maxlength="24" value="${d.signText.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" placeholder="Nome do caminhão"></label></div>
<div data-workshop-content="art"><h3>ARTE NA CARROCERIA</h3><p class="workshop-note">Importação e artes incluídas sem custo. Imagens ficam neste navegador.</p><label>PAINEL<select id="artTarget"><option value="both">Duas laterais</option><option value="left">Lateral esquerda</option><option value="right">Lateral direita</option><option value="rear">Traseira</option></select></label><label>ARTE<select id="artPreset">${Object.entries(PRESETS).map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label><button class="outline" id="previewArt">VER ARTE NO PAINEL</button><label class="upload-art">IMPORTAR JPG / PNG / WEBP<input id="artFile" type="file" accept="image/png,image/jpeg,image/webp"></label><p class="workshop-note">Até 8 MB. Imagem otimizada e guardada neste navegador.</p><label>ENQUADRAMENTO<select id="artFit"><option value="cover" ${d.fit==='cover'?'selected':''}>Preencher (recorta as bordas)</option><option value="contain" ${d.fit==='contain'?'selected':''}>Imagem inteira (com margens)</option></select></label></div>
<div data-workshop-content="lights"><h3>ILUMINAÇÃO DECORATIVA</h3><p class="workshop-note">Os padrões são gratuitos. Faróis, faixas e letreiros são adquiridos no catálogo de peças.</p><label class="deko-check"><input id="dekoEnabled" type="checkbox" ${d.lights?'checked':''}> Luzes na carroceria</label><label>EFEITO<select id="dekoPattern"><option value="steady">Fixo</option><option value="pulse">Pulsar suave</option><option value="chase">Sequencial</option></select></label><label>CORES<select id="dekoPalette"><option value="festival">Festival multicolorido</option><option value="amber">Âmbar</option><option value="cyan">Azul e ciano</option></select></label><p class="workshop-note">O horário é definido pela fase. As luzes permanecem equipadas de dia e à noite.</p></div>
<div class="workshop-checkout"><button class="primary" id="applyDecoration">COMPRAR E EQUIPAR</button><button class="outline" id="discardPreview">DESCARTAR PRÉVIA</button><p id="decorationStatus" class="workshop-note">Escolher versões altera apenas a prévia. Peças visuais não dão vantagem mecânica.</p></div></section>`;}
function workshopTabs(){document.querySelectorAll('[data-workshop-content]').forEach(el=>el.hidden=el.dataset.workshopContent!==workshopPanel);document.querySelectorAll('[data-workshop-panel]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.workshopPanel===workshopPanel)));document.querySelectorAll('[data-part-card]').forEach(el=>el.hidden=partGroup!=='Todas'&&el.dataset.partCard!==partGroup);document.querySelectorAll('[data-part-group]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.partGroup===partGroup)));}
function bindDecorationControls(){if(!$('artTarget'))return;const epoch=decorationEpoch,redraw=()=>{renderer.colors?.clear();decorateTruck(player,draftDecoration);checkoutUI();$('decorationStatus').textContent='Alterações na prévia. Salve para equipar neste caminhão.';},setArt=(id,side=$('artTarget').value)=>{if(side==='both'){draftDecoration.left=id;draftDecoration.right=id;}else draftDecoration[side]=id;redraw();$('decorationStatus').textContent='Prévia atualizada. Clique em Salvar personalização para equipar.';};
 checkoutUI();workshopTabs();document.querySelectorAll('[data-workshop-panel]').forEach(b=>b.onclick=()=>{workshopPanel=b.dataset.workshopPanel;workshopTabs();});document.querySelectorAll('[data-part-group]').forEach(b=>b.onclick=()=>{partGroup=b.dataset.partGroup;workshopTabs();});document.querySelectorAll('[data-part-version]').forEach(select=>select.onchange=()=>{const key=select.dataset.partVersion;draftDecoration.variants[key]=Number(select.value);draftDecoration.accessories[key]=true;document.querySelector('[data-accessory="'+key+'"]').checked=true;redraw();});$('discardPreview').onclick=()=>{draftDecoration=normalizeDecoration(save.fleet[previewId]?.decoration);updateGaragePreview();toast('Prévia descartada.');};
 $('artPreset').value=Object.hasOwn(PRESETS,draftDecoration.left)?draftDecoration.left:'none';
 $('dekoFullPreview').onclick=()=>{draftDecoration=normalizeDecoration({...draftDecoration,accessories:Object.fromEntries(Object.keys(ACCESSORIES).map(id=>[id,true])),lights:true,left:'serra',right:'serra'});decorateTruck(player,draftDecoration);renderGarageDetails();};
 $('dekoPattern').value=draftDecoration.pattern;$('dekoPalette').value=draftDecoration.palette;
 $('previewArt').onclick=()=>setArt($('artPreset').value);
 $('artFile').onchange=async e=>{const id=previewId,side=$('artTarget').value,file=e.target.files[0];if(!file)return;const input=e.target;input.disabled=true;try{const art=await importArt(file);if(id!==previewId||mode!=='garage'||epoch!==decorationEpoch)return;setArt(art,side);toast('Imagem pronta na prévia. Salve para equipar.');}catch(error){toast(error.message);}finally{input.disabled=false;}};
 $('artFit').onchange=e=>{draftDecoration.fit=e.target.value;redraw();};
 for(const id of ['dekoEnabled','dekoPattern','dekoPalette'])$(id).onchange=()=>{draftDecoration.lights=$('dekoEnabled').checked;draftDecoration.pattern=$('dekoPattern').value;draftDecoration.palette=$('dekoPalette').value;redraw();};
 document.querySelectorAll('[data-accessory]').forEach(input=>input.onchange=()=>{draftDecoration.accessories[input.dataset.accessory]=input.checked;redraw();$('decorationStatus').textContent='Peças na prévia. Salve para equipar neste caminhão.';});
 $('dekoSignText').oninput=e=>{draftDecoration.signText=normalizeDecoration({signText:e.target.value}).signText;redraw();};

 $('applyDecoration').onclick=()=>{draftDecoration.signText=normalizeDecoration({signText:$('dekoSignText').value}).signText;const quote=quoteParts(save,previewId,draftDecoration);if(!quote.valid||quote.reason){toast(quote.reason||'Não foi possível equipar.');return;}if(commitGarage(draft=>saveDecoration(draft,previewId,draftDecoration))){showWorkshopService('parts');$('decorationStatus').textContent='Personalização equipada e salva neste caminhão.';toast('Personalização equipada no '+VEHICLES.find(v=>v.id===previewId).name+'.');}};
}
window.addEventListener('art-error',event=>toast(event.detail));
function persist(){try{localStorage.setItem('carga-pesada-v1',JSON.stringify(save));}catch{if(!saveWarned){toast('Não foi possível salvar neste navegador.');saveWarned=true;}return false;}$('balance').textContent=money(save.money);return true;}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3500);}
function showRadio(t){$('radioText').textContent=t;$('radio').classList.remove('hidden');radioTimer=clock+8;}
let chapterFilter='all',timeFilter='all',statusFilter='all';

// REV18: menu pages share the live career state; no decorative/inert navigation.
let menuPanelOpen=false,menuPanelReturnFocus=null;
function closeMenuPanel(){
 const panel=$('menuPanel');if(!panel||panel.classList.contains('hidden'))return;
 panel.classList.add('hidden');menuPanelOpen=false;
 document.querySelectorAll('[data-menu-panel]').forEach(button=>button.setAttribute('aria-pressed','false'));
 if(menuPanelReturnFocus?.isConnected)menuPanelReturnFocus.focus({preventScroll:true});
 menuPanelReturnFocus=null;
}
function menuPanelMetric(label,value){return `<div class="cp-panel-stat"><small>${label}</small><strong>${value}</strong></div>`;}
function showMenuPanel(which){
 if(mode==='drive'||mode==='paused'||mode==='result')return;
 if(!menuPanelOpen)menuPanelReturnFocus=document.activeElement;
 const panel=$('menuPanel'),body=$('menuPanelContent');
 const titles={profile:['CARREIRA · PORTO SALGUEIRO','Perfil da caminhoneira'],statistics:['A ESTRADA EM NÚMEROS','Estatísticas da carreira'],achievements:['JORNADA · MEDALHAS','Conquistas'],options:['AJUSTES DA OFICINA','Opções do jogo'],extras:['DOCUMENTOS E ACESSIBILIDADE','Extras da estrada']};
 if(!titles[which])return;
 $('menuPanelEyebrow').textContent=titles[which][0];$('menuPanelTitle').textContent=titles[which][1];
 const done=save.campaign.completed.length, fleetCount=Object.keys(save.fleet).length;
 const medals=Object.values(save.medals||{}), counts={bronze:medals.filter(v=>v===1).length,prata:medals.filter(v=>v===2).length,ouro:medals.filter(v=>v===3).length};
 if(which==='profile'){
  body.innerHTML=`<p>Você está construindo o legado da Oficina Farol. O progresso abaixo vem da carreira salva neste dispositivo.</p><div class="cp-panel-grid">${menuPanelMetric('CAMINHÃO EM USO',VEHICLES.find(v=>v.id===save.selected).name)}${menuPanelMetric('SALDO ATUAL',money(save.money))}${menuPanelMetric('SUA FROTA',fleetCount)}${menuPanelMetric('MISSÕES CONCLUÍDAS',done+'/'+CONTRACTS.length)}</div><div class="cp-panel-actions"><button id="panelBackup">BACKUP DA CARREIRA</button><button class="secondary" id="panelGarage">ABRIR GARAGEM</button></div>`;
  $('panelBackup').onclick=()=>{closeMenuPanel();$('careerBtn').click()};$('panelGarage').onclick=()=>{closeMenuPanel();showPage('garage')};
 }else if(which==='statistics'){
  body.innerHTML=`<p>Estatísticas registradas em sua carreira. Os valores não incluem fretes que não foram concluídos com sucesso.</p><div class="cp-panel-grid">${menuPanelMetric('ENTREGAS',save.deliveries)}${menuPanelMetric('DUELOS VENCIDOS',save.wins)}${menuPanelMetric('MISSÕES DA HISTÓRIA',done+'/'+CONTRACTS.length)}${menuPanelMetric('RECORDES DE TEMPO',Object.keys(save.best||{}).length)}</div><div class="cp-panel-actions"><button id="panelContracts">VER CONTRATOS</button></div>`;
  $('panelContracts').onclick=()=>{closeMenuPanel();showPage('contracts')};
 }else if(which==='achievements'){
  body.innerHTML=`<p>As medalhas são conquistadas ao completar fretes com bons tempos e carga preservada. Duelos vencidos também contam na carreira.</p><div class="cp-panel-grid">${menuPanelMetric('MEDALHAS DE OURO',counts.ouro)}${menuPanelMetric('MEDALHAS DE PRATA',counts.prata)}${menuPanelMetric('MEDALHAS DE BRONZE',counts.bronze)}${menuPanelMetric('DUELOS VENCIDOS',save.wins)}</div><p class="cp-panel-status">${done===CONTRACTS.length?'Campanha principal concluída!':'Faltam '+(CONTRACTS.length-done)+' missões para completar sua jornada.'}</p><div class="cp-panel-actions"><button id="panelMedals">IR PARA OS FRETES</button></div>`;
  $('panelMedals').onclick=()=>{closeMenuPanel();showPage('contracts')};
 }else if(which==='options'){
  body.innerHTML=`<p>Configure o jogo. O áudio e a qualidade gráfica são os mesmos usados durante as viagens.</p><label class="cp-panel-field">QUALIDADE GRÁFICA<select id="menuGraphicsQuality"><option value="high">Alta · mais detalhes</option><option value="balanced">Equilibrada · recomendada</option><option value="eco">Econômica · maior desempenho</option></select></label><label class="cp-panel-field">VOLUME DOS EFEITOS<input id="menuEffectsVolume" type="range" min="0" max="1" step="0.01" aria-label="Volume dos efeitos sonoros"></label><label class="cp-panel-field">VOLUME DA MÚSICA<input id="menuMusicVolume" type="range" min="0" max="1" step="0.01" aria-label="Volume da música do jogo"></label><p class="cp-panel-status" id="menuOptionsFeedback" role="status">As preferências são aplicadas e salvas automaticamente.</p><div class="cp-panel-actions"><button id="menuHelpOptions">VER CONTROLES</button></div>`;
  $('menuGraphicsQuality').value=graphicsQuality;$('menuGraphicsQuality').onchange=e=>{graphicsQuality=normalizeGraphicsQuality(e.target.value);applyGraphicsQuality();$('graphicsQuality').value=graphicsQuality;try{localStorage.setItem('carga-pesada-graphics',graphicsQuality)}catch{}$('menuOptionsFeedback').textContent='Qualidade gráfica aplicada.'};
  $('menuEffectsVolume').value=effectsVolume;$('menuEffectsVolume').oninput=e=>{effectsVolume=Number(e.target.value);sounds?.setVolume(effectsVolume);try{localStorage.setItem('carga-pesada-effects-volume',effectsVolume)}catch{}$('menuOptionsFeedback').textContent='Volume dos efeitos atualizado.'};$('menuMusicVolume').value=musicVolume;$('menuMusicVolume').oninput=e=>{musicVolume=Number(e.target.value);save.musicVolume=musicVolume;$('musicVolume').value=musicVolume;music?.setVolume(musicVolume);persist();$('menuOptionsFeedback').textContent='Volume atualizado.'};
  $('menuHelpOptions').onclick=()=>{closeMenuPanel();$('helpBtn').click()};
 }else if(which==='extras'){
  body.innerHTML=`<p>Consulte as orientações da estrada, faça uma cópia da carreira para outro navegador ou prepare o próximo contrato.</p><div class="cp-panel-actions"><button id="panelHelp">CONTROLES E TUTORIAL</button><button class="secondary" id="panelCareer">EXPORTAR / IMPORTAR SAVE</button><button class="secondary" id="panelToContracts">CONTRATOS</button><button class="secondary" id="panelIntro">REVER ABERTURA</button><button class="secondary" id="panelCredits">VER CRÉDITOS</button></div><p class="cp-panel-status"><a href="./assets/audio/CREDITOS_AUDIO.txt" target="_blank" rel="noopener">Créditos dos efeitos sonoros</a></p><p class="cp-panel-status">Frequência 17 · “Cuida do Aurora que ele cuida de você.” — Seu Nilo</p>`;
  $('panelHelp').onclick=()=>{closeMenuPanel();$('helpBtn').click()};$('panelCareer').onclick=()=>{closeMenuPanel();$('careerBtn').click()};$('panelToContracts').onclick=()=>{closeMenuPanel();showPage('contracts')};$('panelIntro').onclick=()=>{closeMenuPanel();startCinematic('intro',()=>home('home'));};$('panelCredits').onclick=()=>{closeMenuPanel();startCinematic('credits',()=>home('home'));};
 }
 document.querySelectorAll('[data-menu-panel]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.menuPanel===which?'true':'false'));
 panel.classList.remove('hidden');menuPanelOpen=true;panel.focus({preventScroll:true});
}

function renderHome(){
 persist();const next=nextMission(save),done=save.campaign.completed.length;$('homeNextMission').textContent=next?CONTRACTS.find(c=>c.id===next).name:'Contratos concluídos podem ser repetidos';$('homeFleetSummary').textContent=Object.keys(save.fleet).length+(Object.keys(save.fleet).length>1?' caminhões':' caminhão')+' · '+VEHICLES.find(v=>v.id===save.selected).name;
 $('chapterProgress').textContent=`${done} / ${CONTRACTS.length} MISSÕES · ${next?'CAMPANHA EM ANDAMENTO':'HISTÓRIA CONCLUÍDA'}`;
 $('chapterHint').textContent=next?`Próxima: ${CONTRACTS.find(c=>c.id===next).name} · ${CONTRACTS.find(c=>c.id===next).night?'NOITE':'DIA'}`:'O legado de Teresa continua. Todos os contratos podem ser repetidos.';
 $('continue').querySelector('.cp-action-label').textContent=next?'CONTINUAR':'FAZER FRETE';
 $('homeFleetCount').textContent=Object.keys(save.fleet).length+' caminhão'+(Object.keys(save.fleet).length===1?'':'ões');
 $('homeCampaignName').textContent=next?CONTRACTS.find(c=>c.id===next).name:'História concluída';
 $('campaignFill').style.width=done/CONTRACTS.length*100+'%';
 $('contracts').innerHTML=CONTRACTS.filter(c=>(chapterFilter==='all'||String(c.chapter)===chapterFilter)&&(timeFilter==='all'||(c.night?'night':'day')===timeFilter)&&(statusFilter==='all'||(statusFilter==='open'?isUnlocked(c,save):save.campaign.completed.includes(c.id)))).map(c=>{const unlocked=isUnlocked(c,save),complete=save.campaign.completed.includes(c.id),info=STORY[c.id];return `<article class="contract ${c.id===next?'active':''} ${complete?'completed':''}"><div class="contract-top"><span>${c.tag} · ${c.night?'NOITE':'DIA'}</span><span>${complete?'✓':c.race?'⚑':'↗'}</span></div><h3>${c.name}</h3><p>${c.description}</p><div class="mission-status">${missionStatus(c.id,save)}</div>${save.best[c.id]?`<p class="contract-record">RECORDE ${formatTime(save.best[c.id])}${MEDALS[save.medals?.[c.id]]?' · '+MEDALS[save.medals[c.id]]:''}</p>`:''}<p class="contract-requirements">Preparo: ${requirementsFor(c).capacity} t · motor N${requirementsFor(c).engine} · freios N${requirementsFor(c).brakes}${requirementsFor(c).speed?' · ' + requirementsFor(c).speed+' km/h teóricos':''}</p><div class="first-bonus">${save.campaign.bonusesClaimed.includes(c.id)?'Bônus de estreia já recebido':`Estreia: + ${money(info.bonus)}`}</div><div class="contract-footer"><span class="reward"><small>FRETE BASE </small>${money(c.pay)}</span><button data-contract="${c.id}" ${unlocked?'':'disabled'}>${unlocked?complete?'REPETIR ↗':'VER ROTA ↗':'BLOQUEADA'}</button></div></article>`;}).join('')||'<p class="workshop-note">Nenhum contrato neste filtro. Altere capítulo, horário ou progresso.</p>';
 document.querySelectorAll('[data-contract]').forEach(b=>b.onclick=()=>brief(CONTRACTS.find(c=>c.id===b.dataset.contract)));
}
function brief(c){if(!isUnlocked(c,save))return;mission=c;const v=VEHICLES.find(v=>v.id===save.selected),gate=entryCheck(c,v,save.fleet[v.id]);$('brief').innerHTML=`<button class="close" id="closeBrief" aria-label="Fechar missão">×</button><span class="eyebrow">${c.race?'EVENTO ESPORTIVO · VIA FECHADA':'MANIFESTO DE CARGA · FREQUÊNCIA 17'}</span><h2>${c.name}</h2><p>${c.route}<br><span class="muted">${routeFor(c).name} · ${routeFor(c).theme} · ${c.night?'NOITE':'DIA'}</span></p><p>${STORY[c.id].speaker}: ${STORY[c.id].brief}</p><div class="brief-detail"><span>PERCURSO<b>${(c.length/1000).toFixed(1)} km</b></span><span>PRAZO<b>${Math.floor(c.time/60)}min ${c.time%60}s</b></span><span>RECOMPENSA<b>${money(c.pay)}</b></span></div><p class="first-bonus">${save.campaign.bonusesClaimed.includes(c.id)?'Repetição: pagamento normal, sem bônus de estreia.':`Bônus único pela primeira conclusão: + ${money(STORY[c.id].bonus)}.`}</p><p>${c.race?`Vença ${c.rival||'Coiote'}. Carros de apoio circulam no circuito e atrapalham os dois caminhões. Desvie ou freie: colisões tiram velocidade e geram custos.`:'Carga: '+c.weight+' t · Integridade mínima: '+c.min+'% · Pedágio: '+money(c.toll)+'.'}<br>Combustível e reparos serão descontados no resultado. Avarias desta viagem são reparadas ao concluir com sucesso. Abastecimento incluído na partida.</p><p class="muted">${v.name} · Condição ${Math.round(save.fleet[v.id].health)}% · ${c.race?'Vácuo esportivo: siga o rival por 2 segundos para ganhar impulso.':'Use W para acelerar e A/D para virar. Saia com cuidado.'}</p><p class="entry-requirements">PREPARAÇÃO: capacidade ${gate.requirements.capacity} t · motor N${gate.requirements.engine} · freios N${gate.requirements.brakes}${gate.requirements.speed?' · desempenho ' + gate.requirements.speed+' km/h':''}<br>${gate.ok?'Caminhão apto para esta fase.':gate.reason}</p>${!c.race?'<p class="first-bonus">Bônus de prazo: até 20% do frete. Exige carga ≥ 90% e perda de integridade do caminhão ≤ 5 pontos.</p>':''}${!gate.ok?'<button class="outline" id="prepareTruck">PREPARAR NA OFICINA ↗</button>':''}<button class="primary" id="start">${save.fleet[v.id].health<15?'REPARE O CAMINHÃO NA OFICINA':!gate.ok?'PREPARAÇÃO NECESSÁRIA':c.race?'CONVERSAR COM O RIVAL ↗':'ACEITAR E PARTIR ↗'}</button>`;$('brief').classList.remove('hidden');$('closeBrief').onclick=()=>$('brief').classList.add('hidden');$('start').disabled=save.fleet[v.id].health<15||!gate.ok;$('start').onclick=startMission;if($('prepareTruck'))$('prepareTruck').onclick=()=>{garageTab='workshop';serviceOpen=true;previewId=save.selected;showPage('garage');};}
$('graphicsQuality').value=graphicsQuality;$('graphicsQuality').onchange=e=>{graphicsQuality=normalizeGraphicsQuality(e.target.value);applyGraphicsQuality();try{localStorage.setItem('carga-pesada-graphics',graphicsQuality);}catch{}toast('Qualidade gráfica: '+e.target.selectedOptions[0].text+'.');};
let music;let musicVolume=Math.max(0,Math.min(1,Number.isFinite(Number(save.musicVolume))?Number(save.musicVolume):.25));$('musicVolume').value=musicVolume;$('musicVolume').oninput=e=>{musicVolume=Number(e.target.value);save.musicVolume=musicVolume;music?.setVolume(musicVolume);persist();};
let audio,sounds;let effectsVolume=.6;try{const stored=localStorage.getItem('carga-pesada-effects-volume');if(stored!==null&&Number.isFinite(Number(stored)))effectsVolume=Math.max(0,Math.min(1,Number(stored)));}catch{}
function initAudio(){if(!sounds){sounds=new RecordedSounds();sounds.setVolume(effectsVolume);}if(!audio)try{const ctx=new AudioContext();audio={ctx};music=new RoadMusic(ctx,musicVolume);sounds?.enableAudioLoop(ctx);}catch{} }
function horn(){if(mode==='drive')sounds?.horn();}

const finishGate=new THREE.Group();const beamMat=new THREE.MeshBasicMaterial({color:'#b9d48e',transparent:true,opacity:.55});box(.3,7,.3,beamMat,finishGate,-7,3.5);box(.3,7,.3,beamMat,finishGate,7,3.5);box(14,.25,.3,beamMat,finishGate,0,7);const gateSign=textSign('ENTREGA  ↓',9,1.7);gateSign.position.set(0,6,0);finishGate.add(gateSign);scene.add(finishGate);finishGate.visible=false;
function createTraffic(){
 cleanupTraffic();
 if(mission.race){
  const profile=rivalProfile(mission),mesh=makeTruck(VEHICLES.find(v=>v.id===profile.vehicleId),profile.color,true);
  decorateTruck(mesh,{left:'serra',right:'serra',lights:mission.night,palette:profile.name==='Dante'?'amber':'cyan',accessories:{roofSpots:true,visor:true,bumper:true},variants:{roofSpots:3,visor:2,bumper:2}});
  scene.add(mesh);rival={mesh};
 }
 // Carros da organização aparecem nas provas e afetam os dois caminhões.
 const colors=['#b5bd9d','#bf7358','#3e6a65','#dcba73','#7b94ad','#a8a4ad'];
 for(let i=0;i<session.traffic.length;i++){
  const g=new THREE.Group(),paint=colors[i%colors.length],kind=session.traffic[i].kind??i%3;
  box(1.88,.52,3.85,paint,g,0,.80,0);
  box(1.74,.47,kind===1?2.13:1.85,mats.glass,g,0,1.34,kind===2?-.2:.10);
  box(1.85,.12,kind===1?2.13:1.85,paint,g,0,1.63,kind===2?-.2:.10);
  for(const x of [-.94,.94])for(const z of [-1.20,1.20]){
   const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.21,10),mats.rubber);
   wheel.rotation.z=Math.PI/2;wheel.position.set(x,.39,z);g.add(wheel);
  }
  for(const x of [-.65,.65]){
   box(.36,.16,.045,mats.lamp,g,x,.83,-1.96);
   box(.35,.14,.045,'#af2e22',g,x,.84,1.96);
  }
  box(1.92,.13,.13,mats.metal,g,0,.53,-1.95);
  box(1.92,.13,.13,mats.metal,g,0,.53,1.95);
  g.name=mission.race?'carro-obstáculo-da-prova':'carro-de-trânsito';
  scene.add(g);traffic.push({mesh:g});
 }
}
function startMission(){const c=mission||CONTRACTS[0],gate=entryCheck(c,VEHICLES.find(v=>v.id===save.selected),save.fleet[save.selected]);if(!gate.ok){toast(gate.reason);return;}if(!c.race){if(shouldPlayIntro(c.id,save.campaign.completed,introShownThisSession)){introShownThisSession=true;startCinematic('intro',launchMission);}else launchMission();return;}const lines=duelLines(c,STORY[c.id].brief);let index=0;const show=()=>{const line=lines[index];$('duelIntro').innerHTML=`<span class="eyebrow">${c.name} · ${c.night?'NOITE':'DIA'}</span><div class="duel-portrait" aria-hidden="true">${line.speaker[0]}</div><h2>${line.speaker}</h2><p class="duel-line">${line.text}</p><small>CONVERSA ${index+1} / ${lines.length}</small><button class="primary" id="nextDuelLine">${index===lines.length-1?'IR PARA A LARGADA ↗':'CONTINUAR CONVERSA ↗'}</button><button class="outline" id="skipDuelIntro">PULAR CONVERSA E PARTIR</button><button class="text-btn" id="cancelDuelIntro">VOLTAR AO CONTRATO</button>`;$('duelIntro').classList.remove('hidden');$('nextDuelLine').onclick=()=>{if(++index<lines.length)show();else begin();};$('skipDuelIntro').onclick=begin;$('cancelDuelIntro').onclick=()=>$('duelIntro').classList.add('hidden');};const begin=()=>{$('duelIntro').classList.add('hidden');launchMission();};show();}
function launchMission(){if(mode==='drive'||(mission&&!isUnlocked(mission,save)))return;if(!entryCheck(mission||CONTRACTS[0],VEHICLES.find(v=>v.id===save.selected),save.fleet[save.selected]).ok)return;initAudio();audio?.ctx.resume();sounds?.start();mission=mission||CONTRACTS[0];night=!!mission.night;buildEnvironment(routeFor(mission));menuStage(false);replacePlayer();document.body.dataset.screen='drive';$('garage').classList.add('hidden');$('contractsPage').classList.add('hidden');const t=save.fleet[save.selected];session=createSession(mission,VEHICLES.find(v=>v.id===save.selected),t);run=session.run;mode='drive';nextHudPaint=0;music?.start(mission.race?'duel':'freight');$('musicTrack').textContent=THEMES[mission.race?'duel':'freight'].name;applyLighting();cameraMode=0;Object.keys(keys).forEach(k=>delete keys[k]);$('brief').classList.add('hidden');$('home').classList.add('hidden');$('header').classList.add('hidden');$('hud').classList.remove('hidden');document.querySelector('.vignette').classList.add('hidden');$('routeName').textContent=mission.route.toUpperCase();$('missionName').textContent=mission.name;finishGate.visible=true;finishGate.position.copy(point(mission.length));finishGate.rotation.y=heading(mission.length);createTraffic();showRadio(STORY[mission.id].radio);player.position.copy(point(run.s,run.x,.03));player.rotation.set(0,heading(run.s),0);if(player.userData.trailer)player.userData.trailer.rotation.y=0;const launchForward=new THREE.Vector3(center(1)-center(0),0,-1).normalize(),launchView=cameraPose(player.position,launchForward,player.userData.spec,0);camera.position.set(launchView.position.x,launchView.position.y,launchView.position.z);camera.lookAt(launchView.look.x,launchView.look.y,launchView.look.z);last=performance.now();}
function pause(){if(mode!=='drive')return;music?.stop();mode='paused';$('pauseScreen').classList.remove('hidden');sounds?.pause();}
function resume(){if(mode!=='paused')return;music?.start(mission.race?'duel':'freight');mode='drive';last=performance.now();$('pauseScreen').classList.add('hidden');sounds?.start();}
function home(page='garage'){music?.start('menu');mode='home';sounds?.stop();paintChoice=null;garageTab='fleet';previewId=save.selected;previewBody=save.fleet[save.selected].body;showPage(page);}
function finish(reason){
 if(mode!=='drive')return;mode='result';sounds?.stop();
 const result=resolveSession(session,save),success=result.success;music?.start('menu');persist();
 const next=success&&result.next?CONTRACTS.find(c=>c.id===result.next):null;
 $('result').innerHTML=`<span class="eyebrow">${success?result.first?'MAIS UM PASSO NA HISTÓRIA':'BOM REVER VOCÊ NA ESTRADA':'O CAMINHO CONTINUA'}</span><h2>${success?mission.race?'Você venceu a prova!':'Carga entregue. Nome honrado.':'Nem toda viagem sai como o plano.'}</h2><p>${success?result.first?STORY[mission.id].outro:'Contrato repetido com sucesso. A cooperativa agradece.':reason||'Coiote chegou primeiro. Volte à oficina e prepare a revanche.'}</p>${success?`<p class="result-award">${result.newBest?'NOVO RECORDE · ':''}${result.medal?'FRETE '+MEDALS[result.medal].toUpperCase()+' · ':''}MELHOR TEMPO ${formatTime(save.best[mission.id])}</p>`:''}<div class="result-grid"><span>Tempo de viagem</span><b>${formatTime(run.elapsed)}</b><span>Integridade da carga</span><b>${Math.round(run.cargo)}%</b><span>Pagamento pela entrega</span><b>${money(success?result.gross:0)}</b><span>Combustível / reparos / pedágio</span><b>${success?'- '+money(result.fuel+result.repairs+result.toll):'Sem cobrança nesta tentativa'}</b><span>Bônus de prazo / qualidade</span><b>${money(success?result.timeBonus||0:0)}</b><span>Bônus de primeira conclusão</span><b>${money(success?result.bonus:0)}</b><span>Lucro total</span><b style="color:var(--gold)">${money(success?result.net+result.bonus:0)}</b></div><p class="muted">${success?'Progresso salvo. ':''}${next?'Próxima missão: '+next.name+'. ':success&&!nextMission(save)?'História concluída. A Oficina Farol permanece aberta no pós-jogo. ':''}${save.deliveries>=3&&!save.fleet.estradeiro?'Estradeiro 120 disponível na garagem. ':''}${!success?'Seu Nilo garante condição mínima de 15% para tentar novamente.':''}</p><button class="primary" id="backHome">VOLTAR À OFICINA ↗</button>${next?'<button class="outline" id="nextStory">PRÓXIMA MISSÃO ↗</button>':''}<button class="outline" id="retry">${success?'REPETIR CONTRATO':'TENTAR NOVAMENTE'}</button>`;
 if(success&&mission.id==='m30')$('result').innerHTML+=`<section><h2>O legado continua</h2><p>${STORY.m30.outro}</p><h3>SUA FROTA NA HOMENAGEM</h3><p>${VEHICLES.filter(v=>save.fleet[v.id]).map(v=>v.name).join(' · ')}</p><p>FIM · Carga Pesada<br>História e universo originais: Oficina Farol e Santa Brava.<br>Construído com Three.js · Licença MIT incluída.</p><p>Pós-jogo: repita os 30 contratos, amplie a frota e personalize seus caminhões.</p></section>`;
 $('result').classList.remove('hidden');$('backHome').onclick=()=>home();$('retry').onclick=()=>{$('result').classList.add('hidden');startMission();};
 if(next)$('nextStory').onclick=()=>{home('contracts');brief(next);};
 if(success&&mission.id==='m30'){const btn=document.createElement('button');btn.className='outline';btn.textContent='VER CRÉDITOS';btn.onclick=()=>startCinematic('credits',restoreResultAfterCinema);$('result').append(btn);if(shouldPlayCredits(mission.id,success,result.first))startCinematic('credits',restoreResultAfterCinema);}
}
let cinematic=null;
function restoreResultAfterCinema(){mode='result';document.body.dataset.screen='drive';$('result').classList.remove('hidden');player.position.copy(point(run.s,run.x,.03));player.rotation.set(0,heading(run.s),0);applyLighting();}
function startCinematic(kind,onFinish){
 if(cinematic)return;const scenes=kind==='intro'?INTRO_SCENES:CREDIT_SCENES;
 cinematic={kind,scenes,time:0,index:-1,onFinish};mode='cinematic';document.body.dataset.screen='cinematic';
 for(const id of ['home','garage','contractsPage','header','hud','brief','duelIntro','result'])$(id).classList.add('hidden');
 document.querySelector('.vignette').classList.add('hidden');finishGate.visible=false;cleanupTraffic();night=false;
 buildEnvironment(ROUTES.ipes);environment.visible=true;replacePlayer();applyLighting();scene.background=skyImages['ipes-dia']||new THREE.Color(ROUTES.ipes.sky);scene.fog.color.set(ROUTES.ipes.sky);
 $('cinematic').classList.remove('hidden');$('cinematic').focus({preventScroll:true});renderCinematicCaption();
}
function endCinematic(){if(!cinematic)return;const done=cinematic.onFinish;cinematic=null;$('cinematic').classList.add('hidden');done();}
function renderCinematicCaption(){if(!cinematic)return;const state=sceneAt(cinematic.scenes,cinematic.time);if(!state){endCinematic();return;}if(state.index===cinematic.index)return;cinematic.index=state.index;$('cinematicCounter').textContent=(cinematic.kind==='intro'?'ABERTURA':'CRÉDITOS')+' · '+(state.index+1)+' / '+cinematic.scenes.length;$('cinematicTitle').textContent=state.scene.title;$('cinematicText').textContent=state.scene.text;$('nextCinematic').textContent=state.index===cinematic.scenes.length-1?'CONCLUIR ↗':'PRÓXIMA CENA ↗';}
$('skipCinematic').onclick=endCinematic;
$('nextCinematic').onclick=()=>{if(!cinematic)return;cinematic.time=cinematic.scenes.slice(0,cinematic.index+1).reduce((sum,scene)=>sum+scene.duration,0);renderCinematicCaption();};
function updateCinematic(dt){if(!cinematic)return;cinematic.time+=dt;renderCinematicCaption();if(!cinematic)return;const state=sceneAt(cinematic.scenes,cinematic.time),travel=35+cinematic.time*4.5,angle=[-2.05,-1.32,1.55,2.30][state.index%4];player.position.copy(point(travel,-2.5,.03));player.rotation.set(0,heading(travel),0);animateTruck(player,0,4.5,dt,0);const target=player.position.clone().add(new THREE.Vector3(0,1.8,0)),distance=state.index%2?16:22;camera.position.copy(target.clone().add(new THREE.Vector3(Math.sin(angle)*distance,4.4,Math.cos(angle)*distance)));camera.lookAt(target);sun.position.copy(player.position.clone().add(new THREE.Vector3(-40,65,50)));sun.target.position.copy(player.position);sun.target.updateMatrixWorld();}
function formatTime(n){n=Math.max(0,Math.ceil(n));return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}
let nextHudPaint=0;let previousPad=[];
function padInput(){const p=navigator.getGamepads?.()?.find(p=>p);if(!p)return {gas:false,brake:false,steer:0};for(const [i,action] of [[0,horn],[2,()=>cameraMode=(cameraMode+1)%3],[9,pause]]){if(p.buttons[i]?.pressed&&!previousPad[i]&&mode==='drive')action();previousPad[i]=!!p.buttons[i]?.pressed;}const steer=Math.abs(p.axes[0])>.15?p.axes[0]:0;return {gas:p.buttons[7]?.value>.15,brake:p.buttons[6]?.value>.15,steer};}
function update(elapsed){const dt=Math.min(elapsed,.25);clock+=elapsed;if(mode==='drive'){
 const pad=padInput();let steer=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);steer=steer||pad.steer;if(mode!=='drive')return;
 advanceSession(session,{gas:keys.w||keys.arrowup||pad.gas,brake:keys.s||keys.arrowdown||pad.brake,steer,hard:keys[' ']},elapsed);
 for(let i=0;i<traffic.length;i++){const car=session.traffic[i];traffic[i].mesh.position.copy(point(car.s,car.x));traffic[i].mesh.rotation.y=heading(car.s)+(car.direction<0?Math.PI:0);}
 if(rival){const other=presentationPose(session,true);rival.mesh.position.copy(point(other.s,other.x));rival.mesh.rotation.y=heading(other.s);animateTruck(rival.mesh,0,other.speed,elapsed,Math.atan(roadSlope(other.s,activeRoute))-Math.atan(roadSlope(other.s-8,activeRoute)));const gap=other.s-run.s;$('rivalPosition').textContent=`${gap>0?`2º · ${(mission.rival||'Coiote').toUpperCase()} À FRENTE`:'1º · VOCÊ NA FRENTE'} · ${Math.round(Math.abs(gap))} m${run.boost>0?' · IMPULSO ATIVO':''}${session.rival.hits?' · RIVAL COLIDIU '+session.rival.hits+'x':''}`;}
 else{const advice=curveAdvice(run.s,run.speed,activeRoute,session.vehicle.brake*(1+session.parts.brakes*.25)/(1+mission.weight/session.vehicle.capacity*.3));$('rivalPosition').textContent=Math.abs(run.x)>7.5?'ACOSTAMENTO · VOLTE PARA A RODOVIA':advice.tight?`CURVA ADIANTE · SUGESTÃO ${advice.safe} km/h`:'VIA ABERTA · PRESERVE A CARGA';$('rivalPosition').style.color=advice.warning?'#ef9667':'var(--gold)';}
 const coaching=curveAdvice(run.s,run.speed,activeRoute,session.vehicle.brake*(1+session.parts.brakes*.25)/(1+mission.weight/session.vehicle.capacity*.3));$('drivingAdvice').textContent=coaching.tight?`${coaching.brakeNow?'FREIE AGORA':'CURVA '+coaching.direction} · ${coaching.safe} km/h · ${coaching.distance} m`:night?'FARÓIS AUTOMÁTICOS · MANTENHA DISTÂNCIA':'ANTECIPE A FRENAGEM · PRESERVE A CARGA';$('drivingAdvice').dataset.warning=String(coaching.brakeNow);
 for(const event of session.events){if(event.type==='collision'){sounds?.crash(clock);showRadio('Batida registrada. Diminua a velocidade e mantenha distância.');}if(event.type==='boss-traffic-player'){sounds?.crash(clock);showRadio('Atenção! Você atingiu um carro da organização. Reduza e procure espaço.');}if(event.type==='boss-traffic-rival')showRadio('O caminhão rival bateu em um carro! Aproveite para ultrapassar com segurança.');if(event.type==='boost')showRadio('Vácuo ativado! Impulso esportivo por três segundos.');}
 if(session.status!=='running'){finish(session.reason);return;}
const visual=presentationPose(session);player.position.copy(point(visual.s,visual.x,.03));const yaw=heading(visual.s)-(visual.steering||0);player.rotation.y=THREE.MathUtils.lerp(player.rotation.y,yaw,1-Math.exp(-dt*6));player.rotation.z=THREE.MathUtils.lerp(player.rotation.z,-visual.lateral*visual.speed*.0008,1-Math.exp(-dt*4));animateTruck(player,visual.steering,visual.speed,elapsed,visual.trailerYaw);
const forward=new THREE.Vector3(center(visual.s+1)-center(visual.s),0,-1).normalize(),target=player.position.clone(),view=cameraPose(target,forward,player.userData.spec,cameraMode),cam=new THREE.Vector3(view.position.x,view.position.y,view.position.z),look=new THREE.Vector3(view.look.x,view.look.y,view.look.z);camera.position.lerp(cam,1-Math.exp(-dt*5));camera.lookAt(look);sun.position.copy(target.clone().add(new THREE.Vector3(-40,65,50)));sun.target.position.copy(target);sun.target.updateMatrixWorld();
if(hudCanvasDue(clock,nextHudPaint)){drawSpeedometer($('speedometer'),Math.abs(run.speed)*3.6);drawMinimap($('minimap'),run,mission,center,session.traffic,session.rival);nextHudPaint=clock+.1;}$('speed').textContent=Math.round(Math.abs(run.speed)*3.6);$('speedometer').setAttribute('aria-label','Velocidade '+Math.round(Math.abs(run.speed)*3.6)+' km/h');$('remaining').textContent=(Math.max(0,mission.length-run.s)/1000).toFixed(2)+' km restantes';$('timer').textContent=formatTime(mission.time-run.elapsed);$('routeProgress').style.width=clamp(run.s/mission.length*100,0,100)+'%';for(const [name,value] of [['cargo',run.cargo],['health',run.health],['fuel',run.fuel]]){$(name+'Value').textContent=Math.round(value)+'%';$(name+'Bar').style.width=value+'%';$(name+'Bar').style.background=value<35?'#d87d52':'#b6c48c';}if(clock>radioTimer)$('radio').classList.add('hidden');sounds?.update(run.speed);
}else if(mode==='cinematic'){updateCinematic(dt);
}else if(mode==='garage'||mode==='home'){
 const isGarage=mode==='garage';
  if(isGarage&&previewSpin)previewAngle+=dt*.24;
  if(isGarage&&workshopScene){
   const effect=updateWorkshopService(workshopScene,dt);
   if(!effect.active)$('workshopServiceStatus').classList.add('hidden');
   player.position.y=workshopScene.position.y+effect.lift;
   const contact=player.children.find(o=>o.userData.contactShadow);
   if(contact)contact.position.y=.015-effect.lift;
  }
 const distance=isGarage?previewDistance:Math.max(17,player.userData.spec.length*1.4),angle=isGarage?previewAngle:2.38;
 const anchor=isGarage?workshopScene?.userData.service?.point:null;
 const focused=anchor?new THREE.Vector3(anchor.x*.44,1.85+(anchor.y-1.85)*.37,anchor.z*.50):new THREE.Vector3(0,1.85,0);
 if(isGarage)garageCameraFocus.lerp(focused,1-Math.exp(-dt*3.5));
 const target=player.position.clone().add(isGarage?garageCameraFocus:new THREE.Vector3(0,1.85,0));
 const desired=target.clone().add(new THREE.Vector3(Math.sin(angle)*distance,distance*.2,Math.cos(angle)*distance));camera.position.lerp(desired,1-Math.exp(-dt*6));camera.lookAt(target);sun.position.copy(player.position.clone().add(new THREE.Vector3(-20,30,-15)));sun.target.position.copy(player.position);sun.target.updateMatrixWorld();
 if(player.userData.trailer)player.userData.trailer.rotation.y=0;
 }}
function renderWorld(){
 const stage=mode==='garage'?$('garageStage'):mode==='home'?$('homeStage'):null,rect=stage?stage.getBoundingClientRect():{x:0,y:0,width:innerWidth,height:innerHeight};
 if(renderer.setRegion)renderer.setRegion(stage?rect:null);
 else{renderer.setScissorTest(false);renderer.setViewport(0,0,innerWidth,innerHeight);renderer.clear();if(stage){renderer.setViewport(rect.x,innerHeight-rect.y-rect.height,rect.width,rect.height);renderer.setScissor(rect.x,innerHeight-rect.y-rect.height,rect.width,rect.height);renderer.setScissorTest(true);}}
 if(mode==='contracts'||rect.width<=0||rect.height<=0||rect.bottom<0||rect.y>innerHeight)return;
 camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();renderer.render(scene,camera);
}

let last=performance.now();function frame(now){requestAnimationFrame(frame);const dt=Math.max(0,(now-last)/1000);last=now;if(mode==='drive'&&dt>1){pause();showRadio('A viagem foi pausada após uma interrupção. Continue quando estiver pronto.');}update(dt);updateHeadlights(headlights,player,night&&['drive','paused','result'].includes(mode));animateDecoration(player,clock,night);if(rival)animateDecoration(rival.mesh,clock,night);renderWorld();}replacePlayer();showPage(pageFromHash(location.hash),false);camera.position.copy(point(9,13,7));requestAnimationFrame(frame);$('loading').classList.add('hidden');
$('continue').onclick=()=>brief(CONTRACTS.find(c=>c.id===nextMission(save))||CONTRACTS.find(c=>c.id==='m02'));
 document.querySelectorAll('[data-page]').forEach(button=>button.onclick=()=>showPage(button.dataset.page));
 document.querySelectorAll('[data-menu-panel]').forEach(button=>button.onclick=()=>showMenuPanel(button.dataset.menuPanel));
 $('closeMenuPanel').onclick=closeMenuPanel;
 document.querySelectorAll('[data-garage-tab]').forEach(button=>button.onclick=()=>{garageTab=button.dataset.garageTab;if(garageTab==='workshop')serviceOpen=true;paintChoice=null;renderGarage();updateGaragePreview(true);});
 $('previewZoom').oninput=e=>previewDistance=Number(e.target.value);
 $('fitModel').onclick=()=>{previewSpin=false;$('spinModel').setAttribute('aria-pressed','false');fitWorkshopPreview();syncGarageCameraButtons();};
 $('rotateLeft').onclick=()=>{previewSpin=false;previewAngle-=.35;syncGarageCameraButtons();};
 $('rotateRight').onclick=()=>{previewSpin=false;previewAngle+=.35;syncGarageCameraButtons();};
 $('spinModel').onclick=()=>{previewSpin=!previewSpin;if(previewSpin)previewDistance=Math.max(previewDistance,workshopAutoDistance(VEHICLES.find(v=>v.id===previewId),Math.PI/2));$('previewZoom').value=previewDistance;$('spinModel').setAttribute('aria-pressed',previewSpin?'true':'false');syncGarageCameraButtons();};
 document.querySelectorAll('[data-camera-view]').forEach(button=>button.onclick=()=>{previewSpin=false;previewAngle=Number(button.dataset.cameraView);$('spinModel').setAttribute('aria-pressed','false');fitWorkshopPreview();syncGarageCameraButtons();});
 const garageStage=$('garageStage');let garageDrag=null;
 garageStage.addEventListener('pointerdown',event=>{if(mode!=='garage'||event.target.closest('button,label,input'))return;garageDrag={id:event.pointerId,x:event.clientX,angle:previewAngle};garageStage.setPointerCapture?.(event.pointerId);});
 garageStage.addEventListener('pointermove',event=>{if(!garageDrag||event.pointerId!==garageDrag.id)return;previewSpin=false;previewAngle=garageDrag.angle+(garageDrag.x-event.clientX)*.009;$('spinModel').setAttribute('aria-pressed','false');syncGarageCameraButtons();});
 const finishGarageDrag=event=>{if(garageDrag?.id===event.pointerId)garageDrag=null;};
 for(const type of ['pointerup','pointercancel','lostpointercapture'])garageStage.addEventListener(type,finishGarageDrag);
 for(const [id,set] of [['chapterFilter',v=>chapterFilter=v],['timeFilter',v=>timeFilter=v],['statusFilter',v=>statusFilter=v]])$(id).onchange=e=>{set(e.target.value);renderHome();};

 $('helpBtn').onclick=()=>$('help').classList.remove('hidden');$('closeHelp').onclick=$('helpOk').onclick=()=>$('help').classList.add('hidden');$('pauseBtn').onclick=pause;$('resume').onclick=resume;$('abandon').onclick=()=>{save.fleet[save.selected].health=Math.max(15,run.health);persist();home();};
 window.addEventListener('hashchange',()=>{if(mode==='cinematic'){history.replaceState(null,'',pageHash(currentPage));return;}const target=pageFromHash(location.hash);if(mode==='drive'||mode==='paused'){pause();history.replaceState(null,'',pageHash(currentPage));return;}if(target!==currentPage)showPage(target,false);});
window.addEventListener('keydown',e=>{if(mode==='drive'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(e.repeat)return;if(mode==='cinematic'){if(e.key==='Escape')endCinematic();return;}if(e.key.toLowerCase()==='c'&&mode==='drive')cameraMode=(cameraMode+1)%3;if(e.key.toLowerCase()==='h'&&mode==='drive')horn();if(e.key==='Escape'&&menuPanelOpen){closeMenuPanel();return;}if(e.key==='Escape'||e.key.toLowerCase()==='p'){if(mode==='drive')pause();else if(mode==='paused')resume();else if(e.key==='Escape'&&mode==='garage')showPage('home');}});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);window.addEventListener('blur',()=>{Object.keys(keys).forEach(k=>delete keys[k]);pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();music?.stop();}else if(['home','garage','contracts'].includes(mode))music?.start('menu');});document.querySelectorAll('[data-key]').forEach(b=>{const reset=()=>keys[b.dataset.key]=false;b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys[b.dataset.key]=true;};b.onpointerup=b.onpointercancel=b.onlostpointercapture=reset;});addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
// Read-only telemetry for repeatable checks and future playtests.
window.cargaPesada={getState:()=>({mode,mission:mission?.id,run:run?{...run}:null,progress:{deliveries:save.deliveries,wins:save.wins,money:save.money},drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles})};

let pendingCareer=null;
$('careerBtn').onclick=()=>{$('careerPanel').classList.remove('hidden');$('careerStatus').textContent='Exporte antes de mudar de endereço ou navegador. O backup inclui as pinturas usadas na frota.';};
function closeCareer(){pendingCareer=null;$('confirmCareer').disabled=true;$('careerFile').value='';$('careerPanel').classList.add('hidden');}
$('closeCareer').onclick=closeCareer;
$('exportCareer').onclick=async()=>{const button=$('exportCareer');button.disabled=true;try{const backup=makeBackup(save,await exportArt(artReferences(save))),text=JSON.stringify(backup);if(text.length>BACKUP_LIMIT)throw Error('O backup excede 32 MB. Reduza as pinturas antes de exportar.');const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='carga-pesada-carreira.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);$('careerStatus').textContent='Backup exportado. Guarde o arquivo JSON para restaurar no novo endereço.';}catch(e){$('careerStatus').textContent=e.message;}finally{button.disabled=false;}};
$('careerFile').onchange=async e=>{pendingCareer=null;$('confirmCareer').disabled=true;const file=e.target.files[0];if(!file)return;try{if(file.size>BACKUP_LIMIT)throw Error('Use um backup de até 32 MB.');pendingCareer=parseBackup(await file.text());const s=pendingCareer.save;$('careerStatus').textContent=`Carreira encontrada: ${s.campaign.completed.length}/30 missões, ${Object.keys(s.fleet).length} caminhão(ões), ${money(s.money)} e ${Object.keys(pendingCareer.images).length} pintura(s). Restaurar substitui a carreira atual deste endereço.`;$('confirmCareer').disabled=false;}catch(error){$('careerStatus').textContent=error.message;}};
$('confirmCareer').onclick=async()=>{if(!pendingCareer)return;const candidate=pendingCareer,button=$('confirmCareer');button.disabled=true;$('careerFile').disabled=true;$('closeCareer').disabled=true;let mapping={};try{mapping=await restoreArt(candidate.images);const restored=JSON.parse(JSON.stringify(candidate.save));for(const truck of Object.values(restored.fleet))for(const side of ['left','right','rear']){const id=truck.decoration[side];if(mapping[id])truck.decoration[side]=mapping[id];}try{localStorage.setItem('carga-pesada-v1',JSON.stringify(restored));}catch{await removeRestoredArt(Object.values(mapping));throw Error('Não há espaço para salvar. A carreira anterior foi mantida.');}save=restored;musicVolume=Number.isFinite(save.musicVolume)?Math.max(0,Math.min(1,save.musicVolume)):.25;$('musicVolume').value=musicVolume;music?.setVolume(musicVolume);previewId=save.selected;paintChoice=null;closeCareer();showPage('home');toast('Carreira e pinturas restauradas.');}catch(e){$('careerStatus').textContent=e.message;button.disabled=false;}finally{$('careerFile').disabled=false;$('closeCareer').disabled=false;}};
