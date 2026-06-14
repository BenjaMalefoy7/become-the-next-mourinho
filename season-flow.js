const BTM_SEASON_FLOW_VERSION = "0.25";
(function(){
const START="2025-08-01",FIRST_MATCH="2025-08-16";
function e(v){return typeof escapeHtml==="function"?escapeHtml(v):String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function iso(d){return d.toISOString().slice(0,10);}
function date(s){return new Date(String(s||START)+"T12:00:00");}
function add(s,n){const d=date(s);d.setDate(d.getDate()+n);return iso(d);}
function diff(a,b){return Math.round((date(b)-date(a))/86400000);}
function fr(s){try{return new Intl.DateTimeFormat("fr-FR",{day:"2-digit",month:"short",year:"numeric"}).format(date(s));}catch(_){return s;}}
function matchDate(md){return add(FIRST_MATCH,(Number(md||1)-1)*7);}
function getNext(c){return typeof getNextCareerMatch==="function"?getNextCareerMatch(c):null;}
function activeIndex(){const id=typeof getActiveCareerId==="function"?getActiveCareerId():null;const careers=typeof loadCareers==="function"?loadCareers():[];const index=careers.findIndex(c=>c.id===id);return{careers,index,career:index>=0?careers[index]:null};}
function save(careers,index,career){career.updatedAt=new Date().toISOString();careers[index]=career;if(typeof saveCareers==="function")saveCareers(careers,{silent:true});}
function ensure(career){if(!career)return false;let changed=false;if(!career.seasonStartDate){career.seasonStartDate=START;changed=true;}if(!career.currentDate){career.currentDate=START;changed=true;}if(!career.seasonDay){career.seasonDay=diff(START,career.currentDate)+1;changed=true;}return changed;}
function ensurePersist(){const a=activeIndex();if(!a.career)return null;if(ensure(a.career))save(a.careers,a.index,a.career);return a.career;}
function nextInfo(career){const m=getNext(career);if(!m)return{match:null,date:null,days:null,label:"Saison terminée"};const d=matchDate(m.matchday);return{match:m,date:d,days:diff(career.currentDate,d),label:(typeof getMatchLabel==="function"?getMatchLabel(m):m.homeClubName+" vs "+m.awayClubName)};}
function isMatchDue(career){ensure(career);const n=nextInfo(career);return Boolean(n.match&&n.days<=0);}
function canPlay(career){if(!career)return{ok:false,message:"Aucune carrière active."};ensure(career);const n=nextInfo(career);if(!n.match)return{ok:false,message:"Aucun match à jouer."};if(n.days>0)return{ok:false,message:"Match prévu le "+fr(n.date)+". Continue jour par jour."};return{ok:true,message:"Match disponible."};}
function canAdvance(career){if(!career)return{ok:false,message:"Aucune carrière active."};if(isMatchDue(career))return{ok:false,message:"Match à jouer aujourd’hui. Va au Matchday Center avant de continuer."};return{ok:true,message:"Jour suivant disponible."};}
function recover(career){(Array.isArray(career.players)?career.players:[]).forEach(p=>{p.condition=Math.min(100,(Number(p.condition??100)||100)+2);});}
function goMatch(){const btn=document.querySelector('[data-screen="match"]');if(btn)btn.click();else if(typeof showScreen==="function")showScreen("match");}
function advance(days){const a=activeIndex();if(!a.career)return;ensure(a.career);const gate=canAdvance(a.career);if(!gate.ok){window.btmSeasonFlowMessage=gate.message;if(typeof refreshUI==="function")refreshUI();return;}const total=Math.max(1,Number(days)||1);for(let i=0;i<total;i++){if(isMatchDue(a.career)){window.btmSeasonFlowMessage="Match à jouer aujourd’hui. Va au Matchday Center.";break;}a.career.currentDate=add(a.career.currentDate,1);a.career.seasonDay=diff(START,a.career.currentDate)+1;recover(a.career);if(typeof window.btmGenerateDailyMail==="function")window.btmGenerateDailyMail(a.career,a.career.currentDate);}save(a.careers,a.index,a.career);if(typeof refreshUI==="function")refreshUI();}
function advanceToNext(){const c=ensurePersist();if(!c)return;const n=nextInfo(c);if(!n.date)return;if(n.days<=0){goMatch();return;}window.btmSeasonFlowMessage="Avance jour par jour. Le match sera accessible le jour même.";if(typeof refreshUI==="function")refreshUI();}
window.btmCanPlayMatch=canPlay;
window.btmCanAdvanceDay=canAdvance;
window.btmNextMatchInfo=nextInfo;
window.btmMatchDate=matchDate;
window.btmFormatSeasonDate=fr;
window.btmAdvanceSeasonDay=advance;
window.btmAdvanceToNextMatch=advanceToNext;
const oldSave=typeof saveSimulatedMatch==="function"?saveSimulatedMatch:null;
saveSimulatedMatch=function saveSimulatedMatchV025(){const c=ensurePersist();const gate=canPlay(c);if(!gate.ok)return{ok:false,message:gate.message};const res=oldSave?oldSave():{ok:false,message:"Simulation indisponible."};if(res&&res.ok){const a=activeIndex();const fresh=a.career||c;if(typeof window.btmEnhanceLastMatchReport==="function")window.btmEnhanceLastMatchReport(fresh);if(a.index>=0)save(a.careers,a.index,fresh);if(typeof window.btmGenerateMatchMail==="function")window.btmGenerateMatchMail(fresh,res.result||fresh?.lastMatchResult);}return res;};
function render(){const main=document.querySelector(".main-content");if(!main)return;const career=ensurePersist();let box=document.getElementById("season-flow-panel");if(!box){box=document.createElement("div");box.id="season-flow-panel";box.className="season-v014 season-flow-panel";const top=document.querySelector(".topbar");if(top&&top.nextSibling)main.insertBefore(box,top.nextSibling);else main.prepend(box);}if(!career){box.innerHTML="";return;}const n=nextInfo(career);const due=isMatchDue(career);const unread=(Array.isArray(career.mailbox)?career.mailbox.filter(m=>!m.read).length:0);const msg=window.btmSeasonFlowMessage||"Saison jour par jour active";window.btmSeasonFlowMessage="";box.classList.toggle("season-v014-ready",due);box.innerHTML=`<div class="season-v014-left"><div class="season-v014-date"><span>Date du jour</span><strong>${e(fr(career.currentDate))}</strong></div><div class="season-v014-next"><span>Prochain match</span><strong>${e(n.label)}</strong><small>${n.date?` · ${e(fr(n.date))} · ${due?"aujourd’hui":"J-"+Math.max(0,n.days)}`:""}</small><div class="season-v014-warning">${e(due?"Match à jouer aujourd’hui":msg)}</div></div></div><div class="season-v014-actions"><button class="secondary-btn" id="season-next-day" ${due?"disabled":""}>${due?"Match à jouer":"Passer au jour suivant"}</button><button class="primary-btn" id="season-next-match">${due?"Aller au match":"Prochain match plus tard"}</button><button class="secondary-btn" id="season-open-mail">Courrier ${unread?`<span class='season-v014-mail-pill'>${unread}</span>`:""}</button></div>`;document.getElementById("season-next-day")?.addEventListener("click",()=>advance(1));document.getElementById("season-next-match")?.addEventListener("click",()=>due?goMatch():advanceToNext());document.getElementById("season-open-mail")?.addEventListener("click",()=>document.querySelector('[data-screen="mail"]')?.click());}
function decorateMatchButton(){const c=ensurePersist();const btn=document.getElementById("prematch-launch");if(!btn||!c)return;const gate=canPlay(c);if(!gate.ok){btn.disabled=true;btn.title=gate.message;}}
function updateCopy(){if(typeof setText==="function")setText("dashboard-description","V0.25 : Season Flow extrait dans un module stable, rythme jour par jour et blocage matchday centralisés.");const f=document.querySelector(".sidebar-footer");if(f)f.textContent="V0.25 — Season Flow stable";}
const prev=typeof refreshUI==="function"?refreshUI:null;
refreshUI=function refreshUIV025Season(){if(prev)prev();render();decorateMatchButton();updateCopy();};
document.addEventListener("DOMContentLoaded",()=>{render();decorateMatchButton();updateCopy();});
})();