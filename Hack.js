(function(){
  const urlMap=new Map();
  window.ChangeR=function(a,b){urlMap.set(a,b);console.log(`[ChangeR] Registered: ${a} → ${b}`)};
  if(!window._originalFetch)window._originalFetch=window.fetch;
  window.fetch=function(...a){
    if(typeof a[0]==="string"&&urlMap.has(a[0]))a[0]=urlMap.get(a[0]);
    else if(a[0] instanceof Request&&urlMap.has(a[0].url))a[0]=new Request(urlMap.get(a[0].url),a[0]);
    return window._originalFetch.apply(this,a);
  };
  console.log("%c[Fetch Hijacker Active]%c Use ChangeR(originalUrl, newUrl) to replace fetch request URLs.","color:limegreen;font-weight:bold","color:lightgray");
})();
