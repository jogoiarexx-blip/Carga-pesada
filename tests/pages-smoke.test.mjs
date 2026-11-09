import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve('.');
const text=file=>readFileSync(join(root,file),'utf8');
const html=text('index.html'),sw=text('sw.js'),manifest=JSON.parse(text('manifest.webmanifest'));
test('publicação contém arquivos essenciais e versionamento v0.16',()=>{
 assert.match(html,/class="build">v0\.16/);
 for(const f of ['index.html','sw.js','manifest.webmanifest','icons/carga-pesada.svg'])assert.ok(existsSync(join(root,f)),f);
});
test('HTML contém apenas links locais para assets da aplicação',()=>{
 const refs=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(s=>s.startsWith('./'));
 for(const url of refs){assert.ok(!url.includes('..'),url);assert.ok(existsSync(join(root,url)),url);}
 assert.ok(refs.some(ref=>/assets\/index-[\w-]+\.js/.test(ref)),'JS compilado ausente');
 assert.ok(refs.some(ref=>/assets\/index-[\w-]+\.css/.test(ref)),'CSS compilado ausente');
});
test('modo offline é registrado no navegador e cache inclui pacotes Vite',()=>{
 assert.match(html,/serviceWorker\.register\('\.\/sw\.js'/);
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
test('save da carreira conserva a chave histórica',()=>{
 assert.match(text('assets/index-DHdQ5Cn1.js'),/carga-pesada-v1/);
});
