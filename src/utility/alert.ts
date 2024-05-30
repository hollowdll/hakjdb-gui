import toast from "react-hot-toast";

export const errorAlert = (message: string) => {
  toast.error(message, { duration: 5000 });
}

export const successAlert = (message: string) => {
  toast.success(message, { duration: 5000 });
}