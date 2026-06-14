const BTM_MATCH_ENGINE_ENTRYPOINT_VERSION="0.22";
(function(){
if(typeof saveSimulatedMatch==='function')return;
if(document.querySelector('script[src*="match-v080.js"]'))return;
const s=document.createElement('script');
s.src='match-v080.js?v=022';
s.async=false;
s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
document.body.appendChild(s);
})();