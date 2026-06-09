import { toast, ToastOptions } from "react-toastify";
import { CustomToast } from "@/app/[locale]/components/ui/CustomToast";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "light",
  closeButton: false,
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(
      ({ closeToast }) => (
        <CustomToast message={message} type="success" closeToast={closeToast} />
      ),
      { ...defaultOptions, ...options },
    );
  },
  error: (message: string, options?: ToastOptions) => {
    return toast.error(
      ({ closeToast }) => (
        <CustomToast message={message} type="error" closeToast={closeToast} />
      ),
      { ...defaultOptions, ...options },
    );
  },
};
