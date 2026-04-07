"use client";
import { useState, useMemo } from "react";
import membersRaw from "../data/members.json";
import metaRaw from "../data/meta.json";

/* ── Data Transform ─────────────────────────────────────────────── */
const D = Object.entries(membersRaw).map(([name, d]) => ({
  n: name, t: d.tier, s: d.score, m: d.msgs, l: d.links,
  w: d.avgWords, ad: d.activeDays, aw: d.activeWeeks,
  la: d.lastActive, di: d.daysInactive,
  vs: d.components.volume, cs: d.components.consistency,
  ss: d.components.substance, rs: d.components.recency,
  u: d.isFounder, history: d.history,
  p: d.pillars || { network: 0, intelligence: 0, capital: 0 },
  pc: d.pillarComponents || {},
  co: d.composite || 0,
}));

const META = metaRaw;
const SNAP = META.snapshots.find(s => s.id === META.currentSnapshot) || META.snapshots[0];
const SRC = (META.sourceStats && META.sourceStats[META.currentSnapshot]) || [];
const PIL = META.pillars || {};
const PW = META.pillarWeights || { network: 0.25, intelligence: 0.40, capital: 0.35 };

/* ── Tier Config ────────────────────────────────────────────────── */
const TC = {
  A: { label: "Active", color: "#10b981", bg: "#052e16", bgL: "#064e3b", icon: "⚡" },
  B: { label: "Watch", color: "#f59e0b", bg: "#422006", bgL: "#78350f", icon: "👁" },
  C: { label: "Remove", color: "#ef4444", bg: "#450a0a", bgL: "#7f1d1d", icon: "🪓" },
  Z: { label: "Zombie", color: "#6b21a8", bg: "#2e1065", bgL: "#4c1d95", icon: "🧟" },
};

const PCOL = { network: "#3b82f6", intelligence: "#8b5cf6", capital: "#10b981" };

/* ── KPI Engine ─────────────────────────────────────────────────── */
function kpis(d) {
  const nn = d.length, tot = d.reduce((a, x) => a + x.m, 0), lnk = d.reduce((a, x) => a + x.l, 0);
  const you = d.find(x => x.u), yM = you?.m || 0, yL = you?.l || 0;
  const c5 = d.filter(x => x.m >= 5).length, a7 = d.filter(x => x.di <= 7).length;
  const deep = d.filter(x => x.w >= 15).length, lk = d.filter(x => x.l >= 3).length;
  const sh = d.map(x => x.m / tot);
  const ent = -sh.reduce((a, p) => a + (p > 0 ? p * Math.log2(p) : 0), 0);
  const subM = d.filter(x => x.w >= 10).reduce((a, x) => a + x.m, 0);
  const tw = d.reduce((a, x) => a + x.w * x.m, 0);
  const noY = d.filter(x => !x.u);
  const t5 = [...noY].sort((a, b) => b.m - a.m).slice(0, 5);
  const t5m = t5.reduce((a, x) => a + x.m, 0);
  const lurk = d.filter(x => x.m < 3).length;
  const avgW = d.reduce((a, x) => a + x.aw, 0) / nn;
  const days = SNAP.days;
  // Pillar averages (non-zombie only)
  const active = d.filter(x => x.t !== "Z");
  const an = active.length || 1;
  const avgNet = active.reduce((a, x) => a + x.p.network, 0) / an;
  const avgInt = active.reduce((a, x) => a + x.p.intelligence, 0) / an;
  const avgCap = active.reduce((a, x) => a + x.p.capital, 0) / an;
  const avgCo = active.reduce((a, x) => a + x.co, 0) / an;
  return {
    nn, tot, lnk, yM, yL, c5, a7, deep, lk, days,
    kd: ent / Math.log2(nn), sn: subM / tot, nd: lk / nn,
    fM: yM / tot, fL: yL / lnk, vel: tot / days, dep: tw / tot,
    t5, t5m, t5p: t5m / (tot - yM), lurk, lurkP: lurk / nn, avgW,
    dw: d.filter(x => x.t === "C").length + d.filter(x => x.t === "B" && x.di > 60).length + d.filter(x => x.t === "Z").length,
    tA: d.filter(x => x.t === "A").length, tB: d.filter(x => x.t === "B").length,
    tC: d.filter(x => x.t === "C").length, tZ: d.filter(x => x.t === "Z").length,
    avgNet, avgInt, avgCap, avgCo,
  };
}

