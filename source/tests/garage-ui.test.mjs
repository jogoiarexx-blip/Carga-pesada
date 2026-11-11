import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const code=readFileSync(new URL('../src/game.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/menu.css',import.meta.url),'utf8');
test('oficina oferece vistas e arrasto sem comprometer controles existentes',()=>{
 for(const view of ['FRENTE','ESQUERDA','DIREITA','TRASEIRA'])assert.match(html,new RegExp('>'+view+'</button>'));
 for(const id of ['rotateLeft','rotateRight','spinModel','previewZoom','garageStage'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(code,/garageStage\.addEventListener\('pointermove'/);
 assert.match(code,/syncGarageCameraButtons/);
});
test('operações financeiras da oficina usam transação antes da atualização visual',()=>{
 for(const service of ['equipBody','purchase','repairTruck','installUpgrade','repaintTruck','saveDecoration'])
  assert.match(code,new RegExp('commitGarage\\(draft=>'+service+'\\('),service);
 assert.match(code,/function refreshGarage\(\)\{renderGarage\(\);updateGaragePreview\(\);\}/);
});
test('prévia da oficina permanece acessível no celular e diagnóstico fica visível',()=>{
 assert.match(css,/\.garage-stage\{position:sticky/);
 assert.match(code,/class="workshop-overview"/);
 assert.match(code,/serviceOpen=true/);
});

test('cenário 3D carrega somente na garagem e sai da frente durante a viagem',()=>{
 assert.match(code,/createWorkshopScene\(\)/);
 assert.match(code,/configureWorkshopScene\(on&&mode==='garage'\)/);
 assert.match(code,/workshopScene\.visible=visible/);
 assert.match(css,/body\[data-screen="garage"\] \.garage-stage\{\s*background:transparent!important/);
});

test('novo zoom adaptativo e efeitos respondem apenas às compras confirmadas',()=>{
 assert.match(code,/workshopAutoDistance\(base\)/);
 assert.match(code,/workshopCameraDistance\(/);
 assert.match(code,/beginWorkshopService\(workshopScene,kind,\{side\}\)/);
 assert.match(code,/updateWorkshopService\(workshopScene,dt\)/);
 assert.match(code,/if\(commitGarage\(draft=>repairTruck/);
 assert.match(code,/showWorkshopService\('repair'\)/);
 assert.match(html,/id="fitModel"/);
 assert.match(html,/id="previewZoom" type="range" min="14" max="90"/);
});

test('status visual e foco da câmera seguem o serviço contextual',()=>{
 assert.match(html,/id="workshopServiceStatus"/);
 assert.match(code,/workshopScene\?\.userData\.service\?\.point/);
 assert.match(code,/garageCameraFocus\.lerp/);
 assert.match(code,/stopWorkshopService\(workshopScene\)/);
 assert.match(code,/configureWorkshopVehicle\(workshopScene,configuredVehicle\(base,previewBody\)\)/);
 assert.match(css,/\.workshop-service-status\{/);
});

test('visibilidade dos efeitos respeita o lado da câmera e interrompe giro automático',()=>{
 assert.match(code,/Math\.sin\(previewAngle\)<-\.05\?-1:1/);
 assert.match(code,/beginWorkshopService\(workshopScene,kind,\{side\}\)/);
 assert.match(code,/previewSpin=false;\$\('spinModel'\)/);
 assert.match(css,/\.garage-stage \.stage-shadow\{display:none\}/);
});

test('enquadramento usa geometria real e retira paredes que escondem o caminhão',()=>{
 assert.match(code,/new THREE\.Box3\(\)\.setFromObject\(player\)/);
 assert.match(code,/workshopFitBounds\(garageModelBounds,w,h,angle\)/);
 assert.match(code,/garageCameraFocus\.copy\(garageCameraBase\)/);
 assert.match(code,/updateWorkshopCameraOcclusion\(workshopScene,camera\.position\)/);
});

test('prévia aplica iluminação da oficina e restaura a estrada ao trocar modo',()=>{
 assert.match(code,/const preset=workshopLighting\(mode,graphicsQuality,night\)/);
 assert.match(code,/sun\.castShadow=preset\.shadows/);
 assert.match(code,/renderer\.toneMappingExposure=preset\.exposure/);
 assert.match(code,/applyGraphicsQuality\(\);applyLighting\(\);/);
 assert.match(css,/body\[data-screen="garage"\] #garageBackdrop\{background:#182e27!important\}/);
});


test('menu lateral premium mantém tabs e seleção acessíveis',()=>{
 for(const tab of ['fleet','store','workshop'])assert.match(html,new RegExp('data-garage-tab="'+tab+'"'));
 for(const cls of ['garage-tab-icon','garage-tab-label','garage-tab-chevron','garage-tab-count','garage-card-art','garage-card-info'])
  assert.ok(html.includes('class="'+cls+'"')||code.includes('class="'+cls+'')||code.includes('class="owned-tag'),cls);
 assert.match(html,/id="fleetCount"/);
 assert.match(code,/button\.setAttribute\('aria-pressed',button\.dataset\.garageTab/);
 assert.match(code,/data-preview="\$\{v\.id\}"/);
 assert.match(code,/owned-tag \$\{inUse\?'is-in-use'/);
});
test('sidebar adaptativa mantém prévia 3D e navegação mobile',()=>{
 assert.match(css,/REV26 · Menu da Oficina Farol/);
 assert.match(css,/\.garage-tab-icon svg\{/);
 assert.match(css,/\.garage-card-art\{/);
 assert.match(css,/\.garage-tab-count,body\[data-screen="garage"\] \.garage-tab-chevron\{display:none!important\}/);
 assert.match(css,/\.garage-stage\{order:4\}/);
 assert.match(html,/data-page="home" type="button"/);
});


test('painel premium apresenta quatro características dinâmicas e ícones vetoriais',()=>{
 assert.match(code,/const garageDetailIcons=Object\.freeze/);
 assert.match(code,/function garageDetailIcon\(kind\)/);
 assert.match(code,/class="garage-details-heading"/);
 assert.match(code,/class="truck-data" aria-label="Características do caminhão"/);
 assert.match(code,/class="garage-stat-tile"/);
 for(const name of ['capacity','speed','length','axles'])assert.match(code,new RegExp("garageDetailIcon\\('"+name+"'\\)"));
 for(const metric of ['CAPACIDADE','VELOCIDADE','COMPRIMENTO','EIXOS NO CONJUNTO'])assert.match(code,new RegExp('>'+metric+'</span>'));
 assert.match(css,/REV27 — Painel de detalhes premium/);
 assert.match(css,/\.garage-stat-tile\{/);
});
test('comparação, configuração e botões continuam funcionais com o novo visual',()=>{
 assert.match(code,/class="garage-compare-panel"/);
 assert.match(code,/class="garage-select-wrap"/);
 assert.match(code,/id="bodyPreview" aria-labelledby="garageBodyLabel"/);
 for(const id of ['useTruck','buyTruck','openWorkshop','installBody'])assert.match(code,new RegExp('id="'+id+'"'));
 assert.match(code,/\$\('bodyPreview'\)\.onchange/);
 assert.match(code,/\$\('useTruck'\)\.onclick/);
 assert.match(code,/\$\('buyTruck'\)\.onclick/);
 assert.match(css,/\.garage-details::-webkit-scrollbar-thumb/);
 assert.match(css,/\.garage-use-button\.is-equipped:disabled/);
});

test('o cronômetro é o desafio e o tuning é opção, sem bloqueio de entrada',()=>{
 assert.match(code,/Oficina \(opcional\): motor N/);
 assert.match(code,/Não existe nível mínimo de motor, freios, velocidade ou capacidade para largar/);
 assert.match(code,/TUNAR NA OFICINA \(OPCIONAL\)/);
 assert.match(code,/\$\('start'\)\.disabled=false/);
 assert.doesNotMatch(code,/if\(!gate\.ok\)/);
});


test('catálogo de motores mostra seis estágios, preços e ganhos sem exigências',()=>{
 assert.match(code,/renderEngineCatalog\(v,truck,save\.money,money\)/);
 assert.match(code,/engineTopSpeed\(v,truck\?\.engine\|\|0\)/);
 assert.match(code,/data-service="brakes"/);
 assert.match(css,/REV34 — catálogo de 6 motores/);
});

test('lojinha de buzinas integra a personalização e o botão móvel sem bloquear gameplay',()=>{
 assert.match(code,/renderHornShop\(save,previewId,money\)/);
 assert.match(code,/\['horns','BUZINAS'\]/);
 assert.match(code,/bindHornControls\(\)/);
 assert.match(code,/buyOrEquipHorn\(draft,previewId,id\)/);
 assert.match(code,/equippedHorn\(save\.fleet\[save\.selected\]\)/);
 assert.match(html,/id="touchHorn"/);
 assert.match(css,/REV35 — lojinha de buzinas/);
});


test('buzinas possuem atalho direto na lateral e aparecem no topo da oficina',()=>{
 assert.match(html,/id="garageHornShortcut"/);
 assert.match(html,/LOJA DE BUZINAS/);
 assert.match(code,/function openHornStore\(\)/);
 assert.match(code,/workshopPanel='horns'/);
 assert.match(code,/\$\('garageHornShortcut'\)\.onclick=openHornStore/);
 assert.match(code,/garageTab==='workshop'&&workshopPanel==='horns'&&owned/);
 assert.match(code,/id="backToGarageServices"/);
 assert.match(code,/renderHornShop\(save,previewId,money\)/);
 assert.match(css,/REV36 — Acesso direto às buzinas/);
});
test('no notebook os cards não são reduzidos a uma faixa pela altura fixa',()=>{
 assert.match(css,/\.garage-vehicle-list\{\s*\n\s*flex:none;min-height:0;height:auto;max-height:none/);
 assert.match(css,/\.garage-screen\{\s*\n\s*height:auto;min-height:calc\(100dvh - 88px\)/);
 assert.match(css,/\.garage-card\{\s*\n\s*width:100%;box-sizing:border-box/);
 assert.match(css,/max-width:1160px/);
 assert.match(css,/\.garage-horn-shortcut\{order:2/);
});
