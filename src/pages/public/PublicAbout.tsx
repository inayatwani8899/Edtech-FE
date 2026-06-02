import { Sparkles, Users, Target, Shield, Zap } from "lucide-react";

const PublicAbout = () => {
  return (
    <div className="about-page" style={{ paddingTop: '1px' }}>
      <section className="hero-section" style={{ paddingBottom: '2px' }}>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Our Mission & Vision
          </div>
          <h1 className="hero-h1">
            Revolutionizing education <br />
            through <span>AI Insights</span>
          </h1>
          <p className="hero-sub text-center mx-auto">
            CognifyIQ is on a mission to empower every student with deep self-understanding.
            By combining advanced psychometrics with state-of-the-art AI, we help
            institutions guide their students toward fulfilling careers.
          </p>
        </div>
      </section>

      <section className="features-section" style={{ background: 'var(--white)' }}>
        <div className="features-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="section-eyebrow">Who we are</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>The Future of <br />Psychometric Testing</h2>
              <p className="text-gray-500 leading-relaxed">
                Founded by a team of educators and AI researchers, CognifyIQ aims to bridge the gap
                between academic learning and career readiness. We believe that assessment
                shouldn't just be about grades, but about discovering untapped potential.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Our approach integrates classical psychometric theories with modern machine learning 
                to provide a dynamic, multi-dimensional view of student capabilities that 
                traditional testing often overlooks.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <Users className="w-8 h-8 text-indigo-500 mb-2" />
                  <h4 className="font-bold text-black">10k+</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Students Guided</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <Target className="w-8 h-8 text-rose-500 mb-2" />
                  <h4 className="font-bold text-black">98%</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Accuracy Rate</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-indigo-50 to-rose-50 border border-gray-100 flex items-center justify-center p-12">
                <Sparkles className="w-32 h-32 text-indigo-400 opacity-20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-48 h-48 text-indigo-500/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ VALUES SECTION ═══════════ */}
      <section className="values-section py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="section-eyebrow mx-auto">Our Core Values</div>
            <h2 className="section-title mb-16">Building the foundation<br />for <span>success.</span></h2>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        title: "Student First",
                        desc: "Every assessment and insight is designed with the student's personal growth and future happiness as the top priority.",
                        color: "indigo"
                    },
                    {
                        title: "Scientific Rigor",
                        desc: "We rely on scientifically validated psychometric models like IRT and the Big Five to ensure professional-grade accuracy.",
                        color: "rose"
                    },
                    {
                        title: "Inclusivity",
                        desc: "Our platform is built to be accessible to all, providing fair and unbiased opportunities regardless of background.",
                        color: "amber"
                    }
                ].map((val, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                        <div className={`w-12 h-12 rounded-xl bg-${val.color}-50 text-${val.color}-500 flex items-center justify-center mb-6 mx-auto`}>
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-3">{val.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ═══════════ STORY SECTION ═══════════ */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
                <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
                <h2 className="text-[8rem] font-black text-indigo-500/5 absolute -top-12 -left-4 select-none">STORY</h2>
                <div className="relative z-10 space-y-6">
                    <h2 className="text-4xl font-black text-black">A journey of <br />discovery.</h2>
                    <p className="text-gray-500 leading-relaxed">
                        What started as a small research project at an AI lab has grown into a 
                        comprehensive ecosystem used by hundreds of institutions worldwide. 
                        We saw a gap in how talent was identified and nurtured, and we decided 
                         to build the tools we wished we had when we were students.
                    </p>
                    <p className="text-gray-500 leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-2">
                        "The goal isn't just to tell you what you're good at, but to show you who 
                        you can become."
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] p-8 flex flex-col justify-end border border-gray-100">
                    <h4 className="font-bold text-indigo-500 text-2xl uppercase">Global</h4>
                    <p className="text-xs text-gray-400 font-bold tracking-widest">Presence in 15+ Countries</p>
                </div>
                <div className="aspect-[4/5] bg-black text-white rounded-[2rem] p-8 flex flex-col justify-end">
                    <h4 className="font-bold text-white text-2xl uppercase">Trusted</h4>
                    <p className="text-xs text-gray-400 font-bold tracking-widest">Certified by EdTech Alliance</p>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
};

export default PublicAbout;
