import { Link } from "react-router-dom";
import {
  Brain, Users, TrendingUp, Shield, Sparkles, Clock,
  Award, BarChart3, Target, Lightbulb, CheckCircle,
  ArrowRight, Star, ArrowUpRight, BookOpen,
  FileText, GraduationCap, Briefcase, School,
  Headphones, UserCheck, Activity, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTestStore } from "@/store/testStore";
import { useEffect } from "react";
import { landingStyles } from "./LandingStyles";
import {
  AIAssessmentMockup,
  AIAnalysisMockup,
  DepartmentsMockup,
  InstantResultsMockup,
  CareerPathsMockup,
  SmartReportsMockup,
  AdvancedAnalyticsMockup,
  EnterpriseSecurityMockup,
  HowStep1Visual,
  HowStep2Visual,
  HowStep3Visual,
  enterpriseFeatures,
} from "./LandingVisualizations";

export const Landing = () => {
  const navigate = useNavigate();
  const { getPublicPublishedTests, publicPublishedTests } = useTestStore();
  useEffect(() => { getPublicPublishedTests(); }, [getPublicPublishedTests]);

  return (
    <>
      <style>{landingStyles}</style>
      <div className="lp">

        {/* ═══════════ NAVBAR ═══════════ */}
        <nav className="lp-nav">
          <div className="nav-logo">
            Cognify<span>IQ</span>
          </div>
          <div className="nav-links">
            <Link to="/assessments">Assessments</Link>
            <Link to="/counselors">Counselors</Link>
            <Link to="/about">About</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
          <div className="nav-actions">
            {/* <Link to="/login" className="btn-nav-ghost">Sign in</Link> */}
            <Link to="/login" className="btn-nav-primary">Get started</Link>
          </div>
        </nav>

        {/* ═══════════ HERO ═══════════ */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              AI-Powered Psychometric Platform
            </div>
            <h1 className="hero-h1">
              The AI assessment<br />
              platform built for <span>everyone</span>
            </h1>
            <p className="hero-sub">
              Comprehensive psychometric testing that reveals cognitive strengths,
              personality traits, and career pathways — powered by advanced AI and
              scientifically validated theories.
            </p>
            <div className="hero-ctas">
              <Link to="/login" className="btn-primary">
                Get started <ArrowRight size={16} />
              </Link>
              <Link to="/counselors" className="btn-secondary">
                Talk to a counselor
              </Link>
            </div>
          </div>

          {/* Product Preview — like gumloop's hero visual */}
          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-topbar">
                <div className="preview-dot preview-dot-r" />
                <div className="preview-dot preview-dot-y" />
                <div className="preview-dot preview-dot-g" />
                <span style={{ marginLeft: 12, fontSize: "0.75rem", color: "#a0a0ab", fontWeight: 500 }}>
                  PathGrad — Assessment Dashboard
                </span>
              </div>
              <div className="preview-body">
                <div className="preview-sidebar">
                  <div className="sidebar-item active">
                    <BarChart3 size={16} /> Dashboard
                  </div>
                  <div className="sidebar-item">
                    <FileText size={16} /> Assessments
                  </div>
                  <div className="sidebar-item">
                    <Users size={16} /> Students
                  </div>
                  <div className="sidebar-item">
                    <Target size={16} /> Career Paths
                  </div>
                  <div className="sidebar-item">
                    <Activity size={16} /> Analytics
                  </div>
                </div>
                <div className="preview-main">
                  <div className="preview-card-row">
                    <div className="preview-stat-card">
                      <div className="psc-label">Assessments</div>
                      <div className="psc-value">2,847</div>
                      <div className="psc-change psc-up">
                        <TrendingUp size={12} /> +18.2%
                      </div>
                    </div>
                    <div className="preview-stat-card">
                      <div className="psc-label">Accuracy</div>
                      <div className="psc-value">95.3%</div>
                      <div className="psc-change psc-up">
                        <TrendingUp size={12} /> +2.1%
                      </div>
                    </div>
                    <div className="preview-stat-card">
                      <div className="psc-label">Avg. Time</div>
                      <div className="psc-value">24m</div>
                      <div className="psc-change psc-neutral">
                        <Clock size={12} /> Steady
                      </div>
                    </div>
                  </div>
                  <div className="preview-chart">
                    <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#a0a0ab", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Assessment Results — Last 7 Days
                    </div>
                    <div className="chart-bars">
                      {[45, 62, 78, 55, 88, 72, 95].map((h, i) => (
                        <div
                          key={i}
                          className="chart-bar"
                          style={{
                            height: `${h}%`,
                            background: `linear-gradient(to top, #6366f1, #818cf8)`,
                            opacity: 0.3 + (h / 130),
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ LOGOS ═══════════ */}
        <section className="logos-section">
          <div className="logos-label">Empowering various educational sectors</div>
          <div className="logos-row">
            {["Schools", "Universities", "Coaching Institutes", "Junior Colleges", "Career Centers", "Educational NGOs"].map((name) => (
              <div key={name} className="logo-item">
                <Award size={18} />
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ FEATURES — BENTO GRID ═══════════ */}
        <section className="features-section">
          <div className="features-container">
            <div className="features-header">
              <div className="section-eyebrow">Everything you need</div>
              <h2 className="section-title">
                Everything you need to assess<br />any individual
              </h2>
              <p className="section-subtitle">
                Powered by Holland's Theory, Big Five, Bloom's Taxonomy and Ability theories — our platform
                covers every dimension of psychometric evaluation.
              </p>
            </div>

            <div className="bento-grid">
              {/* Card 1 — Large: AI-Powered Assessment */}
              <div className="bento-card bento-lg">
                <div className="bento-card-header">
                  <div className="bento-card-title">AI-Powered Adaptive Assessment</div>
                  <div className="bento-card-desc">
                    Questions adapt in real-time to the student's ability level using Item Response Theory
                  </div>
                </div>
                <div className="bento-visual">
                  <AIAssessmentMockup />
                </div>
              </div>

              {/* Card 2 — Regular: Personality Analysis */}
              <div className="bento-card">
                <div className="bento-card-header">
                  <div className="bento-card-title">AI-Enhanced Analysis</div>
                  <div className="bento-card-desc">
                    Deep personality profiling using Big Five framework
                  </div>
                </div>
                <div className="bento-visual">
                  <AIAnalysisMockup />
                </div>
              </div>

              {/* Card 3 — Regular: Built For All */}
              <div className="bento-card">
                <div className="bento-card-header">
                  <div className="bento-card-title">Built For Everyone</div>
                  <div className="bento-card-desc">
                    Assessments for every stakeholder in education
                  </div>
                </div>
                <div className="bento-visual">
                  <DepartmentsMockup />
                </div>
              </div>

              {/* Card 4 — Regular: Instant Processing */}
              <div className="bento-card">
                <div className="bento-card-header">
                  <div className="bento-card-title">Real-time Processing</div>
                  <div className="bento-card-desc">
                    Watch as AI processes and scores assessments live
                  </div>
                </div>
                <div className="bento-visual">
                  <InstantResultsMockup />
                </div>
              </div>

              {/* Card 6 — Regular: Analytics */}
              <div className="bento-card">
                <div className="bento-card-header">
                  <div className="bento-card-title">Advanced Analytics</div>
                  <div className="bento-card-desc">
                    Comprehensive dashboards for schools to track cohorts and growth
                  </div>
                </div>
                <div className="bento-visual">
                  <AdvancedAnalyticsMockup />
                </div>
              </div>

              {/* Card 5 — Large: Career Guidance */}
              <div className="bento-card bento-lg">
                <div className="bento-card-header">
                  <div className="bento-card-title">Smart Career Pathways</div>
                  <div className="bento-card-desc">
                    AI matches cognitive and personality profiles to ideal career paths with confidence scores
                  </div>
                </div>
                <div className="bento-visual" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <CareerPathsMockup />
                  <SmartReportsMockup />
                </div>
              </div>

              {/* Card 7 — Regular: Security */}
              <div className="bento-card">
                <div className="bento-card-header">
                  <div className="bento-card-title">Enterprise Security</div>
                  <div className="bento-card-desc">
                    GDPR & FERPA compliant data protection for schools
                  </div>
                </div>
                <div className="bento-visual">
                  <EnterpriseSecurityMockup />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section className="how-section">
          <div className="how-container">
            <div className="how-header">
              <div className="section-eyebrow">How PathGrad works</div>
              <h2 className="section-title">Get started in three simple steps</h2>
              <p className="section-subtitle">
                From choosing a framework to receiving your career report —
                everything is automated and AI-powered.
              </p>
            </div>

            <div className="how-steps">
              <div className="how-step">
                <div className="how-step-num">1</div>
                <div className="how-step-title">Choose a Framework</div>
                <div className="how-step-desc">
                  Select from our library of psychometric theories — Holland's for career interests,
                  Big Five for personality, Ability Theory for cognitive, or Bloom's for knowledge.
                </div>
                <HowStep1Visual />
              </div>

              <div className="how-step">
                <div className="how-step-num">2</div>
                <div className="how-step-title">Take the Assessment</div>
                <div className="how-step-desc">
                  AI generates adaptive questions calibrated to your grade level.
                  Questions get harder or easier based on your responses.
                </div>
                <HowStep2Visual />
              </div>

              <div className="how-step">
                <div className="how-step-num">3</div>
                <div className="how-step-title">Get Your Insights</div>
                <div className="how-step-desc">
                  Receive a comprehensive report with cognitive scores, personality
                  traits, career recommendations, and growth plans.
                </div>
                <HowStep3Visual />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ STATS BAR ═══════════ */}
        <section className="stats-section">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-num">300+</div>
              <div className="stat-label">Assessments completed</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-num">2</div>
              <div className="stat-label">Pilot Institutions Active</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-num">10+</div>
              <div className="stat-label">Counsellors Onboard</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-num">99.9%</div>
              <div className="stat-label">Cloud Uptime Guaranteed</div>
            </div>
          </div>
        </section>

        {/* ═══════════ SOCIAL PROOF ═══════════ */}
        <section className="proof-section">
          <div className="proof-container">
            <div className="proof-header">
              <div className="section-eyebrow">Trusted by educators</div>
              <h2 className="section-title">See what our users are saying</h2>
            </div>
            <div className="proof-grid">
              {[
                {
                  text: "PathGrad completely transformed how we approach career counseling. The AI-generated insights are incredibly accurate and save us hours of manual assessment.",
                  name: "Dr. Priya Sharma",
                  role: "Head Counselor, DPS International",
                  color: "#6366f1",
                },
                {
                  text: "The adaptive testing is remarkable — it accurately pinpointed my cognitive strengths and recommended career paths I'd never considered but turned out to be perfect.",
                  name: "Rahul Mehta",
                  role: "12th Grade Student",
                  color: "#22c55e",
                },
                {
                  text: "We deployed PathGrad across 15 schools in our network. The standardized reporting and grade-specific assessments are exactly what we needed.",
                  name: "Anita Desai",
                  role: "Director of Education, Ashoka Schools",
                  color: "#f59e0b",
                },
              ].map((t, i) => (
                <div key={i} className="proof-card">
                  <div className="proof-stars">
                    {Array(5).fill(0).map((_, j) => (
                      <Star key={j} size={16} className="proof-star" fill="#f59e0b" />
                    ))}
                  </div>
                  <p className="proof-text">"{t.text}"</p>
                  <div className="proof-author">
                    <div className="proof-avatar" style={{ background: t.color }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="proof-name">{t.name}</div>
                      <div className="proof-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ USE CASES ═══════════ */}
        <section className="usecases-section">
          <div className="usecases-container">
            <div className="usecases-header">
              <div className="section-eyebrow">Built for all departments</div>
              <h2 className="section-title">
                Consolidate your assessment tools,<br />empower your team
              </h2>
              <p className="section-subtitle">
                Whether you're a student, school administrator, HR professional,
                or career counselor — PathGrad has the right assessment for you.
              </p>
            </div>
            <div className="usecases-grid">
              {[
                {
                  icon: GraduationCap, title: "Students",
                  desc: "Discover cognitive strengths, personality traits, and ideal career paths through scientifically validated tests.",
                  bg: "#eef2ff", color: "#6366f1",
                },
                {
                  icon: Headphones, title: "Counselors",
                  desc: "Access comprehensive student reports, track progress across sessions, and provide data-driven career guidance.",
                  bg: "#fef3c7", color: "#f59e0b",
                },
                {
                  icon: School, title: "Schools",
                  desc: "Deploy standardized assessments across grades, compare cohort performance, and generate institution-level insights.",
                  bg: "#f0fdf4", color: "#22c55e",
                },
                {
                  icon: Briefcase, title: "HR Teams",
                  desc: "Evaluate candidates' cognitive abilities and cultural fit with role-specific psychometric assessments.",
                  bg: "#fce7f3", color: "#ec4899",
                },
              ].map((uc, i) => (
                <div key={i} className="usecase-card">
                  <div className="usecase-icon" style={{ background: uc.bg }}>
                    <uc.icon size={28} color={uc.color} />
                  </div>
                  <div className="usecase-title">{uc.title}</div>
                  <div className="usecase-desc">{uc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ ENTERPRISE ═══════════ */}
        <section className="enterprise-section">
          <div className="enterprise-container">
            <div className="enterprise-header">
              <div className="section-eyebrow">Enterprise ready</div>
              <h2 className="section-title">Built for institutions at scale</h2>
              <p className="section-subtitle">
                Security, compliance, and control — everything schools and organizations need.
              </p>
            </div>
            <div className="enterprise-grid">
              {enterpriseFeatures.map((feat, i) => (
                <div key={i} className="ent-card">
                  <div className="ent-icon">
                    <feat.icon size={20} color="#818cf8" />
                  </div>
                  <div className="ent-title">{feat.title}</div>
                  <div className="ent-desc">{feat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">
              Everyone's talking about AI.<br />
              Give your team the tool to <span>use it.</span>
            </h2>
            <p className="cta-desc">
              Join thousands of institutions using PathGrad to transform
              their assessment and career guidance programs.
            </p>
            <div className="cta-btns">
              <Link to="/login" className="btn-primary">
                Get started for free <ArrowRight size={16} />
              </Link>
              <Link to="/counselors" className="btn-secondary">
                Contact sales <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="lp-footer">
          <div className="footer-inner">
            <div className="footer-logo">
              Cognify<span>IQ</span>
            </div>
            <div className="footer-links">
              <Link to="/assessments">Assessments</Link>
              <Link to="/counselors">Counselors</Link>
              <Link to="/about">About</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
            <div className="footer-copy">© 2026  Cognify<span>IQ</span>. All rights reserved.</div>
          </div>
        </footer>

      </div>
    </>
  );
};