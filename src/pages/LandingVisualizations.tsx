import React from "react";
import {
  Brain, Users, Target, BarChart3, CheckCircle2, FileText,
  Sparkles, Activity, BookOpen, TrendingUp, Zap, GitBranch,
  ArrowRight, Layers, GraduationCap, Briefcase, School, Baby,
  Shield, Lock, Cloud, Monitor, UserCheck, Headphones, Key, Cpu
} from "lucide-react";

// These components are embedded INSIDE the bento cards as visual mockups
// They simulate a real product UI — exactly like gumloop shows their product visuals

// ═══════════════════════════════════════
// AI ASSESSMENT MOCKUP — Inside bento card
// Shows a question being answered
// ═══════════════════════════════════════
export const AIAssessmentMockup = () => (
  <div className="ai-assess-mock">
    <div className="mock-question">
      <div className="mock-q-label">Question 4 of 25 • Ability Theory</div>
      <div className="mock-q-text">
        If all Zorbs are Tilps, and some Tilps are Wubs, which conclusion must be true?
      </div>
      <div className="mock-options">
        <div className="mock-option">
          <div className="mock-option-dot" />
          All Zorbs are Wubs
        </div>
        <div className="mock-option selected">
          <div className="mock-option-dot" />
          Some Zorbs may be Wubs
        </div>
        <div className="mock-option">
          <div className="mock-option-dot" />
          No Zorbs are Wubs
        </div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
      <Sparkles size={14} color="#6366f1" />
      <span style={{ fontSize: "0.72rem", color: "#6366f1", fontWeight: 600 }}>
        AI adapting difficulty based on response pattern...
      </span>
    </div>
  </div>
);

