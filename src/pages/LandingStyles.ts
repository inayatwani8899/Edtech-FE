export const landingStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --bg: #fafafa;
  --white: #ffffff;
  --black: #0a0a0a;
  --gray-50: #f8f8f8;
  --gray-100: #f0f0f0;
  --gray-200: #e4e4e7;
  --gray-300: #d1d1d6;
  --gray-400: #a0a0ab;
  --gray-500: #71717a;
  --gray-600: #52525b;
  --gray-700: #3f3f46;
  --gray-800: #27272a;
  --gray-900: #18181b;
  --primary: #6366f1;
  --primary-light: #818cf8;
  --primary-dark: #4f46e5;
  --primary-bg: #eef2ff;
  --accent: #f43f5e;
  --accent-light: #fb7185;
  --green: #22c55e;
  --green-bg: #f0fdf4;
  --blue: #3b82f6;
  --blue-bg: #eff6ff;
  --amber: #f59e0b;
  --amber-bg: #fffbeb;
  --radius: 16px;
  --radius-sm: 10px;
  --radius-lg: 24px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.lp {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg);
  color: var(--black);
  overflow-x: hidden;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }

/* ═══════════════════════════════════════
   NAVBAR — Sticky, glassmorphic
═══════════════════════════════════════ */
.lp-nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 14px 32px;
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(250,250,250,0.85);
  backdrop-filter: blur(16px) saturate(1.5);
  border-bottom: 1px solid var(--gray-200);
}

.nav-logo {
  font-size: 1.25rem; font-weight: 800; letter-spacing: -0.04em;
  color: var(--black);
  display: flex; align-items: center; gap: 8px;
}
.nav-logo span { color: var(--primary); }

.nav-links {
  display: flex; align-items: center; gap: 28px;
}
.nav-links a {
  font-size: 0.875rem; font-weight: 500; color: var(--gray-600);
  transition: color 0.15s;
}
.nav-links a:hover { color: var(--black); }

.nav-actions {
  display: flex; align-items: center; gap: 12px;
}
.btn-nav-ghost {
  padding: 8px 16px; border-radius: 8px; font-size: 0.875rem;
  font-weight: 500; color: var(--gray-700); background: transparent;
  border: none; cursor: pointer; transition: background 0.15s;
}
.btn-nav-ghost:hover { background: var(--gray-100); }
.btn-nav-primary {
  padding: 8px 20px; border-radius: 8px; font-size: 0.875rem;
  font-weight: 600; color: white; background: var(--primary);
  border: none; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(99,102,241,0.3);
}
.btn-nav-primary:hover { background: var(--primary-dark); transform: translateY(-1px); }

/* ═══════════════════════════════════════
   HERO — Centered, bold, clean
═══════════════════════════════════════ */
.hero-section {
  padding: 160px 32px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}

/* Subtle dot grid like gumloop */
.hero-section::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, var(--gray-300) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.4;
  pointer-events: none;
}

.hero-content {
  position: relative; z-index: 2;
  max-width: 820px; margin: 0 auto;
}

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 16px 6px 6px;
  border-radius: 99px;
  background: var(--primary-bg);
  border: 1px solid rgba(99,102,241,0.15);
  font-size: 0.8rem; font-weight: 600; color: var(--primary);
  margin-bottom: 32px;
  animation: fadeUp 0.6s ease-out;
}
.hero-badge-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--primary);
  animation: badgePulse 2s ease-in-out infinite;
}
@keyframes badgePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.hero-h1 {
  font-size: clamp(2.8rem, 5.5vw, 4.2rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: var(--black);
  margin-bottom: 24px;
  animation: fadeUp 0.6s ease-out 0.1s backwards;
}
.hero-h1 span {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 1.15rem; font-weight: 400; color: var(--gray-500);
  line-height: 1.7; max-width: 580px; margin: 0 auto 40px;
  animation: fadeUp 0.6s ease-out 0.2s backwards;
}

.hero-ctas {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  animation: fadeUp 0.6s ease-out 0.3s backwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 10px;
  background: var(--primary); color: white;
  font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.95rem;
  border: none; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(99,102,241,0.35);
}
.btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 24px; border-radius: 10px;
  background: var(--white); color: var(--gray-700);
  font-family: 'Inter', sans-serif; font-weight: 500; font-size: 0.95rem;
  border: 1px solid var(--gray-200); cursor: pointer; transition: all 0.2s;
}
.btn-secondary:hover { border-color: var(--gray-400); background: var(--gray-50); }

