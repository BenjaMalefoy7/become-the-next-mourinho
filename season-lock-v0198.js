const BTM_MATCHDAY_LOCK_VERSION="0.19.8";
(function(){
const START="2025-08-01",FIRST="2025-08-16";
function d(s){return new Date(String(s||START)+"T12:00:00");}
function iso(x){return x.toISOString().slice(0,10);}
function add(s,n){const x=d(s);x.setDate(x.getDate()+n);return iso(x);}
function delta(a,b){return Math.round((d(b)-d(a))/86400000);}
function mdate(md){return add(FIRST,(Number(md||1)-1)*7);}
function next(c){return typeof getNextCareerMatch==="function"?getNextCareerMatch(c):null;}
function active(){const id=typeof getActiveCareerId==="function"?getActiveCareerId():null;const cs=typeof loadCareers==="function"?loadCareers():[];const i=cs.findIndex(c=>c.id===id);return{cs,i,c:i>=0?cs[i]:null};}
function save(a){if(a.i<0)return;a.c.updatedAt=new Date().toISOString();a.cs[a.i]=a.c;if(typeof saveCareers==="function")saveCareers(a.cs,{silent:true});}
function goMatch(){const b=document.querySelector('[data-screen="match"]');if(b)b.click();else if(typeof showScreen==="function")showScreen("match");}
function due(c){if(!c)return false;c.currentDate=c.currentDate||START;const m=next(c);if(!m)return false;return delta(c.currentDate,mdate(m.matchday))<=0;}
window.btmIsMatchDue=function(c){return due(c);};
const originalAdvance=window.btmAdvanceSeasonDay;
window.btmAdvanceSeasonDay=function lockedAdvance(days){const a=active();if(!a.c)return;if(due(a.c)){a.c.matchdayLockMessage="Jour de match : prépare et joue le match avant de passer au jour suivant.";save(a);goMatch();if(typeof refreshUI==="function")refreshUI();return;}if(originalAdvance)originalAdvance(Math.max(1,Number(days)||1));const b=active();if(b.c&&due(b.c)){b.c.matchdayLockMessage="Jour de match atteint : va au Matchday Center.";save(b);}}
function decorate(){const a=active();const c=a.c;const box=document.getElementById("season-v014");if(!box||!c)return;const isDue=due(c);const day=document.getElementById("season-next-day");const nextBtn=document.getElementById("season-next-match");const warning=box.querySelector(".season-v014-warning");if(day){day.disabled=isDue;day.textContent=isDue?"Match à jouer":"Jour suivant";}if(nextBtn){nextBtn.textContent=isDue?"Aller au match":"Prochain match plus tard";nextBtn.onclick=function(){if(isDue)goMatch();else if(window.btmAdvanceSeasonDay)window.btmAdvanceSeasonDay(1);};}if(warning)warning.textContent=isDue?"Jour de match : impossible de passer au jour suivant":"Saison jour par jour active";}
const prev=typeof refreshUI==="function"?refreshUI:null;refreshUI=function refreshUILockV0198(){if(prev)prev();decorate();};document.addEventListener("DOMContentLoaded",decorate);document.addEventListener("click",()=>setTimeout(decorate,0));
})();