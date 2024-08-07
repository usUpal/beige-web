import Swal from 'sweetalert2';

export const swalToast = (color: any, message: string) => {
  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    showCloseButton: true,
    customClass: {
      popup: `color-${color}`,
    },
  });
  toast.fire({
    title: message,
  });
};
