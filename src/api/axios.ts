import axios from "axios";
import Swal from 'sweetalert2';
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://charming-bohr.180-179-213-167.plesk.page/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - dynamically switches baseURL based on endpoint path
api.interceptors.request.use(
    (config) => {
        const url = config.url || "";
        const lowerUrl = url.toLowerCase();
        
        // Use Org/SuperAdmin/Student server for Auth, Organization, SuperAdmin, TenantSync, and Student Module APIs
        if (
            lowerUrl.includes("organization") || 
            lowerUrl.includes("auth") || 
            lowerUrl.includes("superadmin") || 
            lowerUrl.includes("tenantsync") ||
            lowerUrl.includes("student") ||
            lowerUrl.includes("payment") ||
            lowerUrl.includes("question") ||
            lowerUrl.includes("test")
        ) {
            config.baseURL = import.meta.env.VITE_ORG_API_BASE_URL || "https://nervous-dubinsky.180-179-213-167.plesk.page/api/";
        } else {
            config.baseURL = import.meta.env.VITE_API_BASE_URL || "https://charming-bohr.180-179-213-167.plesk.page/api/";
        }

        const token = localStorage.getItem("auth_token") || localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const tenant = localStorage.getItem("tenantName");
        if (tenant) {
            config.headers["tenant"] = tenant;
            config.headers["X-Tenant-Name"] = tenant;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - enhanced with Sweet Alert
// api.interceptors.response.use(
//     (response) => {
//         debugger
//         // Show success messages for non-GET requests
//         if (['post', 'put', 'patch', 'delete'].includes(response.config.method?.toLowerCase() || '')) {
//             const message = getSuccessMessage(response.config.method?.toLowerCase(), response.status, response.data?.message);
//             if (message) {
//                 Swal.fire({
//                     title: 'Success!',
//                     text: message,
//                     icon: 'success',
//                     timer: 3000,
//                     showConfirmButton: false,
//                     toast: true,
//                     position: 'top-end',
//                 });
//             }
//         }

//         // Also show custom success messages from API response
//         if (response.data?.message && response.config.method?.toLowerCase() !== 'get') {
//             Swal.fire({
//                 title: 'Success!',
//                 text: response.data.message,
//                 icon: 'success',
//                 timer: 3000,
//                 showConfirmButton: false,
//                 toast: true,
//                 position: 'top-end',
//             });
//         }

//         return response;
//     },
//     (error) => {
//         const { response } = error;
//         const status = response?.status;
//         // Keep your existing 401 handling
//         if (status === 401) {
//             console.log("Unauthorized, redirecting to login...");
//             // handle logout or redirect to login
//         }

//         // Show error message with Sweet Alert
//         const message = getErrorMessage(status, response?.data?.message);

//         Swal.fire({
//             title: 'Error!',
//             text: message,
//             icon: 'error',
//             timer: 5000,
//             showConfirmButton: true,
//             toast: true,
//             position: 'top-end',
//         });

//         return Promise.reject(error);
//     }
// );
api.interceptors.response.use(
    (response) => {
        const backendCode = response?.data?.code;
        const backendMessage = response?.data?.message;
        const method = response.config.method?.toLowerCase();
        const isAuthRequest = response?.config?.url?.toLowerCase().includes("auth");
        const skipToast = response.config?.headers?.['x-skip-toast'] === 'true' || (response.config as any)?.skipToast;

        // ✅ If backend sends code >= 400, treat it as error manually
        if (backendCode && backendCode >= 400) {
            if (!isAuthRequest && !skipToast) {
                toast.error(backendMessage || 'Something went wrong on the server.');
            }

            // Reject promise to prevent "success" flow from continuing
            return Promise.reject({
                response: {
                    status: backendCode,
                    data: response.data,
                },
            });
        }

        // ✅ Show success message for non-GET requests
        if (!isAuthRequest && ['post', 'put', 'patch', 'delete'].includes(method || '')) {
            const message = getSuccessMessage(method, response.status, backendMessage);
            if (message && !skipToast) {
                toast.success(message);
            }
        }

        return response;
    },
    (error) => {
        const { response } = error;
        const status = response?.status;
        const message = response?.data?.message || getErrorMessage(status);
        const isAuthRequest = error?.config?.url?.toLowerCase().includes("auth") || response?.config?.url?.toLowerCase().includes("auth");
        const skipToast = error?.config?.headers?.['x-skip-toast'] === 'true' || (error?.config as any)?.skipToast;

        // 🚨 Session Expiry Handling
        if (!isAuthRequest && (status === 401 || response?.data?.code === 401)) {
            Swal.fire({
                title: 'Session Expired',
                text: 'Your current session has ended. Please sign in again to continue.',
                icon: 'warning',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Re-authenticate',
                allowOutsideClick: false,
                background: '#0f172a',
                color: '#fff',
            }).then(() => {
                useAuthStore.getState().logout();
                window.location.href = "/login";
            });
            return Promise.reject(error);
        }

        if (!isAuthRequest && !skipToast) {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

// Helper function to get success messages
const getSuccessMessage = (method: string | undefined, status: number, customMessage?: string): string | null => {
    if (customMessage) {
        return customMessage;
    }

    if (status >= 200 && status < 300) {
        switch (method) {
            case 'post':
                return 'Item created successfully!';
            case 'put':
            case 'patch':
                return 'Item updated successfully!';
            case 'delete':
                return 'Item deleted successfully!';
            default:
                return null;
        }
    }
    return null;
};

// Helper function to get error messages based on status code
const getErrorMessage = (status: number | undefined, customMessage?: string): string => {
    if (customMessage) {
        return customMessage;
    }

    switch (status) {
        case 400:
            return 'Bad Request. Please check your input.';
        case 401:
            return 'Unauthorized. Please login again.';
        case 403:
            return 'Forbidden. You do not have permission to perform this action.';
        case 404:
            return 'Resource not found.';
        case 409:
            return 'Conflict. This item already exists.';
        case 422:
            return 'Validation error. Please check your input.';
        case 429:
            return 'Too many requests. Please try again later.';
        case 500:
            return 'Internal server error. Please try again later.';
        case 502:
            return 'Bad gateway. Please try again later.';
        case 503:
            return 'Service unavailable. Please try again later.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};

export default api;