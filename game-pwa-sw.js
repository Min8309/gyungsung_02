/* Scope is the game only; the rest of the newspaper site is untouched. */
const CACHE='gyungsung-game-pwa-v1';
const gameBase=new URL('./sikjasil/',self.location.href);
const expansionBase=new URL('./mobile-expansion/',self.location.href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([gameBase.href,new URL('manifest.webmanifest',gameBase).href,new URL('pwa-icons/icon-192.png',gameBase).href,new URL('pwa-icons/icon-512.png',gameBase).href]))));
// Updates activate after the old app closes, avoiding a mid-game reload.
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('gyungsung-game-pwa-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||request.headers.has('range')||url.origin!==gameBase.origin||(!url.href.startsWith(gameBase.href)&&!url.href.startsWith(expansionBase.href)))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}catch(error){const saved=await cache.match(request);if(saved)return saved;if(request.mode==='navigate')return await cache.match(gameBase.href)||Response.error();return Response.error();}})());
});
