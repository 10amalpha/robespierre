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
}));

const META = metaRaw;
const SNAP = META.snapshots.find(s => s.id === META.currentSnapshot) || META.snapshots[0];
const SRC = (META.sourceStats && META.sourceStats[META.currentSnapshot]) || [];

/* ── Tier Config ────────────────────────────────────────────────── */
const TC = {
  A: { label: "Active", color: "#10b981", bg: "#052e16", bgL: "#064e3b", icon: "⚡" },
  B: { label: "Watch", color: "#f59e0b", bg: "#422006", bgL: "#78350f", icon: "👁" },
  C: { label: "Remove", color: "#ef4444", bg: "#450a0a", bgL: "#7f1d1d", icon: "🪓" },
  Z: { label: "Zombie", color: "#6b21a8", bg: "#2e1065", bgL: "#4c1d95", icon: "🧟" },
};

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
  return {
    nn, tot, lnk, yM, yL, c5, a7, deep, lk, days,
    kd: ent / Math.log2(nn), sn: subM / tot, nd: lk / nn,
    fM: yM / tot, fL: yL / lnk, vel: tot / days, dep: tw / tot,
    t5, t5m, t5p: t5m / (tot - yM), lurk, lurkP: lurk / nn, avgW,
    dw: d.filter(x => x.t === "C").length + d.filter(x => x.t === "B" && x.di > 60).length + d.filter(x => x.t === "Z").length,
    tA: d.filter(x => x.t === "A").length, tB: d.filter(x => x.t === "B").length,
    tC: d.filter(x => x.t === "C").length, tZ: d.filter(x => x.t === "Z").length,
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
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={{ fontSize: 9, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</span>
    </div>
    <div style={{ fontSize: 21, fontWeight: 700, color, fontFamily: "'JetBrains Mono',monospace" }}>{value}</div>
    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>{sub}</div>
  </div>
);

const Br = ({ v, mx = 100, c }) => (<div style={{ width: "100%", height: 5, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${(v / mx) * 100}%`, height: "100%", background: c, borderRadius: 3, transition: "width 0.6s ease" }} /></div>);

const Mn = ({ lb, v, mx = 30, c }) => (<div style={{ flex: 1, minWidth: 68 }}>
  <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 2, letterSpacing: "0.05em" }}>{lb}</div>
  <div style={{ fontSize: 12, fontWeight: 600, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{v.toFixed(1)}</div>
  <div style={{ width: "100%", height: 3, background: "#1a1a2e", borderRadius: 2, marginTop: 2 }}><div style={{ width: `${(v / mx) * 100}%`, height: "100%", background: c, borderRadius: 2 }} /></div>
</div>);

const Ins = ({ icon, title, body, color }) => (
  <div style={{ background: "#111118", borderRadius: 10, padding: "13px 15px", border: `1px solid ${color}25`, marginBottom: 10, display: "flex", gap: 11, alignItems: "flex-start" }}>
    <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
    <div><div style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 3 }}>{title}</div>
    <div style={{ fontSize: 11, color: "#b0b0c0", lineHeight: 1.55 }}>{body}</div></div>
  </div>
);

/* ── Member Card ────────────────────────────────────────────────── */
const Card = ({ m, rank, exp, tog }) => {
  const tc = TC[m.t];
  const hasHistory = m.history && m.history.length > 1;
  const prev = hasHistory ? m.history[m.history.length - 2] : null;
  const delta = prev ? m.s - prev.score : null;
  return (
    <div onClick={tog} style={{ background: exp ? tc.bgL : "#111118", border: `1px solid ${exp ? tc.color + "40" : "#1e1e2e"}`, borderRadius: 10, padding: "10px 13px", cursor: "pointer", transition: "all 0.2s", marginBottom: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: tc.bg, border: `2px solid ${tc.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: tc.color, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{rank}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, color: "#e5e7eb", fontSize: 13 }}>{m.n}{m.u ? " 👑" : ""}</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, fontWeight: 600, background: tc.bg, color: tc.color, border: `1px solid ${tc.color}30` }}>{tc.icon} {tc.label}</span>
            {delta !== null && <span style={{ fontSize: 9, fontWeight: 700, color: delta > 0 ? "#10b981" : delta < 0 ? "#ef4444" : "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}>{delta > 0 ? "▲" : delta < 0 ? "▼" : "="}{Math.abs(delta).toFixed(1)}</span>}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>{m.m} msgs</span>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>{m.l} links</span>
            <span style={{ fontSize: 10, color: m.di > 30 ? "#ef4444" : m.di > 14 ? "#f59e0b" : "#6b7280" }}>{m.di === 0 ? "today" : `${m.di}d ago`}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: tc.color, fontFamily: "'JetBrains Mono',monospace" }}>{m.s.toFixed(0)}</div>
          <div style={{ width: 52 }}><Br v={m.s} c={tc.color} /></div>
        </div>
      </div>
      {exp && (<div style={{ marginTop: 11, paddingTop: 9, borderTop: `1px solid ${tc.color}20` }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Mn lb="VOLUME" v={m.vs} mx={30} c="#3b82f6" />
          <Mn lb="CONSISTENCY" v={m.cs} mx={25} c="#8b5cf6" />
          <Mn lb="SUBSTANCE" v={m.ss} mx={20} c="#ec4899" />
          <Mn lb="RECENCY" v={m.rs} mx={25} c="#10b981" />
        </div>
        <div style={{ display: "flex", gap: 13, marginTop: 7, flexWrap: "wrap" }}>
          {[["Avg words", m.w], ["Active days", `${m.ad}/${SNAP.days}`], ["Weeks", `${m.aw}/14`], ["Last", m.la]].map(([a, b]) => (
            <div key={a} style={{ fontSize: 10, color: "#9ca3af" }}><span style={{ color: "#6b7280" }}>{a}:</span> {b}</div>
          ))}
        </div>
        {hasHistory && (<div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${tc.color}10` }}>
          <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Trajectory</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {m.history.map((h, i) => (
              <div key={h.snapshot} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: i === m.history.length - 1 ? tc.bg : "#0a0a0f", border: `1px solid ${i === m.history.length - 1 ? tc.color + "30" : "#1e1e2e"}`, color: i === m.history.length - 1 ? tc.color : "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}>
                {h.snapshot}: {h.score.toFixed(0)} ({h.tier})
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
  const [sort, setSort] = useState("score");
  const [sec, setSec] = useState("intel");
  const k = useMemo(() => kpis(D), []);
  const filt = useMemo(() => {
    let r = [...D];
    if (filter !== "all") r = r.filter(x => x.t === filter);
    if (search) r = r.filter(x => x.n.toLowerCase().includes(search.toLowerCase()));
    if (sort === "score") r.sort((a, b) => b.s - a.s);
    else if (sort === "msgs") r.sort((a, b) => b.m - a.m);
    else if (sort === "inactive") r.sort((a, b) => b.di - a.di);
    else if (sort === "links") r.sort((a, b) => b.l - a.l);
    return r;
  }, [filter, search, sort]);
  const goM = (name) => { setSec("members"); setFilter("all"); setSearch(name); setExp(name); };

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
    <div style={{ display: "flex", borderBottom: "1px solid #1e1e2e", padding: "0 20px", gap: 2 }}>
      {[["intel", "🧠 Intelligence"], ["insights", "💡 Insights"], ["robes", "⚔️ Robespierre"], ["members", "👥 Members"]].map(([key, lb]) => (
        <button key={key} onClick={() => { setSec(key); if (key !== "members") { setSearch(""); setFilter("all"); } }} style={{ padding: "8px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", background: "transparent", border: "none", color: sec === key ? "#e5e7eb" : "#6b7280", borderBottom: sec === key ? "2px solid #10b981" : "2px solid transparent" }}>{lb}</button>
      ))}
    </div>

    {/* ── TAB: Intelligence ──────────────────────────────────────── */}
    {sec === "intel" && (<div style={{ padding: "14px 20px 80px" }}>
      <div style={{ background: "#111118", borderRadius: 12, padding: "14px 10px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>🧬 System Learning Health</div>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 8 }}>
          <G v={k.kd * 100} mx={100} lb="Knowledge Distribution" sub="%" c="#8b5cf6" />
          <G v={k.sn * 100} mx={100} lb="Signal-to-Noise" sub="%" c="#10b981" />
          <G v={k.nd * 100} mx={100} lb="Network Density" sub="%" c="#3b82f6" />
          <G v={(1 - k.fM) * 100} mx={100} lb="Decentralization" sub="%" c="#f59e0b" />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <KPI icon="🧠" title="Active Brains" value={k.c5} sub={`${((k.c5 / k.nn) * 100).toFixed(0)}% contribute 5+ msgs`} color="#10b981" />
        <KPI icon="🔗" title="Knowledge Inputs" value={k.lnk} sub={`${k.lk} members share sources`} color="#3b82f6" />
        <KPI icon="⚡" title="Velocity" value={`${k.vel.toFixed(0)}/d`} sub={`${(k.vel * 7).toFixed(0)} msgs/week`} color="#8b5cf6" />
        <KPI icon="📐" title="Depth" value={`${k.dep.toFixed(0)}w`} sub={`avg words · ${k.deep} deep writers`} color="#ec4899" />
        <KPI icon="🔥" title="7d Pulse" value={k.a7} sub={`${((k.a7 / k.nn) * 100).toFixed(0)}% active this week`} color="#10b981" />
        <KPI icon="🪓" title="Dead Weight" value={k.dw} sub="to cut for signal" color="#ef4444" alert />
      </div>
      <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #1e1e2e", marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📊 Learning Flywheel</div>
        {[
          { lb: "Knowledge Input", d: "External links", v: k.lnk, tg: "1,500+", p: Math.min(k.lnk / 1500, 1), c: "#3b82f6", dt: `${k.lk} of ${k.nn} share links (${((k.lk / k.nn) * 100).toFixed(0)}%)` },
          { lb: "Processing", d: "Substantive msgs (10+ words)", v: `${(k.sn * 100).toFixed(0)}%`, tg: "80%+", p: k.sn / 0.8, c: "#10b981", dt: `${k.deep} members write deep analytical messages` },
          { lb: "Distribution", d: "Brains processing signal", v: k.c5, tg: "50+", p: Math.min(k.c5 / 50, 1), c: "#8b5cf6", dt: `Spread: ${(k.kd * 100).toFixed(0)}% of max entropy` },
          { lb: "Retention", d: "Active within 7 days", v: `${((k.a7 / k.nn) * 100).toFixed(0)}%`, tg: "85%+", p: (k.a7 / k.nn) / 0.85, c: "#f59e0b", dt: `${k.a7} of ${k.nn} engaged this week` },
        ].map((x, i) => (<div key={i} style={{ marginBottom: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
            <div><span style={{ fontSize: 12, fontWeight: 600, color: "#e5e7eb" }}>{x.lb}</span><span style={{ fontSize: 10, color: "#6b7280", marginLeft: 6 }}>{x.d}</span></div>
            <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}><span style={{ fontSize: 15, fontWeight: 700, color: x.c, fontFamily: "'JetBrains Mono',monospace" }}>{x.v}</span><span style={{ fontSize: 9, color: "#6b7280" }}>/ {x.tg}</span></div>
          </div>
          <div style={{ width: "100%", height: 5, background: "#1a1a2e", borderRadius: 3, overflow: "hidden", marginBottom: 3 }}><div style={{ width: `${Math.min(x.p * 100, 100)}%`, height: "100%", background: x.p >= 1 ? x.c : `${x.c}99`, borderRadius: 3 }} /></div>
          <div style={{ fontSize: 10, color: "#6b7280" }}>{x.dt}</div>
        </div>))}
      </div>
      <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #1e1e2e" }}>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🏆 Top Knowledge Nodes (ex-founder)</div>
        {D.filter(x => !x.u).sort((a, b) => { const sa = a.l * 3 + a.w * 0.5 + a.aw * 2 + a.m * 0.1; const sb = b.l * 3 + b.w * 0.5 + b.aw * 2 + b.m * 0.1; return sb - sa; }).slice(0, 10).map((x, i) => {
          const ks = (x.l * 3 + x.w * 0.5 + x.aw * 2 + x.m * 0.1).toFixed(0);
          return (<div key={x.n} onClick={() => goM(x.n)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 4px", borderBottom: i < 9 ? "1px solid #1a1a2e" : "none", cursor: "pointer", borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.background = "#1a1a2e"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: i < 3 ? "#052e16" : "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: i < 3 ? "#10b981" : "#6b7280", fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ flex: 1 }}><span style={{ fontSize: 12, fontWeight: 500, color: "#e5e7eb" }}>{x.n}</span></div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 10, color: "#9ca3af" }}><span>🔗{x.l}</span><span>💬{x.m}</span><span>{x.w.toFixed(0)}w</span><span style={{ color: "#10b981", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{ks}</span></div>
          </div>);
        })}
      </div>
    </div>)}

    {/* ── TAB: Insights ──────────────────────────────────────────── */}
    {sec === "insights" && (<div style={{ padding: "14px 20px 80px" }}>
      <div style={{ background: "#111118", borderRadius: 12, padding: "14px 12px", border: "1px solid #f59e0b25", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>⚠️ Founder Dependency Analysis</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {[{ lb: "Message Share", v: `${(k.fM * 100).toFixed(0)}%`, tg: "<15%", bad: k.fM > 0.15, c: "#f59e0b" }, { lb: "Link Share", v: `${(k.fL * 100).toFixed(0)}%`, tg: "<20%", bad: k.fL > 0.2, c: "#ef4444" }, { lb: "Your Msgs", v: k.yM.toLocaleString(), tg: null, bad: false, c: "#8b5cf6" }, { lb: "Your Links", v: k.yL, tg: null, bad: false, c: "#3b82f6" }].map(x => (
            <div key={x.lb} style={{ flex: "1 1 80px", minWidth: 80, background: x.bad ? "#422006" : "#0a0a0f", borderRadius: 8, padding: "9px 11px", border: `1px solid ${x.bad ? x.c + "30" : "#1e1e2e"}` }}>
              <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{x.lb}</div>
              <div style={{ fontSize: 19, fontWeight: 700, color: x.c, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{x.v}</div>
              {x.tg && <div style={{ fontSize: 9, color: x.bad ? "#ef4444" : "#10b981", marginTop: 2 }}>target: {x.tg}</div>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#d4a574", lineHeight: 1.6, padding: "10px 12px", background: "#422006", borderRadius: 8, border: "1px solid #f59e0b20" }}>
          <strong style={{ color: "#f59e0b" }}>What this means:</strong> You are the brain, curator, and energy source. If you stop posting for a week, knowledge input drops by more than half.<br /><br />
          <strong style={{ color: "#f59e0b" }}>How to fix:</strong> Assign weekly curator roles to top 5. Challenge{" "}
          <span onClick={() => goM("Andres Felipe Arias")} style={{ textDecoration: "underline", cursor: "pointer" }}>Andres Felipe</span>,{" "}
          <span onClick={() => goM("gordo Barato")} style={{ textDecoration: "underline", cursor: "pointer" }}>gordo Barato</span>,{" "}
          <span onClick={() => goM("Lucas Jaramillo")} style={{ textDecoration: "underline", cursor: "pointer" }}>Lucas</span>,{" "}
          <span onClick={() => goM("Fede Suarez")} style={{ textDecoration: "underline", cursor: "pointer" }}>Fede</span>, and{" "}
          <span onClick={() => goM("Dario Palacio")} style={{ textDecoration: "underline", cursor: "pointer" }}>Dario</span> to match your link output.
        </div>
      </div>
      <Ins icon="📊" title={`Top 5 Concentration: ${(k.t5p * 100).toFixed(0)}% of non-founder msgs`} color="#8b5cf6" body={`${k.t5.map(x => x.n).join(", ")} generate ${k.t5m.toLocaleString()} of ${(k.tot - k.yM).toLocaleString()} non-founder messages. The remaining ${k.tA - 6} Tier A members average only ${((k.tot - k.yM - k.t5m) / (k.tA - 6)).toFixed(0)} msgs each.`} />
      <Ins icon="👻" title={`Lurker Ratio: ${(k.lurkP * 100).toFixed(0)}% have <3 messages`} color="#ef4444" body={`${k.lurk} of ${k.nn} members posted fewer than 3 messages in ${SNAP.days} days.`} />
      <Ins icon="📐" title={`Signal Quality: ${k.deep} deep writers (${((k.deep / k.nn) * 100).toFixed(0)}%)`} color="#ec4899" body="Members averaging 15+ words/msg are your analytical engines. Challenge them to post original theses, not just reactions." />
      <Ins icon="🔗" title={`Knowledge Input Diversity: ${k.lk} of ${k.nn} share links`} color="#3b82f6" body={`Only ${((k.lk / k.nn) * 100).toFixed(0)}% bring in external knowledge. The group's information diet depends on ~${k.lk} curators feeding ${k.nn} consumers.`} />
      <Ins icon="📅" title={`Consistency: avg ${k.avgW.toFixed(1)} of 14 weeks active`} color="#f59e0b" body={`${D.filter(x => x.aw <= 2).length} members were active only 1-2 weeks total. Consistency matters more than volume.`} />
      <Ins icon="🚌" title="Bus Factor: 1" color="#ef4444" body={`If Hernán stops posting, the group loses ${(k.fM * 100).toFixed(0)}% of messages and ${(k.fL * 100).toFixed(0)}% of links overnight. Goal: raise bus factor to 5.`} />
      <div style={{ background: "#052e16", borderRadius: 12, padding: "14px 12px", border: "1px solid #10b98130", marginTop: 4 }}>
        <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>🎯 Actionable Plays</div>
        {[
          { n: "1", t: "Cut dead weight NOW", d: `Remove ${k.tZ} zombies + ${k.tC} Tier C + ${D.filter(x => x.t === "B" && x.di > 60).length} dormant = ${k.dw} total cuts.` },
          { n: "2", t: "Weekly Curator Rotation", d: "Top 5 non-founder each curate 3 links/week on rotating topics." },
          { n: "3", t: "Activate the Long Tail", d: `${D.filter(x => x.t === "A" && x.m < 20 && x.m >= 5).length} Tier A members have 5-20 msgs. Tag them directly.` },
          { n: "4", t: "Thursday Thesis Drop", d: "Weekly ritual: 3 members post a 1-paragraph investment thesis." },
          { n: "5", t: "Quarterly Audit", d: "Re-run this analysis every 90 days. Track founder dependency ↓, contributors ↑." },
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
        <div style={{ fontSize: 12, color: "#e5a0a0", lineHeight: 1.6 }}>The revolution demands participation. Members below contributed zero signal to collective intelligence.</div>
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
        {[{ crime: "Zero Participation", icon: "🧟", desc: `Never posted a single message in ${SNAP.days} days.`, count: k.tZ }, { crime: "Abandonment", icon: "💀", desc: "Posted 1-7 messages then went silent 65+ days.", count: k.tC }, { crime: "Dormancy", icon: "😴", desc: "Had some activity but 60+ days inactive.", count: D.filter(x => x.t === "B" && x.di > 60).length }].map((c, i) => (
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
        <div style={{ fontSize: 10, color: "#6b21a8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🧟 The Executed — Zero Post Zombies ({k.tZ})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {D.filter(x => x.t === "Z").sort((a, b) => a.n.localeCompare(b.n)).map(z => (<div key={z.n} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#2e1065", color: "#a78bfa", border: "1px solid #6b21a830" }}>{z.n}</div>))}
        </div>
      </div>
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #ef444425", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>💀 The Deserters — Tier C ({k.tC})</div>
        {D.filter(x => x.t === "C").sort((a, b) => b.di - a.di).map(m => (<div key={m.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1a1a2e" }}><span style={{ fontSize: 12, color: "#e5e7eb" }}>{m.n}</span><div style={{ display: "flex", gap: 12, fontSize: 10, color: "#9ca3af" }}><span>{m.m} msgs</span><span style={{ color: "#ef4444" }}>{m.di}d silent</span></div></div>))}
      </div>
      <div style={{ background: "#111118", borderRadius: 12, padding: "16px 14px", border: "1px solid #f59e0b25", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>😴 Death Row — Dormant Tier B ({D.filter(x => x.t === "B" && x.di > 60).length})</div>
        {D.filter(x => x.t === "B" && x.di > 60).sort((a, b) => b.di - a.di).map(m => (<div key={m.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1a1a2e" }}><span style={{ fontSize: 12, color: "#e5e7eb" }}>{m.n}</span><div style={{ display: "flex", gap: 12, fontSize: 10, color: "#9ca3af" }}><span>{m.m} msgs</span><span>{m.s.toFixed(0)} score</span><span style={{ color: "#f59e0b" }}>{m.di}d silent</span></div></div>))}
      </div>
      <div style={{ background: "#052e16", borderRadius: 12, padding: "16px 14px", border: "1px solid #10b98130" }}>
        <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🔄 Path to Redemption</div>
        <div style={{ fontSize: 11, color: "#a0d4b8", lineHeight: 1.6 }}>The revolution is firm but fair. Executed members may petition for re-entry:</div>
        <div style={{ marginTop: 10 }}>
          {["DM the founder with a 1-paragraph thesis on any current investment topic", "Commit to sharing minimum 2 quality links per week (no IG/TikTok)", "Engage in at least 3 discussions per week for the first month", "Accept that a second execution is permanent — no appeals"].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
              <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: 11, color: "#a0d4b8" }}>{r}</span>
            </div>
          ))}
        </div>
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
            <option value="score">Sort: Score</option><option value="msgs">Sort: Messages</option><option value="links">Sort: Links</option><option value="inactive">Sort: Most Inactive</option>
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
