import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Timer, BookOpen, ArrowLeft, Minimize, Maximize, Info, CheckSquare } from "lucide-react";
import { useTestStore } from "@/store/testStore";
import { useAuthStore } from "@/store/useAuthStore";

export const TestDetail = () => {
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    currentPage,
    currentTest,
    testQuestions,
    questionPagination,
    testTakingLoading,
    testTakingError,
    fetchTestById,
    fetchQuestions,
    submitTest,
    getCurrentAnswer,
    setAnswerLocally,
    resetTestState,
    currentSession,
  } = useTestStore();

  const {
    totalPages = 1,
    hasNext = false,
    hasPrevious = false,
  } = questionPagination || {};
  const { user } = useAuthStore();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Instructions, 1: Ready, 2: Test
  const testContainerRef = useRef<HTMLDivElement>(null);
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch test details on mount
  useEffect(() => {
    if (testId) fetchTestById(testId);
  }, [testId, fetchTestById]);

  // Timer logic
  useEffect(() => {
    if (currentStep !== 2 || timeRemaining === null) return;
    if (timeRemaining <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeRemaining(prev => (prev !== null ? prev - 1 : 0)), 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining, currentStep]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Fullscreen API functions
  const enterFullScreen = async () => {
    if (testContainerRef.current) {
      try {
        if (testContainerRef.current.requestFullscreen) {
          await testContainerRef.current.requestFullscreen();
        } else if ((testContainerRef.current as any).mozRequestFullScreen) {
          await (testContainerRef.current as any).mozRequestFullScreen();
        } else if ((testContainerRef.current as any).webkitRequestFullscreen) {
          await (testContainerRef.current as any).webkitRequestfullscreen();
        } else if ((testContainerRef.current as any).msRequestFullscreen) {
          await (testContainerRef.current as any).msRequestFullscreen();
        }
        setIsFullScreen(true);
      } catch (err) {
        console.error('Error entering fullscreen:', err);
      }
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
      setIsFullScreen(false);
    } catch (err) {
      console.error('Error exiting fullscreen:', err);
    }
  };

  // Auto submit when timer ends
  const handleAutoSubmit = async () => {
    if (!testId || !user?.id) return;

    setIsSubmitting(true);
    try {
      await submitTest(testId, String(user.id));
      toast({
        title: "Test Auto-Submitted",
        description: "Time's up! Your test has been automatically submitted.",
      });
      resetTestState();
      navigate("/results");
    } catch (err: any) {
      console.error("Auto-submission error:", err);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Your test couldn't be auto-submitted. Please contact support.",
      });
    }
  };

  // Submit test on exit
  const submitTestOnExit = async () => {
    if (!testId || !user?.id) return false;

    try {
      await submitTest(testId, String(user.id));
      return true;
    } catch (err) {
      console.error("Exit submission error:", err);
      return false;
    }
  };

  // Fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;

      setIsFullScreen(!!fullscreenElement);

      if (!fullscreenElement && currentStep === 2 && timeRemaining !== null && timeRemaining > 0) {
        Swal.fire({
          title: 'Fullscreen Exited',
          text: "You have exited fullscreen mode. It's recommended to stay in fullscreen for better test experience.",
          icon: 'info',
          confirmButtonText: 'Continue Test',
          showCancelButton: true,
          cancelButtonText: 'Exit Test',
          background: '#fff',
          backdrop: 'rgba(0,0,0,0.7)',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Return to Fullscreen?',
              text: "Would you like to return to fullscreen mode?",
              icon: 'question',
              confirmButtonText: 'Yes, Enter Fullscreen',
              showCancelButton: true,
              cancelButtonText: 'No, Continue Normally',
              background: '#fff',
              backdrop: 'rgba(0,0,0,0.7)'
            }).then((fullscreenResult) => {
              if (fullscreenResult.isConfirmed) {
                enterFullScreen();
              }
            });
          } else {
            handleExitTest();
          }
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [currentStep, timeRemaining]);

  const handleExitTest = async () => {
    Swal.fire({
      title: 'Exit Test?',
      text: "Your test will be automatically submitted. You won't be able to resume and will need to purchase again for a new assessment.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Exit & Submit',
      cancelButtonText: 'Continue Test',
      background: '#fff',
      backdrop: 'rgba(0,0,0,0.7)',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const success = await submitTestOnExit();
        if (success) {
          setCurrentStep(0);
          await exitFullScreen();
          resetTestState();
        }
        return success;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        toast({
          title: "Test Submitted",
          description: "Your test has been submitted successfully.",
        });
        navigate("/tests");
      } else if (result.isConfirmed && !result.value) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "Failed to submit test. Please try again.",
        });
      }
    });
  };

  const handleContinueToNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBackToPrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };






  const handleStartTest = async () => {
    if (!testId) return;
    try {
      const limit = currentTest?.totalQuestionsPerPage ?? 10;
      // reset to first page when starting
      useTestStore.setState({ currentPage: 1 });
      setCurrentStep(2);
      await fetchQuestions(1, limit, currentSession?.id ?? null, currentTest?.testId ?? testId, currentTest?.grade ?? undefined);

      if (currentTest?.timeDuration) {
        setTimeRemaining(currentTest?.timeDuration * 60);
      }

      toast({
        title: "Test Started",
        description: "Good luck! Read each question carefully.",
      });

      // Removed auto-fullscreen per user request
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to start test",
      });
      setCurrentStep(1);
    }
  };

  // Get current question from paginated questions array
  const currentQuestion = testQuestions?.[0] || null;

  const handleNextQuestion = async () => {
    if (!testId || !questionPagination) return;
    const nextPage = currentPage + 1;
    const limit = currentTest?.totalQuestionsPerPage || 10;

    if (questionPagination.hasNext) {
      await fetchQuestions(nextPage, limit, currentSession?.id ?? null, currentTest?.testId ?? testId, currentTest?.grade ?? undefined);
      useTestStore.setState({ currentPage: nextPage });

      if (questionsContainerRef.current) {
        questionsContainerRef.current.scrollTop = 0;
      }
    }
  };

  const handlePreviousQuestion = async () => {
    if (!testId || !questionPagination) return;

    const prevPage = currentPage - 1;
    const limit = currentTest?.totalQuestionsPerPage || 10;

    if (questionPagination.hasPrevious && prevPage >= 1) {
      await fetchQuestions(prevPage, limit, currentSession?.id ?? null, currentTest?.testId ?? testId, currentTest?.grade ?? undefined);
      useTestStore.setState({ currentPage: prevPage });

      if (questionsContainerRef.current) {
        questionsContainerRef.current.scrollTop = 0;
      }
    }
  };

  const handlePageNavigation = async (pageNumber: number) => {
    if (!testId || pageNumber === currentPage) return;

    const limit = currentTest?.totalQuestionsPerPage || 10;
    await fetchQuestions(pageNumber, limit, currentSession?.id ?? null, currentTest?.testId ?? testId, currentTest?.grade ?? undefined);
    useTestStore.setState({ currentPage: pageNumber });

    if (questionsContainerRef.current) {
      questionsContainerRef.current.scrollTop = 0;
    }
  };

  const handleSubmitTest = async () => {
    if (!testId || !user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Test ID or User ID is missing"
      });
      return;
    }

    setIsSubmitting(true);
    setCurrentStep(0);

    try {
      await exitFullScreen();
      await submitTest(testId, String(user.id));

      toast({
        title: "Test Submitted Successfully",
        description: "Thank you for completing the test!"
      });

      resetTestState();
      navigate("/results");

    } catch (err: any) {
      console.error("Test submission error:", err);

      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: err.message || "Please try again. Your answers are saved locally."
      });

      setIsSubmitting(false);
      setCurrentStep(2);
      await enterFullScreen();
    }
  };

  // Navigation guard function
  const navigationGuard = useCallback((targetUrl: string) => {
    if (currentStep === 2 && timeRemaining !== null && timeRemaining > 0) {
      Swal.fire({
        title: 'Leave Test?',
        text: "Your test will be automatically submitted. You won't be able to resume and will need to purchase again.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Leave & Submit',
        cancelButtonText: 'Stay on Test',
        background: '#fff',
        backdrop: 'rgba(0,0,0,0.7)',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const success = await submitTestOnExit();
          if (success) {
            setCurrentStep(0);
            await exitFullScreen();
            resetTestState();
          }
          return success;
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          window.location.href = targetUrl;
        }
      });
      return false;
    }
    return true;
  }, [currentStep, timeRemaining]);

  // Enhanced navigation prevention logic
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (currentStep === 2 && timeRemaining !== null && timeRemaining > 0) {
        event.preventDefault();
        event.stopPropagation();
        navigationGuard(window.location.href);
      }
    };

    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (currentStep === 2 && timeRemaining !== null && timeRemaining > 0) {
        event.preventDefault();
        // Attempt to submit test before unloading
        await submitTestOnExit();
        event.returnValue = 'Your test is being submitted...';
        return event.returnValue;
      }
    };

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && currentStep === 2 && timeRemaining !== null && timeRemaining > 0) {
        event.preventDefault();
        event.stopPropagation();
        navigationGuard(link.href);
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep, timeRemaining, navigationGuard]);

  // Generate page numbers for navigation
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 10;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Loading state
  if (testTakingLoading && currentStep !== 2 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  // Submitting state
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 border-0 shadow-xl bg-white">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Submitting Assessment</h2>
              <p className="text-slate-500">Securely processing your responses...</p>
            </div>
            <Progress value={66} className="h-2 bg-slate-100" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Visual Stepper Component
  const TestStepper = ({ step }: { step: number }) => (
    <div className="flex items-center justify-center mb-10">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center">
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
            ${step >= i ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400'}
            ${step === i ? 'ring-4 ring-indigo-50 shadow-md scale-110' : ''}
          `}>
            {step > i ? <CheckCircle className="h-6 w-6" /> : <span className="text-sm font-bold">{i + 1}</span>}
          </div>
          {i < 2 && (
            <div className={`w-16 h-1 transition-all duration-300 mx-2 rounded-full ${step > i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  // STEP 1: Instructions Page
  if (currentStep === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <TestStepper step={0} />
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/tests")}
                className="mb-6 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{currentTest?.title || "Test Details"}</h1>
                  <p className="text-slate-500 text-sm">Review these instructions before you begin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center text-slate-600 mb-1">
                    <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Duration</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{currentTest?.timeDuration || 30} Minutes</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center text-slate-600 mb-1">
                    <Timer className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Format</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">Multiple Choice Questions</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-indigo-500" />
                  Guidelines
                </h3>
                <div className="grid gap-3">
                  {[
                    "Ensure a stable internet connection for the entire duration.",
                    "Once you start, you cannot pause or resume later.",
                    "The assessment will automatically submit when the timer ends.",
                    "Exiting fullscreen or the browser tab will trigger auto-submission.",
                    "Answer all questions based on your first instinct.",
                    "Calculators or external aids are not permitted unless specified."
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="mt-1 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex items-center justify-end pt-6 border-t border-slate-100">
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                  onClick={handleContinueToNextStep}
                >
                  Continue to Confirmation
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Ready to Begin Page
  if (currentStep === 1 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <TestStepper step={1} />
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8">
              <Button
                variant="ghost"
                onClick={handleBackToPrevStep}
                className="mb-8 -ml-2 text-slate-500 hover:text-slate-900"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Instructions
              </Button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                  <Timer className="h-10 w-10 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Final Confirmation</h1>
                <p className="text-slate-500 max-w-sm mx-auto">
                  You are ready to begin the {currentTest?.title || "assessment"}. Please ensure you're in a quiet place.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Important Reminder</h4>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      By clicking "Start Assessment", you agree to the terms. The timer will begin immediately and you will enter fullscreen mode.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBackToPrevStep}
                  className="px-8 h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Go Back
                </Button>
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-12 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                  onClick={handleStartTest}
                  disabled={testTakingLoading}
                >
                  {testTakingLoading ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Initializing...
                    </span>
                  ) : (
                    "Start Assessment Now"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
            <Button
              onClick={() => { setCurrentStep(0); resetTestState(); }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            >
              Back to Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main test interface
  const currentCategory = testQuestions[0]?.category || currentTest?.title || "Assessment";

  return (
    <div ref={testContainerRef} className="h-screen overflow-hidden flex flex-col bg-slate-50">
      <div className="flex-none bg-white border-b border-gray-100 shadow-sm z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Category Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 overflow-hidden">
            <h1 className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight border-b-2 border-[#1a1a1a] inline-block pb-1 whitespace-nowrap overflow-hidden text-ellipsis mr-4">
              {currentCategory}
            </h1>
            <p className="text-[#4a4a4a] text-xs leading-tight max-w-2xl opacity-80">
              Activities mentioned here don't have to be connected to the actual career interest. <a href="#" className="text-blue-600 underline font-medium">Watch video</a> for help.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable Question Table */}
      <main className="flex-1 overflow-hidden flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex-1 min-h-0 bg-white rounded-xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden flex flex-col">
          <div className="flex-none bg-slate-50 py-3 px-8 text-center border-b border-gray-100">
            <h2 className="text-base font-bold text-[#1a1a1a]">
              Indicate your preference for pursuing these activities in your leisure
            </h2>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Headers */}
                <div className="grid grid-cols-[1fr_repeat(5,110px)] bg-[#007b82] text-white sticky top-0 z-30 shadow-md">
                  <div className="p-3"></div>
                  <div className="p-3 text-center font-bold text-[10px] uppercase tracking-wider border-l border-[#006b72]">Strongly Dislike</div>
                  <div className="p-3 text-center font-bold text-[10px] uppercase tracking-wider border-l border-[#006b72]">Dislike</div>
                  <div className="p-3 text-center font-bold text-[10px] uppercase tracking-wider border-l border-[#006b72]">Unsure</div>
                  <div className="p-3 text-center font-bold text-[10px] uppercase tracking-wider border-l border-[#006b72]">Like</div>
                  <div className="p-3 text-center font-bold text-[10px] uppercase tracking-wider border-l border-[#006b72]">Strongly Like</div>
                </div>
              </div>
            </div>

            <div
              ref={questionsContainerRef}
              className="flex-1 overflow-y-auto scroll-smooth w-full"
            >
              <div className="min-w-[800px]">
                <style>{`
                  .scroll-smooth::-webkit-scrollbar {
                    width: 6px;
                  }
                  .scroll-smooth::-webkit-scrollbar-track {
                    background: #f1f1f1;
                  }
                  .scroll-smooth::-webkit-scrollbar-thumb {
                    background: #007b82;
                    border-radius: 10px;
                  }
                `}</style>
                {testQuestions.map((question, qIdx) => (
                  <div
                    key={question.questionId}
                    className={`grid grid-cols-[1fr_repeat(5,110px)] items-center border-b border-gray-50 transition-colors hover:bg-slate-50 ${qIdx % 2 === 1 ? 'bg-[#fbfbfb]' : 'bg-white'}`}
                  >
                    <div className="p-4 text-sm font-semibold text-[#2d2d2d] pl-8">
                      {question.questionText}
                    </div>

                    {/* Preference Cells */}
                    {[1, 2, 3, 4, 5].map((idx) => {
                      const option = question.options?.[idx - 1];
                      const optionValue = option ? String(option.optionId) : String(idx);
                      const isSelected = getCurrentAnswer(question.questionId.toString()) === optionValue;

                      return (
                        <div key={idx} className="p-2 flex justify-center border-l border-gray-50">
                          <button
                            className="relative h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:border-[#007b82]"
                            onClick={() => setAnswerLocally(question.questionId.toString(), optionValue)}
                          >
                            <div className={`
                              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                              ${isSelected
                                ? 'border-[#007b82] bg-white'
                                : 'border-gray-300 bg-white'}
                            `}>
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-inner animate-in fade-in zoom-in duration-200" />
                              )}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation Section */}
      <div className="flex-none bg-white border-t border-gray-200 z-40 pb-[50px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center bg-white">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousQuestion}
            disabled={!hasPrevious}
            className="h-10 px-6 rounded-lg border-gray-300 text-gray-700 hover:bg-slate-50 font-bold transition-all disabled:opacity-20"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous Set
          </Button>

          <div className="bg-slate-100 px-4 py-1.5 rounded-full text-slate-700 font-bold text-[10px] tracking-widest uppercase border border-slate-200">
            Set {currentPage} of {totalPages}
          </div>

          {hasNext ? (
            <Button
              size="sm"
              onClick={handleNextQuestion}
              className="h-10 px-8 rounded-lg bg-[#007b82] hover:bg-[#006b72] text-white font-bold shadow-md shadow-teal-50 transition-all transform active:scale-95 flex items-center"
            >
              <span className="mr-1">Next Set</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmitTest}
              disabled={isSubmitting}
              className="h-10 px-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-50 transition-all transform active:scale-95"
            >
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          )}
        </div>
      </div>

      {/* Global Floating Footer Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 z-50 flex justify-between items-center text-xs text-gray-500 font-bold shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            Auto-saved
          </span>
          <span className={`flex items-center gap-2 ${timeRemaining && timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
            <Timer className="h-4 w-4" />
            {timeRemaining ? formatTime(timeRemaining) : '--:--'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={isFullScreen ? exitFullScreen : enterFullScreen}
            className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 text-slate-600 transition-all active:scale-90"
            title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <div className="w-px h-4 bg-slate-200" />
          <span className="text-slate-400">Code: {testId}</span>
          <div className="w-px h-4 bg-slate-200" />
          <button onClick={handleExitTest} className="text-red-500 hover:underline">Exit</button>
        </div>
      </div>
    </div>
  );
};
