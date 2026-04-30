/* ================================================================
   BUSINESS IVOIRE USA 2026 — Front interactions
   ================================================================ */

(function () {
  "use strict";

  const html = document.documentElement;

  /* ----- Lang switcher ----- */
  const langButtons = document.querySelectorAll(".topbar__lang button");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (!lang) return;
      html.setAttribute("lang", lang);
      langButtons.forEach((b) =>
        b.classList.toggle("is-active", b.dataset.lang === lang),
      );
      document.querySelectorAll("select option[data-fr]").forEach((opt) => {
        opt.textContent = lang === "en" ? opt.dataset.en : opt.dataset.fr;
      });
      try {
        localStorage.setItem("biusa-lang", lang);
      } catch (_) {}
    });
  });

  try {
    const saved = localStorage.getItem("biusa-lang");
    if (saved && saved !== html.getAttribute("lang")) {
      const btn = document.querySelector(
        `.topbar__lang button[data-lang="${saved}"]`,
      );
      if (btn) btn.click();
    }
  } catch (_) {}

  /* ----- Header — scroll state + light state ----- */
  const header = document.getElementById("header");
  const heroEl = document.querySelector(".hero");
  if (header) {
    const onScroll = () => {
      const scrolled = window.scrollY > 40;
      header.classList.toggle("is-scrolled", scrolled);
      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        const overHero = heroRect.bottom > 80;
        header.classList.toggle("is-light", overHero);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----- Mobile nav toggle ----- */
  const toggle = document.getElementById("navToggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => header.classList.toggle("is-open"));
    document
      .querySelectorAll(".nav__link")
      .forEach((link) =>
        link.addEventListener("click", () =>
          header.classList.remove("is-open"),
        ),
      );
  }

  /* ----- Scroll reveal ----- */
  if ("IntersectionObserver" in window) {
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            reveal.unobserve(e.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -4% 0px" },
    );
    document
      .querySelectorAll(".reveal, .reveal-stagger")
      .forEach((el) => reveal.observe(el));
  } else {
    document
      .querySelectorAll(".reveal, .reveal-stagger")
      .forEach((el) => el.classList.add("is-visible"));
  }

  /* ----- Hero parallax (subtle) ----- */
  const heroBg = document.querySelector(".hero__bg.parallax");
  if (
    heroBg &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    let ticking = false;
    const onParallax = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = Math.min(window.scrollY * 0.18, 120);
          heroBg.style.transform = `translateY(${y}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onParallax, { passive: true });
  }

  /* ----- Hotel searchbar -> scroll to hotel grid ----- */
  const hotelSearchbar = document.getElementById("hotelSearchbar");
  if (hotelSearchbar) {
    hotelSearchbar.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = document.getElementById("hotelGrid");
      if (target) {
        const headerH =
          (document.querySelector(".header")?.offsetHeight || 0) + 20;
        const top =
          target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  }

  /* ----- Form: build clean mailto body ----- */
  const form = document.getElementById("registerForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const lines = [];
      for (const [k, v] of data.entries()) {
        if (v) lines.push(`${k.toUpperCase()} : ${v}`);
      }
      const body = encodeURIComponent(
        "BUSINESS IVOIRE USA 2026 — Demande d'inscription\n\n" +
          lines.join("\n") +
          "\n\n— Envoyé via le site officiel",
      );
      const subject = encodeURIComponent(
        "BUSINESS IVOIRE USA 2026 — Inscription : " +
          (data.get("prenom") || "") +
          " " +
          (data.get("nom") || ""),
      );
      window.location.href = `mailto:naimf@protonmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
