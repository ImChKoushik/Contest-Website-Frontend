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
    const isRefreshCall = config.url?.includes('generate-access');

    if (isRefreshCall) {
      // Send the refresh token as Bearer for this endpoint
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        config.headers['Authorization'] = `Bearer ${refreshToken}`;
      }
    } else {
      // Send the access token as Bearer for all other endpoints
      const accessToken = localStorage.getItem('authToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────
// On 401 from any endpoint (except the refresh itself), try to silently
// refresh the access token using the stored refresh token, then retry.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry on 401, and not for the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('generate-access') &&
      !originalRequest.url?.includes('login-user')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      // ── Case 1: No refresh token stored (old session / not yet logged in fresh) ──
      // If a user is stored in localStorage, their session has expired → signal the UI.
      // If there's no user at all, they were never logged in — just reject silently.
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        const hasUser = localStorage.getItem('authUser');
        if (hasUser) {
          // Clear stale access token but keep user data so Navbar shows the greeting
          localStorage.removeItem('authToken');
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
        return Promise.reject(error);
      }

      // ── Case 2: Refresh token exists — try to get a new access token ──
      try {
        // axiosInstance request interceptor will attach Bearer <refreshToken> automatically
        const refreshRes = await axiosInstance.get('/user/generate-access');

        const newAccessToken =
          refreshRes.data?.data?.accessToken ||
          refreshRes.data?.accessToken ||
          null;

        const newRefreshToken =
          refreshRes.data?.data?.refreshToken ||
          refreshRes.data?.refreshToken ||
          null;

        if (newAccessToken) localStorage.setItem('authToken', newAccessToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token was present but server rejected it — user must re-login
        processQueue(refreshError, null);
        
        // Dispatch global event for AuthContext to show "Login Again"
        window.dispatchEvent(new CustomEvent('auth:expired'));
        
        // Clear tokens but KEEP authUser so Navbar can still show the greeting
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
