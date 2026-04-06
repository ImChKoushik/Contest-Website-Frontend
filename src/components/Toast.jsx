import { useEffect, useState } from 'react';

const Toast = ({ id, message, type, duration, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, duration - 300); // Start exit animation 300ms before duration ends

        return () => clearTimeout(timer);
    }, [duration]);

    // Handle manual close
    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(id), 300);
    };

    const getTypeStyles = () => {
        switch (type) {
            case 'error':
                return {
                    bg: 'bg-red-50/90 border-red-200/50',
                    icon: 'text-red-500 bg-red-100',
                    progress: 'bg-red-500',
                    shadow: 'shadow-[0_10px_30px_-10px_rgba(239,68,68,0.2)]'
                };
            case 'warning':
                return {
                    bg: 'bg-amber-50/90 border-amber-200/50',
                    icon: 'text-amber-500 bg-amber-100',
                    progress: 'bg-amber-500',
                    shadow: 'shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)]'
                };
            default: // success
                return {
                    bg: 'bg-white/90 border-[#8cc63f]/20',
                    icon: 'text-[#8cc63f] bg-[#8cc63f]/10',
                    progress: 'bg-[#8cc63f]',
                    shadow: 'shadow-[0_10px_30px_-10px_rgba(140,198,63,0.2)]'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div 
            className={`
                relative mb-3 flex items-center gap-3 p-4 pr-10 rounded-2xl border backdrop-blur-md 
                ${styles.bg} ${styles.shadow} 
                min-w-[320px] max-w-[450px] overflow-hidden pointer-events-auto
                ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}
            `}
        >
            {/* Type Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${styles.icon}`}>
                {type === 'error' ? '✕' : type === 'warning' ? '⚠' : '✓'}
            </div>

            {/* Message */}
            <div className="flex-grow">
                <p className="text-gray-800 font-bold text-[14px] leading-tight tracking-tight">
                    {message}
                </p>
                <p className="text-gray-500 text-[11px] font-medium mt-0.5 uppercase tracking-wider opacity-60">
                    {type === 'error' ? 'Action Failed' : 'Notification'}
                </p>
            </div>

            {/* Close Button */}
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-black/5">
                <div 
                    className={`h-full ${styles.progress} animate-progress`}
                    style={{ animationDuration: `${duration}ms` }}
                />
            </div>
        </div>
    );
};

export default Toast;
