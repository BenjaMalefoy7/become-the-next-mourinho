const BTM_TRANSFERS_ENTRYPOINT_VERSION="0.23";
(function(){
  if(window.__BTM_TRANSFERS_LOADED__)return;
  window.__BTM_TRANSFERS_LOADED__=true;
  if(typeof window.renderTransfersV017==='function')return;
  if(document.querySelector('script[src*="transfers-v017.js"]'))return;
  const s=document.createElement('script');
  s.src='transfers-v017.js?v=023';
  s.async=false;
  s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
  document.body.appendChild(s);
})();
