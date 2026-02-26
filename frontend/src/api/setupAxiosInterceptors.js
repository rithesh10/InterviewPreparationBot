import axios from "axios";
import config from "../config/config";

let isInitialized = false;
let refreshPromise = null;

function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

async function refreshToken() {
  const storedRefreshToken = localStorage.getItem("refreshToken");
  if (!storedRefreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(
    `${config.backendUrl}/users/refresh-token`,
    { refreshToken: storedRefreshToken },
    { skipAuthRefresh: true }
  );

  const nextAccessToken = response?.data?.accessToken;
  const nextRefreshToken = response?.data?.refreshToken;

  if (!nextAccessToken) {
    throw new Error("Refresh endpoint did not return access token");
  }

  localStorage.setItem("accessToken", nextAccessToken);
  if (nextRefreshToken) {
    localStorage.setItem("refreshToken", nextRefreshToken);
  }

  return nextAccessToken;
}

export function setupAxiosInterceptors() {
  if (isInitialized) return;
  isInitialized = true;

  axios.interceptors.request.use(
    (requestConfig) => {
      const token = localStorage.getItem("accessToken");
      const isBackendRequest =
        typeof requestConfig.url === "string" &&
        requestConfig.url.startsWith(config.backendUrl);

      if (token && isBackendRequest) {
        requestConfig.headers = requestConfig.headers || {};
        if (!requestConfig.headers.Authorization) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }

      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const code = error?.response?.data?.data?.code;
      const originalRequest = error?.config || {};

      if (
        status === 401 &&
        code === "TOKEN_EXPIRED" &&
        !originalRequest._retry &&
        !originalRequest.skipAuthRefresh
      ) {
        originalRequest._retry = true;

        try {
          if (!refreshPromise) {
            refreshPromise = refreshToken().finally(() => {
              refreshPromise = null;
            });
          }

          const nextAccessToken = await refreshPromise;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          clearAuthSession();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      if (status === 401) {
        if (
          code === "TOKEN_EXPIRED" ||
          code === "TOKEN_INVALID" ||
          code === "TOKEN_MISSING" ||
          code === "REFRESH_TOKEN_EXPIRED" ||
          code === "REFRESH_TOKEN_INVALID" ||
          code === "REFRESH_TOKEN_REVOKED" ||
          code === "REFRESH_TOKEN_MISSING"
        ) {
          clearAuthSession();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }

      return Promise.reject(error);
    }
  );
}
