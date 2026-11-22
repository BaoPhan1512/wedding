/* Thiệp cưới — mã hiển thị. Thông tin cưới nằm trong config.js, không cần sửa file này. */
(function () {
  "use strict";
  const C = window.WEDDING;
  if (!C) { document.body.innerHTML = "<p style='padding:2rem'>Không đọc được config.js — kiểm tra lại dấu phẩy, ngoặc kép.</p>"; return; }

  /* ---------- Tiện ích ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const parseDate = (d) => { const [y, m, day] = String(d).split("-").map(Number); return { y, m, d: day }; };
  const weekday = (ds) => { const p = parseDate(ds); return WEEKDAYS[new Date(p.y, p.m - 1, p.d).getDay()]; };
  const eventMoment = (ev) => new Date(`${ev.date}T${ev.time || "00:00"}:00+07:00`);

  /* ---------- Âm lịch (thuật toán Hồ Ngọc Đức, múi giờ +7) ---------- */
  const Lunar = (() => {
    const INT = Math.floor, PI = Math.PI;
    function jdFromDate(dd, mm, yy) {
      const a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
      let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
      if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
      return jd;
    }
    function newMoon(k, tz) {
      const T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
      let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
      Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
      const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
      const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
      const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
      let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
      C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
      C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
      C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
      C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
      C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
      C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
      const deltat = T < -11
        ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
        : -0.000278 + 0.000265 * T + 0.000262 * T2;
      return INT(Jd1 + C1 - deltat + 0.5 + tz / 24);
    }
    function sunLong(jdn, tz) {
      const T = (jdn - 2451545.5 - tz / 24) / 36525, T2 = T * T, dr = PI / 180;
      const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
      const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
      let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
      DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
      let L = (L0 + DL) * dr;
      L = L - PI * 2 * INT(L / (PI * 2));
      return INT((L / PI) * 6);
    }
    function month11(yy, tz) {
      const off = jdFromDate(31, 12, yy) - 2415021, k = INT(off / 29.530588853);
      let nm = newMoon(k, tz);
      if (sunLong(nm, tz) >= 9) nm = newMoon(k - 1, tz);
      return nm;
    }
    function leapOffset(a11, tz) {
      const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
      let last, i = 1, arc = sunLong(newMoon(k + i, tz), tz);
      do { last = arc; i++; arc = sunLong(newMoon(k + i, tz), tz); } while (arc !== last && i < 14);
      return i - 1;
    }
    function convert(dd, mm, yy, tz = 7) {
      const dayNumber = jdFromDate(dd, mm, yy), k = INT((dayNumber - 2415021.076998695) / 29.530588853);
      let monthStart = newMoon(k + 1, tz);
      if (monthStart > dayNumber) monthStart = newMoon(k, tz);
      let a11 = month11(yy, tz), b11 = a11, lunarYear;
      if (a11 >= monthStart) { lunarYear = yy; a11 = month11(yy - 1, tz); }
      else { lunarYear = yy + 1; b11 = month11(yy + 1, tz); }
      const lunarDay = dayNumber - monthStart + 1, diff = INT((monthStart - a11) / 29);
      let leap = 0, lunarMonth = diff + 11;
      if (b11 - a11 > 365) {
        const ld = leapOffset(a11, tz);
        if (diff >= ld) { lunarMonth = diff + 10; if (diff === ld) leap = 1; }
      }
      if (lunarMonth > 12) lunarMonth -= 12;
      if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
      return { day: lunarDay, month: lunarMonth, year: lunarYear, leap };
    }
    const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
    const canChi = (y) => `${CAN[(y + 6) % 10]} ${CHI[(y + 8) % 12]}`;
    return { convert, canChi };
  })();
  const lunarText = (ds) => {
    const p = parseDate(ds), l = Lunar.convert(p.d, p.m, p.y);
    return `(Tức ngày ${l.day} tháng ${l.month}${l.leap ? " nhuận" : ""} năm ${Lunar.canChi(l.year)})`;
  };

  /* ---------- Biểu tượng vẽ nét (tự vẽ) ---------- */
  const S = 'fill="none" stroke="#3c5f94" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"';
  const ICONS = {
    rings: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fbf7ef" stroke="#c9d5e8" stroke-width="2"/>
      <g ${S}><circle cx="41" cy="58" r="16"/><circle cx="59" cy="58" r="16"/>
      <path d="M53 41 l6 -8 l6 8 l-6 5 z" fill="#dce6f4"/><path d="M53 41 h12"/></g>
      <path d="M74 26 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" fill="#c8323c"/></svg>`,
    camera: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fbf7ef" stroke="#c9d5e8" stroke-width="2"/>
      <g ${S}><rect x="22" y="36" width="56" height="36" rx="6" fill="#dce6f4"/><path d="M38 36 l4 -7 h16 l4 7"/>
      <circle cx="50" cy="54" r="11" fill="#fbf7ef"/><circle cx="50" cy="54" r="5"/><path d="M68 43 h4"/></g>
      <path d="M50 22 c-3 -4 -9 -1 -6 3 l6 5 l6 -5 c3 -4 -3 -7 -6 -3z" fill="#c8323c"/></svg>`,
    glasses: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fbf7ef" stroke="#c9d5e8" stroke-width="2"/>
      <g ${S}><path d="M30 28 l14 4 l-3 16 c-1 6 -8 8 -12 4 c-3 -3 -3 -6 -2 -9 z" fill="#dce6f4" transform="rotate(-8 36 40)"/>
      <path d="M35 53 l-3 16 M26 70 h12" transform="rotate(-8 36 40)"/>
      <path d="M70 28 l-14 4 l3 16 c1 6 8 8 12 4 c3 -3 3 -6 2 -9 z" fill="#dce6f4" transform="rotate(8 64 40)"/>
      <path d="M65 53 l3 16 M62 70 h12" transform="rotate(8 64 40)"/></g>
      <g fill="#c8323c"><circle cx="50" cy="20" r="2"/><circle cx="44" cy="16" r="1.4"/><circle cx="56" cy="15" r="1.6"/></g></svg>`,
    heart: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fbf7ef" stroke="#c9d5e8" stroke-width="2"/>
      <path d="M50 74 C22 56 24 34 38 31 c6 -1 10 2 12 7 c2 -5 6 -8 12 -7 c14 3 16 25 -12 43z" fill="#dce6f4" ${S}/></svg>`,
    plane: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fbf7ef" stroke="#c9d5e8" stroke-width="2"/>
      <g ${S}><path d="M22 52 L78 30 L62 72 L50 58 Z" fill="#dce6f4"/><path d="M78 30 L50 58 L48 70 L56 63"/></g></svg>`,
    bouquet: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fbf7ef" stroke="#c9d5e8" stroke-width="2"/>
      <g ${S}><path d="M50 52 L44 80 M50 52 L50 82 M50 52 L56 80"/>
      <circle cx="40" cy="36" r="8" fill="#fbf7ef"/><circle cx="58" cy="32" r="9" fill="#fbf7ef"/><circle cx="50" cy="46" r="7" fill="#fbf7ef"/>
      <path d="M44 66 c-6 -4 -8 2 -2 4 M56 66 c6 -4 8 2 2 4" stroke="#4a6fa5"/></g>
      <g fill="#c8323c"><circle cx="40" cy="36" r="2.5"/><circle cx="58" cy="32" r="3"/><circle cx="50" cy="46" r="2.3"/></g></svg>`,
  };
  const BOUQUET_BIG = `<svg viewBox="0 0 120 150" aria-hidden="true"><g ${S}>
      <path d="M60 80 L46 140 M60 80 L60 144 M60 80 L74 140"/>
      <path d="M60 80 c-14 -10 -26 -6 -30 -18 M60 80 c14 -10 26 -6 30 -18" />
      <path d="M38 52 c-10 -6 -8 -18 2 -16 c2 -10 14 -8 13 2 c8 0 8 12 -1 14 c-2 8 -12 8 -14 0z" fill="#fbf7ef"/>
      <path d="M68 40 c-8 -8 -2 -18 6 -14 c4 -8 16 -4 12 4 c8 4 2 14 -6 12 c-4 6 -12 4 -12 -2z" fill="#fbf7ef"/>
      <path d="M54 66 c-6 -6 0 -14 6 -10 c6 -4 12 4 6 10 c2 6 -10 8 -12 0z" fill="#fbf7ef"/>
      <path d="M30 30 c-6 -2 -8 -10 -2 -12 M92 54 c6 -2 8 -10 2 -12"/></g>
      <g fill="#c8323c"><circle cx="45" cy="44" r="3.5"/><circle cx="77" cy="32" r="3.5"/><circle cx="60" cy="62" r="3"/></g>
      <g fill="none" stroke="#4a6fa5" stroke-width="3" stroke-linecap="round"><path d="M60 112 c-12 -10 -22 -2 -12 4 c6 3 12 0 12 -4 c0 4 6 7 12 4 c10 -6 0 -14 -12 -4z"/><path d="M56 116 l-8 18 M64 116 l8 18"/></g></svg>`;
  const PAPER_HEART = `<svg viewBox="0 0 100 92"><path d="M50 90 C8 62 0 40 10 22 C20 4 42 6 50 24 Z" fill="#d23a44"/>
      <path d="M50 90 C92 62 100 40 90 22 C80 4 58 6 50 24 Z" fill="#b2232e"/>
      <path d="M50 24 L50 90" stroke="#8e1a23" stroke-width="1" opacity=".5"/></svg>`;
  const PAPER_PLANE = `<svg viewBox="0 0 280 130" aria-hidden="true">
      <path d="M38 98 C26 86 28 72 40 72 c6 0 9 4 10 8 c1 -4 5 -8 11 -8 c12 0 14 14 2 26 l-13 12z" fill="#c8323c"/>
      <path d="M68 86 C110 70 130 110 170 80 S 210 50 222 46" fill="none" stroke="#7d9cc8" stroke-width="2.4" stroke-dasharray="6 7" stroke-linecap="round"/>
      <g class="fly"><path d="M206 52 L268 18 L246 74 L232 60 Z" fill="#fbf7ef" stroke="#3c5f94" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M268 18 L232 60 L230 76 L240 67" fill="#dce6f4" stroke="#3c5f94" stroke-width="2.6" stroke-linejoin="round"/></g></svg>`;
  const ENVELOPE = (withFlap) => `<svg viewBox="0 0 320 226" role="img" aria-label="Phong bì thiệp cưới">
      <defs>
        <linearGradient id="eb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a80b8"/><stop offset="1" stop-color="#3f639b"/></linearGradient>
        <linearGradient id="ef" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c71a8"/><stop offset="1" stop-color="#5d83bb"/></linearGradient>
        <radialGradient id="ws" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#e6b378"/><stop offset=".6" stop-color="#c08a4a"/><stop offset="1" stop-color="#8f5f2c"/></radialGradient>
      </defs>
      <rect x="2" y="2" width="316" height="222" rx="10" fill="url(#eb)"/>
      <path d="M4 222 L160 112 L316 222" fill="none" stroke="#86a6d3" stroke-width="1.5" opacity=".7"/>
      <path d="M4 4 L120 120 M316 4 L200 120" stroke="#2f4f82" stroke-width="1" opacity=".35"/>
      <path class="flap" d="M2 10 Q2 2 12 2 H308 Q318 2 318 10 L160 128 Z" fill="url(#ef)" stroke="#86a6d3" stroke-width="1.2" ${withFlap ? "" : ""}/>
      <g class="seal">
        <path d="M160 92 c8 -1 12 4 18 4 c5 2 4 9 8 13 c3 6 -2 10 -1 16 c-1 7 -8 7 -12 12 c-5 4 -11 1 -17 3 c-7 0 -9 -6 -15 -9 c-6 -4 -4 -10 -7 -16 c-2 -6 3 -10 4 -16 c3 -6 9 -5 14 -8z" fill="url(#ws)"/>
        <circle cx="160" cy="114" r="15" fill="none" stroke="#9a6a35" stroke-width="2" opacity=".7"/>
        <path d="M160 124 c-10 -6 -12 -12 -8 -16 c3 -3 7 -1 8 2 c1 -3 5 -5 8 -2 c4 4 2 10 -8 16z" fill="#a8743c" stroke="#7d5226" stroke-width="1"/>
      </g>
      <g fill="#fff"><circle cx="60" cy="60" r="1.6"/><circle cx="262" cy="160" r="1.3"/><circle cx="96" cy="182" r="1.2"/><circle cx="250" cy="54" r="1"/></g>
    </svg>`;
  const ICON_SEND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>`;
  const ICON_GIFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>`;
  const HEART_STAMP = `<svg viewBox="0 0 100 92" aria-hidden="true"><path d="M50 88 C10 62 0 38 12 20 C24 4 44 8 50 24 C56 8 76 4 88 20 C100 38 90 62 50 88Z" fill="#c8323c"/></svg>`;

  /* ---------- Dữ liệu dẫn xuất ---------- */
  const events = C.events || [];
  const main = events[C.mainEvent] || events[0] || { date: "2027-01-01", time: "00:00" };
  const mainP = parseDate(main.date);
  const first = C.nameFirst === "groom" ? C.groom : C.bride;
  const second = C.nameFirst === "groom" ? C.bride : C.groom;
  const famFirst = C.nameFirst === "groom" ? C.families.groom : C.families.bride;
  const famSecond = C.nameFirst === "groom" ? C.families.bride : C.families.groom;
  const P = C.photos || {};
  const album = (P.album || []).filter(Boolean);
  document.title = C.pageTitle || `Thiệp cưới ${first.name} & ${second.name}`;

  /* ---------- Dựng trang ---------- */
  const h = [];
  h.push(`
  <section class="sec" id="top">
    <h1 class="t-vibes hero-title reveal">${esc(C.heroTitle)}</h1>
    <div class="hero-names reveal"><span class="nm">${esc(first.name)}</span><span class="amp">&amp;</span><span class="nm">${esc(second.name)}</span></div>
    <div class="hero-info reveal">
      <div>${mainP.d} tháng ${pad(mainP.m)}<br>${mainP.y}</div><span class="div"></span>
      <div>${esc(main.time)}<br>${esc(weekday(main.date))}</div><span class="div"></span>
      <div>${esc(C.heroVenue || main.address)}</div>
    </div>
  </section>
  <img class="photo-wide reveal" src="${esc(P.hero)}" alt="Ảnh cưới" loading="eager">
  <section class="sec">
    <div class="big-date reveal">${pad(mainP.d)}.${pad(mainP.m)}.${mainP.y}</div>
    <div class="rule reveal"></div>
    ${C.quote ? `<p class="t-quote reveal">“${esc(C.quote)}”</p>` : ""}
  </section>
  <div class="env-wrap reveal zoom"><div class="env-float">${ENVELOPE()}</div><div class="env-shadow"></div></div>
  <section class="sec">
    <div class="families reveal">
      <div><div class="fam-title">${esc(famFirst.title)}</div><div class="fam-names">${esc(famFirst.father)}<br>${esc(famFirst.mother)}</div><div class="fam-addr">${esc(famFirst.address)}</div></div>
      <span class="line"></span>
      <div><div class="fam-title">${esc(famSecond.title)}</div><div class="fam-names">${esc(famSecond.father)}<br>${esc(famSecond.mother)}</div><div class="fam-addr">${esc(famSecond.address)}</div></div>
    </div>
    <div class="big-names" style="margin-top:calc(var(--u)*9)">
      <div class="nm reveal">${esc(first.name)}</div>
      <div class="and reveal">and</div>
      <div class="nm reveal">${esc(second.name)}</div>
    </div>
    <p class="invite reveal">${esc(C.invitation)}</p>
  </section>
  ${P.invite ? `<img class="photo-wide reveal" src="${esc(P.invite)}" alt="Ảnh cưới" loading="lazy">` : ""}`);

  events.forEach((ev, i) => {
    const p = parseDate(ev.date);
    h.push(`
  <section class="sec event">
    <h2 class="t-serif ev-name reveal">${esc(ev.name)}</h2>
    <div class="ev-time reveal">Vào lúc ${esc(ev.time)} · ${esc(weekday(ev.date))}</div>
    <div class="ev-date reveal"><div class="side">Tháng ${pad(p.m)}</div><div class="day">${pad(p.d)}</div><div class="side">Năm ${p.y}</div></div>
    <div class="ev-lunar reveal">${esc(ev.lunar || lunarText(ev.date))}</div>
    <div class="ev-addr reveal">${esc(ev.address)}</div>
    ${ev.mapUrl ? `<a class="btn reveal" href="${esc(ev.mapUrl)}" target="_blank" rel="noopener">📍 Xem chỉ đường</a>` : ""}
    ${i < events.length - 1 ? `<div class="ev-sep"></div>` : ""}
  </section>`);
  });

  if ((C.timeline || []).length) {
    h.push(`
  <section class="sec">
    <h2 class="t-script sec-title reveal">Timeline</h2>
    <div class="t-label reveal">Lịch trình ngày vui</div>
    <div class="timeline" style="--n:${C.timeline.length}">
      ${C.timeline.map((t, i) => `<div class="tl-item reveal" style="transition-delay:${i * 0.15}s"><div class="tl-icon">${ICONS[t.icon] || ICONS.heart}</div><div class="tl-time">${esc(t.time)}</div><div class="tl-label">${esc(t.label)}</div></div>`).join("")}
    </div>
  </section>`);
  }

  if (C.dressCode && C.dressCode.enabled !== false) {
    h.push(`
  <section class="sec">
    <h2 class="t-script sec-title reveal">Dress code</h2>
    <div class="t-label reveal">Gợi ý trang phục cho ngày vui</div>
    <div class="dots">${C.dressCode.colors.map((c, i) => `<div class="dot-item reveal zoom" style="transition-delay:${i * 0.1}s"><div class="dot" style="background:${esc(c.color)}"></div><div class="dot-name">${esc(c.name)}</div></div>`).join("")}</div>
    ${C.dressCode.note ? `<p class="t-body dress-note reveal">${esc(C.dressCode.note)}</p>` : ""}
  </section>`);
  }

  const brideFirst = C.nameFirst !== "groom";
  const cpl = brideFirst ? [["Cô dâu", C.bride], ["Chú rể", C.groom]] : [["Chú rể", C.groom], ["Cô dâu", C.bride]];
  h.push(`
  <section class="sec">
    <div class="couple">
      ${cpl.map(([lbl, p]) => `<div class="reveal"><div class="arch"><img src="${esc(p.photo)}" alt="${esc(lbl)}" loading="lazy"></div><div class="t-script who">${lbl}</div><div class="who-name">${esc(p.name)}</div></div>`).join("")}
      <div class="paper-heart" aria-hidden="true">${PAPER_HEART}</div>
    </div>
  </section>`);

  if (C.story && C.story.enabled !== false) {
    h.push(`
  <section class="sec">
    <div class="story-head">
      <div class="t-label reveal">${esc(C.story.subtitle)}</div>
      <h2 class="t-script reveal">${esc(C.story.title)}</h2>
      <div class="plane reveal">${PAPER_PLANE}</div>
    </div>
    <div class="t-body story-text">${C.story.paragraphs.map((p) => `<p class="reveal">${esc(p)}</p>`).join("")}</div>
  </section>`);
  }

  // Lịch tháng cưới
  const firstDow = (new Date(mainP.y, mainP.m - 1, 1).getDay() + 6) % 7; // T2 = 0
  const daysIn = new Date(mainP.y, mainP.m, 0).getDate();
  let cells = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((w) => `<div class="wd">${w}</div>`).join("");
  for (let i = 0; i < firstDow; i++) cells += `<div></div>`;
  for (let d = 1; d <= daysIn; d++) cells += d === mainP.d ? `<div class="d wed">${HEART_STAMP}${d}</div>` : `<div class="d">${d}</div>`;
  h.push(`
  <section class="sec">
    <div class="cal-head reveal"><div><div class="t-script month">Tháng ${mainP.m}</div><div class="t-label" style="color:var(--ink)">Năm ${mainP.y}</div></div>${BOUQUET_BIG}</div>
    <div class="cal-card reveal"><div class="cal-grid">${cells}</div></div>
  </section>`);

  h.push(`
  <section class="sec full countdown">
    ${P.countdown ? `<img class="bg" src="${esc(P.countdown)}" alt="" loading="lazy">` : ""}
    <h2 class="t-script reveal">${esc(C.countdownTitle || "Ngày vui sắp đến…")}</h2>
    <div class="cd-boxes reveal" id="cd">
      <div class="cd-box"><b data-k="d">0</b><span>Ngày</span></div>
      <div class="cd-box"><b data-k="h">00</b><span>Giờ</span></div>
      <div class="cd-box"><b data-k="m">00</b><span>Phút</span></div>
      <div class="cd-box"><b data-k="s">00</b><span>Giây</span></div>
    </div>
  </section>`);

  if (P.memory) {
    h.push(`
  <section class="sec">
    <div class="memory">
      <div class="frame reveal"><img src="${esc(P.memory)}" alt="Kỷ niệm" loading="lazy"></div>
      <div class="words reveal"><div class="t-script w1">Kỷ niệm</div><div class="t-script w2">của</div><div class="t-script w3">chúng mình</div></div>
    </div>
  </section>`);
  }

  if (album.length) {
    h.push(`
  <section class="sec">
    <div class="album-main reveal">
      <div class="slides" id="slides"><div class="track">${album.map((s, i) => `<img src="${esc(s)}" alt="Ảnh ${i + 1}" loading="lazy" data-i="${i}">`).join("")}</div></div>
      <div class="album-nav"><button type="button" id="prev" aria-label="Ảnh trước">‹</button><span class="album-count" id="count">01 / ${pad(album.length)}</span><button type="button" id="next" aria-label="Ảnh sau">›</button></div>
    </div>
    <div class="thumbs reveal" id="thumbs">${album.map((s, i) => `<img src="${esc(s)}" alt="" loading="lazy" data-i="${i}">`).join("")}</div>
  </section>`);
  }

  if (C.rsvp && C.rsvp.enabled !== false) {
    const max = C.rsvp.maxGuests || 10;
    h.push(`
  <section class="sec" id="rsvp">
    <h2 class="t-serif reveal" style="font-size:calc(var(--u)*7)">${esc(C.rsvp.title || "Xác nhận tham dự")}</h2>
    <p class="t-quote reveal" style="margin-top:calc(var(--u)*2)">${esc(C.rsvp.intro)}</p>
    <form class="form-card reveal" id="rsvpForm" novalidate>
      <div class="field"><label for="f-name">Họ và tên *</label><input type="text" id="f-name" name="name" required autocomplete="name" placeholder="Tên của bạn"></div>
      <div class="field"><label for="f-phone">Số điện thoại</label><input type="tel" id="f-phone" name="phone" autocomplete="tel" placeholder="09xx xxx xxx"></div>
      <div class="field"><span class="lbl">Bạn có tham dự không?</span>
        <div class="choices">
          <div><input type="radio" id="a-yes" name="attend" value="Sẽ tham dự" checked><label for="a-yes">💙 Sẽ tham dự</label></div>
          <div><input type="radio" id="a-no" name="attend" value="Không tham dự"><label for="a-no">Rất tiếc 😢</label></div>
        </div></div>
      <div class="field" id="guestsField"><label for="f-guests">Số người tham dự (bao gồm bạn)</label>
        <select id="f-guests" name="guests">${Array.from({ length: max }, (_, i) => `<option>${i + 1}</option>`).join("")}</select></div>
      <div class="field"><label for="f-side">Bạn là khách của</label>
        <select id="f-side" name="side"><option>${esc(C.families.groom.title)}</option><option>${esc(C.families.bride.title)}</option><option>Cả hai</option></select></div>
      <div class="field"><label for="f-msg">Lời nhắn gửi cô dâu chú rể</label><textarea id="f-msg" name="message" placeholder="Viết đôi dòng chúc phúc…"></textarea></div>
      <button class="btn" type="submit">Gửi phản hồi</button>
      <div class="form-msg" id="rsvpMsg" role="status"></div>
    </form>
  </section>`);
  }

  if (C.gift && C.gift.enabled !== false) {
    h.push(`
  <section class="sec" id="gift">
    <h2 class="t-serif reveal" style="font-size:calc(var(--u)*7)">${esc(C.gift.title)}</h2>
    <p class="t-body reveal">${esc(C.gift.hint)}</p>
    <button class="red-env reveal" type="button" id="openGift" aria-label="Mở hộp mừng cưới">
      <span class="xi">囍</span>
      <span class="txt"><b>Gửi chút yêu thương</b><small>Để gửi quà mừng cưới tới cô dâu, chú rể</small><em>ẤN VÀO ĐÂY →</em></span>
    </button>
  </section>`);
  }

  h.push(`
  <section class="sec thanks">
    ${P.thankYou ? `<img src="${esc(P.thankYou)}" alt="" loading="lazy">` : ""}
    <div class="over">
      <p class="t-quote reveal">${esc(C.thankYou.message)}</p>
      <div class="t-script reveal">${esc(C.thankYou.title)}</div>
    </div>
  </section>`);

  $("#card").innerHTML = h.join("");

  /* ---------- Giao diện nổi: nhạc, lời chúc, modal ---------- */
  const ui = $("#ui");
  const accHtml = (C.gift?.accounts || []).map((a) => {
    const qr = a.qrImage || (a.bankId && a.accountNo
      ? `https://img.vietqr.io/image/${encodeURIComponent(a.bankId)}-${encodeURIComponent(a.accountNo)}-qr_only.png?accountName=${encodeURIComponent(a.accountName || "")}`
      : "");
    return `<div class="acc">
      ${a.label ? `<div class="lab">${esc(a.label)}</div>` : ""}
      <div class="bank">${esc(a.bank)}</div>
      ${qr ? `<img class="qr" src="${esc(qr)}" alt="Mã QR ${esc(a.bank)}" loading="lazy" onerror="this.remove()">` : ""}
      <dl><dt>Chủ tài khoản</dt><dd>${esc(a.accountName)}</dd><dt>Số tài khoản</dt><dd>${esc(a.accountNo)}</dd></dl>
      <button class="btn copy" type="button" data-copy="${esc(a.accountNo)}">Sao chép số tài khoản</button>
    </div>`;
  }).join("");

  ui.innerHTML = `
    ${C.music ? `<button class="music-btn" id="musicBtn" type="button" aria-label="Bật/tắt nhạc">♫</button><audio id="bgm" src="${esc(C.music)}" loop preload="auto"></audio>` : ""}
    ${C.wishes?.enabled !== false ? `<div class="bubbles" id="bubbles" aria-live="polite"></div>` : ""}
    <form class="wish-bar" id="wishBar" autocomplete="off">
      ${C.wishes?.enabled !== false ? `<input id="wishInput" maxlength="200" placeholder="Gửi lời chúc…" aria-label="Gửi lời chúc"><button class="icon-btn" type="submit" aria-label="Gửi lời chúc">${ICON_SEND}</button>` : `<span style="flex:1"></span>`}
      ${C.gift?.enabled !== false ? `<button class="icon-btn gift" type="button" id="giftBtn" aria-label="Mừng cưới">${ICON_GIFT}</button>` : ""}
    </form>
    <div class="modal hidden" id="giftModal" role="dialog" aria-modal="true" aria-label="Quà mừng cưới">
      <div class="modal-box"><button class="modal-x" type="button" data-close aria-label="Đóng">×</button>
        <div style="font-size:30px;color:var(--red)">囍</div><h3>Quà mừng cưới</h3><p class="sub">${esc(C.gift?.message)}</p>${accHtml}</div>
    </div>
    <div class="modal hidden" id="nameModal" role="dialog" aria-modal="true" aria-label="Tên của bạn">
      <div class="modal-box"><button class="modal-x" type="button" data-close aria-label="Đóng">×</button>
        <h3>Bạn tên là gì?</h3><p class="sub">Để cô dâu chú rể biết lời chúc này của ai nhé</p>
        <form id="nameForm"><div class="field"><input type="text" id="wishName" required maxlength="40" placeholder="Tên của bạn" style="text-align:center"></div><button class="btn" type="submit" style="width:100%;justify-content:center">Gửi lời chúc</button></form></div>
    </div>
    <div class="modal lightbox hidden" id="lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh">
      <button class="modal-x" type="button" data-close aria-label="Đóng">×</button>
      <button class="lb-nav lb-prev" type="button" aria-label="Ảnh trước">‹</button>
      <img alt="Ảnh cưới phóng to">
      <button class="lb-nav lb-next" type="button" aria-label="Ảnh sau">›</button>
    </div>`;

  const toast = (msg) => { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); };
  const openModal = (m) => { m.classList.remove("hidden"); };
  const closeModal = (m) => { m.classList.add("hidden"); };
  $$(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-close]")) closeModal(m); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".modal").forEach(closeModal); });

  /* ---------- Nhạc ---------- */
  const audio = $("#bgm"), mBtn = $("#musicBtn");
  const playMusic = () => { if (!audio) return; audio.play().then(() => mBtn.classList.add("playing")).catch(() => {}); };
  if (audio) {
    mBtn.addEventListener("click", () => { if (audio.paused) playMusic(); else { audio.pause(); mBtn.classList.remove("playing"); } });
    audio.addEventListener("error", () => mBtn.remove());
  }

  /* ---------- Màn mở thiệp ---------- */
  if (C.opening && C.opening.enabled !== false) {
    const o = document.createElement("div");
    o.className = "opening";
    o.innerHTML = `<div class="o-title">${esc(C.heroTitle)}</div><div class="o-names">${esc(first.name)} &amp; ${esc(second.name)}</div>
      <button class="env-btn" type="button" aria-label="Mở thiệp">${ENVELOPE(true)}</button><div class="o-hint">${esc(C.opening.hint)}</div>`;
    document.body.appendChild(o);
    document.body.classList.add("locked");
    const open = () => {
      o.classList.add("open"); playMusic();
      setTimeout(() => o.classList.add("gone"), 200);
      setTimeout(() => { document.body.classList.remove("locked"); o.remove(); startReveal(); }, 1600);
    };
    o.addEventListener("click", open, { once: true });
  } else {
    document.addEventListener("click", playMusic, { once: true });
    startRevealSoon();
  }
  function startRevealSoon() { requestAnimationFrame(startReveal); }

  /* ---------- Hiện dần khi cuộn ---------- */
  function startReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Lấp lánh ---------- */
  if (C.sparkles !== false) {
    const box = $("#sparkles");
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("i");
      const size = 5 + Math.random() * 8;
      s.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-duration:${9 + Math.random() * 10}s;animation-delay:${-Math.random() * 18}s;--dx:${(Math.random() - 0.5) * 120}px`;
      box.appendChild(s);
    }
  }

  /* ---------- Đếm ngược ---------- */
  const target = eventMoment(main).getTime();
  const cd = $("#cd");
  const tick = () => {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const hh = Math.floor(diff / 36e5); diff -= hh * 36e5;
    const mm = Math.floor(diff / 6e4); const ss = Math.floor((diff - mm * 6e4) / 1e3);
    cd.querySelector('[data-k="d"]').textContent = d;
    cd.querySelector('[data-k="h"]').textContent = pad(hh);
    cd.querySelector('[data-k="m"]').textContent = pad(mm);
    cd.querySelector('[data-k="s"]').textContent = pad(ss);
  };
  tick(); setInterval(tick, 1000);

  /* ---------- Album ---------- */
  if (album.length) {
    let idx = 0;
    const track = $("#slides .track"), thumbs = $$("#thumbs img"), count = $("#count");
    const go = (i) => {
      idx = (i + album.length) % album.length;
      track.style.transform = `translateX(${-idx * 100}%)`;
      count.textContent = `${pad(idx + 1)} / ${pad(album.length)}`;
      thumbs.forEach((t, k) => t.classList.toggle("on", k === idx));
      const tb = $("#thumbs"), t = thumbs[idx];
      if (tb && t) tb.scrollTo({ left: t.offsetLeft - tb.offsetLeft - (tb.clientWidth - t.clientWidth) / 2, behavior: "smooth" });
    };
    $("#prev").onclick = () => go(idx - 1);
    $("#next").onclick = () => go(idx + 1);
    thumbs.forEach((t) => (t.onclick = () => go(+t.dataset.i)));
    let auto = setInterval(() => go(idx + 1), 4500);
    const slides = $("#slides");
    let x0 = null;
    slides.addEventListener("pointerdown", (e) => { x0 = e.clientX; clearInterval(auto); });
    slides.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1)); else openLightbox(idx);
    });
    go(0);
    // Phóng to
    const lb = $("#lightbox"), lbImg = $("#lightbox img");
    let li = 0;
    const showLb = (i) => { li = (i + album.length) % album.length; lbImg.src = album[li]; };
    function openLightbox(i) { showLb(i); openModal(lb); }
    $(".lb-prev", lb).onclick = (e) => { e.stopPropagation(); showLb(li - 1); };
    $(".lb-next", lb).onclick = (e) => { e.stopPropagation(); showLb(li + 1); };
    let lx = null;
    lb.addEventListener("touchstart", (e) => (lx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { if (lx === null) return; const dx = e.changedTouches[0].clientX - lx; lx = null; if (Math.abs(dx) > 40) showLb(li + (dx < 0 ? 1 : -1)); });
  }

  /* ---------- Gửi dữ liệu về Google Sheets ---------- */
  const SCRIPT = (C.googleScriptUrl || "").trim();
  const send = (data) => {
    if (!SCRIPT) return Promise.resolve(false);
    const body = new URLSearchParams({ ...data, time: new Date().toLocaleString("vi-VN") });
    return fetch(SCRIPT, { method: "POST", mode: "no-cors", body }).then(() => true).catch(() => false);
  };

  /* ---------- Xác nhận tham dự ---------- */
  const form = $("#rsvpForm");
  if (form) {
    const gf = $("#guestsField");
    form.addEventListener("change", () => gf.classList.toggle("hidden", form.attend.value !== "Sẽ tham dự"));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = $("#rsvpMsg");
      if (!form.name.value.trim()) { msg.textContent = "Bạn nhập giúp tên nhé!"; form.name.focus(); return; }
      const btn = form.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Đang gửi…";
      const data = { type: "rsvp", name: form.name.value.trim(), phone: form.phone.value.trim(), attend: form.attend.value, guests: form.attend.value === "Sẽ tham dự" ? form.guests.value : "0", side: form.side.value, message: form.message.value.trim() };
      await send(data);
      if (data.message) addWish({ name: data.name, text: data.message }, true);
      try { localStorage.setItem("rsvp-sent", "1"); } catch (_) {}
      btn.textContent = "Đã gửi ✓";
      msg.textContent = data.attend === "Sẽ tham dự" ? "Cảm ơn bạn! Hẹn gặp bạn trong ngày vui nhé 💙" : "Cảm ơn bạn đã báo cho chúng mình biết 💙";
    });
  }

  /* ---------- Lời chúc bay lên ---------- */
  const bubbles = $("#bubbles");
  let wishes = [...(C.wishes?.samples || [])], wi = 0;
  function addWish(w, mine) {
    if (!bubbles || !w.text) return;
    wishes.push(w);
    if (mine) showBubble(w);
  }
  function showBubble(w) {
    const b = document.createElement("div");
    b.className = "bubble";
    b.innerHTML = `<b>${esc(w.name)}:</b> ${esc(w.text)}`;
    bubbles.appendChild(b);
    const list = $$(".bubble:not(.out)", bubbles);
    if (list.length > 3) { const o = list[0]; o.classList.add("out"); setTimeout(() => o.remove(), 500); }
    setTimeout(() => { b.classList.add("out"); setTimeout(() => b.remove(), 500); }, 9000);
  }
  if (bubbles) {
    setInterval(() => { if (!wishes.length || document.hidden) return; showBubble(wishes[wi++ % wishes.length]); }, 2800);
    if (SCRIPT) {
      fetch(SCRIPT + (SCRIPT.includes("?") ? "&" : "?") + "action=wishes").then((r) => r.json()).then((list) => {
        if (Array.isArray(list) && list.length) { wishes = list.filter((w) => w.text); wi = 0; }
      }).catch(() => {});
    }
  }
  const wishBar = $("#wishBar"), wishInput = $("#wishInput"), nameModal = $("#nameModal");
  let guestName = ""; try { guestName = localStorage.getItem("guest-name") || ""; } catch (_) {}
  const submitWish = async () => {
    const text = wishInput.value.trim(); if (!text) return;
    wishInput.value = "";
    addWish({ name: guestName, text }, true);
    await send({ type: "wish", name: guestName, message: text });
    toast("Đã gửi lời chúc, cảm ơn bạn! 💙");
  };
  wishBar.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!wishInput || !wishInput.value.trim()) return;
    if (!guestName) { openModal(nameModal); setTimeout(() => $("#wishName").focus(), 50); return; }
    submitWish();
  });
  $("#nameForm").addEventListener("submit", (e) => {
    e.preventDefault();
    guestName = $("#wishName").value.trim(); if (!guestName) return;
    try { localStorage.setItem("guest-name", guestName); } catch (_) {}
    closeModal(nameModal); submitWish();
  });

  /* ---------- Hộp mừng cưới ---------- */
  const giftModal = $("#giftModal");
  [$("#openGift"), $("#giftBtn")].forEach((b) => b && b.addEventListener("click", () => openModal(giftModal)));
  giftModal.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    const v = b.dataset.copy;
    try { await navigator.clipboard.writeText(v); }
    catch (_) { const t = document.createElement("textarea"); t.value = v; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
    toast("Đã sao chép số tài khoản");
  });
})();