/* ═══════════════════════════════════════
   HERO PRODUCT PREVIEW — Floating UI mockup
═══════════════════════════════════════ */
.hero-preview {
  margin-top: 64px;
  position: relative;
  max-width: 960px;
  margin-left: auto; margin-right: auto;
  animation: fadeUp 0.8s ease-out 0.4s backwards;
}

.preview-window {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow:
    0 4px 6px rgba(0,0,0,0.02),
    0 24px 60px rgba(0,0,0,0.06),
    0 0 0 1px rgba(0,0,0,0.03);
}

.preview-topbar {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 20px;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}
.preview-dot {
  width: 12px; height: 12px; border-radius: 50%;
}
.preview-dot-r { background: #ff5f56; }
.preview-dot-y { background: #ffbd2e; }
.preview-dot-g { background: #27c93f; }

.preview-body {
  padding: 32px;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  min-height: 340px;
}

.preview-sidebar {
  display: flex; flex-direction: column; gap: 6px;
}
.sidebar-item {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem; font-weight: 500;
  color: var(--gray-500);
  display: flex; align-items: center; gap: 10px;
  transition: all 0.15s;
}
.sidebar-item.active {
  background: var(--primary-bg);
  color: var(--primary);
  font-weight: 600;
}

.preview-main {
  display: flex; flex-direction: column; gap: 20px;
}

.preview-card-row {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
}

.preview-stat-card {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  padding: 18px;
}
.psc-label {
  font-size: 0.7rem; font-weight: 500; color: var(--gray-400);
  text-transform: uppercase; letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.psc-value {
  font-size: 1.6rem; font-weight: 800; color: var(--black);
  letter-spacing: -0.03em;
}
.psc-change {
  font-size: 0.72rem; font-weight: 600; margin-top: 4px;
  display: flex; align-items: center; gap: 4px;
}
.psc-up { color: var(--green); }
.psc-neutral { color: var(--gray-400); }

.preview-chart {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  padding: 20px;
  flex: 1;
}
.chart-bars {
  display: flex; align-items: flex-end; gap: 8px;
  height: 120px; padding-top: 8px;
}
.chart-bar {
  flex: 1; border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
}
.chart-bar:hover { opacity: 0.8; }

/* ═══════════════════════════════════════
   LOGOS BAR — Social proof
═══════════════════════════════════════ */
.logos-section {
  padding: 48px 32px;
  border-top: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
  text-align: center;
}
.logos-label {
  font-size: 0.78rem; font-weight: 600; color: var(--gray-400);
  text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 28px;
}
.logos-row {
  display: flex; align-items: center; justify-content: center;
  gap: 48px; flex-wrap: wrap;
  max-width: 900px; margin: 0 auto;
}
.logo-item {
  font-size: 1.1rem; font-weight: 800; color: var(--gray-300);
  letter-spacing: -0.02em;
  transition: color 0.2s;
  display: flex; align-items: center; gap: 8px;
}
.logo-item:hover { color: var(--gray-500); }

/* ═══════════════════════════════════════
   FEATURE BENTO — Gumloop bento grid
═══════════════════════════════════════ */
.features-section {
  padding: 100px 32px;
  background: var(--bg);
}
.features-container {
  max-width: 1140px; margin: 0 auto;
}
.features-header {
  text-align: center; margin-bottom: 64px;
}
.section-eyebrow {
  font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--primary);
  margin-bottom: 16px;
}
.section-title {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 800; letter-spacing: -0.03em; line-height: 1.1;
  color: var(--black); margin-bottom: 16px;
}
.section-subtitle {
  font-size: 1.05rem; color: var(--gray-500); max-width: 520px;
  margin: 0 auto; line-height: 1.6; font-weight: 400;
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 16px;
}

.bento-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 32px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}
.bento-card:hover {
  border-color: var(--gray-300);
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  transform: translateY(-2px);
}

/* Big card spans 2 cols */
.bento-card.bento-lg {
  grid-column: span 2;
}

.bento-card-header {
  margin-bottom: 20px;
}
.bento-card-title {
  font-size: 1.15rem; font-weight: 700; color: var(--black);
  margin-bottom: 6px; letter-spacing: -0.01em;
}
.bento-card-desc {
  font-size: 0.88rem; color: var(--gray-500); line-height: 1.5;
}

/* Visual content area inside bento cards */
.bento-visual {
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
  border-radius: var(--radius);
  padding: 20px;
  min-height: 180px;
  position: relative;
  overflow: hidden;
}

/* ─── Visual mockup for AI Assessment card ─── */
.ai-assess-mock {
  display: flex; flex-direction: column; gap: 14px;
}
.mock-question {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  padding: 16px;
}
.mock-q-label {
  font-size: 0.7rem; font-weight: 600; color: var(--primary);
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 8px;
}
.mock-q-text {
  font-size: 0.85rem; color: var(--black); font-weight: 500;
  line-height: 1.5; margin-bottom: 12px;
}
.mock-options {
  display: flex; flex-direction: column; gap: 6px;
}
.mock-option {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--gray-200);
  font-size: 0.78rem; color: var(--gray-600);
  display: flex; align-items: center; gap: 8px;
  transition: all 0.15s;
}
.mock-option.selected {
  background: var(--primary-bg);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 600;
}
.mock-option-dot {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid var(--gray-300);
  flex-shrink: 0;
}
.mock-option.selected .mock-option-dot {
  border-color: var(--primary);
  background: var(--primary);
  box-shadow: inset 0 0 0 3px white;
}

/* ─── Visual mockup for AI Analysis card ─── */
.ai-analysis-mock {
  display: flex; gap: 16px; align-items: flex-start;
}
.ai-radar {
  width: 140px; height: 140px; flex-shrink: 0;
  position: relative;
}
.radar-ring {
  position: absolute; border-radius: 50%;
  border: 1px solid var(--gray-200);
}
.radar-ring-1 { inset: 0; }
.radar-ring-2 { inset: 20px; }
.radar-ring-3 { inset: 40px; }
.radar-dot {
  position: absolute; width: 10px; height: 10px;
  border-radius: 50%; background: var(--primary);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
}
.ai-traits {
  display: flex; flex-direction: column; gap: 8px; flex: 1;
}
.trait-bar-item {
  display: flex; align-items: center; gap: 10px;
}
.trait-label {
  font-size: 0.72rem; font-weight: 600; color: var(--gray-500);
  width: 80px; flex-shrink: 0;
}
.trait-bar {
  flex: 1; height: 8px; background: var(--gray-100);
  border-radius: 4px; overflow: hidden;
}
.trait-fill {
  height: 100%; border-radius: 4px;
  transition: width 0.8s ease;
}

/* ─── All departments mockup ─── */
.dept-mock {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
}
.dept-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 0.78rem; font-weight: 500; color: var(--gray-600);
  transition: all 0.15s;
}
.dept-pill:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.dept-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* ─── Instant results mockup ─── */
.results-mock {
  display: flex; flex-direction: column; gap: 10px;
}
.result-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
}
.result-status {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.result-status.done { background: var(--green); }
.result-status.progress { background: var(--amber); }
.result-status.pending { background: var(--gray-300); }
.result-text {
  font-size: 0.78rem; font-weight: 500; color: var(--gray-600); flex: 1;
}
.result-time {
  font-size: 0.7rem; color: var(--gray-400);
}
.result-bar {
  height: 4px; background: var(--gray-100); border-radius: 2px;
  overflow: hidden; flex: 1; max-width: 80px;
}
.result-bar-fill {
  height: 100%; border-radius: 2px; background: var(--green);
}

/* ─── Career paths mockup ─── */
.career-mock {
  display: flex; flex-direction: column; gap: 10px;
}
.career-path-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  transition: all 0.15s;
}
.career-path-item:hover { border-color: var(--primary); }
.career-match {
  font-size: 0.7rem; font-weight: 700;
  padding: 3px 8px; border-radius: 4px;
  flex-shrink: 0;
}
.career-match.high { background: var(--green-bg); color: var(--green); }
.career-match.med { background: var(--blue-bg); color: var(--blue); }
.career-title {
  font-size: 0.82rem; font-weight: 600; color: var(--black); flex: 1;
}
.career-arrow {
  color: var(--gray-300);
}

