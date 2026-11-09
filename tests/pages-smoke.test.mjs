import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve('.');
const text=file=>readFileSync(join(root,file),'utf8');
const html=text('index.html'),sw=text('sw.js'),manifest=JSON.parse(text('manifest.webmanifest'));
const scripts=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(s=>s.startsWith('./'));
const entry=scripts.find(s=>/\.\/assets\/index-[\w-]+\.js/.test(s));
test('publicação contém versão v0.18, novo menu e arquivos essenciais',()=>{
 assert.match(html,/class="build">v0\.(18|19)/);
 assert.match(html,/class="cp-home-layout"/);
 assert.match(html,/class="cp-main-actions"/);
 assert.match(html,/id="menuPanel"/);
 for(const f of ['index.html','sw.js','manifest.webmanifest','icons/carga-pesada.svg'])assert.ok(existsSync(join(root,f)),f);
});
test('HTML contém apenas links locais para assets da aplicação',()=>{
 for(const url of scripts){assert.ok(!url.includes('..'),url);assert.ok(existsSync(join(root,url)),url);}
 assert.ok(entry,'JS compilado ausente');
 assert.ok(scripts.some(ref=>/assets\/index-[\w-]+\.css/.test(ref)),'CSS compilado ausente');
});
test('modo offline registra um cache versionado e inclui módulos compilados',()=>{
 assert.match(html,/serviceWorker\.register\('\.\/sw\.js'/);
 assert.match(sw,/carga-pesada-offline-v0\.(18|19)/);
 assert.match(sw,/self\.addEventListener\('install'/);
 assert.match(sw,/html\.matchAll/);
 assert.match(sw,/self\.addEventListener\('fetch'/);
 assert.match(sw,/request\.mode==='navigate'/);
});
test('manifest do aplicativo mantém escopo da subpasta',()=>{
 assert.equal(manifest.start_url,'./');
 assert.equal(manifest.scope,'./');
 assert.equal(manifest.display,'standalone');
 assert.ok(existsSync(join(root,manifest.icons[0].src)));
});
test('todos os cenários de dia e noite estão disponíveis localmente',()=>{
 for(const region of ['ipes','porto','vale','circuito'])
  for(const time of ['dia','noite'])
   assert.ok(existsSync(join(root,'assets',`fundo-${region}-${time}.svg`)));
 assert.ok(existsSync(join(root,'assets/oficina-farol-v06.png')));
});
test('chave histórica de save foi preservada no JS compilado',()=>{
 assert.ok(entry);
 assert.match(text(entry),/carga-pesada-v1/);
});
