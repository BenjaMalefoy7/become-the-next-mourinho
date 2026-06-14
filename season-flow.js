const BTM_SEASON_FLOW_ENTRYPOINT_VERSION="0.23";
(function(){
  if(window.__BTM_SEASON_FLOW_LOADED__)return;
  window.__BTM_SEASON_FLOW_LOADED__=true;
  if(typeof window.btmCanAdvanceDay==='function')return;
  if(document.querySelector('script[src*="season-v014.js"]'))return;
  const s=document.createElement('script');
  s.src='season-v014.js?v=023';
  s.async=false;
  s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
  document.body.appendChild(s);
})();