/* ── Micro Components ───────────────────────────────────────────── */
const G = ({ v, mx = 1, lb, sub, c, sz = 76 }) => {
  const ci = 2 * Math.PI * 29, o = ci * (1 - Math.min(v / mx, 1));
  return (<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
    <svg width={sz} height={sz} viewBox="0 0 74 74">
      <circle cx="37" cy="37" r="29" fill="none" stroke="#1a1a2e" strokeWidth="5" />
      <circle cx="37" cy="37" r="29" fill="none" stroke={c} strokeWidth="5" strokeDasharray={ci} strokeDashoffset={o} strokeLinecap="round" transform="rotate(-90 37 37)" style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x="37" y="35" textAnchor="middle" fill={c} fontSize="14" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{v < 10 ? v.toFixed(1) : Math.round(v)}</text>
      <text x="37" y="46" textAnchor="middle" fill="#6b7280" fontSize="7.5">{sub}</text>
    </svg>
    <div style={{ fontSize: 9, color: "#9ca3af", textAlign: "center", lineHeight: 1.2, maxWidth: 82, fontWeight: 500 }}>{lb}</div>
  </div>);
};

const KPI = ({ icon, title, value, sub, color, alert }) => (
  <div style={{ background: "#111118", borderRadius: 10, padding: "11px 13px", border: `1px solid ${alert ? color + "40" : "#1e1e2e"}`, flex: "1 1 140px", minWidth: 140 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}><span style={{ fontSize: 12 }}>{icon}</span><span style={{ fontSize: 9, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</span></div>
    <div style={{ fontSize: 21, fontWeight: 700, color, fontFamily: "'JetBrains Mono',monospace" }}>{value}</div>
    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>{sub}</div>
  </div>
);

const Br = ({ v, mx = 100, c }) => (<div style={{ width: "100%", height: 5, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${(v / mx) * 100}%`, height: "100%", background: c, borderRadius: 3, transition: "width 0.6s ease" }} /></div>);

const Mn = ({ lb, v, mx = 30, c }) => (<div style={{ flex: 1, minWidth: 68 }}>
  <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 2, letterSpacing: "0.05em" }}>{lb}</div>
  <div style={{ fontSize: 12, fontWeight: 600, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{typeof v === "number" ? v.toFixed(1) : v}</div>
  <div style={{ width: "100%", height: 3, background: "#1a1a2e", borderRadius: 2, marginTop: 2 }}><div style={{ width: `${(typeof v === "number" ? v : 0) / mx * 100}%`, height: "100%", background: c, borderRadius: 2 }} /></div>
</div>);

const Ins = ({ icon, title, body, color }) => (
  <div style={{ background: "#111118", borderRadius: 10, padding: "13px 15px", border: `1px solid ${color}25`, marginBottom: 10, display: "flex", gap: 11, alignItems: "flex-start" }}>
    <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
    <div><div style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 3 }}>{title}</div>
    <div style={{ fontSize: 11, color: "#b0b0c0", lineHeight: 1.55 }}>{body}</div></div>
  </div>
);

/* ── Radar Chart (Triangle) ─────────────────────────────────────── */
const Radar = ({ net, int, cap, size = 90 }) => {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const angles = [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI / 3), -Math.PI / 2 + (4 * Math.PI / 3)];
  const pts = (vals) => vals.map((v, i) => {
    const a = angles[i], d = (v / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  });
  const grid = pts([100, 100, 100]);
  const grid50 = pts([50, 50, 50]);
  const data = pts([net, int, cap]);
  const poly = (p) => p.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={poly(grid)} fill="none" stroke="#1e1e2e" strokeWidth="1" />
      <polygon points={poly(grid50)} fill="none" stroke="#1e1e2e" strokeWidth="0.5" strokeDasharray="2,2" />
      {grid.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#1e1e2e" strokeWidth="0.5" />)}
      <polygon points={poly(data)} fill="#10b98115" stroke="#10b981" strokeWidth="1.5" />
      {data.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={[PCOL.network, PCOL.intelligence, PCOL.capital][i]} />)}
      <text x={cx} y={8} textAnchor="middle" fill={PCOL.network} fontSize="7" fontWeight="600">🔗{net}</text>
      <text x={size - 4} y={size - 6} textAnchor="end" fill={PCOL.intelligence} fontSize="7" fontWeight="600">🧠{int}</text>
      <text x={4} y={size - 6} textAnchor="start" fill={PCOL.capital} fontSize="7" fontWeight="600">💰{cap}</text>
    </svg>
  );
};

/* ── Pillar Bar (horizontal) ────────────────────────────────────── */
const PillarBar = ({ label, icon, value, color, max = 100 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
    <span style={{ fontSize: 11, width: 16 }}>{icon}</span>
    <div style={{ flex: 1 }}>
      <div style={{ width: "100%", height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s" }} />
      </div>
    </div>
    <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "'JetBrains Mono',monospace", width: 28, textAlign: "right" }}>{value}</span>
  </div>
);

/* ── Member Card ────────────────────────────────────────────────── */
const Card = ({ m, rank, exp, tog }) => {
  const tc = TC[m.t];
  const hasHistory = m.history && m.history.length > 1;
  const prev = hasHistory ? m.history[m.history.length - 2] : null;
  const delta = prev && prev.composite != null ? m.co - prev.composite : null;
  return (
    <div onClick={tog} style={{ background: exp ? tc.bgL : "#111118", border: `1px solid ${exp ? tc.color + "40" : "#1e1e2e"}`, borderRadius: 10, padding: "10px 13px", cursor: "pointer", transition: "all 0.2s", marginBottom: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: tc.bg, border: `2px solid ${tc.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: tc.color, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{rank}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, color: "#e5e7eb", fontSize: 13 }}>{m.n}{m.u ? " 👑" : ""}</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, fontWeight: 600, background: tc.bg, color: tc.color, border: `1px solid ${tc.color}30` }}>{tc.icon} {tc.label}</span>
            {delta !== null && <span style={{ fontSize: 9, fontWeight: 700, color: delta > 0 ? "#10b981" : delta < 0 ? "#ef4444" : "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}>{delta > 0 ? "▲" : delta < 0 ? "▼" : "="}{Math.abs(delta).toFixed(0)}</span>}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 9, color: PCOL.network, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>🔗{m.p.network}</span>
            <span style={{ fontSize: 9, color: PCOL.intelligence, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>🧠{m.p.intelligence}</span>
            <span style={{ fontSize: 9, color: PCOL.capital, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>💰{m.p.capital}</span>
            <span style={{ fontSize: 9, color: "#6b7280" }}>·</span>
            <span style={{ fontSize: 9, color: m.di > 30 ? "#ef4444" : m.di > 14 ? "#f59e0b" : "#6b7280" }}>{m.di === 0 ? "today" : `${m.di}d ago`}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: tc.color, fontFamily: "'JetBrains Mono',monospace" }}>{m.co}</div>
          <div style={{ width: 52 }}><Br v={m.co} c={tc.color} /></div>
        </div>
      </div>
      {exp && (<div style={{ marginTop: 11, paddingTop: 9, borderTop: `1px solid ${tc.color}20` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Radar net={m.p.network} int={m.p.intelligence} cap={m.p.capital} size={100} />
          <div style={{ flex: 1, minWidth: 150 }}>
            <PillarBar label="Network" icon="🔗" value={m.p.network} color={PCOL.network} />
            <PillarBar label="Intelligence" icon="🧠" value={m.p.intelligence} color={PCOL.intelligence} />
            <PillarBar label="Capital" icon="💰" value={m.p.capital} color={PCOL.capital} />
            <div style={{ borderTop: "1px solid #1e1e2e", marginTop: 6, paddingTop: 6 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Mn lb="VOLUME" v={m.vs} mx={30} c="#6b7280" />
                <Mn lb="CONSISTENCY" v={m.cs} mx={25} c="#6b7280" />
                <Mn lb="RECENCY" v={m.rs} mx={25} c="#6b7280" />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 13, marginTop: 7, flexWrap: "wrap" }}>
          {[["Msgs", m.m], ["Links", m.l], ["Avg words", m.w], ["Active days", `${m.ad}/${SNAP.days}`], ["Last", m.la]].map(([a, b]) => (
            <div key={a} style={{ fontSize: 10, color: "#9ca3af" }}><span style={{ color: "#6b7280" }}>{a}:</span> {b}</div>
          ))}
        </div>
        {hasHistory && (<div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${tc.color}10` }}>
          <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Trajectory</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {m.history.map((h, i) => (
              <div key={h.snapshot} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: i === m.history.length - 1 ? tc.bg : "#0a0a0f", border: `1px solid ${i === m.history.length - 1 ? tc.color + "30" : "#1e1e2e"}`, color: i === m.history.length - 1 ? tc.color : "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}>
                {h.snapshot}: {(h.composite != null ? h.composite : h.score || 0).toFixed ? (h.composite ?? h.score ?? 0) : 0} ({h.tier})
              </div>
            ))}
          </div>
        </div>)}
      </div>)}
    </div>
  );
};

/* ── Source helpers ──────────────────────────────────────────────── */
const srcColors = { "X/Twitter": "#3b82f6", "YouTube": "#8b5cf6", "Substack": "#10b981", "Instagram": "#ef4444", "TikTok": "#ef4444", "Bloomberg/Reuters/FT": "#f59e0b" };
const srcVerdicts = { "Primary alpha channel": "✓", "Deep content": "✓", "Analysis layer": "✓", "Junk food": "✗ (-2)", "Premium signal": "✓ (need more)" };

/* ── Main App ───────────────────────────────────────────────────── */
export default function App() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [exp, setExp] = useState(null);
  const [sort, setSort] = useState("composite");
  const [sec, setSec] = useState("intel");
  const k = useMemo(() => kpis(D), []);
  const filt = useMemo(() => {
    let r = [...D];
    if (filter !== "all") r = r.filter(x => x.t === filter);
    if (search) r = r.filter(x => x.n.toLowerCase().includes(search.toLowerCase()));
    if (sort === "composite") r.sort((a, b) => b.co - a.co);
    else if (sort === "network") r.sort((a, b) => b.p.network - a.p.network);
    else if (sort === "intelligence") r.sort((a, b) => b.p.intelligence - a.p.intelligence);
    else if (sort === "capital") r.sort((a, b) => b.p.capital - a.p.capital);
    else if (sort === "msgs") r.sort((a, b) => b.m - a.m);
    else if (sort === "inactive") r.sort((a, b) => b.di - a.di);
    else if (sort === "links") r.sort((a, b) => b.l - a.l);
    return r;
  }, [filter, search, sort]);
  const goM = (name) => { setSec("members"); setFilter("all"); setSearch(name); setExp(name); };

  // Top per pillar (non-founder, non-zombie)
  const active = D.filter(x => !x.u && x.t !== "Z");
  const topNet = [...active].sort((a, b) => b.p.network - a.p.network).slice(0, 5);
  const topInt = [...active].sort((a, b) => b.p.intelligence - a.p.intelligence).slice(0, 5);
  const topCap = [...active].sort((a, b) => b.p.capital - a.p.capital).slice(0, 5);

  return (<div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e5e7eb", fontFamily: "'Inter',-apple-system,sans-serif" }}>

    {/* Header */}
    <div style={{ padding: "22px 20px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>10AMPRO</span>
        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, background: "linear-gradient(135deg,#052e16,#1e1e2e)", color: "#10b981", fontWeight: 600, border: "1px solid #10b98130" }}>Collective Intelligence</span>
        {META.snapshots.length > 1 && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, background: "#1e1e2e", color: "#8b5cf6", fontWeight: 600, border: "1px solid #8b5cf630" }}>v{META.snapshots.length}</span>}
      </div>
      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>
        {SNAP.from.slice(5).replace("-", "/")} → {SNAP.to.slice(5).replace("-", "/")} · {k.nn} members · {k.tot.toLocaleString()} msgs · {SNAP.days}d
      </div>
    </div>

    {/* Tabs */}
    <div style={{ display: "flex", borderBottom: "1px solid #1e1e2e", padding: "0 20px", gap: 2, overflowX: "auto" }}>
      {[["intel", "🧠 Intelligence"], ["insights", "💡 Insights"], ["robes", "⚔️ Robespierre"], ["members", "👥 Members"]].map(([key, lb]) => (
        <button key={key} onClick={() => { setSec(key); if (key !== "members") { setSearch(""); setFilter("all"); } }} style={{ padding: "8px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", background: "transparent", border: "none", color: sec === key ? "#e5e7eb" : "#6b7280", borderBottom: sec === key ? "2px solid #10b981" : "2px solid transparent", whiteSpace: "nowrap" }}>{lb}</button>
      ))}
    </div>

    {/* ── TAB: Intelligence ──────────────────────────────────────── */}
    {sec === "intel" && (<div style={{ padding: "14px 20px 80px" }}>

      {/* Three Pillars Overview */}
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>⚡ Three Pillars of 10AMPRO</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { key: "network", icon: "🔗", label: "Network Sharing", desc: "Connecting people", avg: k.avgNet, c: PCOL.network, w: PW.network },
            { key: "intelligence", icon: "🧠", label: "Collective Intelligence", desc: "Making us smarter", avg: k.avgInt, c: PCOL.intelligence, w: PW.intelligence },
            { key: "capital", icon: "💰", label: "Open Source Capital", desc: "Showing your hand", avg: k.avgCap, c: PCOL.capital, w: PW.capital },
          ].map(p => (
            <div key={p.key} style={{ flex: "1 1 140px", minWidth: 140, background: "#0a0a0f", borderRadius: 10, padding: "14px 12px", border: `1px solid ${p.c}20` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#e5e7eb" }}>{p.label}</div>
                  <div style={{ fontSize: 9, color: "#6b7280" }}>{p.desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: p.c, fontFamily: "'JetBrains Mono',monospace" }}>{Math.round(p.avg)}</span>
                <span style={{ fontSize: 10, color: "#6b7280" }}>/ 100 avg</span>
              </div>
              <Br v={p.avg} c={p.c} />
              <div style={{ fontSize: 9, color: "#6b7280", marginTop: 4 }}>Weight: {(p.w * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12, padding: "8px 10px", background: "#0a0a0f", borderRadius: 8, border: "1px solid #1e1e2e" }}>
          <span style={{ fontSize: 10, color: "#6b7280" }}>Group Composite:</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#e5e7eb", fontFamily: "'JetBrains Mono',monospace" }}>{Math.round(k.avgCo)}</span>
          <span style={{ fontSize: 10, color: "#6b7280" }}>/ 100</span>
          <div style={{ flex: 1, marginLeft: 8 }}><Br v={k.avgCo} c="#10b981" /></div>
        </div>
      </div>

      {/* Top per pillar */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {[
          { label: "Top Networkers", icon: "🔗", data: topNet, key: "network", c: PCOL.network },
          { label: "Top Intelligence", icon: "🧠", data: topInt, key: "intelligence", c: PCOL.intelligence },
          { label: "Top Capital", icon: "💰", data: topCap, key: "capital", c: PCOL.capital },
        ].map(col => (
          <div key={col.key} style={{ flex: "1 1 180px", minWidth: 180, background: "#111118", borderRadius: 10, padding: "12px", border: `1px solid ${col.c}20` }}>
            <div style={{ fontSize: 10, color: col.c, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>{col.icon} {col.label}</div>
            {col.data.map((m, i) => (
              <div key={m.n} onClick={() => goM(m.n)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", cursor: "pointer", borderBottom: i < 4 ? "1px solid #1a1a2e" : "none" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: i < 3 ? col.c : "#6b7280", fontFamily: "'JetBrains Mono',monospace", width: 16 }}>{i + 1}</span>
                <span style={{ fontSize: 11, color: "#e5e7eb", flex: 1 }}>{m.n}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: col.c, fontFamily: "'JetBrains Mono',monospace" }}>{m.p[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* System Health Gauges */}
      <div style={{ background: "#111118", borderRadius: 12, padding: "14px 10px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>🧬 System Health</div>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 8 }}>
          <G v={k.kd * 100} mx={100} lb="Knowledge Distribution" sub="%" c="#8b5cf6" />
          <G v={k.sn * 100} mx={100} lb="Signal-to-Noise" sub="%" c="#10b981" />
          <G v={k.nd * 100} mx={100} lb="Network Density" sub="%" c="#3b82f6" />
          <G v={(1 - k.fM) * 100} mx={100} lb="Decentralization" sub="%" c="#f59e0b" />
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <KPI icon="🧠" title="Active Brains" value={k.c5} sub={`${((k.c5 / k.nn) * 100).toFixed(0)}% contribute 5+ msgs`} color="#10b981" />
        <KPI icon="🔗" title="Knowledge Inputs" value={k.lnk} sub={`${k.lk} members share sources`} color="#3b82f6" />
        <KPI icon="⚡" title="Velocity" value={`${k.vel.toFixed(0)}/d`} sub={`${(k.vel * 7).toFixed(0)} msgs/week`} color="#8b5cf6" />
        <KPI icon="📐" title="Depth" value={`${k.dep.toFixed(0)}w`} sub={`avg words · ${k.deep} deep writers`} color="#ec4899" />
        <KPI icon="🔥" title="7d Pulse" value={k.a7} sub={`${((k.a7 / k.nn) * 100).toFixed(0)}% active this week`} color="#10b981" />
        <KPI icon="🪓" title="Dead Weight" value={k.dw} sub="to cut for signal" color="#ef4444" alert />
      </div>
    </div>)}

    {/* ── TAB: Insights ──────────────────────────────────────────── */}
    {sec === "insights" && (<div style={{ padding: "14px 20px 80px" }}>

      {/* Pillar Health Insights */}
      <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #1e1e2e", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#e5e7eb", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📊 Pillar Diagnosis</div>
        {[
          { icon: "🔗", label: "Network Sharing", avg: k.avgNet, c: PCOL.network, strong: active.filter(x => x.p.network >= 60).length, weak: active.filter(x => x.p.network < 20 && x.p.network > 0).length, insight: "Most members consume but don't connect others. Intros and @mentions are the currency of network value." },
          { icon: "🧠", label: "Collective Intelligence", avg: k.avgInt, c: PCOL.intelligence, strong: active.filter(x => x.p.intelligence >= 60).length, weak: active.filter(x => x.p.intelligence < 20 && x.p.intelligence > 0).length, insight: "The group's strongest pillar — driven by a few prolific link-sharers and analysts. Need to distribute this more." },
          { icon: "💰", label: "Open Source Capital", avg: k.avgCap, c: PCOL.capital, strong: active.filter(x => x.p.capital >= 60).length, weak: active.filter(x => x.p.capital < 20 && x.p.capital > 0).length, insight: "The hardest pillar — requires vulnerability. 'I bought X, here's my thesis.' Most groups avoid this. 10AMPRO should own it." },
        ].map((p, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < 2 ? "1px solid #1e1e2e" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>{p.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#e5e7eb" }}>{p.label}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: p.c, fontFamily: "'JetBrains Mono',monospace", marginLeft: "auto" }}>{Math.round(p.avg)}</span>
              <span style={{ fontSize: 9, color: "#6b7280" }}>avg</span>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "#10b981" }}>✓ {p.strong} strong (60+)</span>
              <span style={{ fontSize: 10, color: "#ef4444" }}>✗ {p.weak} weak (&lt;20)</span>
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.5 }}>{p.insight}</div>
          </div>
        ))}
      </div>

      {/* Founder Dependency */}
      <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #f59e0b25", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>⚠️ Founder Dependency</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {[{ lb: "Msg Share", v: `${(k.fM * 100).toFixed(0)}%`, tg: "<15%", bad: k.fM > 0.15, c: "#f59e0b" }, { lb: "Link Share", v: `${(k.fL * 100).toFixed(0)}%`, tg: "<20%", bad: k.fL > 0.2, c: "#ef4444" }, { lb: "Msgs", v: k.yM.toLocaleString(), c: "#8b5cf6" }, { lb: "Links", v: k.yL, c: "#3b82f6" }].map(x => (
            <div key={x.lb} style={{ flex: "1 1 70px", minWidth: 70, background: x.bad ? "#422006" : "#0a0a0f", borderRadius: 8, padding: "9px 11px", border: `1px solid ${x.bad ? x.c + "30" : "#1e1e2e"}` }}>
              <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>{x.lb}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: x.c, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{x.v}</div>
              {x.tg && <div style={{ fontSize: 9, color: x.bad ? "#ef4444" : "#10b981", marginTop: 2 }}>target: {x.tg}</div>}
            </div>
          ))}
        </div>
      </div>

      <Ins icon="👻" title={`Lurker Ratio: ${(k.lurkP * 100).toFixed(0)}% have <3 messages`} color="#ef4444" body={`${k.lurk} of ${k.nn} members posted fewer than 3 messages in ${SNAP.days} days.`} />
      <Ins icon="🚌" title="Bus Factor: 1" color="#ef4444" body={`If Hernán stops, the group loses ${(k.fM * 100).toFixed(0)}% of messages and ${(k.fL * 100).toFixed(0)}% of links. Goal: raise to 5.`} />

      {/* Actionable Plays */}
      <div style={{ background: "#052e16", borderRadius: 12, padding: "14px 12px", border: "1px solid #10b98130", marginTop: 4 }}>
        <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>🎯 Pillar-Based Actions</div>
        {[
          { n: "1", t: "🔗 Network Challenge", d: "Each Tier A member introduces 1 person from their network to the group per month. Track intro count." },
          { n: "2", t: "🧠 Weekly Curator Rotation", d: "Top 5 each curate 3 quality links/week. Rotating topics: macro, crypto, AI, latam, wild card." },
          { n: "3", t: "💰 Friday Position Thread", d: "Weekly ritual: 'What did you buy/sell this week and why?' Even 2 sentences counts. Make transparency the norm." },
          { n: "4", t: "🪓 Cut dead weight", d: `Remove ${k.dw} members scoring 0 across all pillars. They add noise, not signal.` },
          { n: "5", t: "📊 Quarterly Pillar Audit", d: "Re-run every 90 days. Track each pillar's group average over time. The goal: all three above 50." },
        ].map(x => (<div key={x.n} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#10b98120", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#10b981", fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{x.n}</div>
          <div><div style={{ fontSize: 11, fontWeight: 600, color: "#e5e7eb" }}>{x.t}</div><div style={{ fontSize: 10, color: "#9ca3af", lineHeight: 1.5, marginTop: 1 }}>{x.d}</div></div>
        </div>))}
      </div>
    </div>)}

    {/* ── TAB: Robespierre ───────────────────────────────────────── */}
    {sec === "robes" && (<div style={{ padding: "14px 20px 80px" }}>
      <div style={{ background: "linear-gradient(135deg,#1a0a0a,#2e1065)", borderRadius: 12, padding: "20px 16px", border: "1px solid #6b21a830", marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>⚔️ La Guillotina</div>
        <div style={{ fontSize: 12, color: "#e5a0a0", lineHeight: 1.6 }}>Zero across all 3 pillars = instant execution. Strong on 1 but zero on 2 = watch list with specific challenge.</div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {[["Zombies", k.tZ, "#ef4444", "#450a0a", "Never typed once"], ["Tier C", k.tC, "#f97316", "#450a0a", "Posted then vanished"], ["Dormant B", D.filter(x => x.t === "B" && x.di > 60).length, "#f59e0b", "#422006", "60+ days silent"], ["Total Cut", k.dw, "#dc2626", "#1a0a2e", `${(k.dw / k.nn * 100).toFixed(0)}% of group`]].map(([lb, ct, c, bg, sub]) => (
          <div key={lb} style={{ flex: "1 1 100px", background: bg, borderRadius: 10, padding: "12px 14px", border: `1px solid ${c}30` }}>
            <div style={{ fontSize: 9, color: c, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{lb}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{ct}</div>
            <div style={{ fontSize: 10, color: c + "99" }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #1e1e2e", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#dc2626", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📜 Crimes Against Collective Intelligence</div>
        {[{ crime: "Zero on All Pillars", icon: "🧟", desc: "No networking, no intelligence, no capital sharing. Pure parasite.", count: k.tZ }, { crime: "Abandonment", icon: "💀", desc: "Posted a few times then went silent 65+ days.", count: k.tC }, { crime: "Dormancy", icon: "😴", desc: "Had activity but 60+ days inactive now.", count: D.filter(x => x.t === "B" && x.di > 60).length }].map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 2 ? "1px solid #1e1e2e" : "none", alignItems: "flex-start" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</span>
            <div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb" }}>{c.crime}</span><span style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", fontFamily: "'JetBrains Mono',monospace" }}>{c.count}</span></div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, lineHeight: 1.5 }}>{c.desc}</div></div>
          </div>
        ))}
      </div>
      {SRC.length > 0 && <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #1e1e2e", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📡 Group Information Diet</div>
        {SRC.map((s, i) => { const mx = Math.max(...SRC.map(x => x.count)); const c = srcColors[s.source] || "#6b7280"; return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < SRC.length - 1 ? "1px solid #1a1a2e" : "none" }}>
            <div style={{ width: 120, fontSize: 11, fontWeight: 500, color: "#e5e7eb" }}>{s.source}</div>
            <div style={{ flex: 1, height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${(s.count / mx) * 100}%`, height: "100%", background: c, borderRadius: 3 }} /></div>
            <div style={{ width: 40, fontSize: 12, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace", textAlign: "right" }}>{s.count}</div>
            <div style={{ width: 130, fontSize: 9, color: c }}>{s.verdict} {srcVerdicts[s.verdict] || ""}</div>
          </div>); })}
      </div>}
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #6b21a825", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#6b21a8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🧟 Zombies ({k.tZ})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {D.filter(x => x.t === "Z").sort((a, b) => a.n.localeCompare(b.n)).map(z => (<div key={z.n} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#2e1065", color: "#a78bfa", border: "1px solid #6b21a830" }}>{z.n}</div>))}
        </div>
      </div>
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #ef444425", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>💀 Deserters — Tier C ({k.tC})</div>
        {D.filter(x => x.t === "C").sort((a, b) => b.di - a.di).map(m => (<div key={m.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1a1a2e" }}><span style={{ fontSize: 12, color: "#e5e7eb" }}>{m.n}</span><div style={{ display: "flex", gap: 12, fontSize: 10, color: "#9ca3af" }}><span>{m.m} msgs</span><span style={{ color: "#ef4444" }}>{m.di}d silent</span></div></div>))}
      </div>
      <div style={{ background: "#052e16", borderRadius: 12, padding: "16px 14px", border: "1px solid #10b98130" }}>
        <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🔄 Path to Redemption</div>
        <div style={{ fontSize: 11, color: "#a0d4b8", lineHeight: 1.6, marginBottom: 8 }}>Pick your pillar. Prove your value in at least ONE:</div>
        {["🔗 Introduce 2 valuable contacts to the group", "🧠 Share 3 quality links/week for a month + engage in discussions", "💰 Post 4 investment theses with specific tickers and reasoning", "Accept that a second execution is permanent"].map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{i + 1}.</span>
            <span style={{ fontSize: 11, color: "#a0d4b8" }}>{r}</span>
          </div>
        ))}
      </div>
    </div>)}

    {/* ── TAB: Members ───────────────────────────────────────────── */}
    {sec === "members" && (<>
      <div style={{ padding: "12px 20px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[["Active", k.tA, "#10b981", "#052e16"], ["Watch", k.tB, "#f59e0b", "#422006"], ["Remove", k.tC, "#ef4444", "#450a0a"], ["Zombie", k.tZ, "#6b21a8", "#2e1065"]].map(([lb, ct, c, bg]) => (
          <div key={lb} style={{ flex: 1, minWidth: 85, padding: "9px 12px", borderRadius: 8, background: bg, border: `1px solid ${c}25` }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{ct}</div>
            <div style={{ fontSize: 10, color: c, opacity: 0.7, fontWeight: 500 }}>{lb}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        <input type="text" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, background: "#111118", border: "1px solid #1e1e2e", color: "#e5e7eb", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {[["all", "All"], ["A", "⚡ Active"], ["B", "👁 Watch"], ["C", "🪓 Remove"], ["Z", "🧟 Zombie"]].map(([key, lb]) => (
            <button key={key} onClick={() => setFilter(key)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid", cursor: "pointer", background: filter === key ? (key === "all" ? "#1e1e2e" : TC[key]?.bg || "#1e1e2e") : "transparent", color: filter === key ? (key === "all" ? "#e5e7eb" : TC[key]?.color || "#e5e7eb") : "#6b7280", borderColor: filter === key ? (key === "all" ? "#374151" : (TC[key]?.color || "") + "40") : "#1e1e2e" }}>{lb}</button>
          ))}
          <div style={{ flex: 1 }} />
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "5px 8px", borderRadius: 6, fontSize: 11, background: "#111118", border: "1px solid #1e1e2e", color: "#9ca3af", cursor: "pointer" }}>
            <option value="composite">Sort: Composite</option>
            <option value="network">Sort: 🔗 Network</option>
            <option value="intelligence">Sort: 🧠 Intelligence</option>
            <option value="capital">Sort: 💰 Capital</option>
            <option value="msgs">Sort: Messages</option>
            <option value="links">Sort: Links</option>
            <option value="inactive">Sort: Most Inactive</option>
          </select>
        </div>
      </div>
      <div style={{ padding: "0 20px 80px" }}>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 6, fontWeight: 500 }}>{filt.length} member{filt.length !== 1 ? "s" : ""}</div>
        {filt.map((m, i) => (<Card key={m.n} m={m} rank={i + 1} exp={exp === m.n} tog={() => setExp(exp === m.n ? null : m.n)} />))}
      </div>
    </>)}
  </div>);
}
