import { Link } from "react-router-dom";
import {
  Brain, Users, TrendingUp, Shield, Sparkles, Clock,
  Award, BarChart3, Target, Lightbulb, CheckCircle,
  ArrowRight, Star, Zap, ArrowUpRight, Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { useTestStore } from "@/store/testStore";
import { useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600&display=swap');

:root {
  --cream:   #f5f0e8;
  --cream2:  #ede7d9;
  --ink:     #1a1a18;
  --ink2:    #3d3d38;
  --forest:  #1e4035;
  --forest2: #2a5c4e;
  --terra:   #c8622a;
  --terra2:  #e07840;
  --gold:    #d4a843;
  --mist:    #8a8a7a;
  --white:   #ffffff;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.lp {
  font-family: 'Outfit', sans-serif;
  background: var(--cream);
  color: var(--ink);
  overflow-x: hidden;
  min-height: 100vh;
}

/* ── utility ── */
.serif { font-family: 'Fraunces', serif; }
.w { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
a { text-decoration: none; color: inherit; }

/* ═══════════════════════════════════════
   HERO — asymmetric, text-first, full-bleed
═══════════════════════════════════════ */
.hero {
  min-height: 100vh;
  background: var(--forest);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* noise texture overlay */
.hero::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.4; pointer-events: none; z-index: 1;
}

.hero-nav {
  position: fixed; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  
  width: 100%;
  background: var(--forest);
  padding: 18px 52px;
}
.hero-logo {
  font-family: 'Fraunces', serif;
  font-size: 1.5rem; font-weight: 700;
  color: var(--cream); letter-spacing: -0.02em;
}
.hero-logo span { color: var(--gold); }
.hero-nav-links {
  display: flex; align-items: center; gap: 32px;
}
.hero-nav-links a {
  font-size: 0.85rem; color: rgba(245,240,232,0.6);
  font-weight: 400; transition: color 0.2s; letter-spacing: 0.03em;
}
.hero-nav-links a:hover { color: var(--cream); }
.nav-cta {
  padding: 9px 20px; border-radius: 6px;
  background: var(--terra); color: var(--white) !important;
  font-weight: 600 !important; font-size: 0.85rem !important;
  transition: background 0.2s !important;
}
.nav-cta:hover { background: var(--terra2) !important; }

.hero-body {
  flex: 1; display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  position: relative; z-index: 2;
  padding: 48px 52px 0;
  gap: 0;
}

.hero-left {
  display: flex; flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 72px;
}

/* large label */
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--gold);
  margin-bottom: 24px;
}
.hero-eyebrow::before {
  content: ''; width: 28px; height: 1px; background: var(--gold);
}

.hero-h1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  font-weight: 900;
  line-height: 1.0;
  letter-spacing: -0.03em;
  color: var(--cream);
  margin-bottom: 28px;
}


.hero-h1 em {
  font-style: italic;
  color: var(--terra2);
}

.hero-sub {
  font-size: 1rem; color: rgba(245,240,232,0.55);
  line-height: 1.7; max-width: 420px; margin-bottom: 40px;
  font-weight: 300;
}

.hero-actions { display: flex; align-items: center; gap: 16px; }

.btn-hero-primary {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 28px; border-radius: 8px;
  background: var(--terra); color: var(--white);
  font-family: 'Outfit', sans-serif;
  font-weight: 600; font-size: 0.9rem;
  border: none; cursor: pointer;
  transition: all 0.22s;
  box-shadow: 0 8px 32px rgba(200,98,42,0.4);
}
.btn-hero-primary:hover { background: var(--terra2); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(200,98,42,0.5); }

.btn-hero-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 24px; border-radius: 8px;
  background: transparent; color: rgba(245,240,232,0.7);
  font-family: 'Outfit', sans-serif;
  font-weight: 400; font-size: 0.9rem;
  border: 1px solid rgba(245,240,232,0.2);
  cursor: pointer; transition: all 0.22s;
}
.btn-hero-ghost:hover { border-color: rgba(245,240,232,0.5); color: var(--cream); }

/* hero right — stacked image + floating cards */
.hero-right {
  position: relative;
  display: flex; align-items: flex-end;
}
.hero-img-wrap {
  width: 100%; height: 580px;
  border-radius: 24px 24px 0 0;
  overflow: hidden;
  position: relative;
}
.hero-img-wrap img {
  width: 100%; height: 100%; object-fit: cover;
  filter: saturate(0.85);
}
.hero-img-wrap::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(30,64,53,0.7) 0%, transparent 50%);
}

