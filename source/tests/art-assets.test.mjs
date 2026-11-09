import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('artes incluídas são arquivos WebP íntegros e completos',()=>{
 for(const name of ['aguia','onca','lobo-v2','arara-v2']){
  const bytes=readFileSync(new URL(`../public/assets/artes/${name}.webp`,import.meta.url));
  assert.equal(bytes.subarray(0,4).toString(),'RIFF',`${name}: cabeçalho RIFF`);
  assert.equal(bytes.subarray(8,12).toString(),'WEBP',`${name}: assinatura WebP`);
  assert.equal(bytes.readUInt32LE(4)+8,bytes.length,`${name}: arquivo truncado ou incompleto`);
 }
});
