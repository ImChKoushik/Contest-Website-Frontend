import { useToast } from '../context/ToastContext';
import Toast from './Toast';

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-24 right-5 z-[9999] flex flex-col items-end pointer-events-none">
            {toasts.map((toast) => (
                <Toast 
                    key={toast.id}
                    {...toast}
                    onRemove={removeToast}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
