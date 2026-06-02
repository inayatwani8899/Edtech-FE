import { Link, useNavigate, Outlet } from "react-router-dom";
import { landingStyles } from "@/pages/LandingStyles";

export const PublicLayout = () => {
  const navigate = useNavigate();

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
          </div>
        </nav>

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