/* ─── Smart reports mockup ─── */
.report-mock {
  display: flex; flex-direction: column; gap: 12px;
}
.report-section-mock {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}
.report-sec-title {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.05em; color: var(--gray-400); margin-bottom: 10px;
}
.report-bars {
  display: flex; gap: 6px; align-items: flex-end; height: 48px;
}
.report-bar {
  flex: 1; border-radius: 3px;
}
.report-score-row {
  display: flex; gap: 12px;
}
.report-score-item {
  flex: 1; text-align: center;
}
.report-score-val {
  font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em;
}
.report-score-lbl {
  font-size: 0.65rem; color: var(--gray-400); margin-top: 2px;
}

/* ═══════════════════════════════════════
   HOW IT WORKS — 3 step process
═══════════════════════════════════════ */
.how-section {
  padding: 100px 32px;
  background: var(--white);
  border-top: 1px solid var(--gray-200);
}
.how-container {
  max-width: 1140px; margin: 0 auto;
}
.how-header {
  text-align: center; margin-bottom: 72px;
}
.how-steps {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
  position: relative;
}
/* Connecting line */
.how-steps::before {
  content: '';
  position: absolute;
  top: 28px; left: 16.67%; right: 16.67%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  z-index: 0;
}
.how-step {
  display: flex;
  flex-direction: column;
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 0 24px;
}
.how-step-num {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--white);
  border: 3px solid var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 800; color: var(--primary);
  margin: 0 auto 24px;
  box-shadow: 0 4px 12px rgba(99,102,241,0.15);
  flex-shrink: 0;
}
.how-step-title {
  font-size: 1.05rem; font-weight: 700; color: var(--black);
  margin-bottom: 10px;
}
.how-step-desc {
  font-size: 0.88rem; color: var(--gray-500); line-height: 1.6;
}

