(() => {
  "use strict";
  const W = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const setText = (id, t) => { const el = document.getElementById(id); if (el && t != null) el.textContent = t; };

  /* ============================================================
     1. CONTENT
  ============================================================ */
  const I = W.intro || {}, H = W.home || {}, P2 = W.page2 || {};
  const groomShort = W.groom.short, brideShort = W.bride.short;
  setText("introTitle", I.title);
  setText("introSub", I.subtitle);
  setText("introKicker", I.kicker);
  setText("introBtn", I.button);
  setText("introGroom", groomShort);
  setText("introBride", brideShort);

  setText("homeTitle", H.title);
  setText("homeSub", H.subtitle);
  setText("homeGroom", groomShort);
  setText("homeBride", brideShort);
  setText("homeMsg", H.message);
  setText("homeBtn", H.button);
  setText("hcDay", H.cardDay);
  setText("hcDate", H.cardDate);
  setText("hcTime", H.cardTime);
  setText("hcTimeSub", H.cardTimeSub);
  setText("hcVenue", H.cardVenue);
  setText("hcCity", H.cardCity);

  setText("p2Title", P2.title);
  setText("p2Sub", P2.subtitle);
  setText("p2Groom", groomShort);
  setText("p2Bride", brideShort);
  setText("p2Msg", P2.message);
  setText("p2Date", P2.date);
  setText("p2Time", P2.time);
  setText("p2Venue", P2.venue);
  $$(".p2-btn").forEach((b, i) => {
    const cfg = (P2.buttons || [])[i] || {};
    b.querySelector(".pb-label").textContent = cfg.label || "";
    b.dataset.go = cfg.page || "";
    b.setAttribute("aria-label", cfg.label || "");
  });

  // ---- pages 3–5 : shared chrome (title, tabs, arrows, dots) ----
  const TABS = W.tabs || { items: [] };
  const TAB_PAGES = TABS.items.map((t) => t.page);
  $$(".tabpage").forEach((page) => {
    const idx = +page.dataset.tab;
    const name = page.dataset.page;
    const withArrows = name !== "p6";               // gallery artwork has no bottom arrows
    const SEQ = ["p2", "p3", "p4", "p5", "p6"];       // ‹ › arrows walk the pages in order
    const prev = SEQ[SEQ.indexOf(name) - 1];
    const next = SEQ[SEQ.indexOf(name) + 1];
    page.querySelector(".tp-chrome").outerHTML = `
      ${TABS.items.map((t, i) => `<button class="tp-tab tp-t${i}${i === idx ? " on" : ""}" type="button" data-go="${t.page}">${t.label}</button>`).join("")}
      ${withArrows ? `
        <button class="tp-arrow tp-prev" type="button" data-go="${prev}" aria-label="ရှေ့ စာမျက်နှာ"></button>
        <button class="tp-arrow tp-next" type="button" data-go="${next || ""}" aria-label="နောက် စာမျက်နှာ"></button>
        <div class="tp-dots">${TABS.items.map((t, i) => `<button type="button" class="${i === idx ? "on" : ""}" data-go="${t.page}" aria-label="${t.label}"></button>`).join("")}</div>` : ""}`;
  });

  const P3 = W.page3 || {}, P4 = W.page4 || {}, P5 = W.page5 || {};
  setText("p3Title", P3.title);
  setText("p3Msg", P3.message);
  setText("p3Groom", groomShort);
  setText("p3Bride", brideShort);
  setText("p3Date", P3.date);
  setText("p3Time", P3.time);
  setText("p3Venue", P3.venue);
  setText("p3Btn", P3.button);

  setText("p4Title", P4.title);
  const ROW_TOP = [31.61, 39.39, 47.05, 54.77, 62.49];   // % of artwork height (5 drawn rows)
  $("#p4List").innerHTML = (P4.items || []).slice(0, 5).map((it, i) => `
    <li class="p4-item" style="top:${ROW_TOP[i]}%;animation-delay:calc(var(--d) + ${0.6 + i * 0.28}s)">
      <span class="p4-ring" style="animation-delay:calc(var(--d) + ${0.55 + i * 0.28}s)"></span>
      <span class="p4-text"><span class="p4-time"></span><span class="p4-desc"></span></span>
    </li>`).join("");
  $$("#p4List .p4-item").forEach((li, i) => {
    li.querySelector(".p4-time").textContent = P4.items[i].time;
    li.querySelector(".p4-desc").textContent = P4.items[i].title;
  });

  const q = encodeURIComponent(P5.mapQuery || "");
  const mapSearch = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const mapDir = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  setText("p5Title", P5.title);
  setText("p5Addr", P5.address);
  setText("p5DirLabel", P5.dirLabel);
  setText("p5GmapLabel", P5.mapLabel);
  $("#p5Dir").href = mapDir;
  $("#p5Map").href = mapDir;
  $("#p5Gmap").href = mapSearch;
  $("#p5Photo").href = mapSearch;

  const P6 = W.page6 || {}, P7 = W.page7 || {}, P8 = W.page8 || {};
  setText("p6Title", P6.title);
  setText("p6NextLabel", P6.next);
  setText("p7Head", P7.head);
  setText("p7Title", P7.title);
  setText("p7Msg", P7.message);
  setText("p7NextLabel", P7.next);
  setText("p8Main", P8.main);
  setText("p8HomeLabel", P8.home);
  setText("p8Kicker", P8.kicker);
  setText("p8Groom", groomShort);
  setText("p8Bride", brideShort);

  /* ============================================================
     2. MUSIC (mp3 → fallback to a soft synthesized melody)
  ============================================================ */
  const audio = $("#bgm");
  let audioCtx = null, synth = null, musicMode = null, musicOn = false, userPaused = false;

  function setMusicUI(on) {
    musicOn = on;
    $$("[data-music]").forEach((b) => { b.classList.toggle("playing", on); b.setAttribute("aria-pressed", String(on)); });
  }
  function startMusic() {
    if (!W.music) return;               // no song yet
    // AudioContext must be created inside the user gesture (iOS)
    try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    audio.src = W.music;
    audio.volume = 0;
    const p = audio.play();
    if (p && p.then) {
      p.then(() => { musicMode = "file"; fadeAudio(MUSIC_VOL, 2500); setMusicUI(true); }).catch(() => startSynth());
    } else { musicMode = "file"; audio.volume = 0.7; setMusicUI(true); }
  }
  audio.addEventListener("error", () => { if (musicMode !== "synth" && !userPaused && audio.getAttribute("src")) startSynth(); });
  const MUSIC_VOL = 0.7;
  let fadeToken = 0, fadedOut = false;
  function fadeAudio(target, ms = 1500, done) {
    const token = ++fadeToken, from = audio.volume, t0 = performance.now();
    const step = (t) => {
      if (token !== fadeToken) return;                  // a newer fade took over
      const k = Math.min(1, (t - t0) / ms);
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * k));
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    };
    requestAnimationFrame(step);
  }
  // doors close → music slowly dies away; leaving the closed gate → it comes back
  function musicFadeOut(ms) {
    if (musicMode !== "file" || audio.paused) return;
    fadedOut = true;
    fadeAudio(0, ms, () => { if (fadedOut) audio.pause(); });
  }
  function musicFadeIn() {
    if (!fadedOut || musicMode !== "file" || userPaused) return;
    fadedOut = false;
    audio.play().then(() => fadeAudio(MUSIC_VOL, 2500)).catch(() => {});
  }
  function startSynth() {
    if (!audioCtx) return;
    musicMode = "synth";
    audio.removeAttribute("src");
    if (!synth) synth = createSynth(audioCtx);
    synth.start();
    setMusicUI(true);
  }
  function toggleMusic() {
    if (musicOn) {
      userPaused = true;
      if (musicMode === "file") audio.pause();
      if (musicMode === "synth" && audioCtx) audioCtx.suspend();
      setMusicUI(false);
    } else {
      userPaused = false;
      if (musicMode === "file") audio.play().then(() => setMusicUI(true)).catch(() => startSynth());
      else if (musicMode === "synth" && audioCtx) { audioCtx.resume(); setMusicUI(true); }
      else startMusic();
    }
  }
  $$("[data-music]").forEach((b) => b.addEventListener("click", toggleMusic));
  document.addEventListener("visibilitychange", () => {
    if (!musicMode || userPaused || fadedOut) return;
    if (document.hidden) { if (musicMode === "file") audio.pause(); else audioCtx && audioCtx.suspend(); }
    else { if (musicMode === "file") audio.play().catch(() => {}); else audioCtx && audioCtx.resume(); }
  });

  function createSynth(ctx) {
    const master = ctx.createGain(); master.gain.value = 0;
    const delay = ctx.createDelay(); delay.delayTime.value = 0.34;
    const fb = ctx.createGain(); fb.gain.value = 0.32;
    const wet = ctx.createGain(); wet.gain.value = 0.35;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    master.connect(ctx.destination);
    const N = { C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A3: 220.0, G3: 196.0, C3: 130.81, F3: 174.61 };
    const melody = [
      ["E5", 1], ["D5", .5], ["C5", .5], ["A4", 1], ["G4", 1], ["A4", .5], ["C5", .5], ["D5", 1], ["E5", 2],
      ["G5", 1], ["E5", .5], ["D5", .5], ["C5", 1], ["A4", 1], ["G4", .5], ["A4", .5], ["C5", 1], ["D5", 2],
      ["E5", 1], ["G5", .5], ["E5", .5], ["D5", 1], ["C5", 1], ["A4", .5], ["G4", .5], ["E4", 1], ["G4", 2],
      ["A4", 1], ["C5", .5], ["A4", .5], ["G4", 1], ["E4", 1], ["D4", .5], ["E4", .5], ["G4", 1], ["C5", 2],
    ];
    const bass = ["C3", "A3", "F3", "G3"];
    const beat = 0.42;
    let i = 0, nextT = 0, bar = 0, beatsInBar = 0, timer = null;
    function pluck(freq, t, dur, vol, type = "triangle") {
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain();
      o.type = type; o.frequency.value = freq; o2.type = "sine"; o2.frequency.value = freq * 2.001; g2.gain.value = 0.25;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(master); g.connect(delay);
      o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
    }
    function schedule() {
      while (nextT < ctx.currentTime + 0.3) {
        const [note, len] = melody[i];
        pluck(N[note], nextT, Math.max(1.2, len * beat * 2.4), 0.16);
        if (beatsInBar === 0) { const b = N[bass[bar % bass.length]]; pluck(b, nextT, 3.2, 0.12, "sine"); pluck(b * 1.5, nextT + beat, 2.4, 0.05, "sine"); }
        beatsInBar += len; if (beatsInBar >= 4) { beatsInBar = 0; bar++; }
        nextT += len * beat; i = (i + 1) % melody.length;
      }
    }
    return {
      start() {
        if (timer) return;
        nextT = ctx.currentTime + 0.1;
        master.gain.setValueAtTime(0, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2.5);
        schedule(); timer = setInterval(schedule, 100);
      },
    };
  }

  /* ============================================================
     3. PETALS / GOLD DUST CANVAS
  ============================================================ */
  const canvas = $("#petals");
  const g2d = canvas.getContext("2d");
  let cw = 0, ch = 0, particles = [], petalsRunning = false;
  const GOLDS = ["#ffd23f", "#f7c21b", "#ffcf2e", "#f2b40f"];
  const PINKS = ["#f9c9d2", "#f4a9b8", "#fde3e8", "#f7b8c4"];
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = innerWidth; ch = innerHeight;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    g2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", resize);
  resize();

  function makeParticle(burst, bx, by) {
    const type = Math.random() < 0.4 ? "petal" : Math.random() < 0.5 ? "spark" : "flower";
    return {
      type, burst,
      x: burst ? bx + rand(-12, 12) : rand(0, cw),
      y: burst ? by + rand(-12, 12) : rand(-ch * 0.2, -20),
      size: type === "spark" ? rand(1.2, 3) : rand(5, 10),
      vx: burst ? rand(-7, 7) : rand(-0.3, 0.3),
      vy: burst ? rand(-9, 2) : rand(0.5, 1.3),
      rot: rand(0, Math.PI * 2), vr: rand(-0.03, 0.03),
      sway: rand(0.5, 1.6), phase: rand(0, Math.PI * 2),
      color: type === "petal" ? PINKS[(Math.random() * 4) | 0] : GOLDS[(Math.random() * 4) | 0],
      life: 0,
    };
  }
  function drawFlower(p) {
    g2d.save(); g2d.translate(p.x, p.y); g2d.rotate(p.rot);
    const s = p.size; g2d.fillStyle = p.color;
    for (let k = 0; k < 4; k++) { g2d.rotate(Math.PI / 2); g2d.beginPath(); g2d.ellipse(0, -s * 0.55, s * 0.38, s * 0.6, 0, 0, Math.PI * 2); g2d.fill(); }
    g2d.fillStyle = "#e08a00"; g2d.beginPath(); g2d.arc(0, 0, s * 0.22, 0, Math.PI * 2); g2d.fill();
    g2d.restore();
  }
  function drawPetal(p) {
    g2d.save(); g2d.translate(p.x, p.y); g2d.rotate(p.rot);
    g2d.scale(1, Math.abs(Math.sin(p.phase + p.life * 0.05)) * 0.7 + 0.3);
    g2d.fillStyle = p.color; g2d.globalAlpha = 0.92;
    g2d.beginPath(); g2d.moveTo(0, -p.size); g2d.quadraticCurveTo(p.size * 0.8, 0, 0, p.size); g2d.quadraticCurveTo(-p.size * 0.8, 0, 0, -p.size); g2d.fill();
    g2d.restore();
  }
  function drawSpark(p) {
    g2d.save(); g2d.translate(p.x, p.y);
    g2d.globalAlpha = 0.5 + 0.5 * Math.sin(p.phase + p.life * 0.15);
    g2d.fillStyle = "#fff1b8"; g2d.shadowColor = "#ffd77a"; g2d.shadowBlur = 8;
    const s = p.size;
    g2d.beginPath();
    g2d.moveTo(0, -s * 2.4); g2d.lineTo(s * 0.5, 0); g2d.lineTo(0, s * 2.4); g2d.lineTo(-s * 0.5, 0); g2d.closePath();
    g2d.moveTo(-s * 2.4, 0); g2d.lineTo(0, s * 0.5); g2d.lineTo(s * 2.4, 0); g2d.lineTo(0, -s * 0.5); g2d.closePath();
    g2d.fill(); g2d.restore();
  }
  function tick() {
    if (!petalsRunning) return;
    g2d.clearRect(0, 0, cw, ch);
    const target = cw < 600 ? 22 : 36;
    if (particles.filter((p) => !p.burst).length < target && Math.random() < 0.12) particles.push(makeParticle(false));
    particles = particles.filter((p) => {
      p.life++;
      if (p.burst) { p.vy += 0.18; p.vx *= 0.985; p.vy *= 0.985; }
      p.x += p.vx + (p.burst ? 0 : Math.sin(p.phase + p.life * 0.02) * p.sway * 0.6);
      p.y += p.vy; p.rot += p.vr;
      if (p.type === "flower") drawFlower(p); else if (p.type === "petal") drawPetal(p); else drawSpark(p);
      return p.y < ch + 30 && p.x > -60 && p.x < cw + 60;
    });
    requestAnimationFrame(tick);
  }
  function startPetals() { if (reduceMotion || petalsRunning) return; petalsRunning = true; requestAnimationFrame(tick); }
  function burst(x, y, n) {
    if (reduceMotion) return;
    const count = n || (cw < 600 ? 40 : 60);
    for (let k = 0; k < count; k++) particles.push(makeParticle(true, x, y));
    startPetals();
  }
  startPetals();

  // a gust of petals blowing across the screen (page turns)
  function gust(reverse) {
    if (reduceMotion) return;
    for (let k = 0; k < (cw < 600 ? 34 : 50); k++) {
      const p = makeParticle(true, reverse ? -20 : cw + 20, rand(0, ch));
      p.vx = (reverse ? 1 : -1) * rand(7, 14); p.vy = rand(-3, 1);
      particles.push(p);
    }
    startPetals();
  }

  /* ============================================================
     4. BUTTERFLIES (reusable for any stage)
  ============================================================ */
  function createButterflies(stage, count) {
    const wrap = stage && stage.querySelector(".butterflies");
    if (reduceMotion || !wrap) return { flyAway() {}, stop() {}, start() {} };
    const svg = `<svg viewBox="-50 -40 100 80">${$("#butterfly").innerHTML}</svg>`;
    const bfs = [];
    let raf = null, leaving = false, last = 0;
    for (let k = 0; k < count; k++) {
      const el = document.createElement("span");
      el.className = "bf"; el.innerHTML = svg;
      el.querySelectorAll(".wing").forEach((w) => { w.style.animationDuration = `${rand(0.16, 0.28)}s`; w.style.animationDelay = `${-rand(0, 0.3)}s`; });
      wrap.appendChild(el);
      bfs.push({ el, x: rand(15, 85), y: rand(20, 70), tx: rand(10, 90), ty: rand(15, 75), vx: 0, vy: 0, s: rand(0.6, 1.1), speed: rand(5, 9) });
    }
    function frame(t) {
      const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
      const w = stage.clientWidth, h = stage.clientHeight || 1;
      for (const b of bfs) {
        const dx = b.tx - b.x, dy = (b.ty - b.y) * (w / h);
        const dist = Math.hypot(dx, dy);
        if (!leaving && dist < 4) { b.tx = rand(8, 92); b.ty = rand(12, 80); }
        const sp = leaving ? b.speed * 6 : b.speed;
        b.vx += ((dx / (dist || 1)) * sp - b.vx) * dt * 1.6 + Math.sin(t / 180 + b.s * 9) * dt * 6;
        b.vy += ((dy / (dist || 1)) * sp - b.vy) * dt * 1.6 + Math.cos(t / 210 + b.s * 7) * dt * 6;
        b.x += b.vx * dt;
        b.y += b.vy * dt * (w / h) * 0.6;
        const ang = (Math.atan2(b.vy, b.vx) * 180) / Math.PI + 90;
        const sc = b.s * (leaving ? 1.8 : 1) + Math.sin(t / 160 + b.s * 5) * 0.08;
        b.el.style.transform = `translate(${(b.x / 100) * w}px, ${(b.y / 100) * h}px) translate(-50%, -50%) rotate(${ang * 0.35}deg) scale(${sc})`;
      }
      raf = requestAnimationFrame(frame);
    }
    const api = {
      start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } },
      stop() { if (raf) cancelAnimationFrame(raf); raf = null; },
      flyAway() {
        leaving = true;
        bfs.forEach((b) => { const a = Math.atan2(b.y - 45, b.x - 50); b.tx = 50 + Math.cos(a) * 160; b.ty = 45 + Math.sin(a) * 160; });
      },
    };
    api.start();
    return api;
  }

  /* ============================================================
     5. INTRO — open the golden gate
  ============================================================ */
  const intro = $("#intro");
  const app = $("#app");
  const homePage = $('[data-page="home"]');
  const gateFlies = createButterflies($("#gateStage"), 6);
  let opened = false;

  function showApp() {
    app.removeAttribute("aria-hidden");
    homePage.classList.add("home-in");
    if (!flies.home) flies.home = createButterflies($("#homeStage"), 4);
  }

  function openDoors() {
    if (opened) return;
    opened = true;
    startMusic();
    if (navigator.vibrate) navigator.vibrate([20, 40, 30]);
    intro.classList.add("opening");
    gateFlies.flyAway();
    // doors swing → camera walks through → golden flash → Page 1
    const T = reduceMotion ? [0, 0, 150, 300] : [1100, 2500, 3250, 3450];
    setTimeout(() => intro.classList.add("zoom"), T[0]);
    setTimeout(() => intro.classList.add("flashing"), T[1]);
    setTimeout(() => { showApp(); burst(innerWidth / 2, innerHeight * 0.45, cw < 600 ? 70 : 110); }, T[2]);
    setTimeout(() => {
      intro.classList.add("gone");
      setTimeout(() => { gateFlies.stop(); intro.remove(); }, 1100);
    }, T[3]);
  }
  $("#openBtn").addEventListener("click", openDoors);
  $("#doors").addEventListener("click", openDoors);

  /* ============================================================
     6. ROUTER — tap to travel between pages (no scrolling)
        Page 1 ⇄ Page 2      : the booklet page is turned (3D)
        Page 3 ⇄ 4 ⇄ 5 (tabs): the card rotates like a cube
        between those groups : silk curtains close & reopen
  ============================================================ */
  const pages = Object.fromEntries($$("[data-page]").map((p) => [p.dataset.page, p]));
  const BOOK = ["home", "p2"];
  const TABSET = TAB_PAGES.filter((n) => pages[n] && pages[n].classList.contains("tabpage"));
  const warp = $("#warp");
  const curtain = $("#curtain");
  const stack = ["home"];
  let current = "home";
  let busy = false;
  const flies = {};

  function originOf(el) {
    if (!el || !el.getBoundingClientRect) return { x: innerWidth / 2, y: innerHeight / 2 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function ringAt(x, y) {
    warp.style.left = `${x}px`; warp.style.top = `${y}px`;
    warp.classList.remove("go"); void warp.offsetWidth; warp.classList.add("go");
  }
  function settle(name) {
    current = name;
    if (name !== "p6" && typeof autoplay === "function") autoplay(false);
    if (name !== "p8") musicFadeIn();
    busy = false;
    Object.entries(flies).forEach(([k, f]) => (k === name ? f.start() : f.stop()));
  }
  // replay each page's choreography; --d = when the page becomes visible
  function enterFx(name, delay) {
    const p = pages[name];
    p.style.setProperty("--d", `${delay}s`);
    const cls = name === "home" ? null : `${name}-in`;
    if (cls) { p.classList.remove(cls); void p.offsetWidth; p.classList.add(cls); }
    if (!flies[name] && name !== "home") {
      const st = p.querySelector(".stage");
      if (st && st.querySelector(".butterflies")) flies[name] = createButterflies(st, name === "p4" ? 3 : 4);
    }
    if (name === "p2") setTimeout(() => sparkleAt(".p2-rings"), (delay + 1.9) * 1000);
    if (name === "p3") setTimeout(() => sparkleAt(".p3-heart"), (delay + 1.8) * 1000);
    if (name === "p5") setTimeout(() => sparkleAt(".p5-route", 0.485, 0.672), (delay + 2.6) * 1000);
    if (name === "p6") { autoplay(false); setTimeout(() => current === "p6" && autoplay(true), (delay + 3) * 1000); }
    if (name === "p8") {
      const st = p.querySelector(".art-stage");
      setTimeout(() => current === "p8" || busy ? musicFadeOut(5000) : 0, (delay + 0.6) * 1000);   // as the doors start to swing shut
      setTimeout(() => {               // the moment the two leaves meet
        st.classList.remove("shake"); void st.offsetWidth; st.classList.add("shake");
        if (navigator.vibrate) navigator.vibrate([35, 40, 70]);
        const s = p.querySelector(".p8-seam").getBoundingClientRect();
        burst(s.left + s.width / 2, s.bottom - 10, 50);
        burst(s.left + s.width / 2, s.top + s.height * 0.4, 30);
      }, (delay + 2.08) * 1000);
      setTimeout(() => sparkleAt(".p8-plaque"), (delay + 3.3) * 1000);
    }
  }
  function sparkleAt(sel, fx = 0.5, fy = 0.5) {
    const el = $(sel); if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width) burst(r.left + r.width * fx, r.top + r.height * fy, 22);
  }
  const inBook = (n) => BOOK.includes(n);
  const inTabs = (n) => TABSET.includes(n);

  // ---- ① page turn ----
  function turn(fromName, toName) {
    const from = pages[fromName], to = pages[toName];
    const D = reduceMotion ? 60 : 1300;
    app.className = "app pv-turn";
    if (BOOK.indexOf(toName) > BOOK.indexOf(fromName)) {
      to.classList.add("active", "turn-under");
      from.classList.add("turn-out");
      enterFx(toName, 0.2);
      gust();
      setTimeout(() => burst(innerWidth * 0.06, innerHeight * 0.5, 30), 150);
      setTimeout(() => { from.classList.remove("turn-out", "active"); to.classList.remove("turn-under"); settle(toName); }, D);
    } else {
      from.classList.add("turn-under", "dim");
      to.classList.add("active", "turn-in");
      enterFx(toName, 0.6);
      gust(true);
      setTimeout(() => { to.classList.remove("turn-in"); from.classList.remove("turn-under", "dim", "active"); settle(toName); }, D);
    }
  }

  // ---- ② cube between tabs ----
  function cube(fromName, toName) {
    const from = pages[fromName], to = pages[toName];
    const fwd = TABSET.indexOf(toName) > TABSET.indexOf(fromName);
    const s = fwd ? "l" : "r";
    const D = reduceMotion ? 60 : 850;
    app.className = "app pv-cube";
    to.classList.add("active", `cube-in-${s}`);
    from.classList.add(`cube-out-${s}`);
    enterFx(toName, 0.45);
    gust(!fwd);
    setTimeout(() => {
      to.classList.remove(`cube-in-${s}`);
      from.classList.remove(`cube-out-${s}`, "active");
      settle(toName);
    }, D);
  }

  // ---- ③ silk curtain between groups ----
  function curtainTo(fromName, toName) {
    const from = pages[fromName], to = pages[toName];
    if (reduceMotion) { from.classList.remove("active"); to.classList.add("active"); enterFx(toName, 0); settle(toName); return; }
    curtain.classList.remove("open"); curtain.classList.add("run");
    void curtain.offsetWidth;
    curtain.classList.add("close");
    setTimeout(() => {
      from.classList.remove("active");
      to.classList.add("active");
      enterFx(toName, 0.5);
      burst(innerWidth / 2, innerHeight / 2, 40);
    }, 700);
    setTimeout(() => { curtain.classList.add("open"); curtain.classList.remove("close"); gust(); }, 900);
    setTimeout(() => { curtain.classList.remove("open", "run"); settle(toName); }, 1850);
  }

  // ---- ④ light bloom / iris : full-screen overlay hides the swap ----
  const fx = $("#fx");
  function overlayFx(kind, fromName, toName, total, swapAt) {
    const from = pages[fromName], to = pages[toName];
    if (reduceMotion) { from.classList.remove("active"); to.classList.add("active"); enterFx(toName, 0); settle(toName); return; }
    fx.className = "fx"; void fx.offsetWidth; fx.className = "fx " + kind;
    if (kind === "bloom") burst(innerWidth / 2, innerHeight * 0.88, 40);
    setTimeout(() => {
      from.classList.remove("active");
      to.classList.add("active");
      enterFx(toName, (total - swapAt) / 1000 * 0.6);
    }, swapAt);
    setTimeout(() => { fx.className = "fx"; settle(toName); }, total);
  }

  // ---- ⑤ page 8 → home : the doors swing open again and we walk through ----
  function portalHome() {
    const p8 = pages.p8, home = pages.home;
    if (reduceMotion) { p8.classList.remove("active"); home.classList.add("active"); settle("home"); return; }
    p8.classList.add("reopen");
    musicFadeIn();                     // doors swing open again → the song returns
    gust(true);
    setTimeout(() => p8.classList.add("walk"), 500);
    setTimeout(() => { fx.className = "fx"; void fx.offsetWidth; fx.className = "fx white"; }, 1250);
    setTimeout(() => {
      p8.classList.remove("active", "reopen", "walk", "p8-in");
      home.classList.add("active");
      home.classList.remove("home-in"); void home.offsetWidth; home.classList.add("home-in");
      burst(innerWidth / 2, innerHeight * 0.45, 60);
    }, 1900);
    setTimeout(() => { fx.className = "fx"; settle("home"); }, 2950);
  }

  $("#p8Home").addEventListener("click", () => navigate("home"));

  function navigate(toName, fromEl, { push = true } = {}) {
    if (busy || !pages[toName] || toName === current) return;
    busy = true;
    if (navigator.vibrate) navigator.vibrate(12);
    const fromName = current;
    const tabHop = inTabs(fromName) && inTabs(toName);
    const pair = [fromName, toName].sort().join("-");
    if (inBook(fromName) && inBook(toName)) turn(fromName, toName);
    else if (tabHop) cube(fromName, toName);
    else if (pair === "p6-p7") overlayFx("bloom", fromName, toName, 1700, 720);
    else if (pair === "p7-p8") overlayFx("iris", fromName, toName, 1900, 900);
    else if (fromName === "p8" && toName === "home") portalHome();
    else curtainTo(fromName, toName);
    if (fromEl) { const o = originOf(fromEl); ringAt(o.x, o.y); }
    if (fromName === "p8" && toName === "home") { stack.length = 0; stack.push("home"); history.pushState({ page: "home" }, "", location.pathname + location.search); return; }
    if (!push) return;
    const url = toName === "home" ? location.pathname + location.search : `#${toName}`;
    if (tabHop) {                       // switching tabs replaces history: back leaves the tab group
      stack[stack.length - 1] = toName;
      history.replaceState({ page: toName }, "", url);
    } else {
      const at = stack.indexOf(toName);
      if (at >= 0) stack.length = at + 1; else stack.push(toName);
      history.pushState({ page: toName }, "", url);
    }
  }
  function back() {
    if (busy) return;
    if (stack.length < 2) { if (current !== "home") navigate(inTabs(current) ? "p2" : "home"); return; }
    history.back();                      // popstate plays the animation
  }
  addEventListener("popstate", (e) => {
    if (!opened) return;
    const target = (e.state && e.state.page) || "home";
    if (target === current || !pages[target]) return;
    const at = stack.indexOf(target);
    if (at >= 0) stack.length = at + 1; else stack.push(target);
    busy = false;
    navigate(target, null, { push: false });
  });

  // pages that are designed later — show a gentle "coming soon"
  function comingSoon(btn) {
    btn.classList.remove("pressed"); void btn.offsetWidth; btn.classList.add("pressed");
    const o = originOf(btn);
    burst(o.x, o.y, 18);
    toast("✨ မကြာမီ ထည့်သွင်းပါမည်");
  }

  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]");
    if (g) {
      const name = g.dataset.go;
      if (menu.classList.contains("open")) {
        closeMenu();
        if (pages[name]) setTimeout(() => navigate(name, null), 420);
        return;
      }
      if (!name) return;
      if (pages[name]) navigate(name, g); else comingSoon(g);
      return;
    }
    if (e.target.closest("[data-back]")) back();
  });

  // swipe left / right on the tab pages
  $$(".tabpage").forEach((p) => {
    let sx = null, sy = 0;
    p.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    p.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
      const i = TABSET.indexOf(current);
      if (dx < 0 && TABSET[i + 1]) navigate(TABSET[i + 1]);
      if (dx > 0) navigate(i > 0 ? TABSET[i - 1] : "p2");
    });
  });

  /* ============================================================
     6b. PAGE 6 — GALLERY (main photo, thumbnails, swipe, autoplay)
  ============================================================ */
  const photos = (P6.photos || []).filter(Boolean);
  const gv = $("#gv"), gvCur = $("#gv .cur"), gvNxt = $("#gv .nxt"), gvDots = $("#gvDots"), gvThumbs = $("#gvThumbs");
  const PER = 6;
  let gi = 0, gvBusy = false, gvTimer = null, gvPage = -1;
  photos.forEach((src) => { const im = new Image(); im.src = src; });   // preload

  function renderThumbs(force) {
    const page = Math.floor(gi / PER), pages = Math.ceil(photos.length / PER);
    if (page !== gvPage || force) {
      gvPage = page;
      gvThumbs.innerHTML = Array.from({ length: PER }, (_, k) => {
        const i = page * PER + k;
        return i < photos.length
          ? `<button class="gv-th" type="button" data-gi="${i}" aria-label="ဓာတ်ပုံ ${i + 1}"><img src="${photos[i]}" alt=""></button>`
          : `<span class="gv-th empty"></span>`;
      }).join("");
      gvThumbs.classList.remove("flip"); void gvThumbs.offsetWidth; gvThumbs.classList.add("flip");
      gvDots.innerHTML = pages > 1
        ? Array.from({ length: pages }, (_, p) => `<button type="button" data-gp="${p}" class="${p === page ? "on" : ""}" aria-label="ဓာတ်ပုံ အုပ်စု ${p + 1}"></button>`).join("")
        : "";
    }
    $$(".gv-th", gvThumbs).forEach((t) => t.classList.toggle("on", +t.dataset.gi === gi));
  }
  function showPhoto(i, dir) {
    if (!photos.length || gvBusy) return;
    i = (i + photos.length) % photos.length;
    if (i === gi) return;
    gvBusy = true;
    const d = dir || (i > gi ? 1 : -1);
    gi = i;
    gvNxt.src = photos[gi];
    gvNxt.className = `gv-img nxt ${d > 0 ? "go-r" : "go-l"}`;
    const r = gv.getBoundingClientRect();
    burst(d > 0 ? r.right - 20 : r.left + 20, r.top + r.height / 2, 16);
    renderThumbs();
    setTimeout(() => {
      gvCur.src = photos[gi];
      gvNxt.className = "gv-img nxt";
      gvBusy = false;
    }, reduceMotion ? 30 : 1000);
  }
  function autoplay(on) {
    clearInterval(gvTimer);
    if (on && photos.length > 1 && !reduceMotion) gvTimer = setInterval(() => showPhoto(gi + 1, 1), 4800);
  }
  function userNav(fn) { fn(); autoplay(false); clearTimeout(userNav.t); userNav.t = setTimeout(() => current === "p6" && autoplay(true), 9000); }
  if (photos.length) { gvCur.src = photos[0]; renderThumbs(true); }
  $(".gv-prev").addEventListener("click", () => userNav(() => showPhoto(gi - 1, -1)));
  $(".gv-next").addEventListener("click", () => userNav(() => showPhoto(gi + 1, 1)));
  gvDots.addEventListener("click", (e) => { const d = e.target.closest("[data-gp]"); if (d) userNav(() => showPhoto(+d.dataset.gp * PER, +d.dataset.gp * PER > gi ? 1 : -1)); });
  gvThumbs.addEventListener("click", (e) => { const t = e.target.closest("[data-gi]"); if (t) userNav(() => showPhoto(+t.dataset.gi)); });
  {
    let sx = null;
    gv.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    gv.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 45) userNav(() => showPhoto(gi + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1));
    });
  }

  /* ============================================================
     7. MENU (opens as a golden circle from the menu button)
  ============================================================ */
  const menu = $("#menu");
  function openMenu(btn) {
    const o = originOf(btn);
    menu.style.setProperty("--mx", `${o.x}px`);
    menu.style.setProperty("--my", `${o.y}px`);
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    setTimeout(() => menu.querySelector(".menu-close").focus({ preventScroll: true }), 500);
  }
  function closeMenu() { menu.classList.remove("open"); menu.setAttribute("aria-hidden", "true"); }
  $$("[data-menu]").forEach((b) => b.addEventListener("click", () => openMenu(b)));
  $(".menu-close").addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (menu.classList.contains("open")) closeMenu(); else back();
  });

  /* ============================================================
     8. TOAST
  ============================================================ */
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ============================================================
     9. PREVIEW SHORTCUTS:  ?open  (skip the gate)   ?open&page=p2
  ============================================================ */
  history.replaceState({ page: "home" }, "", location.pathname + location.search);
  const qs = new URLSearchParams(location.search);
  if (qs.has("open")) {
    opened = true;
    gateFlies.stop();
    intro.remove();
    showApp();
    const p = qs.get("page");
    if (p && pages[p]) setTimeout(() => navigate(p, null), 400);
  }
})();
