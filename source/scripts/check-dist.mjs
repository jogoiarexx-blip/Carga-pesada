import {readFileSync,existsSync,readdirSync} from 'node:fs';import {resolve,dirname,join} from 'node:path';import assert from 'node:assert/strict';
const root=resolve('dist'),html=readFileSync(join(root,'index.html'),'utf8'),urls=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]);
for(const u of urls){assert.ok(!u.startsWith('/'),`Caminho absoluto impede subpasta: ${u}`);assert.ok(!/^https?:/.test(u),`Dependência externa: ${u}`);assert.ok(existsSync(resolve(root,u)),`Arquivo ausente: ${u}`);for(const base of ['https://example.test/','https://example.test/Carga-Pesada/'])assert.ok(new URL(u,base).href.startsWith(base));}
for(const f of readdirSync(join(root,'assets')).filter(n=>n.endsWith('.css'))){const css=readFileSync(join(root,'assets',f),'utf8');for(const [,u] of css.matchAll(/url\(["']?([^\s)"']+)["']?\)/g))if(!u.startsWith('data:'))assert.ok(existsSync(resolve(root,'assets',u)),`CSS aponta para imagem ausente: ${u}`);}
for(const region of ['ipes','porto','vale','circuito'])for(const time of ['dia','noite'])assert.ok(existsSync(join(root,'assets',`fundo-${region}-${time}.svg`)));
assert.ok(existsSync(join(root,'assets','oficina-farol-v06.png')));assert.ok(existsSync(join(root,'THIRD_PARTY_THREE.txt')));console.log('Build íntegro: módulos, CSS e cenários disponíveis na raiz e em subpastas.');

for(const path of ['sw.js','manifest.webmanifest','icons/carga-pesada.svg'])assert.ok(existsSync(join(root,path)),`PWA ausente: ${path}`);