/* Step visual cards */
.how-step-visual {
  margin-top: auto;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 20px;
  text-align: left;
}
.how-integration-row {
  display: flex; flex-direction: column; gap: 8px;
}
.how-integration {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 0.78rem; font-weight: 500; color: var(--gray-700);
}
.how-int-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-size: 0.75rem; font-weight: 800;
}
.how-int-fields {
  display: flex; gap: 6px; margin-left: auto;
}
.how-int-field {
  padding: 3px 8px; border-radius: 4px;
  background: var(--gray-100); font-size: 0.65rem;
  color: var(--gray-400);
}

/* ═══════════════════════════════════════
   SOCIAL PROOF — Testimonials
═══════════════════════════════════════ */
.proof-section {
  padding: 80px 32px;
  background: var(--bg);
  border-top: 1px solid var(--gray-200);
}
.proof-container {
  max-width: 1140px; margin: 0 auto;
}
.proof-header {
  text-align: center; margin-bottom: 56px;
}
.proof-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
}
.proof-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 28px;
  transition: all 0.25s;
}
.proof-card:hover {
  border-color: var(--gray-300);
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
}
.proof-stars {
  display: flex; gap: 3px; margin-bottom: 16px;
}
.proof-star { color: var(--amber); }
.proof-text {
  font-size: 0.92rem; color: var(--gray-600); line-height: 1.7;
  margin-bottom: 20px; font-style: italic;
}
.proof-author {
  display: flex; align-items: center; gap: 12px;
}
.proof-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; font-weight: 700; color: white;
}
.proof-name { font-size: 0.85rem; font-weight: 600; color: var(--black); }
.proof-role { font-size: 0.75rem; color: var(--gray-400); }

/* ═══════════════════════════════════════
   USE CASES — Who it's for
═══════════════════════════════════════ */
.usecases-section {
  padding: 100px 32px;
  background: var(--white);
  border-top: 1px solid var(--gray-200);
}
.usecases-container {
  max-width: 1140px; margin: 0 auto;
}
.usecases-header {
  text-align: center; margin-bottom: 64px;
}
.usecases-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
}
.usecase-card {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 28px 24px;
  text-align: center;
  transition: all 0.25s;
  position: relative; overflow: hidden;
}
.usecase-card:hover {
  background: var(--white);
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(99,102,241,0.08);
}
.usecase-icon {
  width: 56px; height: 56px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px;
  transition: transform 0.3s;
}
.usecase-card:hover .usecase-icon { transform: scale(1.08); }
.usecase-title {
  font-size: 1rem; font-weight: 700; color: var(--black);
  margin-bottom: 8px;
}
.usecase-desc {
  font-size: 0.82rem; color: var(--gray-500); line-height: 1.55;
}

