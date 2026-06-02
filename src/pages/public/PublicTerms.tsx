const PublicTerms = () => {
  return (
    <div className="terms-page" style={{ paddingTop: '1px', paddingBottom: '12px' }}>
      <section className="hero-section" style={{ paddingBottom: '30px' }}>
        <div className="hero-content">
          <div className="section-eyebrow">Terms of Service</div>
          <h1 className="hero-h1">Commitment to <span>Excellence.</span></h1>
          <p className="hero-sub max-w-lg mx-auto">
            By using CognifyIQ, you agree to the following terms and conditions.
            We strive to provide the best possible experience for our users.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6">
        <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-black mb-4">1. Acceptance of Terms</h3>
            <p>Welcome to CognifyIQ ("Service"). By accessing or using our platform, you agree to be bound by these Terms of Service, including our Privacy Policy. Our Service is intended for students, counselors, and educational institutions looking to utilize AI-driven psychometric insights for career and educational development.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">2. Accuracy of AI Insights</h3>
            <p>CognifyIQ provides assessments based on scientifically validated psychometric models and advanced AI algorithms. However, these insights are designed to be supportive guides and not absolute determinants of ability or career success. We do not guarantee specific professional outcomes and encourage users to consult with qualified human advisors alongside our automated reports.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">3. Intellectual Property</h3>
            <p>All content, including assessment questions, scoring algorithms, report designs, and the "CognifyIQ" name and logo, are the exclusive intellectual property of CognifyIQ. Users are granted a limited, non-exclusive license to use the Service for personal or internal educational purposes. Any unauthorized scraping, copying, or reverse engineering of our assessment logic is strictly prohibited.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">4. User Responsibilities</h3>
            <p>When taking assessments, you agree to provide honest and thoughtful responses to ensure the accuracy of your profile. You are responsible for maintaining the security of your login credentials. Any misuse of the platform or attempt to manipulate assessment results may lead to account suspension.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">5. Institutional Accounts (Schools/Organizations)</h3>
            <p>Organizations using CognifyIQ are responsible for managing their internal user access and ensuring that student participation complies with local educational regulations. The institution remains the primary owner of its students' aggregated data, subject to the individual privacy rights of the students.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">6. Limitation of Liability</h3>
            <p>To the maximum extent permitted by law, CognifyIQ shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the Service. We provide the Service on an "as-is" and "as-available" basis.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">7. Termination</h3>
            <p>We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicTerms;
