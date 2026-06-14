const BTM_LEAGUE_SIM_ENTRYPOINT_VERSION="0.22";
(function(){
if(document.querySelector('script[src*="matchday-v090.js"]'))return;
const s=document.createElement('script');
s.src='matchday-v090.js?v=022';
s.async=false;
s.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
document.body.appendChild(s);
})();