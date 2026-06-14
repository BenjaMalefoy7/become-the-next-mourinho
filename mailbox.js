const BTM_MAILBOX_ENTRYPOINT_VERSION="0.23";
(function(){
  if(window.__BTM_MAILBOX_LOADED__)return;
  window.__BTM_MAILBOX_LOADED__=true;
  if(typeof window.btmGenerateDailyMail==='function')return;
  if(document.querySelector('script[src*="season-v015.js"]'))return;
  const s=document.createElement('script');
  s.src='season-v015.js?v=023';
  s.async=false;
  s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
  document.body.appendChild(s);
})();
