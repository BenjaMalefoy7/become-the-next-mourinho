const BTM_LEAGUE_SIM_ENTRYPOINT_VERSION="0.23";
(function(){
  if(typeof window.renderDynamicStandings==='function')return;
  if(document.querySelector('script[src*="matchday-v090.js"]'))return;
  const script=document.createElement('script');
  script.src='matchday-v090.js?v=023';
  script.async=false;
  script.onload=()=>{if(typeof refreshUI==='function')refreshUI();};
  document.body.appendChild(script);
})();
