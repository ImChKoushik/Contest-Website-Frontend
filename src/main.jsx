import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import axios from 'axios'

// Configure global axios interceptor for token-based auth
axios.interceptors.request.use(
  (config) => {
    // Skip adding Bearer token for the refresh route to avoid 401 conflicts
    const isRefreshRoute = config.url.includes('generate-access') || config.url.includes('refresh-token');
    
    const token = localStorage.getItem('authToken');
    if (token && token !== "undefined" && token !== "null" && !isRefreshRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true; // Still send cookies if set
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
