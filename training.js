const BTM_TRAINING_ENTRYPOINT_VERSION="0.23";
(function(){
  if(window.__BTM_TRAINING_LOADED__)return;
  window.__BTM_TRAINING_LOADED__=true;
  if(typeof window.btmApplyTrainingDays==='function')return;
  if(document.querySelector('script[src*="training-v018.js"]'))return;
  const s=document.createElement('script');
  s.src='training-v018.js?v=023';
  s.async=false;
  document.body.appendChild(s);
})();