// ═══════════════════════════════════════
// AI ANALYSIS MOCKUP — Personality traits radar
// ═══════════════════════════════════════
export const AIAnalysisMockup = () => (
  <div className="ai-analysis-mock">
    <div className="ai-radar">
      <div className="radar-ring radar-ring-1" />
      <div className="radar-ring radar-ring-2" />
      <div className="radar-ring radar-ring-3" />
      <div className="radar-dot" style={{ top: "15%", left: "50%", transform: "translateX(-50%)" }} />
      <div className="radar-dot" style={{ top: "35%", right: "8%" }} />
      <div className="radar-dot" style={{ bottom: "25%", right: "15%" }} />
      <div className="radar-dot" style={{ bottom: "10%", left: "30%" }} />
      <div className="radar-dot" style={{ top: "40%", left: "5%" }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <polygon
          points="70,20 125,48 115,100 40,110 10,55"
          fill="rgba(99,102,241,0.12)"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <div className="ai-traits">
      {[
        { label: "Openness", pct: 87, color: "#6366f1" },
        { label: "Conscient.", pct: 72, color: "#3b82f6" },
        { label: "Extraversion", pct: 65, color: "#22c55e" },
        { label: "Agreeable", pct: 81, color: "#f59e0b" },
        { label: "Neuroticism", pct: 34, color: "#f43f5e" },
      ].map((t) => (
        <div key={t.label} className="trait-bar-item">
          <span className="trait-label">{t.label}</span>
          <div className="trait-bar">
            <div className="trait-fill" style={{ width: `${t.pct}%`, background: t.color }} />
          </div>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: t.color, width: 30, textAlign: "right" }}>
            {t.pct}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════
// DEPARTMENT/USER TYPES — Grid of audience pills
// ═══════════════════════════════════════
export const DepartmentsMockup = () => {
  const depts = [
    { label: "Students", icon: GraduationCap, bg: "#eef2ff", color: "#6366f1" },
    { label: "Counselors", icon: Headphones, bg: "#fef3c7", color: "#f59e0b" },
    { label: "Schools", icon: School, bg: "#f0fdf4", color: "#22c55e" },
    { label: "HR Teams", icon: Briefcase, bg: "#fce7f3", color: "#ec4899" },
    { label: "Professionals", icon: UserCheck, bg: "#eff6ff", color: "#3b82f6" },
    { label: "Parents", icon: Users, bg: "#faf5ff", color: "#a855f7" },
  ];

  return (
    <div className="dept-mock">
      {depts.map((d) => (
        <div key={d.label} className="dept-pill">
          <div className="dept-icon" style={{ background: d.bg }}>
            <d.icon size={16} color={d.color} />
          </div>
          {d.label}
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════
// INSTANT RESULTS — Processing status mockup
// ═══════════════════════════════════════
export const InstantResultsMockup = () => (
  <div className="results-mock">
    <div className="result-item">
      <div className="result-status done" />
      <span className="result-text">Cognitive Assessment</span>
      <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#22c55e" }}>✓</span>
      <span className="result-time">Completed 2:14 PM</span>
    </div>
    <div className="result-item">
      <div className="result-status done" />
      <span className="result-text">Personality Profiling</span>
      <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#22c55e" }}>✓</span>
      <span className="result-time">Completed 2:18 PM</span>
    </div>
    <div className="result-item" style={{ background: "#fffbeb", borderColor: "#fef3c7" }}>
      <div className="result-status progress" />
      <span className="result-text" style={{ color: "#92400e" }}>Career Matching</span>
      <div className="result-bar">
        <div className="result-bar-fill" style={{ width: "68%", background: "#f59e0b" }} />
      </div>
      <span className="result-time" style={{ color: "#b45309" }}>Processing...</span>
    </div>
    <div className="result-item">
      <div className="result-status pending" />
      <span className="result-text">Report Generation</span>
      <span className="result-time">Pending</span>
    </div>
  </div>
);

// ═══════════════════════════════════════
// CAREER PATHS — Recommendation mockup
// ═══════════════════════════════════════
export const CareerPathsMockup = () => (
  <div className="career-mock">
    {[
      { title: "Data Scientist", match: "96%", level: "high" },
      { title: "UX Researcher", match: "89%", level: "high" },
      { title: "Product Manager", match: "84%", level: "med" },
      { title: "Clinical Psychologist", match: "78%", level: "med" },
    ].map((c) => (
      <div key={c.title} className="career-path-item">
        <span className={`career-match ${c.level}`}>{c.match}</span>
        <span className="career-title">{c.title}</span>
        <ArrowRight size={14} className="career-arrow" />
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════
// SMART REPORTS — PDF preview mockup
// ═══════════════════════════════════════
export const SmartReportsMockup = () => (
  <div className="report-mock">
    <div className="report-section-mock">
      <div className="report-sec-title">Cognitive Profile</div>
      <div className="report-bars">
        {[65, 88, 72, 95, 58, 80, 90].map((h, i) => (
          <div
            key={i}
            className="report-bar"
            style={{
              height: `${h}%`,
              background: i % 2 === 0 ? "#6366f1" : "#c7d2fe",
            }}
          />
        ))}
      </div>
    </div>
    <div className="report-section-mock">
      <div className="report-sec-title">Key Scores</div>
      <div className="report-score-row">
        {[
          { val: "142", label: "IQ Estimate", color: "#6366f1" },
          { val: "92nd", label: "Percentile", color: "#22c55e" },
          { val: "A+", label: "Overall", color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="report-score-item">
            <div className="report-score-val" style={{ color: s.color }}>
              {s.val}
            </div>
            <div className="report-score-lbl">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════
// HOW IT WORKS — Step visuals
// ═══════════════════════════════════════
export const HowStep1Visual = () => (
  <div className="how-step-visual">
    <div className="how-integration-row">
      {[
        { label: "Holland's", bg: "#eef2ff", color: "#6366f1", fields: ["RIASEC", "Interests"] },
        { label: "Ability Theory", bg: "#f0fdf4", color: "#22c55e", fields: ["Cognitive", "Aptitude"] },
        { label: "Big Five", bg: "#fef3c7", color: "#f59e0b", fields: ["OCEAN", "Personality"] },
        { label: "Bloom's", bg: "#fce7f3", color: "#ec4899", fields: ["Knowledge", "Depth"] },
      ].map((item) => (
        <div key={item.label} className="how-integration">
          <div className="how-int-icon" style={{ background: item.bg, color: item.color }}>
            {item.label.charAt(0)}
          </div>
          {item.label}
          <div className="how-int-fields">
            {item.fields.map((f) => (
              <span key={f} className="how-int-field">{f}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const HowStep2Visual = () => (
  <div className="how-step-visual">
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[
        { label: "AI generates adaptive questions", icon: Sparkles, done: true },
        { label: "Student responds with timed answers", icon: Target, done: true },
        { label: "Real-time difficulty adjustment", icon: Zap, active: true },
      ].map((item, i) => (
        <div
          key={i}
          className="how-integration"
          style={item.active ? { background: "#eef2ff", borderColor: "#c7d2fe" } : {}}
        >
          <div
            className="how-int-icon"
            style={{
              background: item.active ? "#6366f1" : item.done ? "#f0fdf4" : "#f8f8f8",
              color: item.active ? "white" : item.done ? "#22c55e" : "#a0a0ab",
            }}
          >
            <item.icon size={14} />
          </div>
          <span style={{ fontSize: "0.78rem", fontWeight: 500, color: item.active ? "#6366f1" : "#52525b" }}>
            {item.label}
          </span>
          {item.done && (
            <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#22c55e", fontWeight: 600 }}>✓</span>
          )}
          {item.active && (
            <span style={{
              marginLeft: "auto", fontSize: "0.65rem", color: "#6366f1",
              fontWeight: 600, background: "#eef2ff", padding: "2px 8px",
              borderRadius: 4
            }}>
              Active
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const HowStep3Visual = () => (
  <div className="how-step-visual">
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", background: "white", borderRadius: 8,
        border: "1px solid #e4e4e7"
      }}>
        <FileText size={16} color="#6366f1" />
        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0a0a0a" }}>
          Comprehensive PDF Report
        </span>
        <span style={{
          marginLeft: "auto", fontSize: "0.65rem", fontWeight: 600,
          color: "#22c55e", background: "#f0fdf4", padding: "3px 8px", borderRadius: 4,
        }}>
          Ready to download
        </span>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", background: "white", borderRadius: 8,
        border: "1px solid #e4e4e7"
      }}>
        <BarChart3 size={16} color="#3b82f6" />
        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0a0a0a" }}>
          Career Pathway Recommendations
        </span>
        <span style={{
          marginLeft: "auto", fontSize: "0.65rem", fontWeight: 600,
          color: "#3b82f6", background: "#eff6ff", padding: "3px 8px", borderRadius: 4,
        }}>
          4 matches
        </span>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", background: "white", borderRadius: 8,
        border: "1px solid #e4e4e7"
      }}>
        <TrendingUp size={16} color="#f59e0b" />
        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0a0a0a" }}>
          Growth Development Plan
        </span>
        <span style={{
          marginLeft: "auto", fontSize: "0.65rem", fontWeight: 600,
          color: "#f59e0b", background: "#fffbeb", padding: "3px 8px", borderRadius: 4,
        }}>
          Personalized
        </span>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════
// ENTERPRISE FEATURE CARDS
// ═══════════════════════════════════════
export const enterpriseFeatures = [
  { icon: Lock, title: "Access Controls", desc: "Role-based permissions for students, counselors, admins and schools" },
  { icon: Activity, title: "Audit Logging", desc: "Track all test activities and data access across your organization" },
  { icon: Cloud, title: "Cloud Deployments", desc: "Secure cloud infrastructure with 99.9% uptime guarantee" },
  { icon: Key, title: "API Access", desc: "Integrate assessments into your existing school management systems" },
  { icon: Shield, title: "Data Privacy", desc: "GDPR and FERPA compliant with full data encryption" },
  { icon: Cpu, title: "Scalable Compute", desc: "Handle thousands of concurrent assessments without slowdown" },
  { icon: Headphones, title: "Priority Support", desc: "Dedicated account manager for your institution's needs" },
];
