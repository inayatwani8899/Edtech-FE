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
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Timer, BookOpen, ArrowLeft, Minimize, Info, CheckSquare } from "lucide-react";
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
  } = useTestStore();
  const { user } = useAuthStore();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const testContainerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch test details on mount
  useEffect(() => {
    if (testId) fetchTestById(testId);
  }, [testId, fetchTestById]);

  // Timer logic
  useEffect(() => {
    if (!testStarted || timeRemaining === null) return;
    if (timeRemaining <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeRemaining(prev => (prev !== null ? prev - 1 : 0)), 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining, testStarted]);

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
      await submitTest(testId, user.id);
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
      await submitTest(testId, user.id);
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

      if (!fullscreenElement && testStarted && timeRemaining !== null && timeRemaining > 0) {
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
  }, [testStarted, timeRemaining]);

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
          setTestStarted(false);
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

  const handleContinueToStart = () => {
    setShowInstructions(false);
  };

  const handleBackToInstructions = () => {
    setShowInstructions(true);
  };

  const handleStartTest = async () => {
    if (!testId) return;
    try {
      const limit = currentTest?.totalQuestionsPerPage;
      setTestStarted(true);
      await fetchQuestions(currentPage, limit);

      if (currentTest?.timeDuration) {
        setTimeRemaining(currentTest?.timeDuration * 60);
      }

      toast({
        title: "Test Started",
        description: "Good luck! Read each question carefully.",
      });

      await enterFullScreen();

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to start test",
      });
      setTestStarted(false);
    }
  };

  // Get current question from paginated questions array
  const currentQuestion = testQuestions?.[0] || null;

  const handleNextQuestion = async () => {
    if (!testId || !questionPagination) return;
    const nextPage = currentPage + 1;
    const limit = currentTest?.totalQuestionsPerPage || 5;

    if (questionPagination.hasNext) {
      await fetchQuestions(nextPage, limit);
      useTestStore.setState({ currentPage: nextPage });

      if (questionsContainerRef.current) {
        questionsContainerRef.current.scrollTop = 0;
      }
    }
  };

  const handlePreviousQuestion = async () => {
    if (!testId || !questionPagination) return;

    const prevPage = currentPage - 1;
    const limit = currentTest?.totalQuestionsPerPage || 5;

    if (questionPagination.hasPrevious && prevPage >= 1) {
      await fetchQuestions(prevPage, limit);
      useTestStore.setState({ currentPage: prevPage });

      if (questionsContainerRef.current) {
        questionsContainerRef.current.scrollTop = 0;
      }
    }
  };

  const handlePageNavigation = async (pageNumber: number) => {
    if (!testId || pageNumber === currentPage) return;

    const limit = currentTest?.totalQuestionsPerPage || 5;
    await fetchQuestions(pageNumber, limit);
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
    setTestStarted(false);

    try {
      await exitFullScreen();
      await submitTest(testId, user.id);

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
      setTestStarted(true);
      await enterFullScreen();
    }
  };

  // Navigation guard function
  const navigationGuard = useCallback((targetUrl: string) => {
    if (testStarted && timeRemaining !== null && timeRemaining > 0) {
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
            setTestStarted(false);
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
  }, [testStarted, timeRemaining]);

  // Enhanced navigation prevention logic
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (testStarted && timeRemaining !== null && timeRemaining > 0) {
        event.preventDefault();
        event.stopPropagation();
        navigationGuard(window.location.href);
      }
    };

    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (testStarted && timeRemaining !== null && timeRemaining > 0) {
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

      if (link && testStarted && timeRemaining !== null && timeRemaining > 0) {
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
  }, [testStarted, timeRemaining, navigationGuard]);

  // Calculate progress and answers
  const totalQuestions = questionPagination.totalQuestions || 0;
  const questionsPerPage = currentTest?.totalQuestionsPerPage || 5;
  const hasPrevious = questionPagination?.hasPrevious || false;
  const hasNext = questionPagination?.hasNext || false;
  const totalPages = questionPagination?.totalPages || 1;

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
  if (testTakingLoading && !testStarted && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-700">Loading test...</p>
        </div>
      </div>
    );
  }

  // Submitting state
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-6">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Submitting Your Test</h2>
              <p className="text-gray-600">Please wait while we process your responses...</p>
            </div>
            <Progress value={75} className="w-full bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-blue-500" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // STEP 1: Instructions Page
  if (showInstructions && !testStarted && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/tests")}
              className="mb-6 group hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Tests
            </Button>
            {/* Test Details */}
            {currentTest && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">Test Details</h3>
                  </div>
                  <p className="text-2xl font-bold">{currentTest.title}</p>
                  <p className="text-blue-100 text-sm mt-2">{currentTest.description}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">Time Limit</h3>
                  </div>
                  <p className="text-2xl font-bold">{currentTest.timeDuration || 30} minutes</p>
                  <p className="text-green-100 text-sm mt-2">Complete within the allocated time</p>
                </div>
              </div>
            )}

            {/* Instructions Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                Test Instructions
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Please read the following instructions carefully before proceeding to the test.
              </p>
            </div>


            {/* Enhanced Instructions Section */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Important Instructions</h3>
              </div>
              <div className="space-y-4">
                <p className="text-purple-100 font-medium">Please read these instructions carefully:</p>
                <ul className="list-disc list-inside space-y-3 text-purple-100 text-sm">
                  <li><strong>Stable Internet Required:</strong> Ensure you have a stable internet connection throughout the test</li>
                  <li><strong>No Resumption:</strong> If you exit the test, you cannot resume and will need to purchase again for a new assessment</li>
                  <li><strong>Auto-Submission:</strong> Test will automatically submit when time ends or if you exit</li>
                  <li><strong>Single Session:</strong> Complete the test in one sitting - no pausing allowed</li>
                  <li><strong>Honest Responses:</strong> Answer all questions honestly based on your first instinct</li>
                  <li><strong>No Right/Wrong:</strong> There are no correct answers - respond naturally</li>
                  <li><strong>Fullscreen Mode:</strong> Test will open in fullscreen for better experience</li>
                  <li><strong>No Going Back:</strong> You cannot return to previous pages once navigated</li>
                </ul>
                <div className="bg-purple-400/20 border border-purple-300/30 rounded-lg p-3 mt-4">
                  <p className="text-purple-100 text-sm font-semibold">
                    ⚠️ Warning: Exiting the test will automatically submit your current responses and you won't be able to retake without purchasing again.
                  </p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <Button
                size="lg"
                className="px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-xl"
                onClick={handleContinueToStart}
                disabled={testTakingLoading}
              >
                <CheckSquare className="h-5 w-5 mr-2" />
                I Understand, Continue to Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Ready to Begin Page
  if (!testStarted && !isSubmitting && !showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <Button
              variant="ghost"
              onClick={handleBackToInstructions}
              className="mb-6 group hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Instructions
            </Button>

            {/* Ready to Begin Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                Ready to Begin?
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                You're about to start your assessment. Make sure you're in a quiet environment and have allocated enough time to complete the test.
              </p>
            </div>

            {/* Final Check Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-2 border-green-200 bg-green-50/50">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 mb-2">Instructions Read</h3>
                  <p className="text-green-600 text-sm">You have read and understood all test instructions</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-blue-50/50">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-blue-800 mb-2">Time Allocated</h3>
                  <p className="text-blue-600 text-sm">You have {currentTest?.timeDuration || 30} minutes allocated</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Reminder */}
            <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Final Reminder</h4>
                  <p className="text-yellow-700 text-sm">
                    Once you start, the timer will begin and you cannot pause or exit without submitting the test.
                    Ensure you're ready before clicking "Start Assessment".
                  </p>
                </div>
              </div>
            </div>

            {/* Start Assessment Button */}
            <div className="text-center">
              <Button
                size="lg"
                className="px-12 py-6 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-xl"
                onClick={handleStartTest}
                disabled={testTakingLoading}
              >
                {testTakingLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Starting Assessment...
                  </div>
                ) : (
                  <>
                    <Timer className="h-5 w-5 mr-2" />
                    Start Assessment Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No questions available - Full page error
  if (!currentQuestion && !testTakingLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-16 text-center space-y-8">
            <div className="space-y-4">
              <AlertCircle className="h-24 w-24 text-red-500 mx-auto" />
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">No Questions Found</h2>
                <p className="text-gray-600 text-lg mb-2">
                  We couldn't find any questions for this test.
                </p>
                <p className="text-gray-500">
                  Please contact your administrator for assistance.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Button
                onClick={() => { setTestStarted(false); resetTestState(); }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg"
              >
                Back to Test Info
              </Button>
              <div>
                <p className="text-sm text-gray-500">
                  If this issue persists, please reach out to support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main test interface
  return (
    <div ref={testContainerRef} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-2 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{currentTest?.title}</h1>
              {/* <p className="text-gray-600 text-sm">{currentTest?.description}</p> */}
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {/* <Badge variant="secondary" className="px-3 py-1 text-sm bg-blue-100 text-blue-700 border-0">
                  Page {currentPage} of {totalPages}
                </Badge> */}
                <div className={`flex items-center text-lg font-semibold px-4 py-2 rounded-lg ${timeRemaining && timeRemaining < 300 ? "bg-red-100 text-red-700 animate-pulse" : "bg-gray-100 text-gray-700"
                  }`}>
                  <Timer className="h-5 w-5 mr-2" />
                  <span>{formatTime(timeRemaining || 0)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSubmitTest}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Exit
                </Button>
                {isFullScreen && (
                  <Button variant="ghost" size="icon" onClick={handleSubmitTest} title="Exit Fullscreen">
                    <Minimize className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions Section - Left Side (2/3 width) */}
          <div className="lg:col-span-2 space-y-2">
            <Card className="border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">Questions</span>
                  <span className="text-blue-500 text-sm font-normal">
                    Showing {(currentPage - 1) * questionsPerPage + 1}-{Math.min(currentPage * questionsPerPage, totalQuestions)} of {totalQuestions}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {/* Scrollable questions container */}
                <div
                  ref={questionsContainerRef}
                  className="space-y-6 overflow-y-auto pr-2"
                  style={{
                    maxHeight: '70vh',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f1f5f9'
                  }}
                >
                  {testQuestions.map((question, index) => (
                    <div
                      key={question.questionId}
                      className="p-6 bg-gray-50/50 rounded-xl border border-gray-200/50 hover:border-blue-200/50 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                          {(currentPage - 1) * questionsPerPage + index + 1}
                        </div>
                        <h3 className="text-sm font-medium text-gray-800 text-base leading-relaxed">
                          {question.questionText}
                        </h3>
                      </div>

                      <RadioGroup
                        value={getCurrentAnswer(question.questionId.toString()) || ""}
                        onValueChange={(value) => setAnswerLocally(question.questionId.toString(), value)}
                        className="grid grid-cols-5 gap-1"
                      >
                        {question.options?.map((option, i) => (
                          <div
                            key={`${question.questionId}-${i}`}
                            className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 bg-white hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 cursor-pointer group"
                          >
                            <RadioGroupItem
                              value={option.optionId}
                              id={`option-${question.questionId}-${i}`}
                              className="text-blue-400 border-2 border-gray-300 group-hover:border-blue-400"
                            />
                            <Label
                              htmlFor={`option-${question.questionId}-${i}`}
                              className="flex-1 cursor-pointer text-gray-900 group-hover:text-gray-500 text-xs font-medium leading-relaxed"
                            >
                              {option.optionText}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                    </div>
                  ))}

                  <div className="flex justify-between items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-2xl mt-5 mb-5">
                    <Button
                      variant="outline"
                      onClick={handlePreviousQuestion}
                      disabled={!hasPrevious}
                      className="flex items-center justify-center rounded-lg px-6 py-1 border-2 text-sm font-medium"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Previous Page
                    </Button>

                    {hasNext ? (
                      <Button
                        onClick={handleNextQuestion}
                        className="flex items-center justify-center rounded-lg px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm font-medium"
                      >
                        Next Page
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitTest}
                        className="flex items-center justify-center rounded-lg px-8 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg text-sm font-medium"
                      >
                        Submit Test
                      </Button>
                    )}
                  </div>
                </div>
                {/* Navigation Buttons */}

              </CardContent>
            </Card>
          </div>

          {/* Navigation Section - Right Side (1/3 width) */}
          <div className="space-y-6">
            {/* Quick Navigation Card */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Quick Navigation
                </CardTitle>
                <CardDescription>
                  Jump to any page quickly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Page Numbers Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <div key={`ellipsis-${index}`} className="flex items-center justify-center h-10 text-gray-500">
                        ...
                      </div>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageNavigation(page as number)}
                        className={`h-10 min-w-[44px] ${currentPage === page
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg"
                          : "hover:border-blue-300"
                          }`}
                      >
                        {page}
                      </Button>
                    )
                  ))}
                </div>

                {/* First/Last Buttons */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageNavigation(1)}
                    disabled={currentPage === 1}
                    className="flex-1"
                  >
                    First Page
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePageNavigation(totalPages)}
                    disabled={currentPage === totalPages}
                    className="flex-1"
                  >
                    Last Page
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress & Actions Card */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Test Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Page</span>
                    <span className="font-semibold">{currentPage} of {totalPages}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Questions on this page</span>
                    <span className="font-semibold">{testQuestions.length}</span>
                  </div>
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-800">Time Remaining</span>
                    <span className={`font-bold ${timeRemaining && timeRemaining < 300 ? "text-red-600 animate-pulse" : ""
                      }`}>
                      {formatTime(timeRemaining || 0)}
                    </span>
                  </div> */}
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Quick Tip
                  </h4>
                  <p className="text-blue-700 text-xs">
                    All answers are saved automatically. Test will auto-submit when time ends.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};