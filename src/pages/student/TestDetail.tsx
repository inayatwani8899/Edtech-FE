import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, BrainCircuit, Sparkles, Loader2 } from "lucide-react";
import { useTestLogic } from "./hooks/useTestLogic";
import { InstructionStep } from "./components/InstructionStep";
import { ConfirmationStep } from "./components/ConfirmationStep";
import { TestInterface } from "./components/TestInterface";

export const TestDetail = () => {
  const {
    testId,
    currentTest,
    testQuestions,
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    timeRemaining,
    isSubmitting,
    isFullScreen,
    currentStep,
    testTakingLoading,
    loading,
    currentQuestion,
    testContainerRef,
    questionsContainerRef,
    formatTime,
    enterFullScreen,
    exitFullScreen,
    handleContinueToNextStep,
    handleBackToPrevStep,
    handleStartTest,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitTest,
    handleExitTest,
    getCurrentAnswer,
    setAnswerLocally,
    navigate,
    mediaStreamRef,
    stopCamera
  } = useTestLogic();

  // Loading state
  const isInitialLoading = (testTakingLoading || loading) && currentStep !== 2 && !isSubmitting;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  // Submitting state: Premium AI-themed processing page
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans">
        <style>{`
          @keyframes grid-drift {
            from { background-position: 0 0; }
            to { background-position: 40px 40px; }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
          @keyframes scan-line {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100%); opacity: 0; }
          }
          .neural-grid-loading {
            background-image: 
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
            animation: grid-drift 20s linear infinite;
          }
          .shimmer-bar {
            background: linear-gradient(90deg, 
              rgba(59, 130, 246, 0) 0%, 
              rgba(59, 130, 246, 0.5) 50%, 
              rgba(59, 130, 246, 0) 100%);
            animation: shimmer 2s infinite;
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>

        {/* Background Effects */}
        <div className="absolute inset-0 neural-grid-loading" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />

        <Card className="max-w-md w-full mx-4 border border-blue-500/20 shadow-2xl bg-slate-900/80 backdrop-blur-xl relative z-10 overflow-hidden">
          {/* Top Scan Line Effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/20 overflow-hidden">
            <div className="h-full w-1/3 bg-blue-400 blur-sm transform -skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]" />
          </div>

          <CardContent className="p-10 text-center space-y-8">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto relative group">
                <div className="absolute inset-0 rounded-3xl border border-blue-500/30 animate-pulse" />
                <div className="absolute -inset-1 bg-blue-500/10 rounded-3xl blur-md opacity-50" />
                <BrainCircuit className="h-12 w-12 text-blue-400 relative z-10" />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-blue-300 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.15em]">
                Processing Results
              </h2>
              <div className="flex items-center justify-center gap-2 text-blue-400 font-mono text-[10px] uppercase tracking-widest font-bold">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>AI Core Syncing...</span>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">
                Generating your <span className="text-blue-400 font-bold">AI-powered report</span>.
                This may take a few moments.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black text-blue-500/60 uppercase tracking-widest mb-1">
                  <span>Synthesizing Insights</span>
                  <span className="animate-pulse">Active</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative border border-white/5">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 w-[65%] shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  <div className="absolute inset-0 shimmer-bar" />
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-600 font-mono uppercase tracking-tighter">
              Secure Neural Uplink Established • Node_0x{testId?.slice(-4) || "7C1"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // STEP 1: Instructions Page
  if (currentStep === 0 && !isSubmitting) {
    return (
      <InstructionStep
        currentTest={currentTest}
        onContinue={handleContinueToNextStep}
        onBack={() => navigate("/tests")}
        stepNumber={0}
      />
    );
  }

  // STEP 2: Ready to Begin Page
  if (currentStep === 1 && !isSubmitting) {
    return (
      <ConfirmationStep
        currentTest={currentTest}
        onStart={handleStartTest}
        onBack={() => {
          stopCamera();
          handleBackToPrevStep();
        }}
        isLoading={testTakingLoading}
        stepNumber={1}
        mediaStreamRef={mediaStreamRef}
      />
    );
  }

  // No questions available - Full page error
  if (!currentQuestion && !testTakingLoading && currentStep === 2) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-lg bg-white">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No Questions Found</h2>
              <p className="text-slate-500">
                We couldn't retrieve questions for this assessment. Please contact support.
              </p>
            </div>
            <button
              onClick={() => {
                navigate("/tests");
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Overview
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main test interface
  const currentCategory = testQuestions[0]?.category || currentTest?.title || "Assessment";

  return (
    <TestInterface
      testContainerRef={testContainerRef}
      questionsContainerRef={questionsContainerRef}
      currentCategory={currentCategory}
      testQuestions={testQuestions}
      currentPage={currentPage}
      totalPages={totalPages}
      hasNext={hasNext}
      hasPrevious={hasPrevious}
      timeRemaining={timeRemaining}
      isFullScreen={isFullScreen}
      isSubmitting={isSubmitting}
      testId={testId}
      getCurrentAnswer={getCurrentAnswer}
      setAnswerLocally={setAnswerLocally}
      handlePreviousQuestion={handlePreviousQuestion}
      handleNextQuestion={handleNextQuestion}
      handleSubmitTest={handleSubmitTest}
      handleExitTest={handleExitTest}
      enterFullScreen={enterFullScreen}
      exitFullScreen={exitFullScreen}
      formatTime={formatTime}
      testTakingLoading={testTakingLoading}
    />
  );
};
