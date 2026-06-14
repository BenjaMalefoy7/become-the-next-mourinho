const BTM_LINEUP_ENTRYPOINT_VERSION="0.30A";
(function(){
  if(window.__BTM_LINEUP_ENTRYPOINT_LOADED__)return;
  window.__BTM_LINEUP_ENTRYPOINT_LOADED__=true;
  const baseRefresh=window.refreshUI;
  function registerLineup(){
    if(window.__BTM_LINEUP_REGISTERED__)return;
    window.__BTM_LINEUP_REGISTERED__=true;
    if(window.refreshUI!==baseRefresh){
      window.refreshUI=baseRefresh;
      console.info("[BTM] V0.30A: legacy lineup refreshUI wrapper neutralized.");
    }
    if(typeof window.btmRegisterRender==="function"&&typeof window.renderLineupBuilder==="function"){
      window.btmRegisterRender("lineup",function(career){window.renderLineupBuilder(career||getResolvedCareer());});
    }
  }
  if(typeof window.renderLineupBuilder==="function"){
    registerLineup();
    if(typeof window.refreshUI==="function")window.refreshUI();
    return;
  }
  const script=document.createElement("script");
  script.src="lineup-v050.js?v=030A";
  script.async=false;
  script.onload=function(){registerLineup();if(typeof window.refreshUI==="function")window.refreshUI();};
  script.onerror=function(){console.error("[BTM] Impossible de charger lineup-v050.js depuis lineup.js V0.30A.");};
  document.body.appendChild(script);
})();