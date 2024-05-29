import toast from "react-hot-toast";

export const errorAlert = (message: string) => {
  toast.error(message, { duration: 4000 });
}

export const successAlert = (message: string) => {
  toast.success(message, { duration: 4000 });
}