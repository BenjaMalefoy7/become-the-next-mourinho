const BTM_MATCH_CENTER_ENTRYPOINT_VERSION="0.23";
(function(){
  if(window.__BTM_MC__)return;
  window.__BTM_MC__=true;
  const exists=document.querySelector('script[src*="season-v013"]');
  if(exists)return;
  const s=document.createElement('script');
  s.src=['season-v013.js','v=023'].join('?');
  s.async=false;
  document.body.appendChild(s);
})();
