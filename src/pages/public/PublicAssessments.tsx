import { Brain, Heart, Briefcase, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PublicAssessments = () => {
  const assessmentTypes = [
    {
      icon: Brain,
      title: "Cognitive Ability",
      desc: "Measure logical reasoning, memory, and information processing speed.",
      framework: "Bloom's Taxonomy / Ability Theory",
      color: "indigo"
    },
    {
      icon: Heart,
      title: "Personality Profile",
      desc: "Deep dive into behavioral patterns and interpersonal preferences.",
      framework: "Big Five Framework",
      color: "rose"
    },
    {
      icon: Briefcase,
      title: "Career Interests",
      desc: "Map interests to industry demands and professional success.",
      framework: "Holland's RIASEC Theory",
      color: "amber"
    },
    {
      icon: Zap,
      title: "Adaptive Skills",
      desc: "Real-time difficulty adjustment based on student ability.",
      framework: "Item Response Theory (IRT)",
      color: "emerald"
    }
  ];

  return (
    <div className="assessments-page" style={{ paddingTop: '1px' }}>
      <section className="hero-section" style={{ paddingBottom: '2px' }}>
        <div className="hero-content">
          <div className="section-eyebrow">Our Assessments</div>
          <h1 className="hero-h1">Scientifically <span>validated</span> <br />frameworks.</h1>
          <p className="hero-sub max-w-lg mx-auto">
            Our multi-dimensional approach ensures a holistic view of every individual's
            potential through standardized and adaptive testing.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {assessmentTypes.map((type, i) => (
            <div
              key={i}
              className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:border-indigo-500/30 hover:shadow-2xl transition-all duration-500 flex flex-col items-start gap-6"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${type.color}-50 flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                <type.icon className={`w-7 h-7 text-${type.color}-500`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{type.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{type.desc}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Framework:</span>
                  <span className="text-[10px] font-bold text-gray-700">{type.framework}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-16 p-12 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden text-center">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Ready to start your journey?</h2>
            <p className="text-indigo-100 mb-8 max-w-md mx-auto">Discover your true potential today. Sign up and get access to our basic assessments for free.</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20"
            >
              Start Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Abstract pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-20 -mb-20 blur-3xl" />
        </div>
      </section>
    </div>
  );
};

export default PublicAssessments;
