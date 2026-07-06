import { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { landingStyles } from "@/pages/LandingStyles";

export const PublicLayout = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{landingStyles}</style>
      <div className="lp">
        {/* ═══════════ NAVBAR ═══════════ */}
        <nav className="lp-nav">
          <div className="nav-logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
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

            <button 
              className="mobile-menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Slide-out Drawer */}
        <div 
          className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} 
          onClick={() => setMobileMenuOpen(false)} 
        />
        <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-links">
            <Link to="/assessments" onClick={() => setMobileMenuOpen(false)}>Assessments</Link>
            <Link to="/counselors" onClick={() => setMobileMenuOpen(false)}>Counselors</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link to="/privacy" onClick={() => setMobileMenuOpen(false)}>Privacy</Link>
            <Link to="/terms" onClick={() => setMobileMenuOpen(false)}>Terms</Link>
          </div>
          <div className="mobile-drawer-actions">
            <Link to="/login" className="btn-nav-primary" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>
              Get started
            </Link>
          </div>
        </div>

        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Outlet />
        </main>

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
            <div className="footer-copy">© 2026 Cognify<span>IQ</span>. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
};
