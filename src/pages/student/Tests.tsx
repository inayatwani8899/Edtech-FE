import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  Search,
  Star,
  ArrowRight,
  LayoutGrid,
  Zap,
  Sparkles,
  Lock,
  BookOpen,
} from "lucide-react";
import { useTestStore } from "@/store/testStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useAuthStore } from "@/store/useAuthStore";

/* ─── helpers ─────────────────────────────────────────────── */
const getDifficultyMeta = (d?: string) => {
  switch (d?.toLowerCase()) {
    case "beginner":
      return { label: "Beginner", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" };
    case "intermediate":
      return { label: "Intermediate", cls: "bg-amber-50 text-amber-600 border-amber-200" };
    case "advanced":
      return { label: "Advanced", cls: "bg-rose-50 text-rose-600 border-rose-200" };
    default:
      return { label: d || "Standard", cls: "bg-slate-50 text-slate-600 border-slate-200" };
  }
};

const TABS = [
  { id: "all", label: "All" },
  { id: "available", label: "Available" },
  { id: "completed", label: "Completed" },
];

/* ─── component ───────────────────────────────────────────── */
export const Tests = () => {
  const { handlePayment, isTestPaid } = usePaymentStore();
  const { user } = useAuthStore();
  const { getPublishedTests, publishedTests, fetchQuestions, testTakingLoading } = useTestStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [processingTestId, setProcessingTestId] = useState<string | null>(null);
  const [paidStatus, setPaidStatus] = useState<Record<string, boolean>>({});
  const [paidLoading, setPaidLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // fetch tests once on mount
  useEffect(() => {
    setMounted(true);
    getPublishedTests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // fetch paid statuses in parallel — the REAL fix for slow loading
  useEffect(() => {
    if (!user?.id || !publishedTests?.length) return;

    const fetchAll = async () => {
      setPaidLoading(true);
      // Fire all requests simultaneously instead of one‑by‑one
      const results = await Promise.all(
        publishedTests.map((test) => isTestPaid(String(user.id), test.id))
      );
      const map: Record<string, boolean> = {};
      publishedTests.forEach((test, i) => {
        map[test.id] = results[i];
      });
      setPaidStatus(map);
      setPaidLoading(false);
    };

    fetchAll();
  }, [user?.id, publishedTests]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = publishedTests.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q);

    const matchTab =
      activeTab === "all" ||
      (activeTab === "completed" && (t as any).completed) ||
      (activeTab === "available" && !(t as any).completed);

    return matchSearch && matchTab;
  });

  // Performance optimization: Don't block the whole UI for payment status
  const isLoading = testTakingLoading;
  const isSyncingData = paidLoading;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Ambient glows ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "-10%",
            width: "55%",
            height: "55%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        {/* Subtle radial center glow instead of grid */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            background: "radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Scrollable inner ──────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          boxSizing: "border-box",
          padding: "32px 24px 48px",
        }}
        // hide webkit scrollbar via inline trick
        className="hide-scrollbar"
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none !important; }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          .card-hover {
            transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          }
          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.3);
          }
          .tab-btn {
            transition: background 0.2s, color 0.2s;
          }
          .cta-btn {
            transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          }
          .cta-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            opacity: 0.9;
          }
          .cta-btn:active:not(:disabled) { transform: scale(0.97); }
          .cta-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        `}</style>

        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* ── Header ────────────────────────────────────── */}
          <div style={{ marginBottom: 36, animation: "fadeUp 0.5s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: 999,
                  padding: "3px 12px",
                }}
              >
                <Sparkles size={11} color="#818cf8" />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#818cf8", textTransform: "uppercase" }}>
                  Assessment Hub
                </span>
              </div>
            </div>
            <h1
              style={{
                fontSize: "clamp(26px, 4vw, 38px)",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Your&nbsp;
              <span
                style={{
                  background: "linear-gradient(90deg, #6366f1,#8b5cf6, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Assessments
              </span>
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 8, maxWidth: 480, lineHeight: 1.6 }}>
              Professional evaluations designed to map your natural strengths and align them with
              high-growth career trajectories.
            </p>
          </div>

          {/* ── Search + Tabs bar ─────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
              animation: "fadeUp 0.55s ease 0.05s both",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
              <Search
                size={14}
                color="#475569"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
              <input
                type="text"
                placeholder="Search assessments…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#f8fafc",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 10,
                  height: 38,
                  paddingLeft: 36,
                  paddingRight: 12,
                  color: "#1e293b",
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
              />
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.07)",
                borderRadius: 10,
                padding: 3,
                gap: 2,
              }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className="tab-btn"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "5px 16px",
                    borderRadius: 7,
                    border: "none",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    background: activeTab === tab.id ? "rgba(99,102,241,0.12)" : "transparent",
                    color: activeTab === tab.id ? "#6366f1" : "#64748b",
                    fontFamily: "inherit",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Count badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginLeft: "auto",
                fontSize: 11,
                color: "#475569",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: isSyncingData ? "#94a3b8" : "#22d3ee",
                  boxShadow: isSyncingData ? "none" : "0 0 8px rgba(34,211,238,0.6)",
                  animation: isSyncingData ? "none" : "pulse 2s infinite",
                }}
              />
              {isLoading ? "…" : filtered.length} tests {isSyncingData && "(syncing…)"}
            </div>
          </div>

          {/* ── Content ───────────────────────────────────── */}
          {isLoading ? (
            /* Skeleton grid */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
                animation: "fadeUp 0.4s ease both",
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid rgba(0,0,0,0.07)",
                    borderRadius: 16,
                    padding: 22,
                    height: 210,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
                      backgroundSize: "800px 100%",
                      animation: "shimmer 1.6s infinite linear",
                    }}
                  />
                  <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: 8, height: 14, width: "40%", marginBottom: 10 }} />
                  <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: 8, height: 20, width: "70%", marginBottom: 8 }} />
                  <div style={{ background: "rgba(0,0,0,0.05)", borderRadius: 8, height: 12, width: "90%", marginBottom: 6 }} />
                  <div style={{ background: "rgba(0,0,0,0.05)", borderRadius: 8, height: 12, width: "60%", marginBottom: 24 }} />
                  <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: 8, height: 36, width: "100%" }} />
                </div>
              ))}
            </div>
          ) : publishedTests.length === 0 ? (
            /* Empty state */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 20px",
                animation: "fadeUp 0.4s ease both",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <LayoutGrid size={28} color="#6366f1" />
              </div>
              <h3 style={{ color: "#0f172a", fontWeight: 700, fontSize: 18, margin: 0, marginBottom: 6 }}>
                No active assessments
              </h3>
              <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
                Contact your administrator to get tests assigned.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            /* No results */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 20px",
                animation: "fadeUp 0.4s ease both",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <Search size={28} color="#6366f1" />
              </div>
              <h3 style={{ color: "#0f172a", fontWeight: 700, fontSize: 18, margin: 0, marginBottom: 6 }}>
                No results found
              </h3>
              <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
                Try a different search term or switch tabs.
              </p>
            </div>
          ) : (
            /* Test grid */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                gap: 20,
              }}
            >
              {filtered.map((test, i) => {
                const diff = getDifficultyMeta(test.difficulty);
                const isPaid = paidStatus[test.id];

                return (
                  <div
                    key={test.id}
                    className="card-hover"
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: 18,
                      padding: "24px 22px 20px",
                      display: "flex",
                      flexDirection: "column",
                      animation: `fadeUp 0.45s ease ${i * 0.05}s both`,
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04), 0 4px 6px -2px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.03)",
                    }}
                  >
                    {/* Top accent line */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                        borderRadius: "18px 18px 0 0",
                      }}
                    />

                    {/* Badges row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          padding: "3px 9px",
                          borderRadius: 999,
                          border: "1px solid",
                        }}
                        className={diff.cls}
                      >
                        {diff.label}
                      </span>

                      {test.category && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "3px 9px",
                            borderRadius: 999,
                            background: "rgba(0,0,0,0.04)",
                            border: "1px solid rgba(0,0,0,0.06)",
                            color: "#64748b",
                          }}
                        >
                          {test.category}
                        </span>
                      )}

                      <div
                        style={{
                          marginLeft: "auto",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 999,
                          padding: "3px 8px",
                        }}
                      >
                        <Clock size={10} color="#6366f1" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>
                          {test.timeDuration}m
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        color: "#0f172a",
                        fontWeight: 700,
                        fontSize: 15,
                        margin: 0,
                        marginBottom: 6,
                        lineHeight: 1.35,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {test.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        color: "#475569",
                        fontSize: 12,
                        lineHeight: 1.6,
                        margin: 0,
                        marginBottom: 16,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {test.description}
                    </p>

                    {/* Stats row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        paddingTop: 12,
                        borderTop: "1px solid rgba(0,0,0,0.07)",
                        marginBottom: 14,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Users size={11} color="#475569" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#475569" }}>
                          {test?.participants?.toLocaleString() || "1.2k+"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Star size={11} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#475569" }}>
                          {test?.rating || "4.8"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <BookOpen size={11} color="#475569" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#475569" }}>
                          {test.questionCount || "—"} Qs
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    {!user ? (
                      <Link
                        to="/login"
                        className="cta-btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 10,
                          height: 38,
                          color: "#94a3b8",
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          fontFamily: "inherit",
                        }}
                      >
                        <Lock size={12} />
                        Login to Unlock
                      </Link>
                    ) : isPaid ? (
                      <Link
                        to={`/test/${test.id}`}
                        className="cta-btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                          border: "none",
                          borderRadius: 10,
                          height: 38,
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          fontFamily: "inherit",
                          boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                        }}
                      >
                        Start Now
                        <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <button
                        className="cta-btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          background:
                            processingTestId === test.id
                              ? "rgba(0,0,0,0.05)"
                              : "linear-gradient(135deg, #1e293b, #334155)",
                          border: "1px solid rgba(0,0,0,0.12)",
                          borderRadius: 10,
                          height: 38,
                          color: processingTestId === test.id ? "#94a3b8" : "#f8fafc",
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: processingTestId === test.id ? "not-allowed" : "pointer",
                          fontFamily: "inherit",
                          width: "100%",
                        }}
                        disabled={processingTestId === test.id}
                        onClick={() => {
                          setProcessingTestId(test.id);
                          navigate(`/test/${test.id}`);
                        }}

                      >
                        {processingTestId === test.id ? (
                          <>
                            <span
                              style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                border: "2px solid rgba(255,255,255,0.2)",
                                borderTopColor: "#6366f1",
                                animation: "spin 0.7s linear infinite",
                                display: "inline-block",
                              }}
                            />
                            Starting…
                          </>
                        ) : (
                          <>
                            <Zap size={12} />
                            Quick Start
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};