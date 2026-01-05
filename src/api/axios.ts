import axios from "axios";
import Swal from 'sweetalert2';
const api = axios.create({
    // baseURL: "https://charming-bohr.180-179-213-167.plesk.page/api/",
    baseURL: "https://n2j84dpm-5001.inc1.devtunnels.ms/api/",
    // timeout: 50000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - keep your existing token logic
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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

        // ✅ If backend sends code >= 400, treat it as error manually
        if (backendCode && backendCode >= 400) {
            Swal.fire({
                title: 'Error!',
                text: backendMessage || 'Something went wrong on the server.',
                icon: 'error',
                timer: 5000,
                showConfirmButton: true,
                toast: true,
                position: 'top-end',
            });

            // Reject promise to prevent "success" flow from continuing
            return Promise.reject({
                response: {
                    status: backendCode,
                    data: response.data,
                },
            });
        }

        // ✅ Show success message for non-GET requests
        if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
            const message = getSuccessMessage(method, response.status, backendMessage);
            if (message) {
                Swal.fire({
                    title: 'Success!',
                    text: message,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end',
                });
            }
        }

        return response;
    },
    (error) => {
        const { response } = error;
        const status = response?.status;
        const message = response?.data?.message || getErrorMessage(status);

        Swal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            timer: 5000,
            showConfirmButton: true,
            toast: true,
            position: 'top-end',
        });

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