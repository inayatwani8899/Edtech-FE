const PublicPrivacy = () => {
  return (
    <div className="privacy-page" style={{ paddingTop: '1px', paddingBottom: '2px' }}>
      <section className="hero-section" style={{ paddingBottom: '30px' }}>
        <div className="hero-content">
          <div className="section-eyebrow">Privacy Policy</div>
          <h1 className="hero-h1">Your data is <span>secure</span> <br />with us.</h1>
          <p className="hero-sub max-w-lg mx-auto">
            At CognifyIQ, we take your privacy seriously. This document outlines
            how we collect, use, and protect your personal and psychometric data.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6">
        <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-black mb-4">1. Data Collection</h3>
            <p>We collect information during the registration process and throughout your interactions with our psychometric assessments. This includes basic profile information (name, age, grade level) and detailed behavioral data required for generating cognitive and personality insights.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">2. Psychometric Data Privacy</h3>
            <p>Your assessment results—including personality profiles, career interests, and cognitive scores—are treated as highly sensitive information. Access is restricted to authorized personnel and is only shared with educational institutions or counselors if you have explicitly granted permission through your organization settings.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">3. Use of AI and Machine Learning</h3>
            <p>Data collected is used to train and refine our proprietary AI models. This processing is done in an aggregated and anonymized fashion to improve the accuracy of our career matching algorithms and predictive analytics for all users.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">4. Third-Party Sharing</h3>
            <p>CognifyIQ does not sell your personal data. We may share anonymized, aggregated demographic data with research partners for educational studies. Personally identifiable information is only shared with third-party service providers (like cloud storage or email services) necessary to operate our platform, under strict confidentiality agreements.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">5. Children's Privacy (COPPA Compliance)</h3>
            <p>As an EdTech provider, we comply with strict regulations regarding the privacy of students. For users under the age of 13/16 (depending on jurisdiction), we require verifiable parental or institutional consent before collecting any personal information.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">6. Your Rights</h3>
            <p>You have the right to access, export, or request the deletion of your personal data at any time. Students belonging to an institution should note that some data management may be governed by the institution's primary agreement with CognifyIQ.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">7. Data Security</h3>
            <p>All data is encrypted at rest and in transit using 256-bit SSL encryption. We perform regular security audits and vulnerability assessments to protect our database from unauthorized access.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicPrivacy;
