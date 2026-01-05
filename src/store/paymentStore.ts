import { create } from "zustand";
import api from "@/api/axios";
import Swal from 'sweetalert2';
import { useAuthStore } from "./useAuthStore";

// Define test object
interface TestDetails {
    id: string;
    price: number;
    userName?: string;
    userEmail?: string;
}

// interface PaymentState {
//     loading: boolean;
//     paidTests: Record<string, boolean>; // Track which test IDs are paid
//     handlePayment: (test: TestDetails) => Promise<{ success: boolean; testId?: string }>;
// }
interface PaymentState {
    loading: boolean;
    paidTests: {
        [userId: string]: {
            [testId: string]: boolean;
        };
    };
    clearPaidTests: (userId?: string) => void;
    clearPaidTest: (userId: string, testId: string) => void;
    markTestAsPaid: (userId: string, testId: string) => void;
    isTestPaid: (userId: string, testId: string) => Promise<boolean>;
    handlePayment: (test: TestDetails) => Promise<{ success: boolean; testId?: string }>;
}

interface TestDetails {
    id: string;
    price: number;
    userName?: string;
    userEmail?: string;
}
// Razorpay on window
declare global {
    interface Window {
        Razorpay: any;
    }
}
export const usePaymentStore = create<PaymentState>((set, get) => ({
    loading: false,
    paidTests: {}, // Structure: { [userId]: { [testId]: boolean } }

    // Clear paid tests for a specific user or all users
    clearPaidTests: (userId?: string) => {
        if (userId) {
            set(state => {
                const newPaidTests = { ...state.paidTests };
                delete newPaidTests[userId];
                return { paidTests: newPaidTests };
            });
        } else {
            set({ paidTests: {} });
        }
    },

    // Clear specific test for a user
    clearPaidTest: (userId: string, testId: string) => {
        set(state => {
            const newPaidTests = { ...state.paidTests };
            if (newPaidTests[userId]) {
                delete newPaidTests[userId][testId];
            }
            return { paidTests: newPaidTests };
        });
    },

    // Mark test as paid for specific user
    markTestAsPaid: (userId: string, testId: string) => {
        set(state => ({
            paidTests: {
                ...state.paidTests,
                [userId]: {
                    ...state.paidTests[userId],
                    [testId]: true
                }
            }
        }));
    },

    // isTestPaid: async (userId: string, testId: string): Promise<boolean> => {
    //     const state = get();

    //     // check from cache first
    //     if (state.paidTests[userId]?.[testId]) {
    //         return true;
    //     }

    //     // otherwise call API
    //     try {
    //         const { data } = await api.get("/Payment/check-access", {
    //             params: { userId, testId },
    //         });

    //         const isPaid = data?.access ?? false;

    //         // save to cache for future calls
    //         set({
    //             paidTests: {
    //                 ...state.paidTests,
    //                 [userId]: {
    //                     ...state.paidTests[userId],
    //                     [testId]: isPaid,
    //                 },
    //             },
    //         });

    //         return isPaid;
    //     } catch (err) {
    //         console.error("Error checking payment access:", err);
    //         return false;
    //     }
    // },
    isTestPaid: async (userId: string, testId: string): Promise<boolean> => {
        const state = get();

        // ✅ Return from cache if available
        if (state.paidTests?.[userId]?.[testId] !== undefined) {
            return !!state.paidTests[userId][testId];
        }

        // Otherwise, call API
        try {
            const { data } = await api.get("/Payment/check-access", {
                params: { userId, testId },
            });
            const isPaid = data?.data?.access;
            // Save result in store for reuse
            set({
                paidTests: {
                    ...state.paidTests,
                    [userId]: {
                        ...state.paidTests[userId],
                        [testId]: isPaid,
                    },
                    isPaid: isPaid
                },
            });

            return isPaid;
        } catch (err) {
            return false;
        }
    },

    handlePayment: async (test: TestDetails) => {
        return new Promise(async (resolve) => {
            const { user } = useAuthStore.getState();

            if (!user?.id) {
                Swal.fire("User not logged in", "Please log in to make a payment.", "error");
                return resolve({ success: false });
            }

            try {
                const { data } = await api.post("/Payment/create-order", {
                    amount: test.price,
                    currency: "INR",
                    testId: test.id,
                    userId: user.id
                });

                const order = data?.data;

                const options = {
                    key: order.key,
                    amount: order.amount,
                    currency: order.currency,
                    order_id: order.orderId,
                    name: "PathGrad Psychometric Testing",
                    description: `Payment for Test ID: ${test.id}`,
                    prefill: {
                        name: test.userName || user.firstName,
                        email: test.userEmail || user.email,
                        contact: user.phone
                    },
                    handler: async (response: any) => {
                        try {
                            const verifyResponse = await api.post("/Payment/verify", {
                                orderId: response.razorpay_order_id,
                                paymentid: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                testId: test.id,
                                userId: user.id
                            });

                            if (verifyResponse.data) {
                                // Mark test as paid for this specific user
                                get().markTestAsPaid(user.id, test.id);
                                Swal.fire({
                                    toast: true,
                                    icon: "success",
                                    title: "Payment completed",
                                    text: "Test activated successfully.",
                                    position: "top-end",
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                });
                                resolve({ success: true, testId: test.id });
                            } else {
                                resolve({ success: false });
                            }
                        } catch (error) {
                            console.error("Payment verification error:", error);
                            resolve({ success: false });
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            Swal.fire("Payment Cancelled", "You closed the payment window.", "info");
                            resolve({ success: false });
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

                rzp.on("payment.failed", function () {
                    Swal.fire("Payment Failed", "Please try again.", "error");
                    resolve({ success: false });
                });
            } catch (error) {
                console.error("Payment initiation error:", error);
                Swal.fire("Error", "Payment could not be started.", "error");
                resolve({ success: false });
            }
        });
    }
}));