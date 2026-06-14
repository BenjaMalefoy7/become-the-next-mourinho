const BTM_CALENDAR_ENTRYPOINT_VERSION="0.23";
(function(){
  if(window.__BTM_CALENDAR_LOADED__)return;
  window.__BTM_CALENDAR_LOADED__=true;
  if(document.querySelector('script[src*="calendar-v060.js"]'))return;
  const s=document.createElement('script');
  s.src='calendar-v060.js?v=023';
  s.async=false;
  s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
  document.body.appendChild(s);
})();
