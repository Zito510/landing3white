// ===== Reveal on scroll (wie im Mockup "smooth") =====
(() => {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

// ===== Form: simpel validieren + Toast =====
(() => {
  const form = document.getElementById("leadForm");
  const toast = document.getElementById("toast");
  if (!form || !toast) return;

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
  const isPhone = (v) => {
    const s = String(v).trim();
    if (s.length < 6) return false;
    return /^[+()0-9\s-]+$/.test(s);
  };

  function showToast(msg, ok = true) {
    toast.textContent = msg;
    toast.style.display = "block";
    toast.style.borderColor = ok ? "rgba(200,169,81,.25)" : "rgba(255,120,120,.35)";
    toast.style.background = ok ? "rgba(200,169,81,.08)" : "rgba(255,120,120,.08)";
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => (toast.style.display = "none"), 3800);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();

    if (name.length < 2) return showToast("Bitte Namen eintragen.", false);
    if (!isPhone(phone)) return showToast("Bitte gültige Telefonnummer eintragen.", false);
    if (!isEmail(email)) return showToast("Bitte gültige E-Mail eintragen.", false);
    if (message.length < 10) return showToast("Bitte kurz Ihr Vorhaben beschreiben.", false);

    // Fake send – hier später API/Backend rein
    await new Promise(r => setTimeout(r, 700));
    console.log({ name, phone, email, message });

    form.reset();
    showToast("Danke! Wir melden uns schnellstmöglich.");
  });
})();
// ===== Counter: zählt von 0 bis data-count, sobald sichtbar =====
(() => {
  const statsWrap = document.querySelector("[data-stats]");
  if (!statsWrap) return;

  const counters = Array.from(statsWrap.querySelectorAll("[data-count]"));
  if (!counters.length) return;

  const animate = (el, to) => {
    const duration = 1400; // ms
    const start = performance.now();
    const from = 0;

    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(from + (to - from) * eased);
      el.textContent = val.toLocaleString("de-DE");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = Number(to).toLocaleString("de-DE");
    };

    requestAnimationFrame(step);
  };

  let started = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || started) return;
      started = true;

      counters.forEach((el) => {
        const to = parseInt(el.getAttribute("data-count"), 10) || 0;
        animate(el, to);
      });

      io.disconnect();
    });
  }, { threshold: 0.25 });

  io.observe(statsWrap);
})();
