import { swalToast } from '../Toast/SwalToast';

export const BookingFormValidator = (error) => {
  const { content_type, content_vertical } = error;
  if (content_type) {
    swalToast('danger', 'Please select your content type');
  } else if (content_vertical) {
    swalToast('danger', 'Please select a category');
  }
};
