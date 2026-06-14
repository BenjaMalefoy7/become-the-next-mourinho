const BTM_MATCH_ENGINE_ENTRYPOINT_VERSION="0.23";
(function(){
  if(window.__BTM_MATCH_ENGINE_LOADED__)return;
  window.__BTM_MATCH_ENGINE_LOADED__=true;
  if(document.querySelector('script[src*="match-v080.js"]'))return;
  const s=document.createElement('script');
  s.src='match-v080.js?v=023';
  s.async=false;
  document.body.appendChild(s);
})();
