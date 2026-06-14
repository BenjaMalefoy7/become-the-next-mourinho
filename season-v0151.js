const BTM_MAILBOX_POLISH_VERSION="0.15.1";
(function(){
const labels={briefing:"Staff",news:"News", "match-report":"Match",board:"Board",transfer:"Mercato",training:"Entraînement"};
function polish(){document.querySelectorAll(".mail-v015-type").forEach(node=>{const raw=node.textContent.trim();node.textContent=labels[raw]||raw;});const header=document.querySelector("#mail .section-header p");if(header)header.textContent="Les types de messages seront enrichis plus tard. Pour l’instant : staff, news et rapports de match.";const btn=document.getElementById("mail-mark-read");if(btn)btn.textContent="Archiver comme lu";}
const prev=typeof refreshUI==="function"?refreshUI:null;refreshUI=function refreshUIMailPolishV0151(){if(prev)prev();polish();};document.addEventListener("DOMContentLoaded",polish);document.addEventListener("click",()=>setTimeout(polish,0));
})();