/* floating stat pill on image */
.hero-pill {
  position: absolute; z-index: 10;
  background: rgba(245,240,232,0.95);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  display: flex; flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.2);
}
.hero-pill-a { bottom: 48px; left: -40px; padding: 16px 22px; }
.hero-pill-b { top: 80px; right: -24px; padding: 14px 20px; flex-direction: row; gap: 12px; }
.hp-num { font-family: 'Fraunces', serif; font-size: 1.6rem; font-weight: 900; color: var(--forest); line-height: 1; }
.hp-lbl { font-size: 0.7rem; color: var(--mist); font-weight: 500; margin-top: 3px; letter-spacing: 0.04em; }
.hp-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--forest); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* bottom trust strip */
.hero-trust {
  position: relative; z-index: 2;
  padding: 24px 52px;
  border-top: 1px solid rgba(245,240,232,0.08);
  display: flex; align-items: center; gap: 40px;
}
.ht-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: rgba(245,240,232,0.45); }
.ht-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(245,240,232,0.2); }

/* ═══════════════════════════════════════
   TICKER STRIP
═══════════════════════════════════════ */
.ticker {
  background: var(--terra);
  padding: 13px 0; overflow: hidden;
}
@keyframes tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.ticker-inner { display: flex; animation: tick 24s linear infinite; white-space: nowrap; }
.ticker-item {
  padding: 0 32px; font-size: 0.78rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.85);
}

/* ═══════════════════════════════════════
   INTRO / ABOUT STRIP — full-width diagonal
═══════════════════════════════════════ */
.intro-strip {
  background: var(--cream);
  padding: 80px 0;
  position: relative;
}
.intro-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 40px;
  display: grid; grid-template-columns: 1fr 2fr; gap: 80px; align-items: start;
}
.intro-label {
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--mist);
  display: flex; align-items: center; gap: 10px; padding-top: 8px;
}
.intro-label::after { content: ''; flex: 1; height: 1px; background: var(--cream2); }
.intro-content h2 {
  font-family: 'Fraunces', serif; font-size: 2.4rem; font-weight: 700;
  line-height: 1.2; margin-bottom: 18px; letter-spacing: -0.02em;
}
.intro-content h2 span { color: var(--forest); }
.intro-content p { font-size: 1rem; color: var(--ink2); line-height: 1.8; max-width: 560px; margin-bottom: 24px; font-weight: 300; }
.intro-stats {
  display: flex; gap: 40px; margin-top: 8px;
}
.is-item { }
.is-num { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 900; color: var(--forest); line-height: 1; }
.is-lbl { font-size: 0.75rem; color: var(--mist); margin-top: 4px; }

/* ═══════════════════════════════════════
   FEATURED TESTS — horizontal scroll cards
═══════════════════════════════════════ */
.tests-section {
  background: var(--ink);
  padding: 88px 0 0;
  overflow: hidden;
}
.tests-header {
  max-width: 1200px; margin: 0 auto; padding: 0 40px 48px;
  display: flex; align-items: flex-end; justify-content: space-between;
}
.tests-header-left {}
.tests-eyebrow { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
.tests-header h2 { font-family: 'Fraunces', serif; font-size: 2.6rem; font-weight: 900; color: var(--cream); line-height: 1.1; letter-spacing: -0.02em; }
.tests-header h2 em { font-style: italic; color: var(--terra2); }

/* scrollable track */
.tests-track-wrap { padding: 0 40px 72px; overflow-x: auto; scrollbar-width: none; }
.tests-track-wrap::-webkit-scrollbar { display: none; }
.tests-track { display: flex; gap: 20px; width: max-content; padding-bottom: 4px; }

.test-card {
  width: 300px; flex-shrink: 0;
  background: rgba(245,240,232,0.04);
  border: 1px solid rgba(245,240,232,0.08);
  border-radius: 20px; padding: 28px 24px;
  display: flex; flex-direction: column; gap: 14px;
  transition: all 0.28s; cursor: pointer;
  position: relative; overflow: hidden;
}
.test-card::before {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--terra), var(--gold));
  transform: scaleX(0); transition: transform 0.3s;
}
.test-card:hover { background: rgba(245,240,232,0.07); border-color: rgba(245,240,232,0.16); transform: translateY(-4px); }
.test-card:hover::before { transform: scaleX(1); }

