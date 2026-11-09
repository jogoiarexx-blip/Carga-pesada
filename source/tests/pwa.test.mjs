import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('service worker incluiu cache versionado e isolamento de escopo',()=>{const sw=readFileSync('public/sw.js','utf8');assert.match(sw,/carga-pesada-offline-v0\.25-audio-v1/);assert.match(sw,/self\.registration\.scope/);});
test('manifesto conserva endereço relativo de instalação',()=>{const manifest=JSON.parse(readFileSync('public/manifest.webmanifest','utf8'));assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./');});
