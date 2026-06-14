const BTM_CALENDAR_ENTRYPOINT_VERSION="0.22";
(function(){
if(document.querySelector('script[src*="calendar-v060.js"]'))return;
const s=document.createElement('script');
s.src='calendar-v060.js?v=022';
s.async=false;
s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
document.body.appendChild(s);
})();