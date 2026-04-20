import axios from 'axios';

const BASE_URL = 'https://contest-backend-td3m.onrender.com/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // still send cookies if present
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────────
// For most endpoints: send Authorization: Bearer <accessToken>
// For /generate-access specifically: send Authorization: Bearer <refreshToken>
// because the backend's refreshAccessToken controller reads:
//   req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "")
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Check if this is a refresh call
    const isRefreshCall = config.url?.includes('generate-access') || config.url?.includes('refresh-token');
    const accessToken = localStorage.getItem('authToken');
    const isCrisis = localStorage.getItem('session_crisis') === 'true';

    // 2. BLOCK background requests during a session crisis or if no token exists
    // This prevents background tasks from firing 401s/500s 
    // and invalidating the refresh token while we wait for the user.
    if (!isRefreshCall && (isCrisis || !accessToken)) {
      const cancelError = new Error('Auth Lock: Request frozen to prevent session conflict.');
      cancelError.isAuthBlock = true; 
      return Promise.reject(cancelError);
    }

    if (isRefreshCall) {
      // For refresh calls, use ONLY the refreshToken. Clear any existing Auth header first.
      delete config.headers['Authorization'];
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        config.headers['Authorization'] = `Bearer ${refreshToken}`;
      }
    } else {
      // 3. For ALL other calls, use the fresh authToken if available
      if (!config.headers['Authorization'] && accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────
// On 401: do NOT auto-refresh. Just notify the UI to show "Login Again".
// The only silent refresh happens when the user manually clicks "Login Again".
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const isAuthError = error.response?.status === 401;
    
    // Check if the request is to a sensitive auth endpoint
    const url = originalRequest.url || '';
    const isAuthEndpoint = 
      url.includes('generate-access') || 
      url.includes('refresh-token') || 
      url.includes('login-user') || 
      url.includes('logout-user') ||
      url.includes('user/me'); // /user/me is used during refresh check

    if (isAuthError && !isAuthEndpoint) {
      // Signal UI to show "Renew Session" button
      localStorage.setItem('session_crisis', 'true');
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

