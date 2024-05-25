import toast from "react-hot-toast";

export const errorAlert = (message: string) => {
  toast.error(message, { duration: 5000 });
}