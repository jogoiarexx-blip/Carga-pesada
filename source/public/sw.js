/* Carga Pesada v0.27 - recursos do jogo disponíveis offline após o primeiro acesso. */
const CACHE='carga-pesada-offline-v0.27-audio-v2';
const PREFIX='carga-pesada-offline-';
const CORE=[
  './','./index.html','./manifest.webmanifest','./icons/carga-pesada.svg',
  './assets/oficina-farol-v06.png',
  ...['motor','buzina','colisao'].map(name=>'./assets/audio/'+name+'.ogg'),
  ...['aguia','lobo-v2','onca','arara-v2'].map(name=>'./assets/artes/'+name+'.webp'),
  ...['ipes','porto','vale','circuito'].flatMap(region=>['dia','noite'].map(time=>'./assets/fundo-'+region+'-'+time+'.svg'))
];
const scoped=relative=>new URL(relative,self.registration.scope).href;

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const response=await fetch(scoped('./index.html'),{cache:'reload'});
    if(!response.ok)throw new Error('HTML indisponível durante instalação: '+response.status);
    const html=await response.text();
    const bundles=[...html.matchAll(/(?:src|href)=["'](\.\/assets\/[^"'?#]+)["']/g)].map(match=>match[1]);
    const urls=[...new Set([...CORE,...bundles])].map(scoped);
    const cache=await caches.open(CACHE);
    await cache.addAll(urls);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  const base=new URL(self.registration.scope);
  if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(scoped('./index.html'),copy)));}
      return response;
    }).catch(async()=>await caches.match(scoped('./index.html'))||Response.error()));
    return;
  }
  event.respondWith(caches.match(request,{ignoreSearch:true}).then(cached=>cached||fetch(request).then(response=>{
    if(response.ok&&response.type==='basic'){
      const copy=response.clone();
      event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));
    }
    return response;
  })));
});
