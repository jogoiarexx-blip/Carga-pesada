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
