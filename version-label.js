const BTM_VISIBLE_UI_VERSION = "V0.43I - Wood desk spacing test";
(function () {
  function ensureLandingStyle() {
    if (document.getElementById("btm-v043c-style")) return;
    const style = document.createElement("style");
    style.id = "btm-v043c-style";
    style.textContent = `
      .start-screen {
        background:
          radial-gradient(ellipse at 50% 45%, rgba(255, 237, 180, 0.13), transparent 40%),
          radial-gradient(circle at 14% 12%, rgba(171, 103, 39, 0.18), transparent 30%),
          radial-gradient(circle at 84% 20%, rgba(99, 55, 25, 0.34), transparent 34%),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
          repeating-linear-gradient(96deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 46px),
          repeating-linear-gradient(0deg, #2b180d 0 8px, #321d10 8px 15px, #241308 15px 24px, #3a2112 24px 32px),
          linear-gradient(135deg, #1a0d06 0%, #3b2213 48%, #160b05 100%);
        background-size: auto, auto, auto, 72px 72px, auto, auto, auto;
      }

      .start-screen .home-desk {
        width: min(1460px, 100%);
        grid-template-columns: minmax(300px, 0.74fr) minmax(460px, 1.04fr) minmax(280px, 0.70fr);
        gap: clamp(28px, 3.2vw, 56px);
      }

      .desk-copy {
        color: rgb(23,63,49);
        background: rgba(255,243,216,.80);
        border: 1px solid rgba(180,141,61,.35);
        padding: 30px;
        border-radius: 32px;
      }

      .start-screen .desk-copy {
        max-width: clamp(330px, 27vw, 430px);
        box-sizing: border-box;
      }

      .desk-kicker {
        background: rgba(255,248,229,.92);
        border-color: rgba(191,142,38,.44);
        color: rgb(154,111,23);
      }

      .start-screen .desk-copy h1 {
        color: rgb(23,63,49);
        opacity: 1;
        text-shadow: none;
        font-size: clamp(3.05rem, 5.15vw, 5.65rem);
        line-height: .9;
        letter-spacing: -.07em;
        max-width: 100%;
      }

      .start-screen .desk-copy h1 span {
        display: block;
        color: rgb(189,140,31);
        font-size: .9em;
        letter-spacing: -.045em;
        transform: translateX(2px);
      }

      .desk-lead {
        color: rgb(80,71,52);
        opacity: 1;
        font-weight: 760;
      }

      .desk-quote {
        background: rgba(255,248,229,.72);
        color: rgb(106,80,48);
        opacity: 1;
      }

      @media (min-width: 1500px) {
        .start-screen .contract-folder {
          margin-left: clamp(4px, 1.3vw, 24px);
        }
      }

      @media (max-width: 1180px) {
        .start-screen .home-desk {
          width: min(1320px, 100%);
          grid-template-columns: 1fr;
          gap: clamp(16px, 2.4vw, 30px);
        }

        .start-screen .desk-copy {
          max-width: none;
        }

        .start-screen .desk-copy h1 {
          font-size: clamp(3rem, 6.6vw, 6.6rem);
        }

        .start-screen .desk-copy h1 span {
          font-size: 1em;
          transform: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function applyVersionLabel() {
    ensureLandingStyle();
    const footer = document.querySelector(".sidebar-footer");
    if (footer) footer.textContent = BTM_VISIBLE_UI_VERSION;
  }

  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("version-label", applyVersionLabel);
  document.addEventListener("DOMContentLoaded", applyVersionLabel);
})();