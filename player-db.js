const BTM_PLAYER_DB_ENTRYPOINT_VERSION="0.23";
(function(){
  if(window.__BTM_PLAYER_DB_LOADED__)return;
  window.__BTM_PLAYER_DB_LOADED__=true;
  if(typeof window.btmEnsurePlayerDatabase==='function')return;
  if(document.querySelector('script[src*="player-db-v016.js"]'))return;
  const s=document.createElement('script');
  s.src='player-db-v016.js?v=023';
  s.async=false;
  s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
  document.body.appendChild(s);
})();
