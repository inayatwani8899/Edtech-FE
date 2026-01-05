import Swal from 'sweetalert2';

// Custom configuration for SweetAlert2
export const swalConfig = {
  success: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#f0f9ff',
      iconColor: '#10b981',
    });
  },
  
  error: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      timer: 5000,
      showConfirmButton: true,
      toast: true,
      position: 'top-end',
      background: '#fef2f2',
      iconColor: '#ef4444',
    });
  },
  
  warning: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      timer: 4000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#fffbeb',
      iconColor: '#f59e0b',
    });
  },
  
  info: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      timer: 4000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#f0f9ff',
      iconColor: '#3b82f6',
    });
  },
};