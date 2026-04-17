import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PublicPricing = () => {
  const plans = [
    {
      name: "Student Starter",
      price: "Free",
      desc: "Perfect for students beginning their journey.",
      features: ["Basic Personality Test", "Career Interest Survey", "Public Results Dashboard", "Email Support"],
      btn: "Get Started",
      color: "gray"
    },
    {
      name: "Pro Professional",
      price: "$19",
      period: "/month",
      desc: "Advanced insights for serious career planning.",
      features: ["Deep Personality Analysis", "Ability & Cognitive Tests", "Personal AI Mentor", "Downloadable Reports", "Counselor Chat"],
      btn: "Go Pro",
      featured: true,
      color: "indigo"
    },
    {
      name: "Institutional",
      price: "Custom",
      desc: "Scalable solutions for schools and organizations.",
      features: ["Bulk Student Licenses", "Organization Dashboard", "Standardized Reporting", "Admin Permissions", "24/7 Dedicated Support"],
      btn: "Contact Sales",
      color: "black"
    }
  ];

  return (
    <div className="pricing-page" style={{ paddingTop: '1px', paddingBottom: '2px' }}>
      <section className="hero-section" style={{ paddingBottom: '30px' }}>
        <div className="hero-content">
          <div className="section-eyebrow">Pricing Plans</div>
          <h1 className="hero-h1">Simple, transparent <br /><span>pricing for all.</span></h1>
          <p className="hero-sub max-w-lg mx-auto">
            Choose the perfect plan for your goals. From individual students to
            large institutions, we have a solution that fits.
          </p>
        </div>
      </section>

      <section className="px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`p-8 rounded-[2rem] bg-white border ${plan.featured ? 'border-indigo-500 shadow-2xl relative' : 'border-gray-200'} transition-all hover:-translate-y-2`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.desc}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-black text-black">{plan.price}</span>
                {plan.period && <span className="text-gray-400 font-bold">{plan.period}</span>}
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-indigo-500" />
                    </div>
                    <span className="text-sm text-gray-600">{feat}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/login"
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm transition-all ${plan.featured
                  ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-600'
                  : 'bg-black text-white hover:bg-gray-900'
                  }`}
              >
                {plan.btn} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PublicPricing;
