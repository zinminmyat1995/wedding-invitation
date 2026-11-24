/* =========================================================
   中文版 — the painted page comes alive:
   clouds drift, tassels sway, and the two painted dragons
   slither out of the picture, coil round the moon gate and
   sweep past the camera into page 2
   ========================================================= */
(() => {
  const C = window.WEDDING_CN || {};
  const P2 = C.page2 || {};
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const set = (id, v) => { const el = document.getElementById(id); if (el && v != null) el.textContent = v; };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };

  /* ---------- page 2 text ---------- */
  set("c2Groom", C.groom); set("c2Bride", C.bride);
  set("c2Kicker", P2.kicker); set("c2Date", P2.dateLong); set("c2Week", P2.week); set("c2Time", P2.time);
  set("c2Venue", P2.venue); set("c2City", P2.city); set("c2Close", P2.closing); set("backLabel", P2.back);

  /* ---------- artwork layers (design units = artwork pixels 1199 × 1312) ---------- */
  const DW = 873, DH = 1802;
  const META = {
    front: [110, 550, 650, 750], dragonL: [20, 340, 265, 335], dragonR: [645, 430, 228, 210],
    tasselL: [36, 716, 40, 120], tasselR: [804, 716, 42, 120],
    c1: [0, 1380, 330, 422], c2: [290, 1430, 330, 372], c3: [560, 1380, 313, 422], c4: [560, 980, 313, 160], c5: [380, 0, 493, 240], c6: [0, 1060, 240, 160],
  };
  const RING = { x: 433, y: 872 };
  document.querySelectorAll(".lay[data-k]").forEach((el) => {
    const [x, y, w, h] = META[el.dataset.k];
    Object.assign(el.style, { left: `${(x / DW) * 100}%`, top: `${(y / DH) * 100}%`, width: `${(w / DW) * 100}%`, height: `${(h / DH) * 100}%` });
    if (el.classList.contains("cl")) {   // wind direction: away from the moon gate
      const cx = x + w / 2 - RING.x, cy = y + h / 2 - RING.y, d = Math.hypot(cx, cy) || 1;
      el.style.setProperty("--px", `${(cx / d) * 9}cqw`); el.style.setProperty("--py", `${(cy / d) * 5}cqw`);
    }
  });

  const p1 = $("#p1"), p2 = $("#p2"), st1 = $("#st1"), artEl = $("#art");
  requestAnimationFrame(() => p1.classList.add("in"));

  /* ---------- canvases ---------- */
  const cvSky = $("#sky"), cvPet = $("#petals"), cvDB = $("#dragonBack"), cvDF = $("#dragonFront");
  const gSky = cvSky.getContext("2d"), gPet = cvPet.getContext("2d"), gDB = cvDB.getContext("2d"), gDF = cvDF.getContext("2d");
  let SR = artEl.getBoundingClientRect(), STR = st1.getBoundingClientRect(), K = SR.width / DW;
  const fit = (cv, w, h) => { const W = Math.round(w * DPR), H = Math.round(h * DPR); if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; } };
  function resize() {
    SR = artEl.getBoundingClientRect(); STR = st1.getBoundingClientRect(); K = SR.width / DW;
    fit(cvPet, SR.width, SR.height); fit(cvDB, SR.width, SR.height);
    fit(cvDF, innerWidth, innerHeight); fit(cvSky, STR.width, STR.height);
  }
  resize(); addEventListener("resize", resize);
  setTimeout(resize, 1700);   // the stage animates in with a transform; measure again once settled

  /* ---------- the painted dragon, cut into parts (head · scaled body · tail · claws) ---------- */
  const load = (src) => { const i = new Image(); i.src = src; return i; };
  const KIT = {
    body: load("img/cn-kit-body.png"), per: 230, top: 64, bot: 40, R: 40,
    head: { img: load("img/cn-kit-head.png"), ax: 60, ay: 260, ang: -0.104 },
    tail: { img: load("img/cn-kit-tail.png"), ax: 335, ay: 45, ang: -0.245 },
    clawF: { img: load("img/cn-kit-clawF.png"), ax: 175, ay: 50, ang: Math.PI },
    clawR: { img: load("img/cn-kit-clawR.png"), ax: 12, ay: 45, ang: Math.PI },
  };

  /* =========================================================
     SKY — soft painted clouds drifting above and below the artwork
  ========================================================= */
  function cloudSprite(w, h) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d"), base = h * 0.74;
    for (let i = 0; i < 44; i++) {
      const fx = rnd(0.1, 0.9), edge = 1 - Math.abs(fx - 0.5) * 1.5, r = h * rnd(0.12, 0.3) * (0.45 + edge * 0.75);
      const x = w * fx, y = base - r * rnd(0.1, 0.9) * edge;
      const rg = g.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, "rgba(255,252,246,.95)"); rg.addColorStop(0.55, "rgba(255,249,240,.6)"); rg.addColorStop(1, "rgba(255,248,238,0)");
      g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    g.globalCompositeOperation = "source-atop";
    const sh = g.createLinearGradient(0, h * 0.25, 0, h); sh.addColorStop(0, "rgba(255,255,255,0)"); sh.addColorStop(1, "rgba(214,150,110,.45)");
    g.fillStyle = sh; g.fillRect(0, 0, w, h);
    return c;
  }
  const sprites = Array.from({ length: 6 }, () => cloudSprite(520, 260));
  // y in fractions of the tall scene: the artwork spans 0.227 → 0.773
  const sky = Array.from({ length: 8 }, (_, i) => ({ x: rnd(-0.4, 1.1), y: i < 3 ? rnd(0.02, 0.12) : rnd(0.84, 1.02), w: rnd(0.5, 0.9), v: rnd(0.006, 0.016), a: rnd(0.25, 0.45), spr: sprites[i % 6], ph: rnd(0, 6) }));
  let wind = 1, windTarget = 1;
  function drawSky(dt, t) {
    wind += (windTarget - wind) * Math.min(1, dt * 2);
    const W = STR.width, H = STR.height, g = gSky;
    g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
    for (const c of sky) {
      c.x += c.v * wind * dt; if (c.x > 1.2) c.x = -0.7;
      const w = c.w * W, h = w * 0.5;
      g.globalAlpha = c.a;
      g.drawImage(c.spr, c.x * W, c.y * H - h * 0.7 + Math.sin(t * 0.0004 + c.ph) * 8, w, h);
    }
    g.globalAlpha = 1;
  }

  /* ---------- plum petals + gold glints ---------- */
  const petals = [];
  const mkPetal = (top) => ({ x: rnd(-50, DW), y: top ? rnd(-60, -10) : rnd(0, DH), s: rnd(7, 13), vx: rnd(10, 40), vy: rnd(36, 80), r: rnd(0, 6.28), vr: rnd(-1.6, 1.6), ph: rnd(0, 6.28), gold: Math.random() < 0.3 });
  for (let i = 0; i < 10; i++) petals.push(mkPetal(false));
  function drawPetals(dt, t) {
    const g = gPet; g.setTransform(DPR * K, 0, 0, DPR * K, 0, 0); g.clearRect(0, 0, DW, DH);
    if (petals.length < 12 && Math.random() < 0.035) petals.push(mkPetal(true));
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.x += (p.vx * wind + Math.sin(t * 0.0012 + p.ph) * 25) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
      if (p.y > DH + 30 || p.x > DW + 60) { petals.splice(i, 1); continue; }
      g.save(); g.translate(p.x, p.y); g.rotate(p.r);
      if (p.gold) {
        g.globalAlpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.006 + p.ph)); g.fillStyle = "#ffe08a";
        g.beginPath(); g.moveTo(0, -p.s * 0.5); g.lineTo(p.s * 0.12, 0); g.lineTo(0, p.s * 0.5); g.lineTo(-p.s * 0.12, 0); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(-p.s * 0.5, 0); g.lineTo(0, p.s * 0.12); g.lineTo(p.s * 0.5, 0); g.lineTo(0, -p.s * 0.12); g.closePath(); g.fill();
      } else {
        g.scale(1, 0.4 + Math.abs(Math.sin(t * 0.002 + p.ph)) * 0.6);
        const gr = g.createLinearGradient(0, -p.s, 0, p.s); gr.addColorStop(0, "#f05a5a"); gr.addColorStop(1, "#a8101c");
        g.fillStyle = gr; g.globalAlpha = 0.9;
        g.beginPath(); g.moveTo(0, -p.s); g.bezierCurveTo(p.s * 0.9, -p.s * 0.5, p.s * 0.6, p.s * 0.8, 0, p.s); g.bezierCurveTo(-p.s * 0.6, p.s * 0.8, -p.s * 0.9, -p.s * 0.5, 0, -p.s); g.fill();
      }
      g.restore();
    }
    g.globalAlpha = 1;
  }

  /* =========================================================
     DRAGON RENDERING — the painted dragon bent along its flight path:
     the scaled body is cut into thin slices and each slice is mapped
     onto the curve, so scales, crest and shading follow the body
  ========================================================= */
  function drawTri(g, img, s0, s1, s2, d0, d1, d2, exp) {
    const cx = (d0[0] + d1[0] + d2[0]) / 3, cy = (d0[1] + d1[1] + d2[1]) / 3;
    const ex = (p) => { const dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1; return [p[0] + (dx / l) * exp, p[1] + (dy / l) * exp]; };
    const den = (s1[0] - s0[0]) * (s2[1] - s0[1]) - (s2[0] - s0[0]) * (s1[1] - s0[1]);
    if (!den) return;
    const a = ((d1[0] - d0[0]) * (s2[1] - s0[1]) - (d2[0] - d0[0]) * (s1[1] - s0[1])) / den;
    const c = ((d2[0] - d0[0]) * (s1[0] - s0[0]) - (d1[0] - d0[0]) * (s2[0] - s0[0])) / den;
    const b = ((d1[1] - d0[1]) * (s2[1] - s0[1]) - (d2[1] - d0[1]) * (s1[1] - s0[1])) / den;
    const d = ((d2[1] - d0[1]) * (s1[0] - s0[0]) - (d1[1] - d0[1]) * (s2[0] - s0[0])) / den;
    const e = d0[0] - a * s0[0] - c * s0[1], f = d0[1] - b * s0[0] - d * s0[1];
    const p0 = ex(d0), p1 = ex(d1), p2 = ex(d2);
    g.save(); g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.closePath(); g.clip();
    g.transform(a, b, c, d, e, f); g.drawImage(img, 0, 0); g.restore();
  }
  function drawPart(g, part, p, T, k, flip) {
    if (!part.img.complete || !part.img.naturalWidth) return;
    g.save(); g.translate(p.x, p.y); g.rotate(Math.atan2(T.y, T.x));
    if (flip) g.scale(1, -1);
    g.rotate(-part.ang); g.scale(k, k);
    g.drawImage(part.img, -part.ax, -part.ay);
    g.restore();
  }
  /** P: spine head → tail, R: body radius per point; o: { keep(i), flip, alpha, exp } */
  function drawKit(g, P, R, o) {
    const n = P.length, keep = o.keep || (() => true), sg = o.flip ? -1 : 1;
    if (n < 4 || !KIT.body.complete || !KIT.body.naturalWidth) return;
    const T = [], N = [], k = [];
    for (let i = 0; i < n; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
      let tx = a.x - b.x, ty = a.y - b.y; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      T.push({ x: tx, y: ty }); N.push({ x: sg * ty, y: -sg * tx }); k.push(R[i] / KIT.R);
    }
    g.globalAlpha = o.alpha == null ? 1 : o.alpha;
    const ia = Math.round(n * 0.22), ib = Math.round(n * 0.6);
    // claws first, so their roots tuck under the belly
    const claw = (i, part) => { if (!keep(i)) return; drawPart(g, part, { x: P[i].x - N[i].x * 26 * k[i], y: P[i].y - N[i].y * 26 * k[i] }, T[i], k[i] * 0.95, o.flip); };
    claw(ib, KIT.clawR); claw(ia, KIT.clawF);
    // tail flame at the end of the body
    // body slices, tail → head
    const U = new Array(n); U[n - 1] = 0;
    for (let i = n - 2; i >= 0; i--) U[i] = U[i + 1] + Math.hypot(P[i].x - P[i + 1].x, P[i].y - P[i + 1].y) / ((k[i] + k[i + 1]) / 2 || 1);
    const H = KIT.top + KIT.bot;
    for (let i = n - 2; i >= 0; i--) {
      if (!(keep(i) && keep(i + 1))) continue;
      const ua = U[i + 1] % KIT.per, ub = Math.min(ua + (U[i] - U[i + 1]), KIT.per * 2 - 0.5);
      const At = [P[i + 1].x + N[i + 1].x * KIT.top * k[i + 1], P[i + 1].y + N[i + 1].y * KIT.top * k[i + 1]];
      const Ab = [P[i + 1].x - N[i + 1].x * KIT.bot * k[i + 1], P[i + 1].y - N[i + 1].y * KIT.bot * k[i + 1]];
      const Bt = [P[i].x + N[i].x * KIT.top * k[i], P[i].y + N[i].y * KIT.top * k[i]];
      const Bb = [P[i].x - N[i].x * KIT.bot * k[i], P[i].y - N[i].y * KIT.bot * k[i]];
      drawTri(g, KIT.body, [ua, 0], [ub, 0], [ub, H], At, Bt, Bb, o.exp);
      drawTri(g, KIT.body, [ua, 0], [ub, H], [ua, H], At, Bb, Ab, o.exp);
    }
    if (keep(n - 1)) drawTailFan(g, P, T, k[0] * KIT.R, o.t || 0);
    if (keep(0)) drawPart(g, KIT.head, P[0], T[0], k[0] * (o.headK || 1.02), o.flip);
    g.globalAlpha = 1;
  }

  /* tail: a fan of golden flame feathers. It follows the bend of the last part of the
     body (secondary motion), so it swings left / right in balance with the body wave */
  function drawTailFan(g, P, T, Rh, t) {
    const n = P.length, e = P[n - 1];
    const back = Math.atan2(-T[n - 1].y, -T[n - 1].x);
    const up = Math.atan2(-T[Math.max(0, n - 9)].y, -T[Math.max(0, n - 9)].x);
    let bend = back - up; while (bend > Math.PI) bend -= Math.PI * 2; while (bend < -Math.PI) bend += Math.PI * 2;
    const sway = clamp(bend * 1.6, -0.9, 0.9) + Math.sin(t * 3.1) * 0.16;
    const L = Rh * 3.1;
    for (let j = 0; j < 7; j++) {
      const s = (j - 3) / 3;                                          // -1 … 1 across the fan
      const ang = back + s * 0.62 + sway * (0.7 + Math.abs(s) * 0.3) + Math.sin(t * 4.2 + j * 0.9) * 0.07;
      const len = L * (1 - Math.abs(s) * 0.38) * (0.94 + 0.06 * Math.sin(t * 5 + j));
      const wid = Rh * (0.34 - Math.abs(s) * 0.08);
      const curl = (sway * 0.9 + s * 0.25) * len * 0.35;              // tips trail behind the swing
      const ca = Math.cos(ang), sa = Math.sin(ang), px = -sa, py = ca;
      const tx = e.x + ca * len + px * curl, ty = e.y + sa * len + py * curl;
      const mx = e.x + ca * len * 0.5 + px * curl * 0.3, my = e.y + sa * len * 0.5 + py * curl * 0.3;
      const gr = g.createLinearGradient(e.x, e.y, tx, ty);
      gr.addColorStop(0, "#b8741e"); gr.addColorStop(0.35, "#eab24e"); gr.addColorStop(0.75, "#ffe7a6"); gr.addColorStop(1, "rgba(255,246,214,.15)");
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(e.x + px * wid, e.y + py * wid);
      g.quadraticCurveTo(mx + px * wid * 1.25, my + py * wid * 1.25, tx, ty);
      g.quadraticCurveTo(mx - px * wid * 0.55, my - py * wid * 0.55, e.x - px * wid, e.y - py * wid);
      g.closePath(); g.fill();
      // glossy rib down each feather
      g.strokeStyle = "rgba(255,248,220,.55)"; g.lineWidth = Math.max(0.6, wid * 0.16); g.lineCap = "round";
      g.beginPath(); g.moveTo(e.x, e.y); g.quadraticCurveTo(mx + px * wid * 0.3, my + py * wid * 0.3, e.x + (tx - e.x) * 0.85, e.y + (ty - e.y) * 0.85); g.stroke();
    }
  }

  /* =========================================================
     FLIGHT PATHS — each dragon starts on its painted pose,
     then both circle the moon gate slowly, half a turn apart
  ========================================================= */
  const mkSpine = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, L, len: L[L.length - 1] }; };
  function poseAt(sp, a) {
    const { pts, L } = sp;
    if (a >= sp.len) { const p = pts[pts.length - 1], q = pts[pts.length - 2], l = Math.hypot(p[0] - q[0], p[1] - q[1]); const kk = (a - sp.len) / l; return { x: p[0] + (p[0] - q[0]) * kk, y: p[1] + (p[1] - q[1]) * kk }; }
    let i = 1; while (L[i] < a) i++;
    const f = (a - L[i - 1]) / (L[i] - L[i - 1]);
    return { x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, y: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f };
  }
  const NPTS = 64, LAG = 0.034, ACC = 300, ORB = 338, OMEGA = (Math.PI * 2) / 6;
  const ORBIT_END = 4.9;
  const profile = (f) => (f < 0.15 ? 1 : f < 0.6 ? 1 - (f - 0.15) * 0.22 : Math.max(0.34, 0.9 - (f - 0.6) * 1.45));
  const DRAG = [
    { sp: mkSpine([[205, 440], [165, 450], [125, 480], [100, 520], [110, 560], [150, 585], [200, 600], [235, 625], [245, 660]]),
      fwd: { x: 0.95, y: -0.3 }, R0: 17, exit: { x: 1500, y: 300 }, exitScale: 2.0 },
    { sp: mkSpine([[700, 515], [735, 495], [780, 470], [830, 480], [855, 530], [835, 585], [790, 610], [740, 600]]),
      fwd: { x: 0.2, y: 0.98 }, R0: 15, exit: { x: -600, y: -300 }, exitScale: 0.5, fade: true },
  ];
  DRAG.forEach((d) => { d.lag = LAG; d.v0 = d.sp.len / (LAG * (NPTS - 1)); const a = d.sp.pts[0]; d.anchor = { x: a[0], y: a[1] }; });
  DRAG[0].theta0 = Math.atan2(DRAG[0].anchor.y - RING.y, DRAG[0].anchor.x - RING.x) + 0.2;
  DRAG[1].theta0 = DRAG[0].theta0 + Math.PI;            // always on the opposite side of the gate
  function path(d, u) {
    if (u <= 0) { const q = poseAt(d.sp, -u * d.v0); return { x: q.x, y: q.y, s: 1, back: false, fly: 0 }; }
    const dist = d.v0 * u + 0.5 * ACC * u * u;
    const lin = { x: d.anchor.x + d.fwd.x * dist, y: d.anchor.y + d.fwd.y * dist };
    const th = d.theta0 + OMEGA * u;
    // the track itself snakes in and out of the circle, so the body (which follows the track) forms S-curves
    const rr = ORB + 52 * Math.sin(th * 5 + d.theta0 * 3) + 14 * Math.sin(th * 2 + d.theta0);
    const orb = { x: RING.x + Math.cos(th) * rr, y: RING.y + Math.sin(th) * rr * 0.96 + Math.sin(u * 1.7 + d.theta0) * 10 };
    const b = smooth(u / 1.6);
    // blend in polar coordinates around the gate, so the dragons swing round it instead of cutting across the couple
    const lr = Math.hypot(lin.x - RING.x, (lin.y - RING.y) / 0.96), la = Math.atan2((lin.y - RING.y) / 0.96, lin.x - RING.x);
    let da = th - la; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
    const ang = la + da * b, rad = Math.max(lr + (rr - lr) * b, Math.min(lr, rr));
    let x = RING.x + Math.cos(ang) * rad, y = RING.y + Math.sin(ang) * rad * 0.96;
    let s = 1 + 0.22 * Math.sin(th) * b + 0.06 * Math.sin(th * 5 + d.theta0 * 3) * b;
    let back = b > 0.55 && Math.sin(th) < -0.12;
    const e = smooth((u - ORBIT_END) / 0.8);
    if (e > 0) {
      const eu = u - ORBIT_END;
      x += (orb.x + (d.exit.x - RING.x) * eu * 1.3 - x) * e;
      y += (orb.y + (d.exit.y - RING.y) * eu * 1.3 - y) * e;
      s += (d.exitScale - s) * e;
      if (e > 0.3) back = false;
    }
    return { x, y, s, back, fly: smooth(u / 0.8) };
  }
  function bodyAt(d, u) {
    const P = [], R = [], B = [];
    for (let i = 0; i < NPTS; i++) { const q = path(d, u - i * d.lag); P.push(q); B.push(q.back); R.push(d.R0 * q.s * profile(i / (NPTS - 1))); }
    // a slow serpentine sway once airborne
    for (let i = 1; i < NPTS - 1; i++) {
      const f = P[i].fly; if (!f) continue;
      const a = P[i - 1], b = P[i + 1]; const tx = a.x - b.x, ty = a.y - b.y, l = Math.hypot(tx, ty) || 1;
      const fi = i / (NPTS - 1);   // travelling wave: calm at the head, swinging more toward the tail
      // slither: a wave runs from the head to the tail (2½ bends along the body), growing toward the tail
      const off = (Math.sin(i * 0.25 - u * 5.2) * (0.5 + 1.6 * fi) + Math.sin(i * 0.11 - u * 2.3 + 1) * 0.6 * fi) * d.R0 * f * Math.min(1, i / 6);
      P[i] = { ...P[i], x: P[i].x - (ty / l) * off, y: P[i].y + (tx / l) * off };
    }
    return { P, R, B };
  }

  // cloud puffs (design units) and screen-space puffs
  const puffs = [], puffsS = [];
  function drawPuffs(g, dt, list) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i]; p.age += dt;
      if (p.age > p.life) { list.splice(i, 1); continue; }
      const kk = p.age / p.life; p.x += p.vx * dt; p.y += p.vy * dt;
      const r = p.r * (0.6 + kk * 0.9), a = (1 - kk) * (kk < 0.15 ? kk / 0.15 : 1) * 0.85;
      const rg = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      rg.addColorStop(0, `rgba(255,250,240,${a})`); rg.addColorStop(0.6, `rgba(255,240,222,${a * 0.5})`); rg.addColorStop(1, "rgba(255,240,222,0)");
      g.fillStyle = rg; g.beginPath(); g.arc(p.x, p.y, r, 0, Math.PI * 2); g.fill();
    }
  }
  function flash(g, x, y, r, a) {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(255,250,220,${a})`); rg.addColorStop(0.4, `rgba(255,215,130,${a * 0.6})`); rg.addColorStop(1, "rgba(255,200,110,0)");
    g.globalCompositeOperation = "lighter"; g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.globalCompositeOperation = "source-over";
  }

  /* ---------- the transition ---------- */
  const AWAKE = 0.65;               // the painted dragons glow before they move
  let flying = false, tFly = 0, giant = null, swapped = false, loosed = false;
  function startFlight() {
    if (flying) return;
    flying = true; tFly = 0; swapped = false; giant = null; loosed = false;
    resize();
    p1.classList.add("awaken");
    startMusic();
    if (navigator.vibrate) navigator.vibrate([20, 60, 30]);
  }
  function flightFrame(dt) {
    tFly += dt;
    const t = tFly, u = t - AWAKE;
    gDB.setTransform(1, 0, 0, 1, 0, 0); gDB.clearRect(0, 0, cvDB.width, cvDB.height);
    gDF.setTransform(1, 0, 0, 1, 0, 0); gDF.clearRect(0, 0, cvDF.width, cvDF.height);
    const toArt = (g) => g.setTransform(DPR * K, 0, 0, DPR * K, DPR * SR.left, DPR * SR.top);
    const exp = 0.7 / (K * DPR);

    if (u >= 0 && !loosed) {
      loosed = true;
      p1.classList.remove("awaken"); p1.classList.add("loose", "flying");
      windTarget = 4;
      DRAG.forEach((d) => { for (let kk = 0; kk < 10; kk++) puffs.push({ x: d.anchor.x + rnd(-120, 120), y: d.anchor.y + rnd(-60, 160), r: rnd(60, 140), vx: rnd(-80, 80), vy: rnd(-50, 50), life: rnd(1.1, 1.8), age: 0 }); });
    }
    // ---- phase 1: out of the picture, slowly round the moon gate ----
    if (u >= 0 && u < ORBIT_END + 1.4) {
      DRAG.forEach((d) => {
        const alpha = d.fade ? 1 - smooth((u - ORBIT_END - 0.2) / 0.6) : 1;
        if (alpha <= 0.01) return;
        const { P, R, B } = bodyAt(d, u);
        gDB.setTransform(DPR * K, 0, 0, DPR * K, 0, 0);
        drawKit(gDB, P, R, { alpha, keep: (i) => B[i], exp, t: u });
        toArt(gDF);
        drawKit(gDF, P, R, { alpha, keep: (i) => !B[i], exp, t: u });
        if (d.fade && u > ORBIT_END && u < ORBIT_END + 0.8 && Math.random() < 0.5) puffs.push({ x: P[0].x, y: P[0].y, r: rnd(80, 160), vx: rnd(-60, 60), vy: rnd(-60, 60), life: 1.2, age: 0 });
      });
      toArt(gDF);
      if (u < 0.5) DRAG.forEach((d) => flash(gDF, d.anchor.x + 40, d.anchor.y + 80, 260, 0.9 * (1 - u / 0.5)));
      drawPuffs(gDF, dt, puffs);
    }

    // ---- phase 2: the dragon sweeps right → left right in front of the camera ----
    const SW = innerWidth, SH = innerHeight;
    if (u > ORBIT_END + 0.6 && !giant) giant = { x0: SW * 1.15 + SH * 0.25, v: (SW * 1.5) / 0.6, L: SW * 2.2 + SH * 0.5, t0: t, n: 70 };
    if (giant) {
      const gt = t - giant.t0, head = giant.x0 - giant.v * gt;
      const Rg = Math.min(SH * 0.085, SW * 0.17), mid = SH * 0.5, A = SH * 0.11, lam = Math.max(SW * 1.5, Math.PI * 2 * Math.sqrt(2 * Rg * A));
      const P = [], R = [];
      for (let i = 0; i < giant.n; i++) {
        const f = i / (giant.n - 1), xr = f * giant.L;
        P.push({ x: head + xr, y: mid + Math.sin((xr / lam) * Math.PI * 2 - gt * 2.6) * A * Math.min(1, f * 8) });
        R.push(Rg * profile(f));
      }
      gDF.setTransform(DPR, 0, 0, DPR, 0, 0);
      const fog = gt < 0.6 ? smooth(gt / 0.6) : 1 - smooth((gt - 0.7) / 0.9);
      if (fog > 0.003) {
        const fg = gDF.createLinearGradient(0, 0, 0, SH);
        fg.addColorStop(0, `rgba(255,244,228,${fog * 0.96})`); fg.addColorStop(0.5, `rgba(255,250,240,${fog})`); fg.addColorStop(1, `rgba(250,232,210,${fog * 0.96})`);
        gDF.fillStyle = fg; gDF.fillRect(0, 0, SW, SH);
      }
      for (let kk = 0; kk < 3; kk++) {
        const i = (Math.random() * giant.n) | 0, q = P[i];
        if (q.x < -200 || q.x > SW + 200) continue;
        const side = Math.random() < 0.5 ? -1 : 1;
        puffsS.push({ x: q.x + rnd(-60, 60), y: q.y + side * R[i] * rnd(1, 2), r: SH * rnd(0.1, 0.2), vx: -rnd(60, 220), vy: side * rnd(20, 80), life: rnd(1, 1.6), age: 0 });
      }
      drawPuffs(gDF, dt, puffsS);
      drawKit(gDF, P, R, { flip: true, exp: 0.7 / DPR, headK: 0.85, t: gt });
      if (!swapped && gt > 0.6) { swapped = true; showPage2(); }
      if (head + giant.L < -SW * 0.1 && gt > 1.7) { puffsS.length = 0; endFlight(); }
    }
  }
  function endFlight() {
    flying = false; giant = null; puffs.length = 0;
    gDF.setTransform(1, 0, 0, 1, 0, 0); gDF.clearRect(0, 0, cvDF.width, cvDF.height);
    gDB.setTransform(1, 0, 0, 1, 0, 0); gDB.clearRect(0, 0, cvDB.width, cvDB.height);
  }

  /* ---------- pages ---------- */
  function showPage2(push = true) {
    p1.classList.remove("on", "in", "flying", "awaken");
    p1.setAttribute("aria-hidden", "true");
    p2.classList.add("on"); p2.removeAttribute("aria-hidden");
    p2.classList.remove("in"); void p2.offsetWidth; p2.classList.add("in");
    windTarget = 1;
    if (push) history.pushState({ p: 2 }, "", "#invite");
  }
  function showPage1() {
    p2.classList.remove("on", "in"); p2.setAttribute("aria-hidden", "true");
    p1.classList.remove("loose", "flying", "awaken", "in");
    p1.classList.add("on"); p1.removeAttribute("aria-hidden");
    void p1.offsetWidth; p1.classList.add("in");
    setTimeout(resize, 1700);
  }
  $("#enterBtn").addEventListener("click", () => { if (reduce) { showPage2(); return; } startFlight(); });
  $("#backBtn").addEventListener("click", () => (history.state && history.state.p === 2 ? history.back() : showPage1()));
  addEventListener("popstate", () => { if (p2.classList.contains("on") && !flying) showPage1(); });

  /* ---------- page 2 gold dust ---------- */
  const cvDust = $("#p2Dust"), gDust = cvDust.getContext("2d");
  const dust = Array.from({ length: 50 }, () => ({ x: Math.random(), y: Math.random(), r: rnd(0.6, 2.2), v: rnd(0.005, 0.02), ph: rnd(0, 6.28) }));
  function drawDust(t) {
    fit(cvDust, innerWidth, innerHeight);
    const g = gDust; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, innerWidth, innerHeight);
    for (const d of dust) {
      d.y -= d.v / 60; if (d.y < -0.02) d.y = 1.02;
      g.fillStyle = `rgba(255,214,120,${0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.003 + d.ph))})`;
      g.beginPath(); g.arc(d.x * innerWidth + Math.sin(t * 0.001 + d.ph) * 12, d.y * innerHeight, d.r, 0, Math.PI * 2); g.fill();
    }
  }

  /* ---------- main loop ---------- */
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (p1.classList.contains("on")) { drawSky(dt, now); drawPetals(dt, now); }
    if (flying) flightFrame(dt);
    if (p2.classList.contains("on")) drawDust(now);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---------- music: starts as soon as the browser allows ---------- */
  const audio = $("#bgm");
  let started = false;
  function startMusic() {
    if (started || !C.music) return; started = true;
    audio.src = C.music; audio.volume = 0;
    audio.play().then(() => {
      const t0 = performance.now();
      const stp = (t) => { audio.volume = Math.max(0, Math.min(0.7, (t - t0) / 2500 * 0.7)); if (audio.volume < 0.7) requestAnimationFrame(stp); };
      requestAnimationFrame(stp);
    }).catch(() => { started = false; });
  }
  startMusic();
  ["pointerdown", "touchstart", "click", "keydown", "wheel", "scroll"].forEach((ev) => addEventListener(ev, startMusic, { passive: true, capture: true }));

  // preview shortcuts:  ?fly  (play the dragons right away)   ?p2  (open page 2)
  if (/[?&]p2\b/.test(location.search)) showPage2(false);
  if (/[?&]fly\b/.test(location.search)) setTimeout(startFlight, 1900);
  window.__cn = { startFlight, get t() { return tFly; } };
})();
