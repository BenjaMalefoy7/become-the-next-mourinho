const BTM_VISIBLE_UI_VERSION = "V0.43J - Manager desk alignment pass";
(function () {
  function ensureLandingStyle() {
    if (document.getElementById("btm-v043j-style")) return;
    const style = document.createElement("style");
    style.id = "btm-v043j-style";
    style.textContent = `
      .start-screen {
        background:
          radial-gradient(ellipse at 50% 48%, rgba(255, 232, 174, 0.16), transparent 42%),
          radial-gradient(circle at 12% 14%, rgba(183, 108, 44, 0.22), transparent 30%),
          radial-gradient(circle at 88% 18%, rgba(86, 47, 22, 0.38), transparent 34%),
          linear-gradient(90deg, rgba(255,255,255,0.034) 1px, transparent 1px),
          repeating-linear-gradient(96deg, rgba(255,255,255,0.026) 0 1px, transparent 1px 44px),
          repeating-linear-gradient(0deg, #2a170c 0 8px, #342012 8px 16px, #241308 16px 25px, #3b2414 25px 34px),
          linear-gradient(135deg, #180c05 0%, #3a2112 50%, #150a04 100%);
        background-size: auto, auto, auto, 72px 72px, auto, auto, auto;
      }

      .start-screen.active {
        align-items: center;
      }

      .start-screen .home-desk {
        width: min(94rem, calc(100vw - clamp(2rem, 6vw, 7rem)));
        min-height: min(47.5rem, calc(100vh - clamp(2rem, 7vh, 5rem)));
        grid-template-columns: minmax(20rem, 24rem) minmax(31rem, 35.5rem) minmax(18.5rem, 22rem);
        gap: clamp(1.75rem, 2.4vw, 2.85rem);
        justify-content: center;
        align-items: center;
      }

      .start-screen .desk-copy {
        justify-self: end;
        max-width: 24rem;
        box-sizing: border-box;
        color: rgb(23,63,49);
        background: rgba(255,243,216,.82);
        border: 1px solid rgba(180,141,61,.38);
        padding: clamp(1.45rem, 2vw, 1.9rem);
        border-radius: 2rem;
        box-shadow: 0 1.7rem 4.5rem rgba(26, 13, 5, 0.22);
      }

      .start-screen .contract-folder {
        justify-self: center;
        width: min(35.5rem, 100%);
        margin-left: 0;
        transform: rotate(-0.7deg);
      }

      .start-screen .contract-paper {
        min-height: clamp(37rem, 72vh, 42rem);
        box-sizing: border-box;
      }

      .start-screen .tactical-board {
        justify-self: start;
        width: min(22rem, 100%);
        max-width: 22rem;
        gap: clamp(0.75rem, 1.3vw, 1rem);
        align-content: center;
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
        font-size: clamp(3rem, 4.45vw, 5.05rem);
        line-height: .91;
        letter-spacing: -.066em;
        max-width: 100%;
        margin-top: clamp(1.1rem, 2.1vh, 1.5rem);
      }

      .start-screen .desk-copy h1 span {
        display: block;
        color: rgb(189,140,31);
        font-size: .9em;
        letter-spacing: -.045em;
        transform: none;
      }

      .desk-lead {
        color: rgb(80,71,52);
        opacity: 1;
        font-weight: 760;
        max-width: 100%;
      }

      .desk-quote {
        background: rgba(255,248,229,.74);
        color: rgb(106,80,48);
        opacity: 1;
        max-width: 100%;
        margin-top: clamp(1rem, 2.3vh, 1.45rem);
      }

      .desk-vision-card {
        margin-top: clamp(0.95rem, 2vh, 1.25rem);
      }

      .desk-mini-mark {
        margin-top: 0.85rem;
      }

      .start-screen .tactical-board .post-it {
        margin-top: 0;
        transform: rotate(1.1deg);
      }

      .start-screen .desk-objective-note {
        transform: rotate(-0.4deg);
      }

      .start-screen .tactics-card {
        min-height: clamp(18.5rem, 34vh, 21rem);
      }

      .start-screen .tactic-dots {
        height: clamp(12rem, 24vh, 13.75rem);
      }

      .desk-detail-note.reminder {
        top: clamp(2rem, 5vh, 3.4rem);
        right: clamp(25.5rem, 29vw, 32.5rem);
        transform: rotate(1.2deg) scale(0.84);
        z-index: 4;
      }

      .desk-detail-stamp {
        top: clamp(5.6rem, 13vh, 7.8rem);
        right: clamp(24.5rem, 28.5vw, 31.5rem);
        transform: rotate(-8deg) scale(0.82);
      }

      .desk-detail-scribble {
        right: clamp(24rem, 28vw, 31rem);
        bottom: clamp(4.5rem, 11vh, 6.8rem);
        transform: rotate(-5deg) scale(0.78);
      }

      .desk-detail-coffee {
        left: clamp(24.5rem, 30vw, 30.5rem);
        bottom: clamp(3.2rem, 8vh, 5.2rem);
      }

      @media (max-width: 1500px) and (min-width: 1181px) {
        .start-screen .home-desk {
          width: min(88rem, calc(100vw - clamp(1.5rem, 4vw, 4rem)));
          grid-template-columns: minmax(18.5rem, 22rem) minmax(29rem, 33rem) minmax(17.5rem, 20rem);
          gap: clamp(1.2rem, 2vw, 1.9rem);
        }

        .start-screen .desk-copy {
          max-width: 22rem;
          padding: 1.45rem;
        }

        .start-screen .desk-copy h1 {
          font-size: clamp(2.7rem, 4.25vw, 4.55rem);
        }

        .start-screen .contract-folder {
          width: min(33rem, 100%);
        }

        .start-screen .tactical-board {
          width: min(20rem, 100%);
          max-width: 20rem;
        }

        .desk-detail-note.reminder,
        .desk-detail-scribble,
        .desk-detail-stamp,
        .desk-detail-coffee {
          display: none;
        }
      }

      @media (max-height: 760px) and (min-width: 1181px) {
        .start-screen .home-desk {
          min-height: auto;
        }

        .start-screen .contract-paper {
          min-height: 35rem;
        }

        .start-screen .desk-copy h1 {
          font-size: clamp(2.65rem, 4vw, 4.35rem);
        }

        .desk-detail-note.reminder,
        .desk-detail-scribble,
        .desk-detail-stamp,
        .desk-detail-coffee {
          display: none;
        }
      }

      @media (max-width: 1180px) {
        .start-screen .home-desk {
          width: min(82rem, calc(100vw - 2rem));
          grid-template-columns: 1fr;
          gap: clamp(1rem, 2.4vw, 1.9rem);
          min-height: auto;
        }

        .start-screen .desk-copy,
        .start-screen .contract-folder,
        .start-screen .tactical-board {
          justify-self: stretch;
          width: 100%;
          max-width: none;
        }

        .start-screen .contract-folder {
          transform: none;
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