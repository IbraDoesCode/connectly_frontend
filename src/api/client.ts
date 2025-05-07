import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to inject token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add interceptor to refresh token
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        const res = await client.post("/token/refresh/", {
          refresh: refreshToken,
        });

        const { access, refresh: newRefresh } = res.data;
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", newRefresh);

        client.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        return client(originalRequest);
      } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
