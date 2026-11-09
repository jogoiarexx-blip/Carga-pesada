import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const dir=dirname(fileURLToPath(import.meta.url));
const archive=resolve(dir,'../vendor/three.module.js.gz');
const target=resolve(dir,'../src/vendor/three.module.js');
const expected='ce1fa418de16a19495a9f72495580e3015d7745c296d3ce0485897f902ddedfb';
const hash=data=>createHash('sha256').update(data).digest('hex');
if(existsSync(target)&&hash(readFileSync(target))===expected){
  console.log('Three.js vendorizado já validado.');
}else{
  const data=gunzipSync(readFileSync(archive));
  if(hash(data)!==expected)throw new Error('Falha de integridade no Three.js vendorizado');
  mkdirSync(dirname(target),{recursive:true});
  writeFileSync(target,data);
  console.log('Three.js vendorizado restaurado e validado.');
}
