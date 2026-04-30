/* ================================================================
   BUSINESS IVOIRE USA 2026 — Enhancements
   - Count-up animation on KPI banner
   - (Ken Burns is pure CSS on .hero__bg-img)
   ================================================================ */

(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* ----- Count-up KPI banner ----- */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function countUp(el, target, duration) {
    const start = performance.now();
    const suffix = el.querySelector("sup");
    const suffixHTML = suffix ? suffix.outerHTML : "";
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = easeOutExpo(t);
      const current = Math.round(eased * target);
      el.innerHTML = current + suffixHTML;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const nums = document.querySelectorAll(".stats-banner__num");
  if (nums.length && "IntersectionObserver" in window) {
    nums.forEach((el) => {
      const raw = el.textContent.trim();
      const m = raw.match(/(\d+)/);
      if (!m) return;
      const target = parseInt(m[1], 10);
      el.dataset.target = target;
      el.textContent = "0" + (raw.includes("+") ? "" : "");
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const target = parseInt(e.target.dataset.target, 10);
            const hasPlus = e.target.dataset.suffix === "+";
            const suffixHTML = hasPlus ? "<sup>+</sup>" : "";
            const start = performance.now();
            const duration = 1600;
            const tick = (now) => {
              const t = Math.min((now - start) / duration, 1);
              const v = Math.round(easeOutExpo(t) * target);
              e.target.innerHTML = v + suffixHTML;
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    nums.forEach((el) => {
      const raw = el.dataset.target ? el.textContent : el.textContent;
      el.dataset.suffix =
        el.querySelector("sup") || /\+/.test(el.textContent) ? "+" : "";
      // Reset display
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target)) {
        el.innerHTML = "0" + (el.dataset.suffix === "+" ? "<sup>+</sup>" : "");
      }
      obs.observe(el);
    });
  }

  /* ----- Countdown to mission opening (June 10, 2026) ----- */
  const TARGET = new Date("2026-06-10T08:00:00-04:00").getTime();
  const dEls = document.querySelectorAll(
    "[data-countdown-days], [data-countdown-days-en]",
  );
  if (dEls.length) {
    const tick = () => {
      const now = Date.now();
      const diff = TARGET - now;
      const days = Math.max(0, Math.floor(diff / 86400000));
      dEls.forEach((el) => (el.textContent = days));
    };
    tick();
    setInterval(tick, 60000);
  }
})();
