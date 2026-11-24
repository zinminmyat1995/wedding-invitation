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
  const NPTS = 70, LAG = 0.036;
  const profile = (f) => (f < 0.12 ? 1 : f < 0.6 ? 1 - (f - 0.12) * 0.2 : Math.max(0.3, 0.9 - (f - 0.6) * 1.5));

  /* Flight choreography (taken from the reference clip): the dragon leaves its painted pose,
     glides along the top, drops down the right side and throws a full loop, sweeps across the
     bottom in front of the couple, climbs the left side, then dives THROUGH the moon window
     (behind the couple), comes out again and rushes at the camera.
     waypoint = [x, y, scale (depth), behind-the-gate 0/1] in artwork units (873 × 1802) */
  const WP_L = [
    [205, 440, 1, 0], [330, 410, 1.04, 0], [480, 402, 1.06, 0], [640, 440, 1.08, 0], [760, 560, 1.1, 0],
    [820, 720, 1.12, 0], [760, 860, 1.16, 0], [640, 800, 1.12, 0], [680, 660, 1.06, 0], [800, 700, 1.1, 0],
    [830, 900, 1.16, 0], [790, 1080, 1.22, 0], [640, 1200, 1.3, 0], [433, 1236, 1.36, 0], [230, 1190, 1.3, 0],
    [110, 1030, 1.2, 0], [90, 820, 1.1, 0], [150, 620, 1.0, 0], [300, 560, 0.92, 1], [480, 590, 0.86, 1],
    [600, 700, 0.84, 1], [620, 880, 0.88, 1], [520, 1010, 0.95, 1], [330, 1000, 1.0, 1], [240, 880, 1.05, 0],
    [300, 700, 1.35, 0], [433, 560, 2.1, 0], [520, 380, 3.2, 0],
  ];
  const WP_R = [[700, 515, 1, 0], ...WP_L.slice(1).map(([x, y, s, b]) => [866 - x, y, s, b])];
  // Catmull-Rom → dense polyline with arc length, depth and behind-flag
  function mkTrack(wp) {
    const pts = [];
    for (let i = 0; i < wp.length - 1; i++) {
      const p0 = wp[Math.max(0, i - 1)], p1 = wp[i], p2 = wp[i + 1], p3 = wp[Math.min(wp.length - 1, i + 2)];
      for (let k = 0; k < 24; k++) {
        const t = k / 24, t2 = t * t, t3 = t2 * t;
        const c = (a, b, cc, d) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
        pts.push({ x: c(p0[0], p1[0], p2[0], p3[0]), y: c(p0[1], p1[1], p2[1], p3[1]), s: p1[2] + (p2[2] - p1[2]) * t, b: p1[3] + (p2[3] - p1[3]) * t });
      }
    }
    const l = wp[wp.length - 1]; pts.push({ x: l[0], y: l[1], s: l[2], b: l[3] });
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    return { pts, L, len: L[L.length - 1] };
  }
  function onTrack(tr, a) {
    const { pts, L } = tr;
    if (a <= 0) return pts[0];
    if (a >= tr.len) { const p = pts[pts.length - 1], q = pts[pts.length - 2], l = Math.hypot(p.x - q.x, p.y - q.y) || 1, k = (a - tr.len) / l; return { x: p.x + (p.x - q.x) * k, y: p.y + (p.y - q.y) * k, s: p.s * (1 + k * 0.02), b: p.b }; }
    let lo = 0, hi = L.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] < a) lo = m; else hi = m; }
    const f = (a - L[lo]) / (L[hi] - L[lo] || 1), p = pts[lo], q = pts[hi];
    return { x: p.x + (q.x - p.x) * f, y: p.y + (q.y - p.y) * f, s: p.s + (q.s - p.s) * f, b: p.b + (q.b - p.b) * f };
  }
  const VMAX = 520;
  const DRAG = [
    { sp: mkSpine([[205, 440], [165, 450], [125, 480], [100, 520], [110, 560], [150, 585], [200, 600], [235, 625], [245, 660]]), tr: mkTrack(WP_L), R0: 21, flip: false, delay: 0, lead: true },
    { sp: mkSpine([[700, 515], [735, 495], [780, 470], [830, 480], [855, 530], [835, 585], [790, 610], [740, 600]]), tr: mkTrack(WP_R), R0: 19, flip: true, delay: 0.9 },
  ];
  // distance travelled: starts at the speed that matches the painted pose, eases up to VMAX
  DRAG.forEach((d) => {
    d.v0 = d.sp.len / (LAG * (NPTS - 1)); d.anchor = { x: d.sp.pts[0][0], y: d.sp.pts[0][1] };
    d.D = [0]; let s = 0; for (let k = 1; k <= 2000; k++) { const u = k * 0.01; s += (d.v0 + (VMAX - d.v0) * smooth(u / 1.6)) * 0.01; d.D.push(s); }
  });
  const dist = (d, u) => { const k = u / 0.01, i = Math.min(1999, Math.floor(k)); return d.D[i] + (d.D[i + 1] - d.D[i]) * (k - i); };
  function path(d, u) {
    if (u <= 0) { const q = poseAt(d.sp, -u * d.v0); return { x: q.x, y: q.y, s: 1, back: false, fly: 0 }; }
    const q = onTrack(d.tr, dist(d, u));
    return { x: q.x, y: q.y, s: q.s, back: q.b > 0.5, fly: smooth(u / 0.7) };
  }
  function bodyAt(d, u) {
    const P = [], R = [], B = [];
    for (let i = 0; i < NPTS; i++) { const q = path(d, u - i * LAG); P.push(q); B.push(q.back); R.push(d.R0 * q.s * profile(i / (NPTS - 1))); }
    // slither: a gentle wave runs from the head to the tail on top of the track
    for (let i = 1; i < NPTS - 1; i++) {
      const f = P[i].fly; if (!f) continue;
      const a = P[i - 1], b = P[i + 1]; const tx = a.x - b.x, ty = a.y - b.y, l = Math.hypot(tx, ty) || 1;
      const fi = i / (NPTS - 1);
      const off = Math.sin(i * 0.22 - u * 4.6) * d.R0 * P[i].s * (0.25 + 0.9 * fi) * f * Math.min(1, i / 6);
      P[i] = { ...P[i], x: P[i].x - (ty / l) * off, y: P[i].y + (tx / l) * off };
    }
    return { P, R, B };
  }

  // cloud puffs (artwork units), screen-space puffs and golden haze
  const puffs = [], puffsS = [], haze = [];
  // cloud puffs use the same painted cloud sprites as the sky, so they read as real cloud
  function drawPuffs(g, dt, list) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i]; p.age += dt;
      if (p.age > p.life) { list.splice(i, 1); continue; }
      const kk = p.age / p.life; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.spr == null) { p.spr = (Math.random() * sprites.length) | 0; p.fl = Math.random() < 0.5; }
      const w = p.r * 2.6 * (0.7 + kk * 0.6), h = w * 0.5;
      g.globalAlpha = Math.sin(Math.PI * Math.min(1, kk * 1.15)) * 0.75;
      g.save(); g.translate(p.x, p.y); if (p.fl) g.scale(-1, 1); g.drawImage(sprites[p.spr], -w / 2, -h * 0.65, w, h); g.restore();
    }
    g.globalAlpha = 1;
  }
  // the warm golden smoke that trails the body in the clip
  function drawHaze(g, dt) {
    g.globalCompositeOperation = "lighter";
    for (let i = haze.length - 1; i >= 0; i--) {
      const p = haze[i]; p.age += dt;
      if (p.age > p.life) { haze.splice(i, 1); continue; }
      const k = p.age / p.life; p.x += p.vx * dt; p.y += p.vy * dt;
      const r = p.r * (0.5 + k * 1.2), a = Math.sin(Math.PI * k) * 0.22;
      const rg = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      rg.addColorStop(0, `rgba(255,205,90,${a})`); rg.addColorStop(0.5, `rgba(240,160,40,${a * 0.45})`); rg.addColorStop(1, "rgba(220,140,30,0)");
      g.fillStyle = rg; g.beginPath(); g.arc(p.x, p.y, r, 0, Math.PI * 2); g.fill();
    }
    g.globalCompositeOperation = "source-over";
  }
  function flash(g, x, y, r, a) {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(255,250,220,${a})`); rg.addColorStop(0.4, `rgba(255,215,130,${a * 0.6})`); rg.addColorStop(1, "rgba(255,200,110,0)");
    g.globalCompositeOperation = "lighter"; g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.globalCompositeOperation = "source-over";
  }

  /* ---------- the transition ----------
     1. each painted dragon glows, trembles and slithers out of the picture,
        diving down into the sea of clouds (drawn from the painted dragon itself)
     2. at that very spot the real 3D dragon (img/dragon.mp4, keyed: black → transparent)
        rises back out of the clouds and coils round the moon gate exactly as in the clip
     3. its body sweeps past the camera → page 2 */
  const AWAKE = 0.7, RATE = 1.1;
  const V0 = 0.75, V_SWAP = 9.35, V_END = 10.45, V_RFADE = 8.2;   // times inside the clip
  const EMERGE = { fx: 0.47, fy: 0.95 };    // where the clip's dragon rises from (fraction of its frame)
  const KW = 640, KH = 360;
  const mkV = () => { const v = document.createElement("video"); v.src = "img/dragon.mp4"; v.muted = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.preload = "auto"; v.playbackRate = RATE; return v; };
  DRAG[0].delay = 0; DRAG[0].cx = 0.35; DRAG[0].mirror = false;
  DRAG[1].delay = 0.75; DRAG[1].cx = 0.65; DRAG[1].mirror = true;
  DRAG.forEach((d) => { d.v = mkV(); d.c = document.createElement("canvas"); d.c.width = KW; d.c.height = KH; d.g = d.c.getContext("2d", { willReadFrequently: true }); d.v.load(); });
  const EDGE = new Float32Array(KW * KH);
  for (let y = 0; y < KH; y++) for (let x = 0; x < KW; x++) {
    const ex = Math.min(x, KW - 1 - x) / (KW * 0.09), ey = Math.min(y, KH - 1 - y) / (KH * 0.14);
    EDGE[y * KW + x] = smooth(Math.min(ex, ey));
  }
  let rawMode = false;
  function keyFrame(d) {
    const g = d.g; g.drawImage(d.v, 0, 0, KW, KH);
    const id = g.getImageData(0, 0, KW, KH), p = id.data;
    for (let i = 0, q = 0; i < p.length; i += 4, q++) {
      const r = p[i], gg = p[i + 1], b = p[i + 2], m = r > gg ? (r > b ? r : b) : (gg > b ? gg : b);
      let a = (m - 22) / 95; a = a < 0 ? 0 : a > 1 ? 1 : a; a = a * a * (3 - 2 * a);
      const k = 1 / (a > 0.55 ? a : 0.55);
      const R = r * k * 1.12, G = gg * k * 0.94, B = b * k * 0.8;
      p[i] = R > 255 ? 255 : R; p[i + 1] = G > 255 ? 255 : G; p[i + 2] = B > 255 ? 255 : B; p[i + 3] = a * EDGE[q] * 255;
    }
    g.putImageData(id, 0, 0);
  }
  // the clip's frame on screen for dragon d
  function clipBox(d) {
    const SW = innerWidth, SH = innerHeight;
    const bw = Math.max(SW * 1.75, SH * 1.12), bh = (bw * 9) / 16;
    return { cx: SW * d.cx, cy: SR.top + (RING.y / DH) * SR.height, bw, bh };
  }
  // build each dive: painted pose → down the outside of the gate → into the clouds where the clip's dragon rises
  function buildDives() {
    DRAG.forEach((d) => {
      const b = clipBox(d);
      const sx = b.cx + (d.mirror ? -1 : 1) * (EMERGE.fx - 0.5) * b.bw, sy = b.cy + (EMERGE.fy - 0.5) * b.bh;
      const ex = (sx - SR.left) / K, ey = (sy - SR.top) / K;            // screen → artwork units
      const side = d.mirror ? 1 : -1, a = d.anchor;
      const wp = d.mirror
        ? [[a.x, a.y, 1, 0], [a.x - 70, a.y + 40, 1.04, 0], [a.x - 40, a.y + 170, 1.08, 0], [RING.x + 345, RING.y - 40, 1.12, 0], [(RING.x + 345 + ex) / 2 + 30, (RING.y + ey) / 2 + 120, 1.15, 0], [ex, ey, 1.1, 0], [ex, ey + 300, 1.0, 0]]
        : [[a.x, a.y, 1, 0], [a.x + 70, a.y + 30, 1.04, 0], [a.x + 40, a.y + 170, 1.08, 0], [RING.x - 345, RING.y - 40, 1.12, 0], [(RING.x - 345 + ex) / 2 - 30, (RING.y + ey) / 2 + 120, 1.15, 0], [ex, ey, 1.1, 0], [ex, ey + 300, 1.0, 0]];
      void side;
      d.tr = mkTrack(wp);
      d.diveLen = d.tr.len - 300 * 0.98;                                  // distance at which the head enters the clouds
      d.diveT = 0; while (d.diveT < 19 && dist(d, d.diveT) < d.diveLen) d.diveT += 0.01;
      d.ex = ex; d.ey = ey;
    });
  }

  let flying = false, tFly = 0, swapped = false, loosed = false;
  function startFlight() {
    if (flying) return;
    flying = true; tFly = 0; swapped = false; loosed = false; haze.length = 0; puffs.length = 0;
    resize(); buildDives();
    p1.classList.add("awaken");
    // start (and pause) both clips inside the tap, so phones allow playback later
    DRAG.forEach((d) => { d.out = false; d.vOn = false; d.done = false; try { d.v.currentTime = V0; } catch (e) {} const pr = d.v.play(); if (pr) pr.then(() => { if (!d.vOn) d.v.pause(); }).catch(() => {}); });
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
    if (u >= 0 && !loosed) { loosed = true; p1.classList.add("loose", "flying"); windTarget = 3; }
    if (u < 0) return;
    let alive = false;

    // ---- 1. the painted dragons dive into the clouds ----
    toArt(gDF); drawHaze(gDF, dt);
    DRAG.forEach((d) => {
      const ud = u - d.delay;
      if (ud < 0) { alive = true; return; }
      if (!d.out) {
        d.out = true; p1.classList.add(d.mirror ? "looseR" : "looseL");
        for (let k = 0; k < 10; k++) puffs.push({ x: d.anchor.x + rnd(-110, 110), y: d.anchor.y + rnd(-40, 150), r: rnd(50, 120), vx: rnd(-70, 70), vy: rnd(-50, 50), life: rnd(1.1, 1.8), age: 0 });
      }
      const fade = 1 - smooth((ud - (d.diveT - 0.4)) / 0.5);   // dissolves into golden smoke as the real dragon rises
      if (fade > 0.01) {
        alive = true;
        const { P, R } = bodyAt(d, ud);
        toArt(gDF);
        drawKit(gDF, P, R, { alpha: fade, exp, t: ud, flip: d.mirror });
        const nH = fade < 0.95 ? 6 : 2;
        for (let k = 0; k < nH; k++) { const i = ((Math.random() * NPTS) | 0), q = P[i]; haze.push({ x: q.x, y: q.y, r: R[i] * rnd(2.2, 3.4), vx: rnd(-20, 20), vy: rnd(-24, 6), life: rnd(1.1, 1.8), age: 0 }); }
        // the cloud sea swallows it
        if (ud > d.diveT - 0.35 && ud < d.diveT + 0.4) for (let k = 0; k < 2; k++) puffs.push({ x: d.ex + rnd(-80, 80), y: d.ey + rnd(0, 80), r: rnd(55, 110), vx: rnd(-40, 40), vy: rnd(-40, -5), life: rnd(1.2, 1.9), age: 0 });
      }
      if (ud < 0.5) flash(gDF, d.anchor.x, d.anchor.y + 60, 220, 0.9 * (1 - ud / 0.5));
    });
    toArt(gDF); drawPuffs(gDF, dt, puffs);

    // ---- 2. the real dragon rises from that same spot and coils round the gate ----
    gDF.setTransform(DPR, 0, 0, DPR, 0, 0);
    DRAG.forEach((d) => {
      const ud = u - d.delay;
      if (d.done || ud < d.diveT - 0.25) return;
      alive = true;
      if (!d.vOn) { d.vOn = true; try { d.v.currentTime = V0; } catch (e) {} d.v.play().catch(() => {}); }
      const vt = d.v.currentTime;
      if (vt >= V_END || d.v.ended || (d.mirror && vt >= V_RFADE + 0.7)) { d.done = true; d.v.pause(); return; }
      if (d.v.readyState < 2) return;
      let src = d.c;
      if (!rawMode) { try { keyFrame(d); } catch (e) { rawMode = true; cvDF.style.mixBlendMode = "screen"; } }
      if (rawMode) src = d.v;
      let a = smooth((vt - V0) / 0.35);
      if (d.mirror) a *= 1 - smooth((vt - V_RFADE) / 0.7);
      else a *= 1 - smooth((vt - (V_END - 0.45)) / 0.45);
      const b = clipBox(d), grow = d.mirror ? 1 : 1 + 0.5 * smooth((vt - 8.6) / 0.8);
      const bw = b.bw * grow, bh = b.bh * grow;
      gDF.save(); gDF.globalAlpha = a; gDF.translate(b.cx, b.cy);
      if (d.mirror) gDF.scale(-1, 1);
      gDF.drawImage(src, -bw / 2, -bh / 2, bw, bh);
      gDF.restore();
      if (!d.mirror && !swapped && vt >= V_SWAP) { swapped = true; showPage2(); }
    });
    if (!alive) endFlight();
  }
  function endFlight() {
    flying = false; puffs.length = 0; haze.length = 0;
    DRAG.forEach((d) => d.v.pause());
    if (!swapped) { swapped = true; showPage2(); }
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
    p1.classList.remove("loose", "flying", "awaken", "in", "looseL", "looseR");
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
    if (flying) { try { flightFrame(dt); } catch (e) { console.error(e); endFlight(); } }
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
