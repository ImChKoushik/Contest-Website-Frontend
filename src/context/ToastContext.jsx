import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "success", duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        
        // Suppress toast for JWT expiry and Auth Lock events (handled gracefully by Navbar)
        const lowerMsg = message?.toString().toLowerCase() || "";
        if (lowerMsg.includes("jwt expired") || lowerMsg.includes("auth lock")) return;

        setToasts((prev) => [...prev, { id, message, type, duration }]);

        // Auto-remove toast after duration
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
            {children}
        </ToastContext.Provider>
    );
};
