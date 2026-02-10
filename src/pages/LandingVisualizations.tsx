import React from "react";
import {
    Brain,
    Users,
    Target,
    BarChart3,
    CheckCircle2,
    FileText,
    Sparkles,
    Activity,
    BookOpen,
    TrendingUp,
    Zap,
    GitBranch,
    ArrowRight,
    Layers,
    GraduationCap,
    Briefcase,
    School,
    Baby
} from "lucide-react";

// ═══════════════════════════════════════
// PSYCHOMETRIC TESTING PROCESS VISUALIZATION
// ═══════════════════════════════════════
export const PsychometricVisualization = () => {
    const stages = [
        {
            icon: Brain,
            title: "Cognitive Assessment",
            theory: "Cattell-Horn-Carroll (CHC) Theory",
            description: "Measures fluid intelligence, crystallized intelligence, and processing speed",
            color: "#c8622a",
            metrics: ["Verbal Reasoning", "Numerical Ability", "Spatial Processing", "Working Memory"]
        },
        {
            icon: Users,
            title: "Personality Profiling",
            theory: "Big Five (OCEAN) Model",
            description: "Evaluates openness, conscientiousness, extraversion, agreeableness, neuroticism",
            color: "#d4a843",
            metrics: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness"]
        },
        {
            icon: Target,
            title: "Interest Mapping",
            theory: "Holland's RIASEC Framework",
            description: "Identifies career interests across six personality types",
            color: "#0ea5e9",
            metrics: ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"]
        },
        {
            icon: Activity,
            title: "Emotional Intelligence",
            theory: "Goleman's EQ Model",
            description: "Assesses self-awareness, empathy, motivation, and social skills",
            color: "#34d399",
            metrics: ["Self-Awareness", "Self-Regulation", "Motivation", "Empathy"]
        }
    ];

    return (
        <div className="psycho-viz">
            <style>{`
        .psycho-viz {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          animation: fadeInScale 0.8s ease-out;
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .stage-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 2px solid #ede7d9;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .stage-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--stage-color);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        
        .stage-card:hover::before {
          transform: scaleX(1);
        }
        
        .stage-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          border-color: var(--stage-color);
        }
        
        .stage-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: var(--stage-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .stage-card:hover .stage-icon-wrap {
          transform: rotate(-5deg) scale(1.05);
        }
        
        .stage-icon-wrap::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 18px;
          background: var(--stage-color);
          opacity: 0.2;
          z-index: -1;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.05;
          }
        }
        
        .stage-title {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a1a18;
          margin-bottom: 8px;
          line-height: 1.2;
        }
        
        .stage-theory {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--stage-color);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        
        .stage-desc {
          font-size: 0.9rem;
          color: #3d3d38;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .stage-metrics {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .metric-tag {
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(0,0,0,0.04);
          color: #3d3d38;
          font-weight: 500;
          border: 1px solid rgba(0,0,0,0.06);
        }
        
        .stage-card:hover .metric-tag {
          background: var(--stage-color);
          color: white;
          border-color: var(--stage-color);
        }
      `}</style>

            {stages.map((stage, idx) => (
                <div
                    key={idx}
                    className="stage-card"
                    style={{ "--stage-color": stage.color } as React.CSSProperties}
                >
                    <div className="stage-icon-wrap">
                        <stage.icon size={28} color="#ffffff" strokeWidth={2.5} />
                    </div>
                    <div className="stage-theory">{stage.theory}</div>
                    <h3 className="stage-title">{stage.title}</h3>
                    <p className="stage-desc">{stage.description}</p>
                    <div className="stage-metrics">
                        {stage.metrics.map((metric, i) => (
                            <span key={i} className="metric-tag">{metric}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ═══════════════════════════════════════
// AI WORKFLOW VISUALIZATION - Animated Flow
// ═══════════════════════════════════════
export const AIWorkflowVisualization = () => {
    const steps = [
        { id: 1, title: "Grade Detection", icon: GraduationCap, desc: "AI identifies student level" },
        { id: 2, title: "Theory Selection", icon: BookOpen, desc: "Picks relevant frameworks" },
        { id: 3, title: "Question Generation", icon: Sparkles, desc: "Creates adaptive items" },
        { id: 4, title: "Response Analysis", icon: Brain, desc: "Evaluates answers in real-time" },
        { id: 5, title: "Score Calculation", icon: BarChart3, desc: "Applies psychometric models" },
        { id: 6, title: "Report Generation", icon: FileText, desc: "Produces insights & guidance" },
    ];

    return (
        <div className="workflow-viz">
            <style>{`
        .workflow-viz {
          position: relative;
          padding: 60px 0;
        }
        
        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px 32px;
          position: relative;
          z-index: 2;
        }
        
        .workflow-step {
          background: rgba(245,240,232,0.08);
          border: 1px solid rgba(245,240,232,0.15);
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
          position: relative;
          transition: all 0.4s ease;
          animation: stepFadeIn 0.6s ease-out backwards;
        }
        
        .workflow-step:nth-child(1) { animation-delay: 0.1s; }
        .workflow-step:nth-child(2) { animation-delay: 0.2s; }
        .workflow-step:nth-child(3) { animation-delay: 0.3s; }
        .workflow-step:nth-child(4) { animation-delay: 0.4s; }
        .workflow-step:nth-child(5) { animation-delay: 0.5s; }
        .workflow-step:nth-child(6) { animation-delay: 0.6s; }
        
        @keyframes stepFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .workflow-step:hover {
          background: rgba(245,240,232,0.12);
          border-color: #d4a843;
          transform: translateY(-4px);
        }
        
        .step-number {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8622a 0%, #d4a843 100%);
          color: white;
          font-family: 'Fraunces', serif;
          font-weight: 900;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(200,98,42,0.3);
        }
        
        .step-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: rgba(245,240,232,0.1);
          border: 1px solid rgba(245,240,232,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          transition: all 0.3s ease;
        }
        
        .workflow-step:hover .step-icon-box {
          background: rgba(212,168,67,0.2);
          border-color: #d4a843;
          transform: scale(1.08);
        }
        
        .step-title {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f5f0e8;
          margin-bottom: 8px;
        }
        
        .step-desc {
          font-size: 0.85rem;
          color: rgba(245,240,232,0.6);
          line-height: 1.5;
        }
        
        .workflow-connector {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .connector-line {
          stroke: rgba(212,168,67,0.3);
          stroke-width: 2;
          fill: none;
          stroke-dasharray: 8 4;
          animation: dash 20s linear infinite;
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -240;
          }
        }
        
        @media (max-width: 960px) {
          .workflow-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px 24px;
          }
        }
        
        @media (max-width: 600px) {
          .workflow-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>

            <div className="workflow-grid">
                {steps.map((step) => (
                    <div key={step.id} className="workflow-step">
                        <div className="step-number">{step.id}</div>
                        <div className="step-icon-box">
                            <step.icon size={24} color="#d4a843" strokeWidth={2} />
                        </div>
                        <h4 className="step-title">{step.title}</h4>
                        <p className="step-desc">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════
// GRADES VISUALIZATION - Level Progression
// ═══════════════════════════════════════
export const GradesVisualization = () => {
    const gradeCategories = [
        {
            category: "Early Education",
            icon: Baby,
            color: "#34d399",
            grades: ["Pre-K", "K", "Grade 1", "Grade 2"],
            focus: "Foundational cognitive & social skills",
            tests: "Picture-based assessments, basic problem-solving"
        },
        {
            category: "Elementary",
            icon: School,
            color: "#0ea5e9",
            grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6"],
            focus: "Core competencies & learning styles",
            tests: "Reading comprehension, math reasoning, creativity"
        },
        {
            category: "Secondary",
            icon: GraduationCap,
            color: "#d4a843",
            grades: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
            focus: "Subject mastery & career exploration",
            tests: "Subject-specific aptitude, personality profiling"
        },
        {
            category: "Higher Education",
            icon: BookOpen,
            color: "#c8622a",
            grades: ["Grade 11", "Grade 12", "Undergraduate"],
            focus: "College readiness & specialization",
            tests: "Advanced reasoning, career alignment, EQ"
        },
        {
            category: "Professional",
            icon: Briefcase,
            color: "#1e4035",
            grades: ["Early Career", "Mid-Level", "Senior"],
            focus: "Leadership & domain expertise",
            tests: "Managerial assessment, technical proficiency"
        }
    ];

    return (
        <div className="grades-viz">
            <style>{`
        .grades-viz {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .grade-category {
          background: white;
          border-radius: 20px;
          border: 2px solid #ede7d9;
          padding: 32px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 28px;
          align-items: start;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          animation: slideIn 0.6s ease-out backwards;
        }
        
        .grade-category:nth-child(1) { animation-delay: 0.1s; }
        .grade-category:nth-child(2) { animation-delay: 0.2s; }
        .grade-category:nth-child(3) { animation-delay: 0.3s; }
        .grade-category:nth-child(4) { animation-delay: 0.4s; }
        .grade-category:nth-child(5) { animation-delay: 0.5s; }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .grade-category::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          background: var(--cat-color);
          transform: scaleY(0);
          transition: transform 0.4s ease;
        }
        
        .grade-category:hover::before {
          transform: scaleY(1);
        }
        
        .grade-category:hover {
          border-color: var(--cat-color);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          transform: translateX(8px);
        }
        
        .category-icon-box {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: var(--cat-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .grade-category:hover .category-icon-box {
          transform: rotate(-3deg) scale(1.05);
        }
        
        .category-icon-box::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 20px;
          background: var(--cat-color);
          opacity: 0.15;
          z-index: -1;
        }
        
        .category-content {
          flex: 1;
        }
        
        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .category-name {
          font-family: 'Fraunces', serif;
          font-size: 1.6rem;
          font-weight: 900;
          color: #1a1a18;
        }
        
        .grade-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .grade-badge {
          padding: 6px 14px;
          border-radius: 8px;
          background: rgba(0,0,0,0.04);
          font-size: 0.8rem;
          font-weight: 600;
          color: #3d3d38;
          border: 1px solid rgba(0,0,0,0.08);
          transition: all 0.2s ease;
        }
        
        .grade-category:hover .grade-badge {
          background: var(--cat-color);
          color: white;
          border-color: var(--cat-color);
          transform: translateY(-2px);
        }
        
        .category-focus {
          font-size: 0.95rem;
          color: #3d3d38;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .category-tests {
          font-size: 0.85rem;
          color: #8a8a7a;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .grade-category {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .category-icon-box {
            margin: 0 auto;
          }
          
          .category-header {
            flex-direction: column;
            align-items: center;
          }
          
          .grade-badges {
            justify-content: center;
          }
        }
      `}</style>

            {gradeCategories.map((cat, idx) => (
                <div
                    key={idx}
                    className="grade-category"
                    style={{ "--cat-color": cat.color } as React.CSSProperties}
                >
                    <div className="category-icon-box">
                        <cat.icon size={36} color="white" strokeWidth={2.5} />
                    </div>
                    <div className="category-content">
                        <div className="category-header">
                            <h3 className="category-name">{cat.category}</h3>
                            <div className="grade-badges">
                                {cat.grades.map((grade, i) => (
                                    <span key={i} className="grade-badge">{grade}</span>
                                ))}
                            </div>
                        </div>
                        <p className="category-focus"><strong>Focus:</strong> {cat.focus}</p>
                        <p className="category-tests"><strong>Assessments:</strong> {cat.tests}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ═══════════════════════════════════════
// TEST PROCESS FLOW - Complete Pipeline
// ═══════════════════════════════════════
export const TestProcessFlow = () => {
    return (
        <div className="process-flow">
            <style>{`
        .process-flow {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .flow-container {
          position: relative;
          padding: 40px 0;
        }
        
        .flow-stage {
          background: rgba(245,240,232,0.06);
          border: 2px solid rgba(245,240,232,0.12);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
          position: relative;
          transition: all 0.4s ease;
          animation: flowIn 0.7s ease-out backwards;
        }
        
        .flow-stage:nth-child(1) { animation-delay: 0.1s; }
        .flow-stage:nth-child(2) { animation-delay: 0.2s; }
        .flow-stage:nth-child(3) { animation-delay: 0.3s; }
        .flow-stage:nth-child(4) { animation-delay: 0.4s; }
        .flow-stage:nth-child(5) { animation-delay: 0.5s; }
        
        @keyframes flowIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .flow-stage::before {
          content: '';
          position: absolute;
          left: 12px;
          bottom: -24px;
          width: 2px;
          height: 24px;
          background: linear-gradient(to bottom, rgba(212,168,67,0.5), transparent);
        }
        
        .flow-stage:last-child::before {
          display: none;
        }
        
        .flow-stage:hover {
          background: rgba(245,240,232,0.1);
          border-color: #d4a843;
          transform: translateX(8px);
        }
        
        .flow-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .flow-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8622a 0%, #d4a843 100%);
          color: white;
          font-family: 'Fraunces', serif;
          font-weight: 900;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(200,98,42,0.3);
        }
        
        .flow-title {
          font-family: 'Fraunces', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #f5f0e8;
          flex: 1;
        }
        
        .flow-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(212,168,67,0.15);
          border: 1px solid rgba(212,168,67,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .flow-content {
          padding-left: 56px;
        }
        
        .flow-desc {
          font-size: 0.95rem;
          color: rgba(245,240,232,0.7);
          line-height: 1.7;
          margin-bottom: 16px;
        }
        
        .flow-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        
        .detail-item {
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(245,240,232,0.04);
          border: 1px solid rgba(245,240,232,0.08);
          font-size: 0.8rem;
          color: rgba(245,240,232,0.8);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .detail-check {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          background: #34d399;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        @media (max-width: 600px) {
          .flow-content {
            padding-left: 0;
            padding-top: 16px;
          }
          
          .flow-header {
            flex-wrap: wrap;
          }
          
          .flow-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            <div className="flow-container">
                <div className="flow-stage">
                    <div className="flow-header">
                        <div className="flow-number">1</div>
                        <h4 className="flow-title">Question Generation</h4>
                        <div className="flow-icon">
                            <Sparkles size={20} color="#d4a843" />
                        </div>
                    </div>
                    <div className="flow-content">
                        <p className="flow-desc">
                            AI analyzes grade level, selects appropriate psychometric theories
                            (CHC, Big Five, RIASEC), and generates contextually relevant questions
                            with varying difficulty levels.
                        </p>
                        <div className="flow-details">
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Grade-adaptive content
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Theory-based items
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Difficulty calibration
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flow-stage">
                    <div className="flow-header">
                        <div className="flow-number">2</div>
                        <h4 className="flow-title">Student Response</h4>
                        <div className="flow-icon">
                            <Target size={20} color="#d4a843" />
                        </div>
                    </div>
                    <div className="flow-content">
                        <p className="flow-desc">
                            Student completes the assessment in a user-friendly interface.
                            Responses are captured with timestamps and behavioral data for comprehensive analysis.
                        </p>
                        <div className="flow-details">
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Timed responses
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Progress tracking
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Auto-save feature
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flow-stage">
                    <div className="flow-header">
                        <div className="flow-number">3</div>
                        <h4 className="flow-title">AI Evaluation</h4>
                        <div className="flow-icon">
                            <Brain size={20} color="#d4a843" />
                        </div>
                    </div>
                    <div className="flow-content">
                        <p className="flow-desc">
                            Advanced algorithms evaluate responses using Item Response Theory (IRT),
                            calculate raw scores, and apply normative data for standardized results.
                        </p>
                        <div className="flow-details">
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                IRT scoring model
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Pattern recognition
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Normative comparison
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flow-stage">
                    <div className="flow-header">
                        <div className="flow-number">4</div>
                        <h4 className="flow-title">Theory Application</h4>
                        <div className="flow-icon">
                            <BookOpen size={20} color="#d4a843" />
                        </div>
                    </div>
                    <div className="flow-content">
                        <p className="flow-desc">
                            Scores are mapped to psychometric constructs—cognitive abilities (CHC),
                            personality traits (Big Five), career interests (RIASEC), and emotional intelligence.
                        </p>
                        <div className="flow-details">
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Multi-theory synthesis
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Trait profiling
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Career alignment
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flow-stage">
                    <div className="flow-header">
                        <div className="flow-number">5</div>
                        <h4 className="flow-title">Report Generation</h4>
                        <div className="flow-icon">
                            <FileText size={20} color="#d4a843" />
                        </div>
                    </div>
                    <div className="flow-content">
                        <p className="flow-desc">
                            Comprehensive PDF report generated with visual analytics, percentile rankings,
                            strength/weakness analysis, and personalized career pathway recommendations.
                        </p>
                        <div className="flow-details">
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Visual dashboards
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Career suggestions
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Actionable insights
                            </div>
                            <div className="detail-item">
                                <div className="detail-check">
                                    <CheckCircle2 size={10} color="white" strokeWidth={3} />
                                </div>
                                Downloadable PDF
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