.tc-cat {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; justify-content: space-between;
}
.tc-live {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 0.65rem; font-weight: 600; color: #6ee7b7;
  padding: 2px 8px; border-radius: 99px;
  background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2);
}
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #34d399; animation: lp 2s ease-in-out infinite; }
@keyframes lp { 0%,100%{opacity:1} 50%{opacity:0.3} }

.tc-title {
  font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 700;
  color: var(--cream); line-height: 1.3; letter-spacing: -0.01em;
}
.tc-desc { font-size: 0.82rem; color: rgba(245,240,232,0.45); line-height: 1.65; flex: 1; }
.tc-completions { font-size: 0.75rem; color: rgba(245,240,232,0.3); display: flex; align-items: center; gap: 6px; }
.tc-btn {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px 0; border-radius: 8px;
  background: var(--terra); color: var(--white);
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.82rem;
  border: none; cursor: pointer; transition: background 0.2s;
  text-decoration: none;
}
.tc-btn:hover { background: var(--terra2); }

/* skeleton */
.test-skel { width: 300px; flex-shrink: 0; height: 260px; border-radius: 20px; background: rgba(245,240,232,0.04); border: 1px solid rgba(245,240,232,0.06); }

/* ═══════════════════════════════════════
   FEATURES — 2-col editorial layout
═══════════════════════════════════════ */
.features-section { background: var(--cream); padding: 100px 0; }
.features-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 40px;
}
.features-top {
  display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
  margin-bottom: 64px; align-items: end;
}
.features-top-left {}
.feat-eyebrow { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mist); margin-bottom: 16px; }
.features-top-left h2 { font-family: 'Fraunces', serif; font-size: 2.6rem; font-weight: 900; line-height: 1.1; letter-spacing: -0.025em; }
.features-top-left h2 span { color: var(--terra); }
.features-top-right p { font-size: 0.95rem; color: var(--ink2); line-height: 1.8; font-weight: 300; margin-bottom: 24px; }

.feat-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 2px; background: var(--cream2); border-radius: 20px; overflow: hidden;
}
.feat-item {
  background: var(--cream); padding: 32px 28px;
  transition: background 0.2s;
  position: relative;
}
.feat-item:hover { background: var(--forest); }
.feat-item:hover .fi-title { color: var(--cream); }
.feat-item:hover .fi-desc { color: rgba(245,240,232,0.55); }
.feat-item:hover .fi-icon { background: rgba(245,240,232,0.1); border-color: rgba(245,240,232,0.15); }
.feat-item:hover .fi-icon svg { color: var(--gold) !important; }
.feat-item:hover .fi-num { color: rgba(245,240,232,0.1); }

.fi-num { font-family: 'Fraunces', serif; font-size: 4rem; font-weight: 900; color: var(--cream2); line-height: 1; margin-bottom: 16px; transition: color 0.2s; user-select: none; }
.fi-icon { width: 44px; height: 44px; border-radius: 10px; background: var(--cream2); border: 1px solid transparent; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; transition: all 0.2s; }
.fi-title { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; transition: color 0.2s; }
.fi-desc { font-size: 0.82rem; color: var(--mist); line-height: 1.65; transition: color 0.2s; }

/* ═══════════════════════════════════════
   TEST TYPES — diagonal split
═══════════════════════════════════════ */
.types-section {
  background: var(--forest);
  padding: 100px 0;
  clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
  margin: -40px 0;
  position: relative; z-index: 2;
}
.types-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.types-top { text-align: center; margin-bottom: 56px; }
.types-top .te { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
.types-top h2 { font-family: 'Fraunces', serif; font-size: 2.4rem; font-weight: 900; color: var(--cream); letter-spacing: -0.025em; line-height: 1.1; }
.types-top h2 em { font-style: italic; color: var(--terra2); }

.types-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
.type-card {
  border-radius: 18px; padding: 32px 22px;
  border: 1px solid rgba(245,240,232,0.08);
  background: rgba(245,240,232,0.03);
  text-align: center; transition: all 0.28s;
  position: relative; overflow: hidden;
}
.type-card::before {
  content: ''; position: absolute;
  width: 120px; height: 120px; border-radius: 50%;
  background: var(--ac, rgba(200,98,42,0.12));
  top: -40px; right: -40px;
  transition: transform 0.4s;
}
.type-card:hover { transform: translateY(-5px); border-color: rgba(245,240,232,0.18); }
.type-card:hover::before { transform: scale(1.4); }
.type-icon { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; background: rgba(245,240,232,0.06); border: 1px solid rgba(245,240,232,0.1); }
.type-title { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 700; color: var(--cream); margin-bottom: 8px; }
.type-desc { font-size: 0.8rem; color: rgba(245,240,232,0.45); line-height: 1.6; }

/* ═══════════════════════════════════════
   BENEFITS — split screen
═══════════════════════════════════════ */
.ben-section { background: var(--cream); padding: 120px 0 100px; }
.ben-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }

