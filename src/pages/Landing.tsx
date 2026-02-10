import { Link } from "react-router-dom";
import {
  Brain, Users, TrendingUp, Shield, Sparkles, Clock,
  Award, BarChart3, Target, Lightbulb, CheckCircle,
  ArrowRight, Star, Zap, ArrowUpRight, Play, BookOpen,
  GitBranch, CheckCircle2, FileText, Layers, Network,
  ActivitySquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { useTestStore } from "@/store/testStore";
import { useEffect } from "react";
import { landingStyles } from "./LandingStyles";
import {
  PsychometricVisualization,
  AIWorkflowVisualization,
  GradesVisualization,
  TestProcessFlow
} from "./LandingVisualizations";

/* ── data ── */
const features = [
  { icon: Brain, title: "Advanced AI Assessment", desc: "Deep insights into cognitive abilities and personality traits using cutting-edge algorithms." },
  { icon: Users, title: "Multi-Role Platform", desc: "Built for students, professionals, educators, and HR teams with role-specific features." },
  { icon: TrendingUp, title: "Adaptive Testing", desc: "Tests adapt to your skill level for accurate, efficient assessment every time." },
  { icon: Shield, title: "Secure & Private", desc: "Bank-level security with full GDPR compliance — your data stays yours." },
  { icon: BarChart3, title: "Detailed Analytics", desc: "Comprehensive reports with actionable insights and career recommendations." },
  { icon: Clock, title: "Instant Results", desc: "AI-generated personalised feedback and reports immediately after completion." },
];

const testTypes = [
  { title: "Aptitude Tests", desc: "Verbal, numerical & logical reasoning", icon: Target, color: "rgba(212,168,67,0.15)", iconCol: "#d4a843" },
  { title: "Personality Assessment", desc: "Big Five & MBTI-style profiling", icon: Users, color: "rgba(200,98,42,0.15)", iconCol: "#c8622a" },
  { title: "Interest Inventory", desc: "Holland's Code RIASEC career mapping", icon: Lightbulb, color: "rgba(14,165,233,0.15)", iconCol: "#0ea5e9" },
  { title: "Emotional Intelligence", desc: "Self-awareness, empathy & regulation", icon: Brain, color: "rgba(52,211,153,0.15)", iconCol: "#34d399" },
];

const benefits = [
  "Scientifically validated assessments",
  "AI-powered personalised recommendations",
  "Real-time progress tracking",
  "Career guidance and counselling support",
  "Industry-specific professional assessments",
  "Comprehensive reporting dashboard",
];

const tickerItems = ["Aptitude Tests", "Personality Profiling", "EQ Assessments", "Career Mapping", "RIASEC Inventory", "Adaptive Testing", "AI Reports", "Instant Results", "Scientifically Validated", "GDPR Compliant"];

export const Landing = () => {
  const navigate = useNavigate();
  const { getPublicPublishedTests, publicPublishedTests } = useTestStore();
  useEffect(() => { getPublicPublishedTests(); }, [getPublicPublishedTests]);

  return (
    <>
      <style>{landingStyles}</style>
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
              <div className="hero-eyebrow"><Sparkles size={12} /> AI-Powered Psychometric Platform</div>
              <h1 className="hero-h1">
                Discover<br />
                who you <em>truly</em><br />
                are — and where<br />
                you belong.
              </h1>
              <p className="hero-sub">
                Comprehensive AI assessments that reveal your cognitive strengths, personality traits, and ideal career path — in under 30 minutes.
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn-hero-primary">
                  Start Free Assessment <ArrowRight size={15} />
                </Link>
                <Link to="/counselors" className="btn-hero-ghost">
                  Talk to a Counselor
                </Link>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-img-wrap">
                <img src={heroImage} alt="Assessment platform" />
                {/* floating pills */}
                <div className="hero-pill hero-pill-a">
                  <div className="hp-num">50K+</div>
                  <div className="hp-lbl">Assessments completed</div>
                </div>
                <div className="hero-pill hero-pill-b">
                  <div className="hp-icon"><Star size={16} color="#f5f0e8" /></div>
                  <div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "1rem", color: "var(--forest)", lineHeight: 1 }}>4.9/5</div>
                    <div className="hp-lbl">User rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="hero-trust">
            {["Free to start", "No credit card required", "GDPR Compliant", "Results in 30 minutes", "95% Accuracy rate"].map((t, i, a) => (
              <span key={t}>
                <span className="ht-item"><CheckCircle size={13} color="rgba(245,240,232,0.4)" />{t}</span>
                {i < a.length - 1 && <span className="ht-dot" style={{ marginLeft: 40 }} />}
              </span>
            ))}
          </div>
        </section>

        {/* ═══════════ TICKER ═══════════ */}
        <div className="ticker">
          <div className="ticker-inner">
            {[...tickerItems, ...tickerItems].map((x, i) => (
              <span key={i} className="ticker-item">✦ {x}</span>
            ))}
          </div>
        </div>

        {/* ═══════════ NEW: PSYCHOMETRIC PROCESS VISUALIZATION ═══════════ */}
        <section className="visual-section psycho-section">
          <div className="visual-inner">
            <div className="visual-header">
              <div className="vis-eyebrow"><Brain size={12} /> Understanding Psychometric Testing</div>
              <h2 className="vis-title">
                The Science Behind<br />
                <span className="gradient-text">Your Assessment Journey</span>
              </h2>
              <p className="vis-subtitle">
                Discover how our comprehensive testing framework evaluates cognitive abilities,
                personality traits, and career alignment through scientifically validated methodologies.
              </p>
            </div>
            <PsychometricVisualization />
          </div>
        </section>

        {/* ═══════════ NEW: AI WORKFLOW VISUALIZATION ═══════════ */}
        <section className="visual-section ai-workflow-section">
          <div className="visual-inner">
            <div className="visual-header">
              <div className="vis-eyebrow"><Sparkles size={12} /> Powered by Advanced AI</div>
              <h2 className="vis-title">
                How AI Creates Your<br />
                <span className="gradient-text">Personalized Assessment</span>
              </h2>
              <p className="vis-subtitle">
                Our intelligent system generates theory-based questions, adapts to your responses,
                and delivers precise evaluations tailored to your grade level and learning profile.
              </p>
            </div>
            <AIWorkflowVisualization />
          </div>
        </section>

        {/* ═══════════ NEW: GRADES & CATEGORIES VISUALIZATION ═══════════ */}
        <section className="visual-section grades-section">
          <div className="visual-inner">
            <div className="visual-header">
              <div className="vis-eyebrow"><Layers size={12} /> Comprehensive Grade Coverage</div>
              <h2 className="vis-title">
                From Elementary to<br />
                <span className="gradient-text">Professional Excellence</span>
              </h2>
              <p className="vis-subtitle">
                Age-appropriate assessments designed for every education level,
                from early learners to career professionals.
              </p>
            </div>
            <GradesVisualization />
          </div>
        </section>

        {/* ═══════════ NEW: TEST PROCESS FLOW ═══════════ */}
        <section className="visual-section process-section">
          <div className="visual-inner">
            <div className="visual-header">
              <div className="vis-eyebrow"><Network size={12} /> Complete Testing Pipeline</div>
              <h2 className="vis-title">
                Your Journey from<br />
                <span className="gradient-text">Question to Insight</span>
              </h2>
              <p className="vis-subtitle">
                See how our end-to-end system generates questions, evaluates responses,
                applies psychometric theories, and produces actionable career guidance.
              </p>
            </div>
            <TestProcessFlow />
          </div>
        </section>

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
                {[{ n: "95%", l: "Accuracy rate" }, { n: "50K+", l: "Tests completed" }, { n: "24/7", l: "AI support" }, { n: "4.9★", l: "Avg rating" }].map(s => (
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
              <h2>Take a test,<br /><em>change your path.</em></h2>
            </div>
            <Link to="/tests" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "rgba(245,240,232,0.5)", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,240,232,0.9)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.5)")}>
              View all tests <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="tests-track-wrap">
            <div className="tests-track">
              {publicPublishedTests
                ? publicPublishedTests.map(test => (
                  <div key={test.id} className="test-card">
                    <div className="tc-cat">
                      <span>{test.category}</span>
                      {test.isPublished && <span className="tc-live"><span className="live-dot" />Live</span>}
                    </div>
                    <div className="tc-title">{test.title}</div>
                    <div className="tc-desc">{test.description}</div>
                    {test?.completions > 0 && (
                      <div className="tc-completions"><Users size={11} />{test.completions.toLocaleString()} completions</div>
                    )}
                    <Link to={`/get-started?testId=${test.id}`} className="tc-btn">
                      Start Test <ArrowRight size={13} />
                    </Link>
                  </div>
                ))
                : Array.from({ length: 6 }).map((_, i) => <div key={i} className="test-skel" />)
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
                <h2>Built different.<br /><span>Built better.</span></h2>
              </div>
              <div className="features-top-right">
                <p>We didn't copy the standard HR software checklist. PathGrad was designed from the ground up around what actually helps people understand themselves — scientifically validated, beautifully simple.</p>
                <Link to="/about" className="btn-outline-ink">Learn our methodology <ArrowUpRight size={14} /></Link>
              </div>
            </div>
            <div className="feat-grid">
              {features.map((f, i) => (
                <div key={i} className="feat-item">
                  <div className="fi-num">0{i + 1}</div>
                  <div className="fi-icon"><f.icon size={18} color="var(--forest)" /></div>
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
              <h2>Four dimensions.<br /><em>One complete picture.</em></h2>
            </div>
            <div className="types-grid">
              {testTypes.map((t, i) => (
                <div key={i} className="type-card" style={{ "--ac": t.color } as React.CSSProperties}>
                  <div className="type-icon"><t.icon size={22} color={t.iconCol} /></div>
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
              <h2>A platform built<br />for <span>real outcomes.</span></h2>
              <p>Every feature exists to get you one step closer to knowing yourself, choosing the right path, and thriving in your career.</p>
              <div className="ben-list">
                {benefits.map((b, i) => (
                  <div key={i} className="ben-item">
                    <div className="ben-check"><CheckCircle size={13} color="var(--cream)" /></div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <div className="ben-btns">
                <button className="btn-forest" onClick={() => { localStorage.removeItem("testId"); localStorage.removeItem("testFlowActive"); navigate("/get-started"); }}>
                  Get Started Today <ArrowRight size={14} />
                </button>
                <Link to="/about" className="btn-outline-ink">Learn More</Link>
              </div>
            </div>

            <div className="ben-right">
              <div className="stat-big sb-1">
                {[{ n: "50K+", l: "Assessments" }, { n: "95%", l: "Accuracy" }].map((s, i, a) => (
                  <span key={s.l} style={{ display: "flex", flexDirection: "column" }}>
                    <span className="sn">{s.n}</span><span className="sl">{s.l}</span>
                    {i < a.length - 1 && <span className="sb-div" style={{ position: "absolute", left: "50%" }} />}
                  </span>
                ))}
                <div className="sb-div" />
                <span style={{ display: "flex", flexDirection: "column" }}><span className="sn">95%</span><span className="sl">Accuracy</span></span>
              </div>
              <div className="stat-big sb-2">
                <span className="sn">24/7</span><span className="sl">AI Support Available</span>
              </div>
              <div className="stat-big sb-3">
                <span className="sn" style={{ color: "var(--forest)" }}>4.9★</span>
                <span className="sl">Average User Rating</span>
              </div>
              <div className="stat-big sb-4">
                <span style={{ display: "flex", flexDirection: "column" }}><span className="sn">30m</span><span className="sl">Avg. completion</span></span>
                <div className="sb-div" />
                <span style={{ display: "flex", flexDirection: "column" }}><span className="sn">Free</span><span className="sl">To start</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="cta-sec">
          <div className="cta-inner">
            <span className="cta-tag">✦ Join 50,000+ People</span>
            <h2>Stop guessing.<br /><em>Start knowing.</em></h2>
            <p>Thousands of students and professionals have already used PathGrad to find clarity, direction, and confidence in their careers.</p>
            <div className="cta-btns">
              <Link to="/tests" className="btn-cta-white"><Award size={15} /> Explore All Tests</Link>
              <Link to="/contact" className="btn-cta-outline">Contact Sales <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};