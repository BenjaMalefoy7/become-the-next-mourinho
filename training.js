const BTM_TRAINING_ENTRYPOINT_VERSION="0.22";
(function(){
if(typeof window.btmApplyTrainingDays==="function")return;
if(document.querySelector('script[src*="training-v018.js"]'))return;
const s=document.createElement("script");
s.src="training-v018.js?v=022";
s.async=false;
s.onload=()=>{if(typeof refreshUI==="function")refreshUI();};
document.body.appendChild(s);
})();