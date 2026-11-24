(() => {
  "use strict";
  const C = window.WEDDING_EN;
  const $ = (s) => document.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const set = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t || ""; };

  /* ---------- content ---------- */
  const H = C.home || {};
  $("#photo").src = C.photo;
  $("#hero").style.setProperty("--bg", `url("${C.photoTiny || C.photo}")`);
  set("kicker", H.kicker);
  set("titleScript", H.script);
  set("groomName", C.groom);
  set("brideName", C.bride);
  set("metaDate", H.date);
  set("metaVenue", H.venue);
  set("enterLabel", H.button);
  // "WEDDING" rises letter by letter
  const tm = $("#titleMain");
  [...(H.title || "")].forEach((c, i) => {
    const s = document.createElement("span");
    s.className = "ch"; s.textContent = c;
    s.style.animationDelay = `${3 + i * 0.09}s`;
    tm.appendChild(s);
  });

  /* ---------- gentle parallax (mouse on desktop, tilt on phones that allow it) ---------- */
  const wrap = $("#photoWrap");
  let px = 0, py = 0;
  const applyPar = () => { wrap.style.transform = `translate(${px * -1.6}%, ${py * -1.2}%)`; };
  if (!reduce) {
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; applyPar();
    });
    addEventListener("deviceorientation", (e) => {
      if (e.gamma == null) return;
      px = Math.max(-1, Math.min(1, e.gamma / 30)) * 0.5;
      py = Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * 0.5;
      applyPar();
    });
  }

  /* ---------- falling white petals ---------- */
  const cv = $("#petals"), g = cv.getContext("2d");
  let W = 0, Hh = 0, parts = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  function size() {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    W = r.width; Hh = r.height; cv.width = W * d; cv.height = Hh * d; g.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener("resize", size); size();
  const mk = (top) => ({
    x: rnd(-20, W + 20), y: top ? rnd(-Hh * 0.3, -10) : rnd(0, Hh),
    s: rnd(5, 11), vx: rnd(-0.25, 0.35), vy: rnd(0.35, 0.9), r: rnd(0, 6.28), vr: rnd(-0.02, 0.02),
    ph: rnd(0, 6.28), a: rnd(0.55, 0.95), blur: Math.random() < 0.25,
  });
  function petal(p, t) {
    g.save(); g.translate(p.x, p.y); g.rotate(p.r);
    g.scale(1, 0.35 + Math.abs(Math.sin(p.ph + t * 0.002)) * 0.65);
    g.globalAlpha = p.a;
    if (p.blur) { g.shadowColor = "rgba(255,255,255,.9)"; g.shadowBlur = 6; }
    const grd = g.createLinearGradient(0, -p.s, 0, p.s);
    grd.addColorStop(0, "#ffffff"); grd.addColorStop(1, "#efe9df");
    g.fillStyle = grd;
    g.beginPath(); g.moveTo(0, -p.s); g.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.8, 0, p.s);
    g.bezierCurveTo(-p.s * 0.7, p.s * 0.8, -p.s * 0.9, -p.s * 0.6, 0, -p.s); g.fill();
    g.restore();
  }
  function frame(t) {
    g.clearRect(0, 0, W, Hh);
    const want = W < 500 ? 18 : 26;
    if (parts.length < want && Math.random() < 0.06) parts.push(mk(true));
    parts = parts.filter((p) => {
      p.x += p.vx + Math.sin(p.ph + t * 0.0012) * 0.5; p.y += p.vy; p.r += p.vr;
      petal(p, t);
      return p.y < Hh + 20;
    });
    requestAnimationFrame(frame);
  }
  if (!reduce) { setTimeout(() => { for (let i = 0; i < 8; i++) parts.push(mk(false)); requestAnimationFrame(frame); }, 1500); }

  /* ---------- music (optional) ---------- */
  const audio = $("#bgm");
  let started = false;
  function startMusic() {
    if (started || !C.music) return; started = true;
    audio.src = C.music; audio.volume = 0;
    audio.play().then(() => {
      const t0 = performance.now();
      const step = (t) => { audio.volume = Math.max(0, Math.min(0.7, (t - t0) / 2500 * 0.7)); if (audio.volume < 0.7) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }).catch(() => { started = false; });
  }
  // start as early as the browser allows:
  // 1) try right away on page load (works when the browser permits autoplay)
  // 2) otherwise on the guest's very first touch / click / scroll / key anywhere on the page
  // music starts on its own the moment the page opens; if the phone's browser blocks
  // sound until the guest touches the screen, it starts on that very first touch (any spot)
  if (C.music) {
    audio.src = C.music; audio.preload = "auto";
    startMusic();
    const kick = () => { if (!audio.paused) { off(); return; } startMusic(); audio.play().then(off).catch(() => {}); };
    const evs = ["pointerdown", "touchstart", "click", "keydown", "wheel", "scroll"];
    const off = () => evs.forEach((ev) => removeEventListener(ev, kick, true));
    evs.forEach((ev) => addEventListener(ev, kick, { capture: true, passive: true }));
    document.addEventListener("visibilitychange", () => { if (!document.hidden && started && audio.paused) audio.play().catch(() => {}); });
  }


  const mBtns = [...document.querySelectorAll("[data-music]")];
  const setM = (on) => mBtns.forEach((b) => { b.classList.toggle("playing", on); b.setAttribute("aria-pressed", String(on)); });
  audio.addEventListener("play", () => setM(true));
  audio.addEventListener("pause", () => setM(false));
  mBtns.forEach((b) => b.addEventListener("click", () => {
    if (!C.music) { toast("Music coming soon ♪"); return; }
    if (performance.now() - (window.__kickT || 0) < 600) return;   // this tap just started the music
    if (!started) startMusic(); else if (audio.paused) audio.play(); else audio.pause();
  }));
  $(".ic-menu").addEventListener("click", () => toast("Tap “Enter Invitation” to step inside ✨"));

  let toastT;
  function toast(m) { const el = $("#toast"); el.textContent = m; el.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2200); }

  /* ---------- page 2 content ---------- */
  const G = C.garden || {};
  set("gScript", G.title || "Our Wedding");
  set("gGroom", C.groom);
  set("gBride", C.bride);

  /* ---------- cinematic walk: Page 1 ⇄ Page 2 ---------- */
  const hero = $("#hero"), garden = $("#garden"), walk = $("#walk");
  let where = "hero", busy = false;
  const restart = (el, ...cls) => { el.classList.remove(...cls); void el.offsetWidth; el.classList.add(...cls); };

  function burstAt(el, n = 24) {
    const r = el.getBoundingClientRect(), c = cv.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const p = mk(false); p.x = r.left - c.left + r.width / 2; p.y = r.top - c.top + r.height / 2;
      p.vx = rnd(-3, 3); p.vy = rnd(-4, -1); parts.push(p);
    }
  }

  function enterGarden(push = true) {
    if (busy || where === "garden") return;
    busy = true;
    if (navigator.vibrate) navigator.vibrate(10);
    // 1 button ripple · 2 darken · 3-6 camera walks forward, flowers rush past
    hero.classList.remove("returning");
    hero.classList.add("leaving");
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run fwd";
    // 7-9 bokeh light, arrive at the garden
    setTimeout(() => {
      garden.classList.add("on");
      garden.removeAttribute("aria-hidden");
      restart(garden, "arrive", "in");
    }, reduce ? 0 : 1050);
    setTimeout(() => {
      hero.classList.add("away"); hero.setAttribute("aria-hidden", "true");
      walk.className = "walk";
      garden.classList.remove("arrive");
      where = "garden"; busy = false;
    }, reduce ? 50 : 2700);
    if (push) history.pushState({ p: "garden" }, "", "#garden");
  }

  function backToHero() {
    if (busy || where !== "garden") return;
    busy = true;
    garden.classList.remove("in");
    restart(garden, "depart");
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run bwd";
    setTimeout(() => {
      hero.classList.remove("away", "leaving");
      hero.removeAttribute("aria-hidden");
      restart(hero, "returning");
    }, reduce ? 0 : 600);
    setTimeout(() => {
      garden.classList.remove("on", "depart");
      garden.setAttribute("aria-hidden", "true");
      walk.className = "walk";
      where = "hero"; busy = false;
    }, reduce ? 50 : 2300);
  }

  $("#enterBtn").addEventListener("click", (e) => {
    startMusic();
    burstAt(e.currentTarget);
    restart(e.currentTarget, "pressed");
    setTimeout(() => enterGarden(), reduce ? 0 : 280);
  });
  $("#backBtn").addEventListener("click", () => history.state && history.state.p === "garden" ? history.back() : backToHero());
  addEventListener("popstate", () => {
    if (where === "gallery") window.__closeGallery();
    else if (where === "bigday") window.__closeBigDay();
    else if (where === "story") window.__closeStory();
    else if (where === "quiz") window.__closeQuiz();
    else if (where === "thanks") window.__closeThanks();
    else if (where === "garden") backToHero();
    else if (location.hash === "#garden") enterGarden(false);
  });
  history.replaceState({ p: "hero" }, "", location.pathname + location.search);

  /* ---------- signs: the camera leans toward the chosen destination ---------- */
  const DEST = { story: "Our Story", gallery: "Gallery", bigday: "The Big Day", quiz: "Fun Quiz" };
  const world = $("#gWorld");
  document.querySelectorAll(".sign").forEach((s) => s.addEventListener("click", () => {
    if (busy) return;
    busy = true;
    const wr = world.getBoundingClientRect(), sr = s.getBoundingClientRect();
    world.style.transformOrigin = `${((sr.left + sr.width * 0.3 - wr.left) / wr.width) * 100}% ${((sr.top + sr.height / 2 - wr.top) / wr.height) * 100}%`;
    burstAt(s, 14);
    garden.classList.add("toward");
    if (s.dataset.dest === "quiz") { setTimeout(() => { busy = false; window.__openQuiz(); }, reduce ? 0 : 900); return; }
    if (s.dataset.dest === "story") { setTimeout(() => { busy = false; window.__openStory(); }, reduce ? 0 : 900); return; }
    if (s.dataset.dest === "bigday") { setTimeout(() => { busy = false; window.__openBigDay(); }, reduce ? 0 : 900); return; }
    if (s.dataset.dest === "gallery") { setTimeout(() => { busy = false; window.__openGallery(); }, reduce ? 0 : 900); return; }
    setTimeout(() => {
      toast(`${DEST[s.dataset.dest]} — coming soon ✨`);
      garden.classList.remove("toward");           // step back to the path
    }, reduce ? 0 : 1400);
    setTimeout(() => { busy = false; }, reduce ? 50 : 2600);
  }));


  /* ============================================================
     GALLERY — 3D coverflow
  ============================================================ */
  const PH = (C.gallery || []);
  const gal = $("#gal"), flow = $("#flow"), dotsEl = $("#galDots"), countEl = $("#galCount");
  set("galGroom", C.groom); set("galBride", C.bride);
  let gi = 0;
  const cards = PH.map((p, i) => {
    const el = document.createElement("div");
    el.className = "card"; el.dataset.i = i;
    el.innerHTML = `<img src="${p.thumb}" alt="Photo ${i + 1}" loading="lazy" decoding="async"><span class="shine"></span>`;
    flow.appendChild(el);
    return el;
  });
  dotsEl.innerHTML = PH.map((_, i) => `<button type="button" role="tab" aria-label="Photo ${i + 1}" data-i="${i}"></button>`).join("");
  const dots = [...dotsEl.children];

  function layout() {
    const fw = flow.clientWidth, fh = flow.clientHeight;
    const landscapeScreen = fw > fh * 1.1;
    // the photo in the middle gets as much room as possible
    const maxH = fh * (landscapeScreen ? .98 : .84), maxW = fw * (landscapeScreen ? .5 : .76);
    const side = { h: Math.min(maxH * .72, fw * (landscapeScreen ? .26 : .5)) };
    side.w = side.h * .68;
    cards.forEach((el, i) => {
      const n = PH.length; let d = i - gi; if (d > n / 2) d -= n; if (d < -n / 2) d += n;   // wrap around so both sides are filled
      const a = Math.abs(d), p = PH[i];
      el.classList.toggle("center", d === 0);
      el.classList.toggle("hide", a > 7);
      if (d === 0) {
        const r = p.w / p.h;
        let h = maxH, w = h * r;
        if (w > maxW) { w = maxW; h = w / r; }
        el.style.setProperty("--w", `${w}px`); el.style.setProperty("--h", `${h}px`);
        el.style.setProperty("--x", "0px"); el.style.setProperty("--z", "60px"); el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--o", 1); el.style.setProperty("--b", 1); el.style.setProperty("--zi", 100);
        const im = el.querySelector("img");
        if (!im.dataset.full) { im.dataset.full = 1; const big = new Image(); big.onload = () => { im.src = p.src; }; big.src = p.src; }
        el.querySelector(".shine").style.animation = "none"; void el.offsetWidth; el.querySelector(".shine").style.animation = "";
        el.setAttribute("aria-current", "true");
      } else {
        const sgn = Math.sign(d);
        const cw = parseFloat(cards[gi].style.getPropertyValue("--w")) || side.w * 1.4;
        const step = side.w * (landscapeScreen ? .5 : .32);
        const x = sgn * (cw / 2 + side.w * (landscapeScreen ? .32 : .05) + (a - 1) * step);
        el.style.setProperty("--w", `${side.w}px`); el.style.setProperty("--h", `${side.h}px`);
        el.style.setProperty("--x", `${x}px`);
        el.style.setProperty("--z", `${-140 - a * 70}px`);
        el.style.setProperty("--ry", `${-sgn * 42}deg`);
        el.style.setProperty("--o", a > 6 ? 0 : 1 - a * 0.09);
        el.style.setProperty("--b", 0.95 - a * 0.07);
        el.style.setProperty("--zi", 100 - a);
        el.removeAttribute("aria-current");
      }
    });
    dots.forEach((b, i) => b.classList.toggle("on", i === gi));
    countEl.textContent = `${String(gi + 1).padStart(2, "0")} / ${String(PH.length).padStart(2, "0")}`;
  }
  function go(i) { gi = (i + PH.length) % PH.length; layout(); }
  // arrows: react on touch-end immediately (no 300 ms delay, no ghost clicks)
  function tapBtn(el, fn) {
    let touched = false;
    el.addEventListener("touchend", (e) => { e.preventDefault(); touched = true; fn(); bump(el); }, { passive: false });
    el.addEventListener("click", () => { if (touched) { touched = false; return; } fn(); bump(el); });
  }
  function bump(el) { el.classList.remove("tapped"); void el.offsetWidth; el.classList.add("tapped"); }
  tapBtn($("#galPrev"), () => go(gi - 1));
  tapBtn($("#galNext"), () => go(gi + 1));
  dotsEl.addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (b) go(+b.dataset.i); });
  addEventListener("resize", () => { if (gal.classList.contains("on")) layout(); });

  // swipe / drag anywhere on the gallery page — the cards follow the finger
  let sx = null, sy = 0, dxNow = 0, moved = false, horiz = null, startT = 0;
  const isCtl = (t) => t.closest(".gal-nav, .gal-dots, .ic-back, .ic-music, .viewer");
  function dStart(x, y, target) { if (isCtl(target)) return; sx = x; sy = y; dxNow = 0; moved = false; horiz = null; startT = performance.now(); }
  function dMove(x, y, e) {
    if (sx === null) return;
    const dx = x - sx, dy = y - sy;
    if (horiz === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) horiz = Math.abs(dx) > Math.abs(dy);
    if (!horiz) return;
    if (e && e.cancelable) e.preventDefault();          // keep the browser from scrolling / going back
    moved = Math.abs(dx) > 8; dxNow = dx;
    flow.style.transform = `translateX(${dx * 0.35}px)`;
  }
  function dEnd(target) {
    if (sx === null) return;
    const dx = dxNow, fast = Math.abs(dx) / Math.max(1, performance.now() - startT) > 0.5;
    sx = null; flow.style.transition = "transform .45s cubic-bezier(.2,.8,.2,1)"; flow.style.transform = "";
    setTimeout(() => { flow.style.transition = ""; }, 460);
    if (horiz && (Math.abs(dx) > 40 || (fast && Math.abs(dx) > 15))) { go(gi + (dx < 0 ? 1 : -1) * (Math.abs(dx) > 220 ? 2 : 1)); return; }
    if (moved) return;
    const c = target && target.closest && target.closest(".card");
    if (!c) return;
    if (+c.dataset.i === gi) openViewer(gi); else go(+c.dataset.i);
  }
  // touch (phones)
  gal.addEventListener("touchstart", (e) => { const t = e.touches[0]; dStart(t.clientX, t.clientY, e.target); }, { passive: true });
  gal.addEventListener("touchmove", (e) => { const t = e.touches[0]; dMove(t.clientX, t.clientY, e); }, { passive: false });
  gal.addEventListener("touchend", (e) => { const t = e.changedTouches[0]; dEnd(document.elementFromPoint(t.clientX, t.clientY)); });
  gal.addEventListener("touchcancel", () => dEnd(null));
  // mouse (desktop)
  gal.addEventListener("mousedown", (e) => { dStart(e.clientX, e.clientY, e.target); });
  addEventListener("mousemove", (e) => { if (sx !== null) dMove(e.clientX, e.clientY, null); });
  addEventListener("mouseup", (e) => { if (sx !== null) dEnd(e.target); });

  // full-screen viewer
  const viewer = $("#viewer"), vImg = $("#viewerImg");
  function openViewer(i) { vImg.src = PH[i].src; viewer.classList.add("open"); viewer.setAttribute("aria-hidden", "false"); }
  function closeViewer() { viewer.classList.remove("open"); viewer.setAttribute("aria-hidden", "true"); }
  $("#viewerClose").addEventListener("click", closeViewer);
  viewer.addEventListener("click", (e) => { if (e.target === viewer) closeViewer(); });
  addEventListener("keydown", (e) => {
    if (viewer.classList.contains("open")) { if (e.key === "Escape") closeViewer(); return; }
    if (!gal.classList.contains("on")) return;
    if (e.key === "ArrowLeft") go(gi - 1);
    if (e.key === "ArrowRight") go(gi + 1);
    if (e.key === "Escape") history.back();
  });

  /* ---------- garden ⇄ gallery: lean into the sign, walk through the light ---------- */
  function openGallery(push = true) {
    if (busy && push) return;
    busy = true; where = "gallery";
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run fwd";
    setTimeout(() => {
      gal.classList.add("on"); gal.removeAttribute("aria-hidden");
      gal.classList.remove("out");
      flow.classList.add("pre"); layout();
      restart(gal, "in");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        cards.forEach((c, k) => { c.style.transitionDelay = `${0.35 + Math.min(Math.abs(k - gi), 7) * 0.07}s`; });
        flow.classList.remove("pre");
        setTimeout(() => cards.forEach((c) => { c.style.transitionDelay = ""; }), 1800);
      }));
    }, reduce ? 0 : 900);
    setTimeout(() => {
      garden.classList.remove("toward"); garden.classList.remove("on"); garden.setAttribute("aria-hidden", "true");
      walk.className = "walk"; busy = false;
    }, reduce ? 50 : 2300);
    if (push) history.pushState({ p: "gallery" }, "", "#gallery");
  }
  function closeGallery() {
    if (busy) return;
    busy = true;
    closeViewer();
    gal.classList.add("out");
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run bwd";
    setTimeout(() => {
      garden.classList.add("on"); garden.removeAttribute("aria-hidden");
      restart(garden, "arrive");
    }, reduce ? 0 : 700);
    setTimeout(() => {
      gal.classList.remove("on", "in", "out"); gal.setAttribute("aria-hidden", "true");
      garden.classList.remove("arrive");
      walk.className = "walk"; where = "garden"; busy = false;
    }, reduce ? 50 : 2600);
  }
  $("#galBack").addEventListener("click", () => history.state && history.state.p === "gallery" ? history.back() : closeGallery());
  window.__openGallery = openGallery;
  window.__closeGallery = closeGallery;


  /* ============================================================
     THE BIG DAY
  ============================================================ */
  const BD = C.bigday || {};
  const bd = $("#bd");
  set("bdGroom", C.groom); set("bdBride", C.bride);
  set("bdDow", BD.dow); set("bdMon", BD.month); set("bdDay", BD.day); set("bdYear", BD.year);
  set("bdVenue", BD.venue); set("bdAddr", BD.address);
  $("#bdMap").href = BD.mapUrl || "#";
  const ICONS = {
    toast: '<path d="M7 3h4l-.5 6a2.5 2.5 0 0 1-3 0L7 3zM9 11v8M7 19h4M13 3h4l.5 6a2.5 2.5 0 0 1-3 0L13 3zM15 11v8M13 19h4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>',
    rings: '<circle cx="9" cy="13" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="15" cy="13" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    dinner: '<path d="M4 17h16M5 17a7 7 0 0 1 14 0M12 8v2M10 7h4M3 19h18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    music: '<path d="M9 17V6l10-2v11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="7" cy="17" r="2.2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="17" cy="15" r="2.2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  };
  $("#bdSteps").innerHTML = (BD.timeline || []).map((s) =>
    `<li class="bd-step"><span class="bd-ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[s.icon] || ICONS.rings}</svg></span><span class="bd-time"></span><span class="bd-what"></span></li>`).join("");
  document.querySelectorAll(".bd-step").forEach((li, i) => {
    li.querySelector(".bd-time").textContent = BD.timeline[i].time;
    li.querySelector(".bd-what").textContent = BD.timeline[i].label;
  });

  function openBigDay(push = true) {
    if (busy && push) return;
    busy = true; where = "bigday";
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run fwd";
    setTimeout(() => { bd.classList.add("on"); bd.classList.remove("out"); bd.removeAttribute("aria-hidden"); restart(bd, "in"); }, reduce ? 0 : 900);
    setTimeout(() => {
      garden.classList.remove("toward", "on"); garden.setAttribute("aria-hidden", "true");
      walk.className = "walk"; busy = false;
    }, reduce ? 50 : 2300);
    if (push) history.pushState({ p: "bigday" }, "", "#bigday");
  }
  function closeBigDay() {
    if (busy) return;
    busy = true;
    bd.classList.add("out");
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run bwd";
    setTimeout(() => { garden.classList.add("on"); garden.removeAttribute("aria-hidden"); restart(garden, "arrive"); }, reduce ? 0 : 700);
    setTimeout(() => {
      bd.classList.remove("on", "in", "out"); bd.setAttribute("aria-hidden", "true");
      garden.classList.remove("arrive"); walk.className = "walk"; where = "garden"; busy = false;
    }, reduce ? 50 : 2600);
  }
  $("#bdBack").addEventListener("click", () => history.state && history.state.p === "bigday" ? history.back() : closeBigDay());
  window.__openBigDay = openBigDay;
  window.__closeBigDay = closeBigDay;


  /* ============================================================
     OUR STORY
  ============================================================ */
  const STY = C.story || {};
  const st = $("#st");
  set("stGroom", C.groom); set("stBride", C.bride);
  set("stSub", STY.subtitle); set("stLead", STY.lead);
  const SICON = {
    people: '<circle cx="8" cy="7" r="2.6" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="16" cy="7" r="2.6" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 18c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5M11 18c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    cup: '<path d="M4 9h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H15M3 20h15M9 3c-1 1.5 1 2 0 4M12 3c-1 1.5 1 2 0 4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    mountain: '<path d="M2 19l6-10 4 6 3-4 7 8z M8 9l1.5 2.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>',
    ring: '<circle cx="12" cy="15" r="5.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9.5 6l2.5-3 2.5 3-2.5 3z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>',
  };
  // desktop positions of the four memories along the thread (fraction of the art)
  const SPOS = [[.665, .435], [.712, .545], [.625, .64], [.62, .775]];
  $("#stList").innerHTML = (STY.moments || []).slice(0, 4).map((m, i) =>
    `<li class="st-item" style="--x:${SPOS[i][0] * 100}%;--y:${SPOS[i][1] * 100}%">
       <span class="st-photo" data-i="${i}"><img src="${m.photo}" alt="" loading="lazy"></span>
       <span class="st-txt"><svg class="st-ic" viewBox="0 0 24 24" aria-hidden="true">${SICON[m.icon] || SICON.ring}</svg><span><span class="st-ttl"></span><span class="st-date"></span></span></span>
     </li>`).join("");
  document.querySelectorAll(".st-item").forEach((li, i) => {
    li.querySelector(".st-ttl").textContent = STY.moments[i].title;
    li.querySelector(".st-date").textContent = STY.moments[i].date || "";
  });
  // phones: a glowing wave that the four memories ride on, alternating left / right
  $("#stList").insertAdjacentHTML("afterbegin", `<svg class="st-wave" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path id="stWave" d="M30 -2 C 30 4, 30 8, 30 12.5 C 30 36.5, 70 13.5, 70 37.5 C 70 61.5, 30 38.5, 30 62.5 C 30 86.5, 70 63.5, 70 87.5 C 70 96, 60 100, 50 104" fill="none" stroke="url(#champ)" stroke-width="2" vector-effect="non-scaling-stroke"/>
      <circle r=".9" fill="#fff6dc"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#stWave"/></animateMotion></circle>
      <circle r=".7" fill="#ffe7b0"><animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite"><mpath href="#stWave"/></animateMotion></circle>
    </svg>`);
  $("#stList").addEventListener("click", (e) => {
    const p = e.target.closest(".st-photo"); if (!p) return;
    vImg.src = STY.moments[+p.dataset.i].photo; viewer.classList.add("open"); viewer.setAttribute("aria-hidden", "false");
  });

  function openStory(push = true) {
    if (busy && push) return;
    busy = true; where = "story";
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run fwd";
    setTimeout(() => { st.classList.add("on"); st.classList.remove("out"); st.removeAttribute("aria-hidden"); restart(st, "in"); }, reduce ? 0 : 900);
    setTimeout(() => {
      garden.classList.remove("toward", "on"); garden.setAttribute("aria-hidden", "true");
      walk.className = "walk"; busy = false;
    }, reduce ? 50 : 2300);
    if (push) history.pushState({ p: "story" }, "", "#story");
  }
  function closeStory() {
    if (busy) return;
    busy = true;
    st.classList.add("out");
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run bwd";
    setTimeout(() => { garden.classList.add("on"); garden.removeAttribute("aria-hidden"); restart(garden, "arrive"); }, reduce ? 0 : 700);
    setTimeout(() => {
      st.classList.remove("on", "in", "out"); st.setAttribute("aria-hidden", "true");
      garden.classList.remove("arrive"); walk.className = "walk"; where = "garden"; busy = false;
    }, reduce ? 50 : 2600);
  }
  $("#stBack").addEventListener("click", () => history.state && history.state.p === "story" ? history.back() : closeStory());
  window.__openStory = openStory;
  window.__closeStory = closeStory;


  /* ============================================================
     FUN QUIZ
  ============================================================ */
  const QZ = C.quiz || { questions: [] };
  const QS = QZ.questions || [];
  const qz = $("#qz");
  document.querySelectorAll(".qzG").forEach((e) => (e.textContent = C.groom));
  document.querySelectorAll(".qzB").forEach((e) => (e.textContent = C.bride));
  const QICON = {
    cafe: '<path d="M4 9h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H15M9 3c-1 1.5 1 2 0 4M12 3c-1 1.5 1 2 0 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    school: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    work: '<rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9 7V5h6v2M3 12h18" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    movie: '<rect x="3" y="9" width="18" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3 9l2-5 16 2-1 3M8 5l2 3M13 5.5l2 3" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    dinner: '<path d="M7 3v7a2 2 0 0 0 2 2v9M5 3v6M9 3v6M17 3c-2 2-2 6 0 8v10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    trip: '<path d="M2 19l6-10 4 6 3-4 7 8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    him: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    her: '<path d="M8 8a4 4 0 1 1 8 0c0 3 1 4 2 5H6c1-1 2-2 2-5z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    smile: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 14c1 2 7 2 8 0" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/>',
    gate: '<path d="M3 5h18M5 8h14M7 8v12M17 8v12M2 3c3 2 17 2 20 0" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    temple: '<path d="M12 3l3 5H9zM7 11h10l-1-3H8zM5 14h14M6 14v6M18 14v6M10 14v6M14 14v6M3 20h18" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    palm: '<path d="M12 21c0-6 1-9 1-11M13 10c-2-3-6-3-8-1 3 0 5 0 8 1zM13 10c2-3 6-3 8-1-3 0-5 0-8 1zM13 10c-1-3-3-5-6-5 2 1 4 3 6 5zM13 10c1-3 3-5 6-5-2 1-4 3-6 5zM8 21h9" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    europe: '<path d="M3 20h18M4 20V11h16v9M4 11c2-4 14-4 16 0M7 20v-6M11 20v-6M15 20v-6M19 20v-6" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    home: '<path d="M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-5h4v5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    plane: '<path d="M2 13l20-8-6 16-4-7z M12 14l10-9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    family: '<circle cx="7" cy="9" r="2.4" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="17" cy="9" r="2.4" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 20c0-3 2-5 5-5s5 2 5 5M12 20c0-3 2-5 5-5s5 2 5 5M12 5s-2-1.6-2-3a1.2 1.2 0 0 1 2-.5 1.2 1.2 0 0 1 2 .5c0 1.4-2 3-2 3z" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    sprout: '<path d="M12 21v-9M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 12c0-4 3-6 7-6 0 4-3 6-7 6z" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  };
  let qi = -1;
  const picks = new Array(QS.length).fill(null);
  $("#qzDots").innerHTML = QS.map(() => "<i></i>").join("");
  const qDots = [...$("#qzDots").children];
  const card = $("#qzCard");

  // stages: -1 = your name · 0..n-1 = questions · n = a few words from the heart
  let mode = "name";
  const U = QZ.ui || {};
  const mmd = (s) => String(s).replace(/\d/g, (d) => "၀၁၂၃၄၅၆၇၈၉"[d]);
  const T = (k, en) => U[k] || en;
  document.querySelector(".qz-intro .qz-ask").textContent = T("askName", "Before we begin…");
  document.querySelector(".qz-intro .qz-lab").textContent = T("nameLabel", "What’s your name?");
  document.querySelector(".qz-note .qz-ask").textContent = T("askNote", "One last thing…");
  document.querySelector(".qz-note .qz-lab").textContent = T("noteLabel", "Leave us a few words from your heart ♡");
  $("#qzName").placeholder = T("namePh", "Type your name here");
  $("#qzMsg").placeholder = T("notePh", "Write something sweet for the couple…");
  $("#qzPrev").textContent = T("back", "← Back");
  document.querySelector(".qz-banner span").textContent = T("got", "You got");
  document.querySelector(".qz-res-s").textContent = T("thanks", "Thank you for being part of our story. ♡");
  $("#qzAgain").textContent = T("again", "Play Again ↻");
  $("#qzHome").textContent = T("home", "Back to Invitation ⌂");
  set("qzCnt", mmd("0 / 300"));
  const nameIn = $("#qzName"), msgIn = $("#qzMsg");
  nameIn.addEventListener("input", () => { if (mode === "name") $("#qzNext").disabled = !nameIn.value.trim(); });
  msgIn.addEventListener("input", () => set("qzCnt", mmd(`${msgIn.value.length} / 300`)));
  nameIn.addEventListener("keydown", (e) => { if (e.key === "Enter" && nameIn.value.trim()) $("#qzNext").click(); });

  function renderQ(anim) {
    const n = QS.length;
    mode = qi < 0 ? "name" : qi >= n ? "note" : "q";
    const paint = () => {
      card.dataset.mode = mode;
      qDots.forEach((d, k) => { d.className = k < Math.max(qi, 0) || qi >= n ? "done" : k === qi ? "now" : ""; });
      if (mode === "name") {
        set("qzStep", T("ready", "Ready to play?"));
        $("#qzImg").src = QZ.introPhoto || QS[0].photo;
        $("#qzPrev").classList.add("hide");
        $("#qzNext").textContent = T("start", "Start the Quiz →");
        $("#qzNext").disabled = !nameIn.value.trim();
        return;
      }
      if (mode === "note") {
        set("qzStep", T("almost", "Almost done ♡"));
        $("#qzImg").src = QZ.notePhoto || QS[n - 1].photo;
        $("#qzPrev").classList.remove("hide");
        $("#qzNext").textContent = T("submit", "Submit ✓");
        $("#qzNext").disabled = false;
        setTimeout(() => msgIn.focus({ preventScroll: true }), 500);
        return;
      }
      const q = QS[qi];
      set("qzStep", mmd(T("step", "Question {n} of {t}").replace("{n}", qi + 1).replace("{t}", n)));
      set("qzNum", `Q${qi + 1}`);
      set("qzQuestion", q.q);
      $("#qzImg").src = q.photo;
      $("#qzOpts").innerHTML = q.options.map((o, k) =>
        `<button class="qz-opt${picks[qi] === k ? " sel" : ""}" type="button" data-k="${k}"><svg viewBox="0 0 24 24" aria-hidden="true">${QICON[o.icon] || QICON.heart}</svg><span></span></button>`).join("");
      [...$("#qzOpts").children].forEach((b, k) => (b.querySelector("span").textContent = q.options[k].text));
      $("#qzPrev").classList.remove("hide");
      $("#qzNext").textContent = T("next", "Next →");
      $("#qzNext").disabled = picks[qi] === null;
    };
    if (anim && !reduce) { card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap"); setTimeout(paint, 320); }
    else paint();
  }
  $("#qzOpts").addEventListener("click", (e) => {
    const b = e.target.closest(".qz-opt"); if (!b) return;
    picks[qi] = +b.dataset.k;
    [...$("#qzOpts").children].forEach((x) => x.classList.toggle("sel", x === b));
    $("#qzNext").disabled = false;
    fxBurst(b, 10);
  });
  $("#qzNext").addEventListener("click", () => {
    if (mode === "name") { if (!nameIn.value.trim()) { nameIn.focus(); return; } nameIn.blur(); qi = 0; renderQ(true); return; }
    if (mode === "note") { submitQuiz(); return; }
    if (picks[qi] === null) return;
    qi++; renderQ(true);
  });
  $("#qzPrev").addEventListener("click", () => { if (qi > 0) { qi--; renderQ(true); } else if (qi === 0) { qi = -1; renderQ(true); } });

  // ---- save the answers (Google Sheet via Apps Script, plus a copy on this device) ----
  function submitQuiz() {
    const score = QS.reduce((s, q, k) => s + (picks[k] === q.answer ? 1 : 0), 0);
    const rec = {
      time: new Date().toISOString(),
      name: nameIn.value.trim().slice(0, 40),
      answers: QS.map((q, k) => (picks[k] === null ? "" : q.options[picks[k]].text)),
      correct: QS.map((q, k) => picks[k] === q.answer),
      score, total: QS.length,
      message: msgIn.value.trim().slice(0, 300),
    };
    try { const all = JSON.parse(localStorage.getItem("quizAnswers") || "[]"); all.push(rec); localStorage.setItem("quizAnswers", JSON.stringify(all)); } catch (e) {}
    if (C.quizEndpoint) {
      fetch(C.quizEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(rec) }).catch(() => {});
    }
    showResult(score);
  }

  function showResult(score) {
    set("qzScore", mmd(`${score} / ${QS.length}`));
    const R = QZ.results || {};
    const name = nameIn.value.trim();
    set("qzResT", score === QS.length ? (R.perfect || "You know us perfectly!") : score >= QS.length - 1 ? (R.great || "You really know us!") : score >= QS.length / 2 ? (R.good || "Not bad at all!") : (R.low || "Come celebrate and get to know us!"));
    if (name) $("#qzResT").textContent = `${name}၊ ${$("#qzResT").textContent}`;
    $("#qzResImg").src = QZ.resultPhoto || QS[0].photo;
    qz.classList.add("result");
    set("qzTitle", "Quiz Result");
    confetti();
  }
  $("#qzAgain").addEventListener("click", () => { picks.fill(null); qi = -1; msgIn.value = ""; set("qzCnt", mmd("0 / 300")); qz.classList.remove("result"); set("qzTitle", "Fun Quiz"); renderQ(true); });
  $("#qzHome").addEventListener("click", () => (history.state && history.state.p === "quiz" ? history.back() : closeQuiz()));

  // petals + gold confetti
  const fxc = $("#qzFx"), fg = fxc.getContext("2d");
  let fxp = [], fxOn = false;
  function fxSize() { const r = fxc.getBoundingClientRect(), dp = Math.min(devicePixelRatio || 1, 2); fxc.width = r.width * dp; fxc.height = r.height * dp; fg.setTransform(dp, 0, 0, dp, 0, 0); }
  function fxLoop() {
    const r = fxc.getBoundingClientRect(); fg.clearRect(0, 0, r.width, r.height);
    fxp = fxp.filter((p) => {
      p.vy += 0.12; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      fg.save(); fg.translate(p.x, p.y); fg.rotate(p.r); fg.globalAlpha = Math.min(1, p.life / 40);
      fg.fillStyle = p.c;
      if (p.petal) { fg.beginPath(); fg.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 7); fg.fill(); } else fg.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      fg.restore();
      return p.life > 0 && p.y < r.height + 20;
    });
    if (fxp.length) requestAnimationFrame(fxLoop); else fxOn = false;
  }
  function fxAdd(x, y, n, spread) {
    if (reduce) return;
    const cols = ["#f7d98c", "#fff3d0", "#f4b8c4", "#ffffff", "#e8c06a"];
    for (let i = 0; i < n; i++) fxp.push({ x, y, vx: (Math.random() - .5) * spread, vy: -Math.random() * spread * .9 - 2, r: Math.random() * 6, vr: (Math.random() - .5) * .3, s: 4 + Math.random() * 6, c: cols[(Math.random() * cols.length) | 0], petal: Math.random() < .5, life: 90 + Math.random() * 60 });
    if (!fxOn) { fxOn = true; fxSize(); requestAnimationFrame(fxLoop); }
  }
  function fxBurst(el, n) { const r = el.getBoundingClientRect(), c = fxc.getBoundingClientRect(); fxAdd(r.left - c.left + r.width / 2, r.top - c.top + r.height / 2, n, 6); }
  function confetti() { const c = fxc.getBoundingClientRect(); fxAdd(c.width * .3, c.height * .45, 60, 14); fxAdd(c.width * .7, c.height * .45, 60, 14); setTimeout(() => fxAdd(c.width / 2, c.height * .3, 70, 16), 350); }

  function openQuiz(push = true) {
    if (busy && push) return;
    busy = true; where = "quiz";
    picks.fill(null); qi = -1; qz.classList.remove("result"); set("qzTitle", "Fun Quiz"); renderQ(false);
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run fwd";
    setTimeout(() => { qz.classList.add("on"); qz.classList.remove("out"); qz.removeAttribute("aria-hidden"); restart(qz, "in"); }, reduce ? 0 : 900);
    setTimeout(() => { garden.classList.remove("toward", "on"); garden.setAttribute("aria-hidden", "true"); walk.className = "walk"; busy = false; }, reduce ? 50 : 2300);
    if (push) history.pushState({ p: "quiz" }, "", "#quiz");
  }
  function closeQuiz() {
    if (busy) return;
    busy = true;
    qz.classList.add("out");
    walk.className = "walk"; void walk.offsetWidth; walk.className = "walk run bwd";
    setTimeout(() => { garden.classList.add("on"); garden.removeAttribute("aria-hidden"); restart(garden, "arrive"); }, reduce ? 0 : 700);
    setTimeout(() => { qz.classList.remove("on", "in", "out", "result"); qz.setAttribute("aria-hidden", "true"); garden.classList.remove("arrive"); walk.className = "walk"; where = "garden"; busy = false; }, reduce ? 50 : 2600);
  }
  $("#qzBack").addEventListener("click", () => (history.state && history.state.p === "quiz" ? history.back() : closeQuiz()));
  window.__openQuiz = openQuiz;
  window.__closeQuiz = closeQuiz;
  if (QS.length) renderQ(false);




  /* ============================================================
     THANK YOU — reached by walking down the garden path
  ============================================================ */
  const TY = C.thanks || {};
  const ty = $("#ty");
  set("tyL1", TY.line1); set("tyL2", TY.line2); set("tyL3", TY.line3);
  // glowing footprints walking up the stepping stones + a little sign
  const gw = $("#gWorld");
  const STEPS = [[47, 92, -8], [53, 87, 6], [46, 82, -6], [51, 77.5, 8], [44, 73.5, -4], [49, 69.5, 6], [42, 66, -2], [46, 62.5, 4]];
  const FOOT = '<svg viewBox="0 0 20 32"><ellipse cx="10" cy="19" rx="7" ry="11" fill="#fff4d6"/><circle cx="4" cy="5" r="2.3" fill="#fff4d6"/><circle cx="8.5" cy="3" r="2.4" fill="#fff4d6"/><circle cx="13" cy="3.6" r="2.2" fill="#fff4d6"/><circle cx="16.6" cy="6.4" r="1.9" fill="#fff4d6"/></svg>';
  gw.insertAdjacentHTML("beforeend",
    STEPS.map((s, i) => `<span class="fp" style="left:${s[0]}%;top:${s[1]}%;--t:rotate(${s[2]}deg) ${i % 2 ? "scaleX(-1)" : ""};animation-delay:${i * 0.35}s">${FOOT}</span>`).join("") +
    `<button class="path-go" type="button" id="pathGo" aria-label="${TY.tag || "Thank you"}"></button>`);
  // a little red arrow sign-post beside the path — the way out to the Thank-You page
  gw.insertAdjacentHTML("beforeend", `<button class="exit-sign" type="button" id="exitSign" aria-label="${TY.tag || "Thank you"}">
      <svg viewBox="0 0 120 150" aria-hidden="true">
        <rect x="56" y="40" width="8" height="108" rx="2" fill="#5b3a1c"/><rect x="57" y="40" width="3" height="108" fill="#7a5230"/>
        <g class="exit-arrow">
          <path d="M12 30 L34 8 H110 V52 H34 Z" fill="#b32d26" stroke="#f2d48f" stroke-width="3" stroke-linejoin="round"/>
          <path d="M17 30 L36 12 H105 V48 H36 Z" fill="none" stroke="rgba(255,230,200,.35)" stroke-width="1.5"/>
          <text x="70" y="36" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="17" fill="#fff3dc">${TY.sign || "This way"}</text>
        </g>
      </svg>
    </button>`);
  $("#gStage").insertAdjacentHTML("beforeend", '<span class="path-tag" id="pathTag" hidden></span>');
  // keep the sign over the path even though the art is right-anchored on phones
  function placeTag() {
    const st = $("#gStage").getBoundingClientRect(), r = $("#pathGo").getBoundingClientRect();
    const t = $("#pathTag");
    const half = t.offsetWidth / 2 + 12;
    t.style.left = `${Math.min(st.width - half, Math.max(half, r.left - st.left + r.width * .5))}px`;
    t.style.top = `${r.top - st.top + r.height * .32}px`;
  }
  addEventListener("resize", placeTag);
  const flash = Object.assign(document.createElement("div"), { className: "ty-flash" });
  document.body.appendChild(flash);

  function openThanks(push = true) {
    if (busy && push) return;
    busy = true; where = "thanks";
    restart(garden, "walkin");                       // walk down the path (no butterflies here)
    setTimeout(() => { flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on"); }, reduce ? 0 : 1700);
    setTimeout(() => { ty.classList.add("on"); ty.classList.remove("out"); ty.removeAttribute("aria-hidden"); restart(ty, "in"); }, reduce ? 0 : 2350);
    setTimeout(() => {
      garden.classList.remove("on", "walkin"); garden.setAttribute("aria-hidden", "true");
      busy = false;
    }, reduce ? 50 : 2900);
    if (push) history.pushState({ p: "thanks" }, "", "#thanks");
  }
  function closeThanks() {
    if (busy) return;
    busy = true;
    ty.classList.add("out");
    setTimeout(() => { garden.classList.add("on"); garden.removeAttribute("aria-hidden"); restart(garden, "arrive", "in"); }, reduce ? 0 : 500);
    setTimeout(() => {
      ty.classList.remove("on", "in", "out"); ty.setAttribute("aria-hidden", "true");
      garden.classList.remove("arrive"); where = "garden"; busy = false; placeTag();
    }, reduce ? 50 : 2400);
  }
  $("#pathGo").addEventListener("click", () => { if (where === "garden") openThanks(); });
  $("#exitSign").addEventListener("click", () => { if (where === "garden") openThanks(); });
  $("#tyBack").addEventListener("click", () => (history.state && history.state.p === "thanks" ? history.back() : closeThanks()));
  window.__openThanks = openThanks;
  window.__closeThanks = closeThanks;
  new MutationObserver(() => { if (garden.classList.contains("on")) requestAnimationFrame(placeTag); }).observe(garden, { attributes: true, attributeFilter: ["class"] });
  requestAnimationFrame(placeTag);

  /* ============================================================
     BUTTERFLY RIVER — ~1000 butterflies sweep across the screen in
     swirling waves; the page changes behind them
  ============================================================ */
  (function () {
    const cv2 = Object.assign(document.createElement("canvas"), { className: "bf-river" });
    cv2.setAttribute("aria-hidden", "true");
    const ctx = cv2.getContext("2d");
    const COLS = ["#fff8e6", "#f9e6b8", "#f3d48f", "#ffffff", "#f6dca6", "#ead0a0"];
    let raf = null;
    function river(back) {
      if (reduce) return;
      if (!cv2.isConnected) document.body.appendChild(cv2);
      const dpr = Math.min(devicePixelRatio || 1, 1.5), W = innerWidth, H = innerHeight;
      cv2.width = W * dpr; cv2.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const N = W < 600 ? 750 : 1000;
      const dir = back ? -1 : 1;
      const bs = [];
      for (let i = 0; i < N; i++) {
        // a river band that sweeps across, with each butterfly looping around its own little circle
        bs.push({
          d: Math.random() * 900,                    // start delay (ms)
          T: 1100 + Math.random() * 700,             // crossing time
          y: H * (0.05 + Math.random() * 0.9),
          amp: 30 + Math.random() * H * 0.12,        // big wave
          waves: 0.6 + Math.random() * 1.2,
          ph: Math.random() * Math.PI * 2,
          loopR: 10 + Math.random() * 45,            // little swirl
          loops: 1 + Math.random() * 2.5,
          s: 6 + Math.random() * 9,
          flap: 0.025 + Math.random() * 0.03,
          c: COLS[(Math.random() * COLS.length) | 0],
          a: 0.55 + Math.random() * 0.45,
        });
      }
      const t0 = performance.now(), END = 900 + 1800 + 100;
      cancelAnimationFrame(raf);
      function frame(now) {
        const t = now - t0;
        ctx.clearRect(0, 0, W, H);
        for (const b of bs) {
          const p = (t - b.d) / b.T;
          if (p <= 0 || p >= 1) continue;
          const e = p * p * (3 - 2 * p);               // smoothstep
          let x = -80 + (W + 160) * e;
          if (dir < 0) x = W - x;
          const th = p * Math.PI * 2 * b.loops + b.ph;
          const y = b.y + Math.sin(e * Math.PI * 2 * b.waves + b.ph) * b.amp + Math.sin(th) * b.loopR;
          x += Math.cos(th) * b.loopR * dir;
          const ang = Math.atan2(Math.cos(e * Math.PI * 2 * b.waves + b.ph) * b.amp * 0.02 + Math.cos(th) * 0.3, dir) * 0.6;
          const fl = 0.25 + 0.75 * Math.abs(Math.sin(now * b.flap + b.ph));
          const fade = p < 0.12 ? p / 0.12 : p > 0.85 ? (1 - p) / 0.15 : 1;
          ctx.save();
          ctx.translate(x, y); ctx.rotate(ang);
          ctx.globalAlpha = b.a * fade;
          ctx.fillStyle = b.c;
          const s = b.s;
          ctx.beginPath(); ctx.ellipse(-s * 0.55 * fl, -s * 0.35, s * 0.62 * fl, s * 0.8, -0.5, 0, 6.283); ctx.fill();
          ctx.beginPath(); ctx.ellipse(s * 0.55 * fl, -s * 0.35, s * 0.62 * fl, s * 0.8, 0.5, 0, 6.283); ctx.fill();
          ctx.beginPath(); ctx.ellipse(-s * 0.4 * fl, s * 0.45, s * 0.42 * fl, s * 0.5, 0.4, 0, 6.283); ctx.fill();
          ctx.beginPath(); ctx.ellipse(s * 0.4 * fl, s * 0.45, s * 0.42 * fl, s * 0.5, -0.4, 0, 6.283); ctx.fill();
          ctx.fillStyle = "rgba(120, 84, 30, .8)";
          ctx.fillRect(-s * 0.06, -s * 0.6, s * 0.12, s * 1.3);
          ctx.restore();
        }
        if (t < END) raf = requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
      }
      raf = requestAnimationFrame(frame);
    }
    new MutationObserver(() => {
      if (walk.classList.contains("run")) river(walk.classList.contains("bwd"));
    }).observe(walk, { attributes: true, attributeFilter: ["class"] });
  })();

  // preview helper: en/?garden  ·  en/?gallery
  // signature line: visible once the guest is inside (hidden on the opening card and the Thank-You page)
  {
    const sig = $("#sig");
    const upd = () => sig.classList.toggle("show", hero.classList.contains("leaving") && !ty.classList.contains("on") && !garden.classList.contains("walkin"));
    const mo = new MutationObserver(upd);
    [hero, ty, garden].forEach((el) => mo.observe(el, { attributes: true, attributeFilter: ["class"] }));
    setTimeout(upd, 0);
  }
  if (/[?&]garden\b/.test(location.search)) { hero.classList.add("leaving", "away"); garden.classList.add("on", "in"); garden.removeAttribute("aria-hidden"); where = "garden"; }
  if (/[?&]gallery/.test(location.search)) { hero.classList.add("leaving", "away"); gal.classList.add("on", "in"); gal.removeAttribute("aria-hidden"); where = "gallery"; layout(); }
  if (/[?&]bigday/.test(location.search)) { hero.classList.add("leaving", "away"); bd.classList.add("on", "in"); bd.removeAttribute("aria-hidden"); where = "bigday"; }
  if (/[?&]story/.test(location.search)) { hero.classList.add("leaving", "away"); st.classList.add("on", "in"); st.removeAttribute("aria-hidden"); where = "story"; }
  if (/[?&]quiz/.test(location.search)) { hero.classList.add("leaving", "away"); qz.classList.add("on", "in"); qz.removeAttribute("aria-hidden"); where = "quiz"; }
  if (/[?&]thanks/.test(location.search)) { hero.classList.add("leaving", "away"); ty.classList.add("on", "in"); ty.removeAttribute("aria-hidden"); where = "thanks"; }
})();
