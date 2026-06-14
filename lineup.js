const BTM_LINEUP_ENTRYPOINT_VERSION="0.22";
(function(){
if(document.querySelector('script[src*="lineup-v050.js"]'))return;
const s=document.createElement('script');
s.src='lineup-v050.js?v=022';
s.async=false;
s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
document.body.appendChild(s);
})();