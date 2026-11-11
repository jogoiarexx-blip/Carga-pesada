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
