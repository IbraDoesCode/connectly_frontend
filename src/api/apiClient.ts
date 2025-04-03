import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://127.0.0.1:8000",
});

// Request interceptor to inject token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    console.log(`Token retreived from localstorage: ${token}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
