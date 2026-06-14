const BTM_LINEUP_ENTRYPOINT_VERSION="0.23";
(function(){
  if(window.__BTM_LINEUP_LOADED__)return;
  window.__BTM_LINEUP_LOADED__=true;
  if(document.querySelector('script[src*="lineup-v050.js"]'))return;
  const s=document.createElement('script');
  s.src='lineup-v050.js?v=023';
  s.async=false;
  s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
  document.body.appendChild(s);
})();
