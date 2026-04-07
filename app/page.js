"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Buffer } from "buffer";
import membersRaw from "../data/members.json";
import metaRaw from "../data/meta.json";

// Polyfill Buffer for @solana/web3.js in browser
if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}

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
  panic: d.panicScore,
  panicFlags: d.panicFlags || [],
  persona: d.persona || {},
  highlights: d.highlights || [],
  savedBy: d.savedBy || null,
  savedUntil: d.savedUntil || null,
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
  const t5 = [...noY].sort((a, b) => b.m - a.m).slice(0, 10);
  const t5m = t5.reduce((a, x) => a + x.m, 0);
  const lurk = d.filter(x => x.m < 3).length;
  const avgW = d.reduce((a, x) => a + x.aw, 0) / nn;
  const days = META.snapshots.reduce((a, s) => a + s.days, 0);
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
  <div style={{ background: "#111118", borderRadius: 10, padding: "11px 13px", border: `1px solid ${alert ? color + "40" : "#1e1e2e"}`, flex: "1 1 100px", minWidth: 100 }}>
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
const Card = ({ m, rank, exp, tog, onPay, payingFor }) => {
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
            {m.panic !== null && m.panic >= 40 && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, fontWeight: 600, background: m.panic >= 80 ? "#450a0a" : "#422006", color: m.panic >= 80 ? "#ef4444" : "#f97316", border: `1px solid ${m.panic >= 80 ? "#ef444430" : "#f9731630"}` }}>🚨 {m.panic}</span>}
            {delta !== null && <span style={{ fontSize: 9, fontWeight: 700, color: delta > 0 ? "#10b981" : delta < 0 ? "#ef4444" : "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}>{delta > 0 ? "▲" : delta < 0 ? "▼" : "="}{Math.abs(delta).toFixed(0)}</span>}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 8, color: PCOL.network, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>🔗{m.p.network}</span>
            <span style={{ fontSize: 8, color: PCOL.intelligence, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>🧠{m.p.intelligence}</span>
            <span style={{ fontSize: 8, color: PCOL.capital, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>💰{m.p.capital}</span>
            <span style={{ fontSize: 8, color: "#6b7280" }}>·</span>
            <span style={{ fontSize: 8, color: m.di > 30 ? "#ef4444" : m.di > 14 ? "#f59e0b" : "#6b7280" }}>{m.di === 0 ? "today" : `${m.di}d ago`}</span>
          </div>
        </div>
        {/* Right side: Score OR Timer+Button (all in one row) */}
        {(m.t === "Z" || m.t === "C") && !m.savedBy ? (() => {
          const TOKEN = META.token || {};
          const timerDays = TOKEN.timerDays || 10;
          const auditDate = new Date('2026-04-07T00:00:00');
          const deadline = new Date(auditDate.getTime() + timerDays * 24 * 3600 * 1000);
          const now = new Date();
          const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
          const d = Math.floor(remaining / 86400);
          const h = Math.floor((remaining % 86400) / 3600);
          const mn = Math.floor((remaining % 3600) / 60);
          const urgent = d <= 3;
          const c = urgent ? "#ef4444" : "#f97316";
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap" }}>Stop the timer:</span>
              <span style={{ fontSize: 14 }}>⏰</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{d}</span>
              <span style={{ fontSize: 10, color: "#6b7280" }}>d</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{h}</span>
              <span style={{ fontSize: 10, color: "#6b7280" }}>hrs</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{mn}</span>
              <span style={{ fontSize: 10, color: "#6b7280" }}>min</span>
              <div onClick={e => { e.stopPropagation(); if (onPay) onPay(m.n); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: payingFor === m.n ? "linear-gradient(135deg, #6b7280, #4b5563)" : "linear-gradient(135deg, #f59e0b, #f97316)", borderRadius: 10, cursor: payingFor === m.n ? "wait" : "pointer", boxShadow: "0 2px 12px #f59e0b50", marginLeft: 4, opacity: payingFor && payingFor !== m.n ? 0.4 : 1 }}>
                {payingFor === m.n ? (
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#0a0a0f" }}>⏳ Signing...</span>
                ) : (<>
                  <img src="/logo.jpg" alt="" style={{ width: 18, height: 18, borderRadius: 5 }} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#0a0a0f" }}>Pay 10,000</span>
                </>)}
              </div>
            </div>
          );
        })() : (m.t === "Z" || m.t === "C") && m.savedBy ? (
          /* Saved on-chain — show green shield */
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div style={{ padding: "6px 14px", background: "#052e16", borderRadius: 10, border: "1px solid #10b98140", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>🛡️</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>Saved</div>
                <div style={{ fontSize: 8, color: "#6b728080", fontFamily: "'JetBrains Mono',monospace" }}>{m.savedBy.slice(0, 4)}...{m.savedBy.slice(-4)}</div>
              </div>
            </div>
            {m.txSig && <a href={`https://solscan.io/tx/${m.txSig}`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} style={{ fontSize: 8, color: "#6b7280", textDecoration: "underline" }}>tx</a>}
          </div>
        ) : !(m.t === "Z" || m.t === "C") ? (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: tc.color, fontFamily: "'JetBrains Mono',monospace" }}>{m.co}</div>
            <div style={{ width: 52 }}><Br v={m.co} c={tc.color} /></div>
          </div>
        ) : null}
      </div>
      {exp && (<div style={{ marginTop: 11, paddingTop: 9, borderTop: `1px solid ${tc.color}20` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
          <Radar net={m.p.network} int={m.p.intelligence} cap={m.p.capital} size={90} />
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            <PillarBar label="Network" icon="🔗" value={m.p.network} color={PCOL.network} />
            <PillarBar label="Intelligence" icon="🧠" value={m.p.intelligence} color={PCOL.intelligence} />
            <PillarBar label="Capital" icon="💰" value={m.p.capital} color={PCOL.capital} />
            {m.panic !== null && m.panic > 0 && (
              <div style={{ marginTop: 4, padding: "4px 8px", background: m.panic >= 60 ? "#450a0a" : "#1e1e2e", borderRadius: 6, border: `1px solid ${m.panic >= 60 ? "#ef444420" : "#f9731615"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10 }}>🚨</span>
                  <span style={{ fontSize: 10, color: m.panic >= 60 ? "#ef4444" : "#f97316", fontWeight: 600 }}>Panic: {m.panic}/100</span>
                  <div style={{ flex: 1, height: 3, background: "#1a1a2e", borderRadius: 2 }}><div style={{ width: `${m.panic}%`, height: "100%", background: m.panic >= 80 ? "#ef4444" : m.panic >= 60 ? "#f97316" : "#f59e0b", borderRadius: 2 }} /></div>
                </div>
                {m.panicFlags.length > 0 && <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 3, lineHeight: 1.4 }}>{m.panicFlags[0]}</div>}
              </div>
            )}
            <div style={{ borderTop: "1px solid #1e1e2e", marginTop: 6, paddingTop: 6 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Mn lb="VOLUME" v={m.vs} mx={30} c="#6b7280" />
                <Mn lb="CONSISTENCY" v={m.cs} mx={25} c="#6b7280" />
                <Mn lb="RECENCY" v={m.rs} mx={25} c="#6b7280" />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 7, flexWrap: "wrap", flexWrap: "wrap" }}>
          {[["Msgs", m.m], ["Links", m.l], ["Avg words", m.w], ["Active days", `${m.ad}/${SNAP.days}`], ["Last", m.la]].map(([a, b]) => (
            <div key={a} style={{ fontSize: 10, color: "#9ca3af" }}><span style={{ color: "#6b7280" }}>{a}:</span> {b}</div>
          ))}
        </div>
        {/* Persona */}
        {(m.persona.bio || m.persona.role || m.persona.tags?.length > 0 || m.persona.platforms?.length > 0) && (
          <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${tc.color}10` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: "#6b7280", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Profile</span>
              {m.persona.role && <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 99, background: "#1e1e2e", color: tc.color, fontWeight: 600, border: `1px solid ${tc.color}20` }}>{m.persona.role}</span>}
            </div>
            {m.persona.bio && <div style={{ fontSize: 11, color: "#b0b0c0", lineHeight: 1.5, marginBottom: 4 }}>{m.persona.bio}</div>}
            {m.persona.platforms?.length > 0 && (
              <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                {m.persona.platforms.map((pl, i) => (
                  <a key={i} href={pl.url || "#"} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 6, background: "#0a0a0f", color: "#3b82f6", border: "1px solid #3b82f620", textDecoration: "none", fontWeight: 500 }}>
                    {pl.type === "substack" ? "📝" : pl.type === "twitter" ? "𝕏" : pl.type === "youtube" ? "▶" : "🔗"} {pl.handle || pl.type}
                  </a>
                ))}
              </div>
            )}
            {m.persona.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {m.persona.tags.map((tag, i) => (
                  <span key={i} style={{ fontSize: 9, padding: "1px 7px", borderRadius: 99, background: "#1e1e2e", color: "#9ca3af", border: "1px solid #2a2a3e" }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Highlights */}
        {m.highlights?.length > 0 && (
          <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${tc.color}10` }}>
            <div style={{ fontSize: 9, color: "#06b6d4", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>💎 Best Contributions</div>
            {m.highlights.slice(0, 3).map((h, i) => {
              const HT = META.highlightTypes || {};
              const ht = HT[h.type] || { icon: "💡", color: "#6b7280", label: h.type };
              return (
                <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", borderBottom: i < Math.min(m.highlights.length, 3) - 1 ? "1px solid #1a1a2e" : "none" }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{ht.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 99, background: ht.color + "15", color: ht.color, fontWeight: 600 }}>{ht.label}</span>
                      {h.quality && <span style={{ fontSize: 8, color: "#f59e0b", fontFamily: "'JetBrains Mono',monospace" }}>★{h.quality}</span>}
                      {h.date && <span style={{ fontSize: 8, color: "#6b7280" }}>{h.date}</span>}
                    </div>
                    <div style={{ fontSize: 10, color: "#9ca3af", lineHeight: 1.4, marginTop: 1 }}>{h.summary}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

/* ── Network Node Map ───────────────────────────────────────────── */
const NodeMap = ({ data, goM }) => {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [dims, setDims] = useState({ w: 360, h: 340 });
  const nodesRef = useRef(null);
  const animRef = useRef(null);

  // Build nodes and edges from member data
  const { nodes, edges } = useMemo(() => {
    // Only include non-zombie members with some activity
    const active = data.filter(x => x.t !== "Z" && x.m > 0);
    const nodes = active.map((m, i) => ({
      id: i, name: m.n, tier: m.t, co: m.co, msgs: m.m,
      network: m.p.network, intelligence: m.p.intelligence, capital: m.p.capital,
      isFounder: m.u,
      // Size based on composite (min 4, max 18)
      r: Math.max(4, Math.min(18, 4 + (m.co / 100) * 14)),
      // Start position: random within bounds
      x: 0, y: 0, vx: 0, vy: 0,
    }));

    // Generate edges: connect members who overlap in activity patterns
    // Higher overlap = stronger connection. Use active weeks + active days as proxy
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      const a = active[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = active[j];
        // Connection strength: both active in same time window
        // Proxy: min(weeks_a, weeks_b) / max(weeks_a, weeks_b) * activity overlap
        const weekOverlap = Math.min(a.aw, b.aw) / Math.max(a.aw, b.aw, 1);
        const dayOverlap = Math.min(a.ad, b.ad) / Math.max(a.ad, b.ad, 1);
        const strength = (weekOverlap * 0.6 + dayOverlap * 0.4);
        // Only connect if reasonable overlap and both somewhat active
        if (strength > 0.4 && a.aw >= 3 && b.aw >= 3) {
          edges.push({ source: i, target: j, strength });
        } else if (strength > 0.6 && (a.aw >= 2 || b.aw >= 2)) {
          edges.push({ source: i, target: j, strength: strength * 0.5 });
        }
      }
    }
    return { nodes, edges };
  }, [data]);

  // Simple force simulation
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    // Initialize positions in a circle
    nodes.forEach((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const dist = 60 + Math.random() * 80;
      n.x = cx + Math.cos(angle) * dist;
      n.y = cy + Math.sin(angle) * dist;
      n.vx = 0; n.vy = 0;
    });
    nodesRef.current = nodes;

    let frame = 0;
    const maxFrames = 200;

    const tick = () => {
      frame++;
      const alpha = Math.max(0.001, 1 - frame / maxFrames);

      // Forces
      nodes.forEach(n => { n.vx *= 0.85; n.vy *= 0.85; });

      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = -800 * alpha / (d * d);
          const fx = (dx / d) * force, fy = (dy / d) * force;
          nodes[i].vx -= fx; nodes[i].vy -= fy;
          nodes[j].vx += fx; nodes[j].vy += fy;
        }
      }

      // Attraction along edges
      edges.forEach(e => {
        const a = nodes[e.source], b = nodes[e.target];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (d - 50) * 0.02 * e.strength * alpha;
        const fx = (dx / d) * force, fy = (dy / d) * force;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      });

      // Center gravity
      nodes.forEach(n => {
        n.vx += (cx - n.x) * 0.008 * alpha;
        n.vy += (cy - n.y) * 0.008 * alpha;
      });

      // Apply velocities and bounds
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(n.r + 4, Math.min(W - n.r - 4, n.x));
        n.y = Math.max(n.r + 4, Math.min(H - n.r - 4, n.y));
      });

      // Draw
      ctx.clearRect(0, 0, W, H);

      // Edges
      edges.forEach(e => {
        const a = nodes[e.source], b = nodes[e.target];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(255,255,255,${0.03 + e.strength * 0.06})`;
        ctx.lineWidth = 0.5 + e.strength;
        ctx.stroke();
      });

      // Nodes
      const hov = nodesRef.current?.find(n => n.name === (typeof window !== "undefined" ? window.__robHover : null));
      nodes.forEach(n => {
        const isHov = hov && n.name === hov.name;
        const tierColor = TC[n.tier]?.color || "#6b7280";

        // Glow for hovered
        if (isHov) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 6, 0, Math.PI * 2);
          ctx.fillStyle = tierColor + "30";
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isHov ? tierColor : tierColor + "90";
        ctx.fill();
        ctx.strokeStyle = isHov ? "#fff" : tierColor;
        ctx.lineWidth = isHov ? 2 : 1;
        ctx.stroke();

        // Founder crown
        if (n.isFounder) {
          ctx.font = `${Math.max(8, n.r * 0.8)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("👑", n.x, n.y - n.r - 3);
        }

        // Name label for large or hovered nodes
        if (n.r >= 10 || isHov) {
          ctx.font = `${isHov ? "bold " : ""}${isHov ? 10 : 8}px 'Inter',sans-serif`;
          ctx.textAlign = "center";
          ctx.fillStyle = isHov ? "#fff" : "#9ca3af";
          const label = n.name.split(" ")[0];
          ctx.fillText(label, n.x, n.y + n.r + 11);
        }

        // Composite score inside node if big enough
        if (n.r >= 8) {
          ctx.font = `bold ${Math.max(7, n.r * 0.65)}px 'JetBrains Mono',monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#fff";
          ctx.fillText(n.co, n.x, n.y);
          ctx.textBaseline = "alphabetic";
        }
      });

      if (frame < maxFrames) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [nodes, edges]);

  // Mouse interaction
  const handleMouse = useCallback((e) => {
    if (!canvasRef.current || !nodesRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    let found = null;
    for (const n of nodesRef.current) {
      const dx = mx - n.x, dy = my - n.y;
      if (dx * dx + dy * dy < (n.r + 4) * (n.r + 4)) { found = n; break; }
    }
    if (typeof window !== "undefined") window.__robHover = found?.name || null;
    setHovered(found);
    canvasRef.current.style.cursor = found ? "pointer" : "default";
  }, []);

  const handleClick = useCallback(() => { if (hovered) goM(hovered.name); }, [hovered, goM]);

  return (
    <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>🌐 Network Node Map</div>
        <div style={{ fontSize: 9, color: "#6b7280" }}>Node size = composite · Color = tier · Click to view member</div>
      </div>
      <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", background: "#0a0a0f", border: "1px solid #1e1e2e" }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{ width: "100%", height: "auto", display: "block" }}
          onMouseMove={handleMouse}
          onMouseLeave={() => { if (typeof window !== "undefined") window.__robHover = null; setHovered(null); }}
          onClick={handleClick}
        />
        {hovered && (
          <div style={{ position: "absolute", top: 8, right: 8, background: "#111118ee", borderRadius: 8, padding: "8px 12px", border: `1px solid ${TC[hovered.tier]?.color || "#6b7280"}30`, backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#e5e7eb" }}>{hovered.name}{hovered.isFounder ? " 👑" : ""}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 10 }}>
              <span style={{ color: PCOL.network, fontWeight: 600 }}>🔗{hovered.network}</span>
              <span style={{ color: PCOL.intelligence, fontWeight: 600 }}>🧠{hovered.intelligence}</span>
              <span style={{ color: PCOL.capital, fontWeight: 600 }}>💰{hovered.capital}</span>
            </div>
            <div style={{ fontSize: 10, color: TC[hovered.tier]?.color, fontWeight: 600, marginTop: 2 }}>Composite: {hovered.co} · {hovered.msgs} msgs</div>
          </div>
        )}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
        {[["A", "Active"], ["B", "Watch"], ["C", "Remove"]].map(([t, lb]) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: TC[t].color }} />
            <span style={{ fontSize: 9, color: "#6b7280" }}>{lb}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 14, height: 2, background: "#ffffff20", borderRadius: 1 }} />
          <span style={{ fontSize: 9, color: "#6b7280" }}>Activity overlap</span>
        </div>
      </div>
    </div>
  );
};

/* ── Solana Pay to Stay ─────────────────────────────────────────── */
const TOKEN = META.token || {};
const SOL_CONFIG = {
  mint: TOKEN.mint || "6P5McDuhznaedKjnCvfe9iEjtCfVLyZhSqe93TZtawky",
  burn: TOKEN.burnAddress || "EGEYg4GYbfdUpEeL6RByTSTiuZYckNJ1EwUGACY6UezG",
  cost: TOKEN.costToStay || 10000,
  decimals: TOKEN.decimals || 9,
  timerDays: TOKEN.timerDays || 10,
  rpc: "https://mainnet.helius-rpc.com/?api-key=d4d1c413-f308-4627-acf4-be837d854089",
  memoProgram: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
};

async function connectWallet() {
  const provider = window?.solana || window?.phantom?.solana || window?.backpack?.solana;
  if (!provider) {
    window.open("https://phantom.app/", "_blank");
    return null;
  }
  try {
    const resp = await provider.connect();
    return { publicKey: resp.publicKey.toString(), provider };
  } catch (e) {
    console.error("Wallet connect failed:", e);
    return null;
  }
}

async function buildPayTransaction(walletPubkey, memberName, provider) {
  try {
    const solanaWeb3 = await import("@solana/web3.js");
    const splToken = await import("@solana/spl-token");
    const { Connection, PublicKey, Transaction, TransactionInstruction } = solanaWeb3;
    const { getAssociatedTokenAddressSync, createTransferInstruction, createAssociatedTokenAccountInstruction } = splToken;

    const conn = new Connection(SOL_CONFIG.rpc, "confirmed");
    const senderPk = new PublicKey(walletPubkey);
    const mintPk = new PublicKey(SOL_CONFIG.mint);
    const burnPk = new PublicKey(SOL_CONFIG.burn);

    // Derive ATAs synchronously (no RPC call)
    const senderATA = getAssociatedTokenAddressSync(mintPk, senderPk);
    const burnATA = getAssociatedTokenAddressSync(mintPk, burnPk);

    // Check sender has enough tokens using getParsedAccountInfo
    const senderAcctInfo = await conn.getParsedAccountInfo(senderATA);
    if (!senderAcctInfo.value) {
      throw new Error("No $10AMPRO tokens found in this wallet");
    }
    const parsedData = senderAcctInfo.value.data;
    if (parsedData && parsedData.parsed) {
      const balance = Number(parsedData.parsed.info?.tokenAmount?.uiAmount || 0);
      if (balance < SOL_CONFIG.cost) {
        throw new Error("Insufficient balance: " + balance.toLocaleString() + " $10AMPRO (need " + SOL_CONFIG.cost.toLocaleString() + ")");
      }
    }

    // Build instructions array
    const instructions = [];

    // Check if burn ATA exists, create if not
    const burnAcctInfo = await conn.getAccountInfo(burnATA);
    if (!burnAcctInfo) {
      instructions.push(
        createAssociatedTokenAccountInstruction(senderPk, burnATA, burnPk, mintPk)
      );
    }

    // SPL transfer
    const rawAmount = BigInt(SOL_CONFIG.cost) * BigInt(Math.pow(10, SOL_CONFIG.decimals));
    instructions.push(
      createTransferInstruction(senderATA, burnATA, senderPk, rawAmount)
    );

    // Memo: "SAVE:MemberName"
    const memoData = new TextEncoder().encode("SAVE:" + memberName);
    instructions.push(
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey(SOL_CONFIG.memoProgram),
        data: memoData,
      })
    );

    // Build transaction with blockhash
    const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash("confirmed");
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPk;
    transaction.add(...instructions);

    // Phantom recommended: signAndSendTransaction
    const { signature } = await provider.signAndSendTransaction(transaction);

    // Wait for confirmation
    await conn.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

    return signature;
  } catch (e) {
    if (e && e.message) throw e;
    throw new Error("Transaction failed — check your wallet and try again");
  }
}

/* ── Main App ───────────────────────────────────────────────────── */
export default function App() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [exp, setExp] = useState(null);
  const [sort, setSort] = useState("composite");
  const [sec, setSec] = useState("intel");

  // Wallet state
  const [wallet, setWallet] = useState(null); // { publicKey, provider }
  const [onChainSaves, setOnChainSaves] = useState({}); // { memberName: { savedBy, signature, ... } }
  const [payingFor, setPayingFor] = useState(null); // member name currently being paid for
  const [payError, setPayError] = useState(null);
  const [paySuccess, setPaySuccess] = useState(null);

  // Fetch on-chain saves on mount
  useEffect(() => {
    fetch("/api/verify-saves", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        if (data.saves) {
          const map = {};
          data.saves.forEach(s => { map[s.member] = s; });
          setOnChainSaves(map);
        }
      })
      .catch(() => {}); // silent fail — falls back to static data
  }, [paySuccess]); // refetch after successful payment

  // Merge on-chain saves with static data — on-chain overrides static
  const mergedD = useMemo(() => D.map(m => {
    const onchain = onChainSaves[m.n];
    if (onchain) return { ...m, savedBy: onchain.savedBy, savedUntil: onchain.savedUntil, txSig: onchain.signature };
    return m;
  }), [onChainSaves]);

  // Handle wallet connect
  const handleConnect = useCallback(async () => {
    if (wallet) { wallet.provider?.disconnect?.(); setWallet(null); return; }
    const w = await connectWallet();
    if (w) setWallet(w);
  }, [wallet]);

  // Handle pay
  const handlePay = useCallback(async (memberName) => {
    let w = wallet;
    if (!w) {
      w = await connectWallet();
      if (!w) return;
      setWallet(w);
    }
    setPayingFor(memberName);
    setPayError(null);
    setPaySuccess(null);
    try {
      const sig = await buildPayTransaction(w.publicKey, memberName, w.provider);
      setPaySuccess({ member: memberName, sig });
      setPayingFor(null);
      // Optimistically update local state
      setOnChainSaves(prev => ({
        ...prev,
        [memberName]: {
          member: memberName,
          savedBy: w.publicKey,
          signature: sig,
          savedUntil: new Date(new Date("2026-04-07").getTime() + SOL_CONFIG.timerDays * 86400000).toISOString(),
        },
      }));
    } catch (e) {
      setPayError(e.message || "Transaction failed");
      setPayingFor(null);
    }
  }, [wallet]);

  const k = useMemo(() => kpis(mergedD.length ? mergedD : D), [mergedD]);
  const filt = useMemo(() => {
    let r = [...mergedD];
    if (filter === "saved") r = r.filter(x => (x.t === "Z" || x.t === "C") && x.savedBy);
    else if (filter !== "all") r = r.filter(x => x.t === filter);
    if (search) r = r.filter(x => x.n.toLowerCase().includes(search.toLowerCase()));
    if (sort === "composite") r.sort((a, b) => b.co - a.co);
    else if (sort === "network") r.sort((a, b) => b.p.network - a.p.network);
    else if (sort === "intelligence") r.sort((a, b) => b.p.intelligence - a.p.intelligence);
    else if (sort === "capital") r.sort((a, b) => b.p.capital - a.p.capital);
    else if (sort === "msgs") r.sort((a, b) => b.m - a.m);
    else if (sort === "inactive") r.sort((a, b) => b.di - a.di);
    else if (sort === "links") r.sort((a, b) => b.l - a.l);
    return r;
  }, [filter, search, sort, mergedD]);
  const goM = (name) => { setSec("members"); setFilter("all"); setSearch(name); setExp(name); };

  // Top per pillar (INCLUDING founder, non-zombie)
  const active = mergedD.filter(x => x.t !== "Z");
  const topComposite = [...active].sort((a, b) => b.co - a.co).slice(0, 10);
  const topNet = [...active].sort((a, b) => b.p.network - a.p.network).slice(0, 10);
  const topInt = [...active].sort((a, b) => b.p.intelligence - a.p.intelligence).slice(0, 10);
  const topCap = [...active].sort((a, b) => b.p.capital - a.p.capital).slice(0, 10);

  return (<div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e5e7eb", fontFamily: "'Inter',-apple-system,sans-serif", overflowX: "hidden" }}>

    {/* Header */}
    <div style={{ padding: "16px 14px 10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img src="/logo.jpg" alt="10AMPRO" style={{ width: 32, height: 32, borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>10AM</span>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "#10b981" }}>CLUB</span>
          </div>
          <div style={{ fontSize: 9, color: "#6b7280", marginTop: 1 }}>
            💰 Open Source Capital · 🧠 Collective Intelligence · 🔗 Network Sharing
          </div>
        </div>
        {/* Guillotine Tally — BIG and prominent */}
        {(() => {
          const axed = mergedD.filter(x => (x.t === "Z" || x.t === "C") && !x.savedBy).length;
          const saved = mergedD.filter(x => (x.t === "Z" || x.t === "C") && x.savedBy).length;
          const TOKEN = META.token || {};
          const timerDays = TOKEN.timerDays || 10;
          const auditDate = new Date('2026-04-07T00:00:00');
          const deadline = new Date(auditDate.getTime() + timerDays * 24 * 3600 * 1000);
          const now = new Date();
          const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
          const dd = Math.floor(remaining / 86400);
          const hh = Math.floor((remaining % 86400) / 3600);
          const mm = Math.floor((remaining % 3600) / 60);
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#ef4444", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{axed}</div>
                <div style={{ fontSize: 9, color: "#ef4444", fontWeight: 700, marginTop: 2 }}>🪓 pending to be axed</div>
              </div>
              {saved > 0 && <>
                <div style={{ height: 36, width: 1, background: "#2a2a3e" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#10b981", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{saved}</div>
                  <div style={{ fontSize: 9, color: "#10b981", fontWeight: 700, marginTop: 2 }}>🛡️ saved</div>
                </div>
              </>}
              <div style={{ height: 36, width: 1, background: "#2a2a3e" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center" }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#f97316", fontFamily: "'JetBrains Mono',monospace" }}>{dd}</span>
                  <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>d</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#f97316", fontFamily: "'JetBrains Mono',monospace" }}>{hh}</span>
                  <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>h</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#f97316", fontFamily: "'JetBrains Mono',monospace" }}>{mm}</span>
                  <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>m</span>
                </div>
                <div style={{ fontSize: 9, color: "#f97316", fontWeight: 700, marginTop: 2 }}>⏰ until cut</div>
              </div>
            </div>
          );
        })()}
      </div>
      <div style={{ fontSize: 10, color: "#4b5563", marginTop: 6, paddingLeft: 40 }}>
        {META.snapshots[0].from.slice(5).replace("-", "/")} → {SNAP.to.slice(5).replace("-", "/")} · {k.nn} members · {k.tot.toLocaleString()} msgs · Powered by Cerebro
      </div>
      {/* Wallet Connect Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, padding: "6px 8px", background: "#111118", borderRadius: 8, border: "1px solid #1e1e2e" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "#6b7280" }}>💳 Solana</span>
          {wallet && <span style={{ fontSize: 9, color: "#10b981", fontFamily: "'JetBrains Mono',monospace" }}>{wallet.publicKey.slice(0, 4)}...{wallet.publicKey.slice(-4)}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="https://jup.ag/tokens/6P5McDuhznaedKjnCvfe9iEjtCfVLyZhSqe93TZtawky" target="_blank" rel="noopener" style={{ padding: "4px 12px", fontSize: 10, fontWeight: 700, background: "linear-gradient(135deg, #f59e0b, #f97316)", color: "#0a0a0f", border: "none", borderRadius: 6, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            <img src="/logo.jpg" alt="" style={{ width: 14, height: 14, borderRadius: 4 }} />
            Buy $10AMPRO
          </a>
          <button onClick={handleConnect} style={{ padding: "4px 12px", fontSize: 10, fontWeight: 700, background: wallet ? "#1e1e2e" : "linear-gradient(135deg, #ab9ff2, #7c3aed)", color: wallet ? "#9ca3af" : "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
            {wallet ? "Disconnect" : "Connect Wallet"}
          </button>
        </div>
      </div>
      {/* Pay status messages */}
      {payError && (
        <div style={{ marginTop: 6, padding: "8px 12px", background: "#450a0a", borderRadius: 8, border: "1px solid #ef444440", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#ef4444" }}>❌ {payError}</span>
          <button onClick={() => setPayError(null)} style={{ marginLeft: "auto", fontSize: 10, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      )}
      {paySuccess && (
        <div style={{ marginTop: 6, padding: "8px 12px", background: "#052e16", borderRadius: 8, border: "1px solid #10b98140", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#10b981" }}>🛡️ {paySuccess.member} saved on-chain!</span>
          <a href={`https://solscan.io/tx/${paySuccess.sig}`} target="_blank" rel="noopener" style={{ fontSize: 9, color: "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}>{paySuccess.sig.slice(0, 12)}...</a>
          <button onClick={() => setPaySuccess(null)} style={{ marginLeft: "auto", fontSize: 10, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      )}
    </div>

    {/* Tabs */}
    <div style={{ display: "flex", borderBottom: "1px solid #1e1e2e", padding: "0 14px", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}>
      {[["intel", "🧠 Intel"], ["insights", "💡 Insights"], ["progress", "📈 Progress"], ["robes", "⚔️ Standards"], ["members", "👥 Members"]].map(([key, lb]) => (
        <button key={key} onClick={() => { setSec(key); if (key !== "members") { setSearch(""); setFilter("all"); } }} style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", background: "transparent", border: "none", color: sec === key ? "#e5e7eb" : "#6b7280", borderBottom: sec === key ? "2px solid #10b981" : "2px solid transparent", whiteSpace: "nowrap", flexShrink: 0 }}>{lb}</button>
      ))}
    </div>

    {/* ── TAB: Intelligence ──────────────────────────────────────── */}
    {sec === "intel" && (<div style={{ padding: "12px 14px 80px" }}>

      {/* Three Pillars Overview */}
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>⚡ The Three Pillars — Your Membership Score</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { key: "network", icon: "🔗", label: "Network Sharing", desc: "Connecting people", avg: k.avgNet, c: PCOL.network, w: PW.network },
            { key: "intelligence", icon: "🧠", label: "Collective Intelligence", desc: "Making us smarter", avg: k.avgInt, c: PCOL.intelligence, w: PW.intelligence },
            { key: "capital", icon: "💰", label: "Open Source Capital", desc: "Showing your hand", avg: k.avgCap, c: PCOL.capital, w: PW.capital },
          ].map(p => (
            <div key={p.key} style={{ flex: "1 1 100px", minWidth: 100, background: "#0a0a0f", borderRadius: 10, padding: "14px 12px", border: `1px solid ${p.c}20` }}>
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

      {/* Top per pillar — 3 columns */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Top Networkers", icon: "🔗", data: topNet, key: "network", c: PCOL.network },
          { label: "Top Intelligence", icon: "🧠", data: topInt, key: "intelligence", c: PCOL.intelligence },
          { label: "Top Capital", icon: "💰", data: topCap, key: "capital", c: PCOL.capital },
        ].map(col => (
          <div key={col.key} style={{ flex: 1, minWidth: 0, background: "#111118", borderRadius: 10, padding: "10px", border: `1px solid ${col.c}20`, overflow: "hidden" }}>
            <div style={{ fontSize: 9, color: col.c, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{col.icon} {col.label}</div>
            {col.data.map((m, i) => (
              <div key={m.n} onClick={() => goM(m.n)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 0", cursor: "pointer", borderBottom: i < 9 ? "1px solid #1a1a2e" : "none" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: i < 3 ? col.c : "#6b7280", fontFamily: "'JetBrains Mono',monospace", width: 14, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 10, color: "#e5e7eb", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.n.split(' ').slice(0, 2).join(' ')}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: col.c, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{m.p[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Network Node Map */}
      <NodeMap data={D} goM={goM} />

      {/* 💎 Best Of — Group Highlights */}
      {(() => {
        const HT = META.highlightTypes || {};
        const groupHL = (META.groupHighlights && META.groupHighlights[META.currentSnapshot]) || [];
        // Also collect top individual highlights
        const allHL = mergedD.flatMap(m => (m.highlights || []).map(h => ({ ...h, member: m.n }))).sort((a, b) => (b.quality || 0) - (a.quality || 0));
        const combined = groupHL.length > 0 ? groupHL : allHL.slice(0, 12);
        const pending = combined.length === 0;
        return (
          <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #06b6d425", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: "#06b6d4", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>💎 Best Of — Top Contributions</div>
              {!pending && <div style={{ fontSize: 9, color: "#6b7280" }}>{combined.length} highlights</div>}
            </div>
            {pending ? (
              <div style={{ padding: "14px", background: "#0a0a0f", borderRadius: 8, border: "1px dashed #06b6d420", textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#06b6d4", fontWeight: 600, marginBottom: 4 }}>🔍 Pending Opus Analysis</div>
                <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.5 }}>
                  Once processed, the group&apos;s greatest hits will appear here — best theses, sharpest analysis, most valuable links, key intros. Each tagged by pillar and scored by quality.
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
                  {Object.entries(HT).map(([key, ht]) => (
                    <span key={key} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: "#1e1e2e", color: ht.color, border: `1px solid ${ht.color}20` }}>{ht.icon} {ht.label}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {combined.map((h, i) => {
                  const ht = HT[h.type] || { icon: "💡", color: "#6b7280", label: h.type };
                  return (
                    <div key={i} onClick={() => h.member && goM(h.member)} style={{ display: "flex", gap: 10, padding: "9px 4px", borderBottom: i < combined.length - 1 ? "1px solid #1a1a2e" : "none", cursor: h.member ? "pointer" : "default", borderRadius: 6 }} onMouseEnter={e => { if (h.member) e.currentTarget.style.background = "#1a1a2e"; }} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: ht.color + "15", border: `1px solid ${ht.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{ht.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          {h.member && <span style={{ fontSize: 11, fontWeight: 600, color: "#e5e7eb" }}>{h.member}</span>}
                          <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 99, background: ht.color + "15", color: ht.color, fontWeight: 600 }}>{ht.label}</span>
                          {h.quality && <span style={{ fontSize: 9, color: "#f59e0b", fontFamily: "'JetBrains Mono',monospace" }}>★{h.quality}/10</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#b0b0c0", lineHeight: 1.5, marginTop: 2 }}>{h.summary}</div>
                        {h.date && <div style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>{h.date}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

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
    {sec === "insights" && (<div style={{ padding: "12px 14px 80px" }}>

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

    {/* ── TAB: Progress ──────────────────────────────────────────── */}
    {sec === "progress" && ((() => {
      const snaps = META.snapshots;
      const hasMultiple = snaps.length > 1;
      const current = SNAP;

      // Compute per-snapshot group stats if we have history
      const getSnapStats = (snapId) => {
        const members = mergedD.filter(x => {
          const h = x.history?.find(hh => hh.snapshot === snapId);
          return h != null;
        });
        const pillarMembers = members.filter(x => {
          const h = x.history?.find(hh => hh.snapshot === snapId);
          return h && h.pillars;
        });
        const pn = pillarMembers.length || 1;
        return {
          avgNet: pillarMembers.reduce((a, x) => a + (x.history.find(h => h.snapshot === snapId)?.pillars?.network || 0), 0) / pn,
          avgInt: pillarMembers.reduce((a, x) => a + (x.history.find(h => h.snapshot === snapId)?.pillars?.intelligence || 0), 0) / pn,
          avgCap: pillarMembers.reduce((a, x) => a + (x.history.find(h => h.snapshot === snapId)?.pillars?.capital || 0), 0) / pn,
          avgCo: pillarMembers.reduce((a, x) => a + (x.history.find(h => h.snapshot === snapId)?.composite || 0), 0) / pn,
          tA: members.filter(x => x.history.find(h => h.snapshot === snapId)?.tier === "A").length,
          tB: members.filter(x => x.history.find(h => h.snapshot === snapId)?.tier === "B").length,
          tC: members.filter(x => x.history.find(h => h.snapshot === snapId)?.tier === "C").length,
          tZ: members.filter(x => x.history.find(h => h.snapshot === snapId)?.tier === "Z").length,
        };
      };

      // Tier movers between snapshots
      const getMovers = () => {
        if (!hasMultiple) return { up: [], down: [], newA: [] };
        const prev = snaps[snaps.length - 2].id;
        const curr = snaps[snaps.length - 1].id;
        const up = [], down = [], newA = [];
        mergedD.forEach(m => {
          const ph = m.history?.find(h => h.snapshot === prev);
          const ch = m.history?.find(h => h.snapshot === curr);
          if (!ph || !ch) return;
          if (ch.tier === "A" && ph.tier !== "A") newA.push({ name: m.n, from: ph.tier, scoreDelta: (ch.composite || ch.score || 0) - (ph.composite || ph.score || 0) });
          if ((ch.composite || 0) > (ph.composite || 0) + 5) up.push({ name: m.n, from: ph.composite || ph.score || 0, to: ch.composite || 0, delta: (ch.composite || 0) - (ph.composite || ph.score || 0) });
          if ((ch.composite || 0) < (ph.composite || 0) - 5) down.push({ name: m.n, from: ph.composite || ph.score || 0, to: ch.composite || 0, delta: (ch.composite || 0) - (ph.composite || ph.score || 0) });
        });
        return { up: up.sort((a, b) => b.delta - a.delta).slice(0, 10), down: down.sort((a, b) => a.delta - b.delta).slice(0, 10), newA };
      };

      const DeltaChip = ({ val, suffix = "" }) => {
        if (val == null || isNaN(val)) return null;
        const r = Math.round(val);
        const c = r > 0 ? "#10b981" : r < 0 ? "#ef4444" : "#6b7280";
        return <span style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{r > 0 ? "▲" : r < 0 ? "▼" : "="}{Math.abs(r)}{suffix}</span>;
      };

      return (<div style={{ padding: "12px 14px 80px" }}>
        {/* Header */}
        <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>📈 Snapshot Timeline</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {snaps.map((s, i) => (
              <div key={s.id} style={{ flex: "1 1 120px", minWidth: 100, padding: "10px 12px", borderRadius: 8, background: s.id === current.id ? "#052e16" : "#0a0a0f", border: `1px solid ${s.id === current.id ? "#10b98130" : "#1e1e2e"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.id === current.id ? "#10b981" : "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}>{s.id}</span>
                  {s.id === current.id && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 99, background: "#10b98120", color: "#10b981", fontWeight: 600 }}>CURRENT</span>}
                </div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{s.from} → {s.to}</div>
                <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{s.days}d · {s.totalMsgs?.toLocaleString() || "?"} msgs · {s.totalMembers || "?"} members</div>
              </div>
            ))}
            {snaps.length === 1 && (
              <div style={{ flex: "1 1 120px", minWidth: 100, padding: "10px 12px", borderRadius: 8, background: "#0a0a0f", border: "1px dashed #1e1e2e" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", fontFamily: "'JetBrains Mono',monospace" }}>s2</div>
                <div style={{ fontSize: 10, color: "#374151" }}>Next audit</div>
                <div style={{ fontSize: 10, color: "#374151", marginTop: 2 }}>Upload new chat export to generate</div>
              </div>
            )}
          </div>
        </div>

        {hasMultiple ? (() => {
          const prev = getSnapStats(snaps[snaps.length - 2].id);
          const curr = getSnapStats(snaps[snaps.length - 1].id);
          const movers = getMovers();
          return (<>
            {/* Pillar Deltas */}
            <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>⚡ Pillar Progress</div>
              {[
                { label: "🔗 Network Sharing", prev: prev.avgNet, curr: curr.avgNet, c: PCOL.network },
                { label: "🧠 Collective Intelligence", prev: prev.avgInt, curr: curr.avgInt, c: PCOL.intelligence },
                { label: "💰 Open Source Capital", prev: prev.avgCap, curr: curr.avgCap, c: PCOL.capital },
                { label: "Composite", prev: prev.avgCo, curr: curr.avgCo, c: "#e5e7eb" },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 3 ? "1px solid #1e1e2e" : "none" }}>
                  <span style={{ fontSize: 11, color: "#e5e7eb", flex: 1 }}>{p.label}</span>
                  <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}>{Math.round(p.prev)}</span>
                  <span style={{ fontSize: 10, color: "#6b7280" }}>→</span>
                  <span style={{ fontSize: 12, color: p.c, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{Math.round(p.curr)}</span>
                  <DeltaChip val={p.curr - p.prev} />
                </div>
              ))}
            </div>

            {/* Tier Movements */}
            <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🔄 Tier Movements</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {[["A", prev.tA, curr.tA, "#10b981"], ["B", prev.tB, curr.tB, "#f59e0b"], ["C", prev.tC, curr.tC, "#ef4444"], ["Z", prev.tZ, curr.tZ, "#6b21a8"]].map(([t, p, c, col]) => (
                  <div key={t} style={{ flex: "1 1 70px", padding: "8px 10px", borderRadius: 8, background: "#0a0a0f", border: `1px solid ${col}20` }}>
                    <div style={{ fontSize: 9, color: col, fontWeight: 600 }}>Tier {t}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: col, fontFamily: "'JetBrains Mono',monospace" }}>{c}</span>
                      <DeltaChip val={c - p} />
                    </div>
                  </div>
                ))}
              </div>
              {movers.newA.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, marginBottom: 4 }}>🎉 Promoted to Tier A:</div>
                  {movers.newA.map(m => (
                    <div key={m.name} onClick={() => goM(m.name)} style={{ fontSize: 11, color: "#e5e7eb", padding: "3px 0", cursor: "pointer" }}>
                      {m.name} <span style={{ color: "#6b7280" }}>from {m.from}</span> <DeltaChip val={m.scoreDelta} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Biggest Movers */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <div style={{ flex: "1 1 200px", background: "#111118", borderRadius: 10, padding: "12px", border: "1px solid #10b98120" }}>
                <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>🚀 Biggest Climbers</div>
                {movers.up.length > 0 ? movers.up.map((m, i) => (
                  <div key={m.name} onClick={() => goM(m.name)} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", cursor: "pointer", borderBottom: i < movers.up.length - 1 ? "1px solid #1a1a2e" : "none" }}>
                    <span style={{ fontSize: 11, color: "#e5e7eb" }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>+{m.delta}</span>
                  </div>
                )) : <div style={{ fontSize: 10, color: "#6b7280" }}>No significant climbers yet</div>}
              </div>
              <div style={{ flex: "1 1 200px", background: "#111118", borderRadius: 10, padding: "12px", border: "1px solid #ef444420" }}>
                <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>📉 Biggest Drops</div>
                {movers.down.length > 0 ? movers.down.map((m, i) => (
                  <div key={m.name} onClick={() => goM(m.name)} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", cursor: "pointer", borderBottom: i < movers.down.length - 1 ? "1px solid #1a1a2e" : "none" }}>
                    <span style={{ fontSize: 11, color: "#e5e7eb" }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{m.delta}</span>
                  </div>
                )) : <div style={{ fontSize: 10, color: "#6b7280" }}>No significant drops yet</div>}
              </div>
            </div>
          </>);
        })() : (
          /* Single snapshot — show baseline state and what will be tracked */
          <>
            <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📊 Baseline (s1) — What Gets Tracked</div>
              <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6, marginBottom: 12 }}>
                This is the starting line. Every metric below becomes the comparison point for the next audit. Upload a new chat export to generate s2 and see the deltas.
              </div>
              {[
                { label: "🔗 Network Sharing", val: k.avgNet, target: 50, c: PCOL.network },
                { label: "🧠 Collective Intelligence", val: k.avgInt, target: 50, c: PCOL.intelligence },
                { label: "💰 Open Source Capital", val: k.avgCap, target: 50, c: PCOL.capital },
                { label: "Group Composite", val: k.avgCo, target: 60, c: "#e5e7eb" },
                { label: "Founder Msg Share", val: k.fM * 100, target: 15, c: "#f59e0b", invert: true },
                { label: "Founder Link Share", val: k.fL * 100, target: 20, c: "#ef4444", invert: true },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 5 ? "1px solid #1e1e2e" : "none" }}>
                  <span style={{ fontSize: 11, color: "#e5e7eb", flex: 1 }}>{p.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: p.c, fontFamily: "'JetBrains Mono',monospace" }}>{Math.round(p.val)}{p.label.includes("Share") ? "%" : ""}</span>
                  <span style={{ fontSize: 9, color: "#6b7280" }}>target: {p.invert ? "<" : ">"}{p.target}{p.label.includes("Share") ? "%" : ""}</span>
                  <span style={{ fontSize: 10, color: p.invert ? (p.val > p.target ? "#ef4444" : "#10b981") : (p.val >= p.target ? "#10b981" : "#f59e0b") }}>
                    {p.invert ? (p.val > p.target ? "✗" : "✓") : (p.val >= p.target ? "✓" : "✗")}
                  </span>
                </div>
              ))}
            </div>

            {/* Tier Baseline */}
            <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🏛️ Tier Distribution (Baseline)</div>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {[["A", k.tA, "#10b981"], ["B", k.tB, "#f59e0b"], ["C", k.tC, "#ef4444"], ["Z", k.tZ, "#6b21a8"]].map(([t, ct, c]) => {
                  const pct = (ct / k.nn) * 100;
                  return (<div key={t} style={{ width: `${pct}%`, minWidth: ct > 0 ? 30 : 0, height: 32, background: c + "40", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${c}30` }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{t}:{ct}</span>
                  </div>);
                })}
              </div>
              <div style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.5 }}>
                Next audit will show: tier promotions/demotions, new Tier A members, who fell from grace, and zombie/deserter changes.
              </div>
            </div>

            {/* What Changes Will Be Tracked */}
            <div style={{ background: "#052e16", borderRadius: 12, padding: "14px 12px", border: "1px solid #10b98130" }}>
              <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>🔮 What s2 Will Reveal</div>
              {[
                "Pillar averages: did 🔗 Network, 🧠 Intelligence, 💰 Capital improve?",
                "Tier movements: who got promoted? who got demoted?",
                "Biggest climbers: top 10 composite score increases",
                "Biggest drops: who fell off and by how much?",
                "Founder dependency: is Hernán's share decreasing?",
                "Panican reform: did flagged panicans improve their Capital scores?",
                "Persona evolution: did people's topics/expertise shift?",
                "Dead weight delta: how many zombies were cut? did it improve signal?",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 10, color: "#10b981", flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 11, color: "#a0d4b8", lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>);
    })())}

    {/* ── TAB: Robespierre ───────────────────────────────────────── */}
    {sec === "robes" && (<div style={{ padding: "12px 14px 80px" }}>
      <div style={{ background: "linear-gradient(135deg,#0a0a1a,#1a0a2e)", borderRadius: 12, padding: "20px 16px", border: "1px solid #8b5cf620", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <img src="/logo.jpg" alt="" style={{ width: 24, height: 24, borderRadius: 6 }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e5e7eb" }}>Club Standards</div>
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>Three pillars define membership: <span style={{ color: PCOL.network }}>🔗 Network</span>, <span style={{ color: PCOL.intelligence }}>🧠 Intelligence</span>, <span style={{ color: PCOL.capital }}>💰 Capital</span>. Score zero across all three and you&apos;re out. The club demands contribution — not consumption.</div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {[["Zombies", k.tZ, "#ef4444", "#450a0a", "Never typed once"], ["Tier C", k.tC, "#f97316", "#450a0a", "Posted then vanished"], ["Dormant B", mergedD.filter(x => x.t === "B" && x.di > 60).length, "#f59e0b", "#422006", "60+ days silent"], ["Total Cut", k.dw, "#dc2626", "#1a0a2e", `${(k.dw / k.nn * 100).toFixed(0)}% of group`]].map(([lb, ct, c, bg, sub]) => (
          <div key={lb} style={{ flex: "1 1 100px", background: bg, borderRadius: 10, padding: "12px 14px", border: `1px solid ${c}30` }}>
            <div style={{ fontSize: 9, color: c, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{lb}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{ct}</div>
            <div style={{ fontSize: 10, color: c + "99" }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #1e1e2e", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#dc2626", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📜 Membership Violations</div>
        {[{ crime: "Zero Contribution", icon: "🧟", desc: `Joined but never posted a single message. ${SNAP.days}+ days of silence. Pure consumer.`, count: k.tZ }, { crime: "Abandoned", icon: "💀", desc: "Posted a few times then vanished. Showed up, saw the alpha, left without contributing.", count: k.tC }, { crime: "Gone Dark", icon: "😴", desc: "Had activity but 60+ days inactive. One check-in away from removal.", count: mergedD.filter(x => x.t === "B" && x.di > 60).length }].map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 2 ? "1px solid #1e1e2e" : "none", alignItems: "flex-start" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</span>
            <div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb" }}>{c.crime}</span><span style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", fontFamily: "'JetBrains Mono',monospace" }}>{c.count}</span></div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, lineHeight: 1.5 }}>{c.desc}</div></div>
          </div>
        ))}
      </div>

      {/* Panicans — Opus AI Analysis */}
      {(() => {
        const panicans = mergedD.filter(x => x.panic !== null && x.panic >= 30).sort((a, b) => b.panic - a.panic);
        return (
          <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #f9731625", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 10, color: "#f97316", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>🚨 Cerebro Analysis: Panicans</div>
              <div style={{ fontSize: 8, padding: "2px 6px", borderRadius: 99, background: "#1e1e2e", color: "#8b5cf6", fontWeight: 600 }}>Powered by Opus</div>
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6, marginBottom: 12 }}>
              Members who erode collective alpha by flooding fear without thesis. Opus read every message and identified patterns of panic behavior — reactive selling, catastrophizing, emotional contagion. The antithesis of Open Source Capital.
            </div>

            {/* Severity Legend */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {[
                { lb: "REMOVAL", range: "70+", c: "#ef4444", bg: "#450a0a", desc: "Chronic fear merchant. Erodes group conviction." },
                { lb: "WARNING", range: "50-69", c: "#f97316", bg: "#422006", desc: "Notable panic. Needs to show conviction or go." },
                { lb: "WATCH", range: "30-49", c: "#f59e0b", bg: "#1e1e2e", desc: "Some reactive behavior. Monitor next audit." },
              ].map(s => (
                <div key={s.lb} style={{ flex: "1 1 100px", minWidth: 90, padding: "6px 8px", background: s.bg, borderRadius: 6, border: `1px solid ${s.c}20` }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: s.c }}>{s.lb} ({s.range})</div>
                  <div style={{ fontSize: 8, color: "#9ca3af", marginTop: 2 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Panican Cards */}
            {panicans.map((m, idx) => {
              const severity = m.panic >= 70 ? { label: "REMOVAL", c: "#ef4444", bg: "#450a0a", icon: "🚨" } :
                               m.panic >= 50 ? { label: "WARNING", c: "#f97316", bg: "#422006", icon: "⚠️" } :
                                               { label: "WATCH", c: "#f59e0b", bg: "#1e1e2e", icon: "👁" };
              return (
                <div key={m.n} style={{ background: severity.bg, borderRadius: 10, padding: "12px", border: `1px solid ${severity.c}20`, marginBottom: 8 }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0a0a0f", border: `2px solid ${severity.c}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: severity.c, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{m.panic}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span onClick={() => goM(m.n)} style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb", cursor: "pointer", textDecoration: "underline", textDecorationColor: severity.c + "40" }}>{m.n}</span>
                        <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 99, background: severity.c + "20", color: severity.c, fontWeight: 700 }}>{severity.icon} {severity.label}</span>
                      </div>
                      {m.persona?.role && <div style={{ fontSize: 10, color: severity.c, opacity: 0.8, marginTop: 1 }}>{m.persona.role}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <div style={{ textAlign: "center", padding: "2px 6px", background: "#0a0a0f", borderRadius: 4 }}>
                        <div style={{ fontSize: 8, color: "#6b7280" }}>💰</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: PCOL.capital, fontFamily: "'JetBrains Mono',monospace" }}>{m.p.capital}</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "2px 6px", background: "#0a0a0f", borderRadius: 4 }}>
                        <div style={{ fontSize: 8, color: "#6b7280" }}>msgs</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}>{m.m}</div>
                      </div>
                    </div>
                  </div>

                  {/* Bio from Opus */}
                  {m.persona?.bio && <div style={{ fontSize: 10, color: "#9ca3af", lineHeight: 1.5, marginBottom: 8, padding: "6px 8px", background: "#0a0a0f", borderRadius: 6 }}>{m.persona.bio}</div>}

                  {/* Evidence Quotes */}
                  {m.panicFlags?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 9, color: severity.c, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>📜 Evidence (from their actual messages)</div>
                      {m.panicFlags.slice(0, 4).map((flag, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 10, color: severity.c, flexShrink: 0 }}>»</span>
                          <span style={{ fontSize: 10, color: "#d4a574", lineHeight: 1.4, fontStyle: "italic" }}>&ldquo;{flag}&rdquo;</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Verdict */}
                  <div style={{ marginTop: 8, padding: "6px 8px", background: severity.c + "10", borderRadius: 6, border: `1px solid ${severity.c}15` }}>
                    <div style={{ fontSize: 10, color: severity.c, fontWeight: 600 }}>
                      {m.panic >= 70 ? "💀 Verdict: Actively damages group conviction. Posts fear, closes positions publicly, triggers others to panic. Zero thesis behind the emotion." :
                       m.panic >= 50 ? "⚠️ Verdict: Pattern of reactive behavior. Surfaces mostly when markets drop. Needs to demonstrate conviction with actual positions or risk removal." :
                       "👁 Verdict: Some reactive tendencies detected. Not chronic but worth monitoring. Next audit will determine trajectory."}
                    </div>
                  </div>
                </div>
              );
            })}

            {panicans.length === 0 && (
              <div style={{ padding: "10px", background: "#052e16", borderRadius: 8, border: "1px solid #10b98120", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#10b981" }}>✓ No panicans detected — the group maintains conviction.</div>
              </div>
            )}
          </div>
        );
      })()}

      {SRC.length > 0 && <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #1e1e2e", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📡 Group Information Diet</div>
        {SRC.map((s, i) => { const mx = Math.max(...SRC.map(x => x.count)); const c = srcColors[s.source] || "#6b7280"; return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < SRC.length - 1 ? "1px solid #1a1a2e" : "none" }}>
            <div style={{ width: 90, fontSize: 10, fontWeight: 500, color: "#e5e7eb" }}>{s.source}</div>
            <div style={{ flex: 1, height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${(s.count / mx) * 100}%`, height: "100%", background: c, borderRadius: 3 }} /></div>
            <div style={{ width: 40, fontSize: 12, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace", textAlign: "right" }}>{s.count}</div>
            <div style={{ fontSize: 8, minWidth: 60, maxWidth: 100, color: c }}>{s.verdict} {srcVerdicts[s.verdict] || ""}</div>
          </div>); })}
      </div>}
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #6b21a825", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#6b21a8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🧟 Zombies ({k.tZ})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {mergedD.filter(x => x.t === "Z").sort((a, b) => a.n.localeCompare(b.n)).map(z => (<div key={z.n} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: z.savedBy ? "#052e16" : "#2e1065", color: z.savedBy ? "#10b981" : "#a78bfa", border: `1px solid ${z.savedBy ? "#10b98130" : "#6b21a830"}` }}>{z.savedBy ? "🛡️ " : ""}{z.n}</div>))}
        </div>
      </div>
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #ef444425", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>💀 Deserters — Tier C ({k.tC})</div>
        {mergedD.filter(x => x.t === "C").sort((a, b) => b.di - a.di).map(m => (<div key={m.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1a1a2e" }}><span style={{ fontSize: 12, color: m.savedBy ? "#10b981" : "#e5e7eb" }}>{m.savedBy ? "🛡️ " : ""}{m.n}</span><div style={{ display: "flex", gap: 12, fontSize: 10, color: "#9ca3af" }}>{m.savedBy ? <span style={{ color: "#10b981", fontWeight: 600 }}>Saved</span> : <><span>{m.m} msgs</span><span style={{ color: "#ef4444" }}>{m.di}d silent</span></>}</div></div>))}
      </div>
      <div style={{ background: "#052e16", borderRadius: 12, padding: "16px 14px", border: "1px solid #10b98130" }}>
        <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🔄 Path to Re-Entry</div>
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
      <div style={{ padding: "12px 14px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[["Active", k.tA, "#10b981", "#052e16"], ["Watch", k.tB, "#f59e0b", "#422006"], ["Remove", k.tC, "#ef4444", "#450a0a"], ["Zombie", k.tZ, "#6b21a8", "#2e1065"]].map(([lb, ct, c, bg]) => (
          <div key={lb} style={{ flex: 1, minWidth: 70, padding: "9px 12px", borderRadius: 8, background: bg, border: `1px solid ${c}25` }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{ct}</div>
            <div style={{ fontSize: 10, color: c, opacity: 0.7, fontWeight: 500 }}>{lb}</div>
          </div>
        ))}
        {(() => { const sc = mergedD.filter(x => (x.t === "Z" || x.t === "C") && x.savedBy).length; return sc > 0 ? (
          <div onClick={() => setFilter("saved")} style={{ flex: 1, minWidth: 70, padding: "9px 12px", borderRadius: 8, background: "#052e16", border: "1px solid #10b98140", cursor: "pointer" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#10b981", fontFamily: "'JetBrains Mono',monospace" }}>{sc}</div>
            <div style={{ fontSize: 10, color: "#10b981", opacity: 0.7, fontWeight: 500 }}>🛡️ Saved</div>
          </div>
        ) : null; })()}
      </div>
      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <input type="text" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, background: "#111118", border: "1px solid #1e1e2e", color: "#e5e7eb", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {[["all", "All"], ["A", "⚡ Active"], ["B", "👁 Watch"], ["C", "🪓 Remove"], ["Z", "🧟 Zombie"], ["saved", "🛡️ Saved"]].map(([key, lb]) => (
            <button key={key} onClick={() => setFilter(key)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid", cursor: "pointer", background: filter === key ? (key === "all" ? "#1e1e2e" : key === "saved" ? "#052e16" : TC[key]?.bg || "#1e1e2e") : "transparent", color: filter === key ? (key === "all" ? "#e5e7eb" : key === "saved" ? "#10b981" : TC[key]?.color || "#e5e7eb") : "#6b7280", borderColor: filter === key ? (key === "all" ? "#374151" : key === "saved" ? "#10b98140" : (TC[key]?.color || "") + "40") : "#1e1e2e" }}>{lb}</button>
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
      <div style={{ padding: "0 14px 80px" }}>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 6, fontWeight: 500 }}>{filt.length} member{filt.length !== 1 ? "s" : ""}</div>
        {filt.map((m, i) => (<Card key={m.n} m={m} rank={i + 1} exp={exp === m.n} tog={() => setExp(exp === m.n ? null : m.n)} onPay={handlePay} payingFor={payingFor} />))}
      </div>
    </>)}
  </div>);
}
