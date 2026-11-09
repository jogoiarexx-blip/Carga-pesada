import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/menu.css',import.meta.url),'utf8');
const game=readFileSync(new URL('../src/game.js',import.meta.url),'utf8');
const requiredIds=['home','homeStage','continue','homeFleetCount','homeCampaignName','homeNextMission','homeFleetSummary','chapterHint','chapterProgress','campaignFill','truckLabel','truckSpecs','menuPanel','menuPanelContent','menuPanelTitle','menuPanelEyebrow','closeMenuPanel','helpBtn','careerBtn'];
test('menu principal preserva todos os pontos de ligação do motor e dos saves',()=>{
 for(const id of requiredIds)assert.match(html,new RegExp(`id="${id}"`),`Faltou ${id}`);
 assert.match(game,/carga-pesada-v1/);
 assert.match(game,/\$\('continue'\)\.onclick=/);
});
test('as cinco ações laterais existem e estão conectadas a navegação real',()=>{
 for(const name of ['CONTINUAR','CONTRATOS','GARAGEM','OPÇÕES','EXTRAS'])assert.match(html,new RegExp(`>${name}</span>`));
 for(const page of ['contracts','garage'])assert.match(html,new RegExp(`data-page="${page}"`));
 for(const panel of ['options','extras'])assert.match(html,new RegExp(`data-menu-panel="${panel}"`));
 assert.match(game,/showMenuPanel\(button\.dataset\.menuPanel\)/);
});
test('navegação superior oferece perfil, estatísticas e conquistas com estado real',()=>{
 for(const panel of ['profile','statistics','achievements'])assert.match(html,new RegExp(`data-menu-panel="${panel}"`));
 for(const term of ['save.deliveries','save.wins','save.medals','save.campaign.completed.length','save.money'])assert.ok(game.includes(term));
 assert.match(game,/panel\.focus\(\{preventScroll:true\}\)/);
 assert.match(game,/menuPanelOpen\)\{closeMenuPanel\(\);return;/);
});
test('opções controla audio e qualidade gráfica usadas no gameplay',()=>{
 assert.match(game,/\$\('menuGraphicsQuality'\)\.onchange/);
 assert.match(game,/\$\('menuMusicVolume'\)\.oninput/);
 assert.match(game,/\$\('graphicsQuality'\)\.value=graphicsQuality/);
 assert.match(game,/\$\('musicVolume'\)\.value=musicVolume/);
});
test('layout é responsivo e mantém cenário da oficina sem importar a captura de tela como interface',()=>{
 assert.match(css,/@media\(max-width:800px\)/);
 assert.match(css,/@media\(max-width:530px\)/);
 assert.match(css,/\.cp-home-layout\{/);
 assert.match(html,/class="cp-home-layout"/);
 assert.ok(!html.includes('Menu Principal Carga Pesada_ A Estrada Chama.png'));
});
