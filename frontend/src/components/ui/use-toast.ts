import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    toast: (message: string, options?: { description?: string; id?: string }) => {
      if (options?.description) {
        return toast(`${message}\n${options.description}`, { id: options.id });
      }
      return toast(message, { id: options?.id });
    },
    dismiss: (toastId?: string) => toast.dismiss(toastId),
  };
};

export { toast };
export default useToast;