.ben-left {}
.ben-eyebrow { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mist); margin-bottom: 16px; }
.ben-left h2 { font-family: 'Fraunces', serif; font-size: 2.6rem; font-weight: 900; line-height: 1.1; letter-spacing: -0.025em; margin-bottom: 18px; }
.ben-left h2 span { color: var(--forest); }
.ben-left p { font-size: 0.95rem; color: var(--ink2); line-height: 1.8; font-weight: 300; margin-bottom: 36px; max-width: 440px; }

.ben-list { margin-bottom: 40px; }
.ben-item { display: flex; align-items: center; gap: 14px; padding: 13px 0; border-bottom: 1px solid var(--cream2); }
.ben-item:last-child { border-bottom: none; }
.ben-check { width: 26px; height: 26px; border-radius: 50%; background: var(--forest); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ben-item span { font-size: 0.9rem; color: var(--ink2); font-weight: 400; }

.ben-btns { display: flex; gap: 12px; }
.btn-forest {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; border-radius: 8px;
  background: var(--forest); color: var(--cream);
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.875rem;
  border: none; cursor: pointer; transition: all 0.2s;
}
.btn-forest:hover { background: var(--forest2); transform: translateY(-1px); }
.btn-outline-ink {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 22px; border-radius: 8px;
  background: transparent; color: var(--ink2);
  font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 0.875rem;
  border: 1.5px solid var(--cream2); cursor: pointer; transition: all 0.2s;
  text-decoration: none;
}
.btn-outline-ink:hover { border-color: var(--ink2); }

/* right — big card stack */
.ben-right { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.stat-big {
  border-radius: 18px; padding: 28px 22px;
  display: flex; flex-direction: column; gap: 6px;
  position: relative; overflow: hidden;
}
.sb-1 { background: var(--forest); grid-column: span 2; flex-direction: row; align-items: center; justify-content: space-around; padding: 28px 32px; }
.sb-2 { background: var(--terra); }
.sb-3 { background: var(--cream2); }
.sb-4 { background: var(--ink); grid-column: span 2; flex-direction: row; align-items: center; justify-content: space-around; padding: 24px 32px; }

.sn { font-family: 'Fraunces', serif; font-size: 2.2rem; font-weight: 900; line-height: 1; }
.sl { font-size: 0.76rem; font-weight: 500; margin-top: 4px; opacity: 0.65; }
.sb-1 .sn, .sb-1 .sl { color: var(--cream); }
.sb-2 .sn, .sb-2 .sl { color: var(--white); }
.sb-3 .sn { color: var(--forest); }
.sb-3 .sl { color: var(--mist); }
.sb-4 .sn, .sb-4 .sl { color: var(--cream); }
.sb-div { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }
.sb-div-dark { width: 1px; height: 40px; background: rgba(30,64,53,0.15); }

/* ═══════════════════════════════════════
   CTA — warm, editorial full-bleed
═══════════════════════════════════════ */
.cta-sec {
  background: var(--terra);
  padding: 100px 40px;
  position: relative; overflow: hidden;
  text-align: center;
}
.cta-sec::before {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}
.cta-inner { position: relative; max-width: 640px; margin: 0 auto; }
.cta-tag { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 99px; padding: 5px 16px; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.9); margin-bottom: 24px; }
.cta-inner h2 { font-family: 'Fraunces', serif; font-size: 3rem; font-weight: 900; color: var(--white); line-height: 1.08; letter-spacing: -0.03em; margin-bottom: 18px; }
.cta-inner h2 em { font-style: italic; }
.cta-inner p { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 36px; font-weight: 300; }
.cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn-cta-white {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 26px; border-radius: 8px;
  background: var(--white); color: var(--terra);
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.9rem;
  border: none; cursor: pointer; transition: all 0.2s;
  text-decoration: none;
}
.btn-cta-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.btn-cta-outline {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 26px; border-radius: 8px;
  background: transparent; color: var(--white);
  font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 0.9rem;
  border: 1.5px solid rgba(255,255,255,0.35); cursor: pointer; transition: all 0.2s;
  text-decoration: none;
}
.btn-cta-outline:hover { border-color: var(--white); }

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 960px) {
  .hero-body { grid-template-columns: 1fr; padding: 32px 28px 0; }
  .hero-right { display: none; }
  .hero-nav { padding: 22px 28px; }
  .hero-trust { padding: 20px 28px; flex-wrap: wrap; gap: 16px; }
  .intro-inner { grid-template-columns: 1fr; gap: 32px; }
  .features-top { grid-template-columns: 1fr; gap: 24px; }
  .feat-grid { grid-template-columns: 1fr 1fr; }
  .types-grid { grid-template-columns: 1fr 1fr; }
  .ben-inner { grid-template-columns: 1fr; }
  .ben-right { order: -1; }
}
@media (max-width: 600px) {
  .hero-h1 { font-size: 2.6rem; }
  .feat-grid { grid-template-columns: 1fr; }
  .types-grid { grid-template-columns: 1fr; }
  .ben-right { grid-template-columns: 1fr; }
  .sb-1, .sb-4 { grid-column: span 1; flex-direction: column; }
  .sb-div, .sb-div-dark { display: none; }
  .tests-header { flex-direction: column; align-items: flex-start; gap: 16px; }
}
`;

/* ── data ── */
const features = [
  { icon: Brain,     title: "Advanced AI Assessment",  desc: "Deep insights into cognitive abilities and personality traits using cutting-edge algorithms." },
  { icon: Users,     title: "Multi-Role Platform",     desc: "Built for students, professionals, educators, and HR teams with role-specific features." },
  { icon: TrendingUp,title: "Adaptive Testing",        desc: "Tests adapt to your skill level for accurate, efficient assessment every time." },
  { icon: Shield,    title: "Secure & Private",        desc: "Bank-level security with full GDPR compliance — your data stays yours." },
  { icon: BarChart3, title: "Detailed Analytics",      desc: "Comprehensive reports with actionable insights and career recommendations." },
  { icon: Clock,     title: "Instant Results",         desc: "AI-generated personalised feedback and reports immediately after completion." },
];

const testTypes = [
  { title: "Aptitude Tests",         desc: "Verbal, numerical & logical reasoning",     icon: Target,    color: "rgba(212,168,67,0.15)",  iconCol: "#d4a843" },
  { title: "Personality Assessment", desc: "Big Five & MBTI-style profiling",            icon: Users,     color: "rgba(200,98,42,0.15)",   iconCol: "#c8622a" },
  { title: "Interest Inventory",     desc: "Holland's Code RIASEC career mapping",       icon: Lightbulb, color: "rgba(14,165,233,0.15)",  iconCol: "#0ea5e9" },
  { title: "Emotional Intelligence", desc: "Self-awareness, empathy & regulation",       icon: Brain,     color: "rgba(52,211,153,0.15)",  iconCol: "#34d399" },
];

const benefits = [
  "Scientifically validated assessments",
  "AI-powered personalised recommendations",
  "Real-time progress tracking",
  "Career guidance and counselling support",
  "Industry-specific professional assessments",
  "Comprehensive reporting dashboard",
];

const tickerItems = ["Aptitude Tests","Personality Profiling","EQ Assessments","Career Mapping","RIASEC Inventory","Adaptive Testing","AI Reports","Instant Results","Scientifically Validated","GDPR Compliant"];

export const Landing = () => {
  const navigate = useNavigate();
  const { getPublicPublishedTests, publicPublishedTests } = useTestStore();
  useEffect(() => { getPublicPublishedTests(); }, [getPublicPublishedTests]);

  return (
    <>
      <style>{CSS}</style>
      <div className="lp">

        {/* ═══════════ HERO ═══════════ */}
        <section className="hero">

          {/* Nav */}
          <nav className="hero-nav">
            <div className="hero-logo">Path<span>Grad</span></div>
            <div className="hero-nav-links">
              <Link to="/tests">Tests</Link>
              <Link to="/counselors">Counselors</Link>
              <Link to="/about">About</Link>
              <Link to="/login" className="nav-cta">Get Started</Link>
            </div>
          </nav>

          {/* Body */}
          <div className="hero-body mt-7">
            <div className="hero-left">
              <div className="hero-eyebrow"><Sparkles size={12}/> AI-Powered Psychometric Platform</div>
              <h1 className="hero-h1">
                Discover<br/>
                who you <em>truly</em><br/>
                are — and where<br/>
                you belong.
              </h1>
              <p className="hero-sub">
                Comprehensive AI assessments that reveal your cognitive strengths, personality traits, and ideal career path — in under 30 minutes.
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn-hero-primary">
                  Start Free Assessment <ArrowRight size={15}/>
                </Link>
                <Link to="/counselors" className="btn-hero-ghost">
                  Talk to a Counselor
                </Link>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-img-wrap">
                <img src={heroImage} alt="Assessment platform"/>
                {/* floating pills */}
                <div className="hero-pill hero-pill-a">
                  <div className="hp-num">50K+</div>
                  <div className="hp-lbl">Assessments completed</div>
                </div>
                <div className="hero-pill hero-pill-b">
                  <div className="hp-icon"><Star size={16} color="#f5f0e8"/></div>
                  <div>
                    <div style={{fontFamily:"'Fraunces',serif",fontWeight:900,fontSize:"1rem",color:"var(--forest)",lineHeight:1}}>4.9/5</div>
                    <div className="hp-lbl">User rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="hero-trust">
            {["Free to start","No credit card required","GDPR Compliant","Results in 30 minutes","95% Accuracy rate"].map((t,i,a)=>(
              <span key={t}>
                <span className="ht-item"><CheckCircle size={13} color="rgba(245,240,232,0.4)"/>{t}</span>
                {i < a.length-1 && <span className="ht-dot" style={{marginLeft:40}}/>}
              </span>
            ))}
          </div>
        </section>

        {/* ═══════════ TICKER ═══════════ */}
        <div className="ticker">
          <div className="ticker-inner">
            {[...tickerItems,...tickerItems].map((x,i)=>(
              <span key={i} className="ticker-item">✦ {x}</span>
            ))}
          </div>
        </div>

        {/* ═══════════ INTRO STRIP ═══════════ */}
        <section className="intro-strip">
          <div className="intro-inner">
            <div>
              <div className="intro-label">About PathGrad</div>
            </div>
            <div className="intro-content">
              <h2>The most <span>scientifically rigorous</span> career assessment platform available today.</h2>
              <p>PathGrad combines decades of psychometric research with modern AI to give you actionable insights — not just scores. We help students, professionals, and organisations understand what makes people thrive.</p>
              <div className="intro-stats">
                {[{n:"95%",l:"Accuracy rate"},{n:"50K+",l:"Tests completed"},{n:"24/7",l:"AI support"},{n:"4.9★",l:"Avg rating"}].map(s=>(
                  <div key={s.l} className="is-item">
                    <div className="is-num">{s.n}</div>
                    <div className="is-lbl">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ FEATURED TESTS ═══════════ */}
        <section className="tests-section">
          <div className="tests-header">
            <div className="tests-header-left">
              <div className="tests-eyebrow">✦ Featured Tests</div>
              <h2>Take a test,<br/><em>change your path.</em></h2>
            </div>
            <Link to="/tests" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:"0.85rem",color:"rgba(245,240,232,0.5)",fontWeight:500,transition:"color 0.2s"}}
              onMouseEnter={e=>(e.currentTarget.style.color="rgba(245,240,232,0.9)")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(245,240,232,0.5)")}>
              View all tests <ArrowUpRight size={14}/>
            </Link>
          </div>

          <div className="tests-track-wrap">
            <div className="tests-track">
              {publicPublishedTests
                ? publicPublishedTests.map(test=>(
                    <div key={test.id} className="test-card">
                      <div className="tc-cat">
                        <span>{test.category}</span>
                        {test.isPublished && <span className="tc-live"><span className="live-dot"/>Live</span>}
                      </div>
                      <div className="tc-title">{test.title}</div>
                      <div className="tc-desc">{test.description}</div>
                      {test?.completions > 0 && (
                        <div className="tc-completions"><Users size={11}/>{test.completions.toLocaleString()} completions</div>
                      )}
                      <Link to={`/get-started?testId=${test.id}`} className="tc-btn">
                        Start Test <ArrowRight size={13}/>
                      </Link>
                    </div>
                  ))
                : Array.from({length:6}).map((_,i)=><div key={i} className="test-skel"/>)
              }
            </div>
          </div>
        </section>

        {/* ═══════════ FEATURES ═══════════ */}
        <section className="features-section">
          <div className="features-inner">
            <div className="features-top">
              <div className="features-top-left">
                <div className="feat-eyebrow">Why PathGrad</div>
                <h2>Built different.<br/><span>Built better.</span></h2>
              </div>
              <div className="features-top-right">
                <p>We didn't copy the standard HR software checklist. PathGrad was designed from the ground up around what actually helps people understand themselves — scientifically validated, beautifully simple.</p>
                <Link to="/about" className="btn-outline-ink">Learn our methodology <ArrowUpRight size={14}/></Link>
              </div>
            </div>
            <div className="feat-grid">
              {features.map((f,i)=>(
                <div key={i} className="feat-item">
                  <div className="fi-num">0{i+1}</div>
                  <div className="fi-icon"><f.icon size={18} color="var(--forest)"/></div>
                  <div className="fi-title">{f.title}</div>
                  <div className="fi-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ TEST TYPES ═══════════ */}
        <section className="types-section">
          <div className="types-inner">
            <div className="types-top">
              <div className="te">✦ Test Battery</div>
              <h2>Four dimensions.<br/><em>One complete picture.</em></h2>
            </div>
            <div className="types-grid">
              {testTypes.map((t,i)=>(
                <div key={i} className="type-card" style={{"--ac":t.color} as React.CSSProperties}>
                  <div className="type-icon"><t.icon size={22} color={t.iconCol}/></div>
                  <div className="type-title">{t.title}</div>
                  <div className="type-desc">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ BENEFITS ═══════════ */}
        <section className="ben-section">
          <div className="ben-inner">
            <div className="ben-left">
              <div className="ben-eyebrow">Everything you need</div>
              <h2>A platform built<br/>for <span>real outcomes.</span></h2>
              <p>Every feature exists to get you one step closer to knowing yourself, choosing the right path, and thriving in your career.</p>
              <div className="ben-list">
                {benefits.map((b,i)=>(
                  <div key={i} className="ben-item">
                    <div className="ben-check"><CheckCircle size={13} color="var(--cream)"/></div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <div className="ben-btns">
                <button className="btn-forest" onClick={()=>{localStorage.removeItem("testId");localStorage.removeItem("testFlowActive");navigate("/get-started");}}>
                  Get Started Today <ArrowRight size={14}/>
                </button>
                <Link to="/about" className="btn-outline-ink">Learn More</Link>
              </div>
            </div>

            <div className="ben-right">
              <div className="stat-big sb-1">
                {[{n:"50K+",l:"Assessments"},{n:"95%",l:"Accuracy"}].map((s,i,a)=>(
                  <span key={s.l} style={{display:"flex",flexDirection:"column"}}>
                    <span className="sn">{s.n}</span><span className="sl">{s.l}</span>
                    {i<a.length-1 && <span className="sb-div" style={{position:"absolute",left:"50%"}}/>}
                  </span>
                ))}
                <div className="sb-div"/>
                <span style={{display:"flex",flexDirection:"column"}}><span className="sn">95%</span><span className="sl">Accuracy</span></span>
              </div>
              <div className="stat-big sb-2">
                <span className="sn">24/7</span><span className="sl">AI Support Available</span>
              </div>
              <div className="stat-big sb-3">
                <span className="sn" style={{color:"var(--forest)"}}>4.9★</span>
                <span className="sl">Average User Rating</span>
              </div>
              <div className="stat-big sb-4">
                <span style={{display:"flex",flexDirection:"column"}}><span className="sn">30m</span><span className="sl">Avg. completion</span></span>
                <div className="sb-div"/>
                <span style={{display:"flex",flexDirection:"column"}}><span className="sn">Free</span><span className="sl">To start</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="cta-sec">
          <div className="cta-inner">
            <span className="cta-tag">✦ Join 50,000+ People</span>
            <h2>Stop guessing.<br/><em>Start knowing.</em></h2>
            <p>Thousands of students and professionals have already used PathGrad to find clarity, direction, and confidence in their careers.</p>
            <div className="cta-btns">
              <Link to="/tests" className="btn-cta-white"><Award size={15}/> Explore All Tests</Link>
              <Link to="/contact" className="btn-cta-outline">Contact Sales <ArrowUpRight size={14}/></Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};