/* ═══════════════════════════════════════
   ENTERPRISE — Feature grid
═══════════════════════════════════════ */
.enterprise-section {
  padding: 100px 32px;
  background: var(--gray-900);
  color: white;
}
.enterprise-container {
  max-width: 1140px; margin: 0 auto;
}
.enterprise-header {
  text-align: center; margin-bottom: 64px;
}
.enterprise-header .section-eyebrow { color: var(--primary-light); }
.enterprise-header .section-title { color: white; }
.enterprise-header .section-subtitle { color: rgba(255,255,255,0.5); }

.enterprise-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}
.ent-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius);
  padding: 28px;
  transition: all 0.25s;
}
.ent-card:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.15);
}
.ent-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(99,102,241,0.15);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.ent-title {
  font-size: 1rem; font-weight: 700; color: white;
  margin-bottom: 8px;
}
.ent-desc {
  font-size: 0.82rem; color: rgba(255,255,255,0.5); line-height: 1.55;
}

/* ═══════════════════════════════════════
   STATS BAR — Impact numbers
═══════════════════════════════════════ */
.stats-section {
  padding: 64px 32px;
  background: var(--primary-bg);
  border-top: 1px solid rgba(99,102,241,0.1);
  border-bottom: 1px solid rgba(99,102,241,0.1);
}
.stats-container {
  max-width: 900px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
}
.stat-item { text-align: center; flex: 1; }
.stat-num {
  font-size: 2.4rem; font-weight: 900; color: var(--primary-dark);
  letter-spacing: -0.03em;
}
.stat-label {
  font-size: 0.82rem; color: var(--gray-500); margin-top: 4px;
  font-weight: 500;
}
.stat-divider {
  width: 1px; height: 56px;
  background: rgba(99,102,241,0.15);
}

/* ═══════════════════════════════════════
   FINAL CTA
═══════════════════════════════════════ */
.cta-section {
  padding: 100px 32px;
  background: var(--bg);
  text-align: center;
  position: relative;
}
.cta-section::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, var(--gray-300) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.3;
  pointer-events: none;
}
.cta-content {
  position: relative; z-index: 2;
  max-width: 640px; margin: 0 auto;
}
.cta-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800; letter-spacing: -0.03em; line-height: 1.1;
  color: var(--black); margin-bottom: 16px;
}
.cta-title span {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.cta-desc {
  font-size: 1.05rem; color: var(--gray-500); line-height: 1.6;
  margin-bottom: 36px;
}
.cta-btns {
  display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;
}

/* ═══════════════════════════════════════
   FOOTER
═══════════════════════════════════════ */
.lp-footer {
  padding: 48px 32px 32px;
  background: var(--white);
  border-top: 1px solid var(--gray-200);
}
.footer-inner {
  max-width: 1140px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
}
.footer-logo {
  font-size: 1.1rem; font-weight: 800; color: var(--black);
  letter-spacing: -0.03em;
}
.footer-logo span { color: var(--primary); }
.footer-links {
  display: flex; gap: 24px;
}
.footer-links a {
  font-size: 0.82rem; color: var(--gray-400); font-weight: 500;
  transition: color 0.15s;
}
.footer-links a:hover { color: var(--black); }
.footer-copy {
  font-size: 0.78rem; color: var(--gray-400);
}

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 960px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-card.bento-lg { grid-column: span 1; }
  .how-steps { grid-template-columns: 1fr; gap: 48px; }
  .how-steps::before { display: none; }
  .proof-grid { grid-template-columns: 1fr; }
  .usecases-grid { grid-template-columns: repeat(2, 1fr); }
  .enterprise-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-container { flex-direction: column; gap: 32px; }
  .stat-divider { width: 60px; height: 1px; }
  .preview-body { grid-template-columns: 1fr; }
  .preview-sidebar { flex-direction: row; flex-wrap: wrap; }
  .preview-card-row { grid-template-columns: repeat(2, 1fr); }
  .nav-links { display: none; }
  .footer-inner { flex-direction: column; gap: 20px; text-align: center; }
  .footer-links { justify-content: center; }
}

@media (max-width: 600px) {
  .hero-h1 { font-size: 2.4rem; }
  .preview-card-row { grid-template-columns: 1fr; }
  .usecases-grid { grid-template-columns: 1fr; }
  .enterprise-grid { grid-template-columns: 1fr; }
  .hero-ctas { flex-direction: column; }
  .ai-analysis-mock { flex-direction: column; }
  .ai-radar { margin: 0 auto; }
  .dept-mock { grid-template-columns: 1fr; }
  .report-score-row { flex-direction: column; gap: 8px; }
}
`;
