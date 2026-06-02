import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useToast } from "@/hooks/use-toast";
import { useTestStore } from "@/store/testStore";
import { useAuthStore } from "@/store/useAuthStore";

export const useTestLogic = () => {
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
        loading,
        fetchTestById,
        fetchQuestions,
        submitTest,
        getCurrentAnswer,
        setAnswerLocally,
        resetTestState,
        currentSession,
        userAnswers,
        isSubmitting,
    } = useTestStore();


    const questionsPerPage = currentTest?.totalQuestionsPerPage || 10;
    const computedTotalPages = Math.max(1, Math.ceil((testQuestions?.length || 0) / questionsPerPage));
    const hasNext = currentPage < computedTotalPages;
    const hasPrevious = currentPage > 1;

    const { user, studentSession } = useAuthStore();
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // 0: Instructions, 1: Ready, 2: Test
    const testContainerRef = useRef<HTMLDivElement>(null);
    const questionsContainerRef = useRef<HTMLDivElement>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const stopCamera = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
    }, []);

    // Fetch test details on mount
    useEffect(() => {
        if (testId) fetchTestById(testId);
    }, [testId, fetchTestById]);

    // Single source of truth for fetching questions when entering the interface
    useEffect(() => {
        if (!testId || testQuestions.length > 0) return;

        const resolvedGrade = studentSession?.gradeId ?? user?.grade ?? (user as any)?.gradeLevel ?? (user as any)?.gradeId ?? currentTest?.grade;

        // Fetch questions once we have resolved a grade or when currentTest details are fully loaded
        if (resolvedGrade || currentTest) {
            fetchQuestions(1, 80, null, testId, resolvedGrade);
        }
    }, [testId, user, studentSession, currentTest, fetchQuestions, testQuestions.length]);


    // Cleanup camera on page unmount
    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

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
        if (!testId || !user?.id || isSubmitting) return;
        useTestStore.setState({ isSubmitting: true });
        try {
            await submitTest(testId, String(user.id));
            toast({
                title: "Test Auto-Submitted",
                description: "Time's up! Your test has been automatically submitted.",
            });
            stopCamera();
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
        if (!testId || !user?.id || isSubmitting) return false;
        useTestStore.setState({ isSubmitting: true });
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
        if (!testId || !user?.id || isSubmitting) return;

        const hasAnswers = userAnswers.size > 0;

        if (!hasAnswers) {
            // No answers, just exit
            try {
                await exitFullScreen();
                stopCamera();
                resetTestState();
                toast({
                    title: "Assessment Exited",
                    description: "You have left the assessment without submitting any answers.",
                });
                navigate("/student/dashboard");
            } catch (err) {
                console.error("Exit error:", err);
                navigate("/student/dashboard");
            }
            return;
        }

        useTestStore.setState({ isSubmitting: true });
        setCurrentStep(0);

        try {
            await exitFullScreen();
            await submitTest(testId, String(user.id));
            stopCamera();
            resetTestState();
            toast({
                title: "Test Submitted",
                description: "Your test has been submitted successfully.",
            });
            navigate("/results");
        } catch (err) {
            console.error("Exit submission error:", err);
            useTestStore.setState({ isSubmitting: false });
            setCurrentStep(2);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "Failed to submit test. Please try again.",
            });
        }
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
            // Reset to first page when starting — data should already be in store from mount effect
            useTestStore.setState({ currentPage: 1 });
            setCurrentStep(2);

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

    // Get current set of questions for the current page (Frontend Pagination)
    const paginatedQuestions = (testQuestions || []).slice(
        (currentPage - 1) * questionsPerPage,
        currentPage * questionsPerPage
    );

    const currentQuestion = paginatedQuestions[0] || null;

    const handleNextQuestion = async () => {
        if (hasNext) {
            const nextPage = currentPage + 1;
            useTestStore.setState({ currentPage: nextPage });

            if (questionsContainerRef.current) {
                questionsContainerRef.current.scrollTop = 0;
            }
        }
    };

    const handlePreviousQuestion = async () => {
        if (hasPrevious) {
            const prevPage = currentPage - 1;
            useTestStore.setState({ currentPage: prevPage });

            if (questionsContainerRef.current) {
                questionsContainerRef.current.scrollTop = 0;
            }
        }
    };

    const handlePageNavigation = async (pageNumber: number) => {
        if (pageNumber === currentPage || pageNumber < 1 || pageNumber > computedTotalPages) return;
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

        // Use the store's current state to check if already submitting
        if (useTestStore.getState().isSubmitting) return;

        // Set state to show loader
        useTestStore.setState({ isSubmitting: true });
        setCurrentStep(0);
        
        // Small delay to ensure React cycles and shows the premium loader in TestDetail
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            await exitFullScreen();
            await submitTest(testId, String(user.id));

            toast({
                title: "Test Submitted Successfully",
                description: "Thank you for completing the test!"
            });

            stopCamera();
            navigate("/results");
            resetTestState();

        } catch (err: any) {
            console.error("Test submission error:", err);

            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: err.message || "Please try again. Your answers are saved locally."
            });

            useTestStore.setState({ isSubmitting: false });
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
                        stopCamera();
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

        if (computedTotalPages <= maxVisiblePages) {
            for (let i = 1; i <= computedTotalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(computedTotalPages);
            } else if (currentPage >= computedTotalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = computedTotalPages - 3; i <= computedTotalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(computedTotalPages);
            }
        }
        return pages;
    };

    return {
        // State
        testId,
        currentTest,
        testQuestions: paginatedQuestions,
        currentPage,
        totalPages: computedTotalPages,
        hasNext,
        hasPrevious,
        timeRemaining,
        isSubmitting,
        isFullScreen,
        currentStep,
        testTakingLoading,
        loading,
        testTakingError,
        currentQuestion,
        testContainerRef,
        questionsContainerRef,
        hasAnswers: userAnswers.size > 0,


        // Functions
        formatTime,
        enterFullScreen,
        exitFullScreen,
        handleContinueToNextStep,
        handleBackToPrevStep,
        handleStartTest,
        handleNextQuestion,
        handlePreviousQuestion,
        handlePageNavigation,
        handleSubmitTest,
        handleExitTest,
        getPageNumbers,
        getCurrentAnswer,
        setAnswerLocally,
        navigate,
        mediaStreamRef,
        stopCamera
    };
};
