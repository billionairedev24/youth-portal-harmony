
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";

const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: '/api', // Proxy handled by Vite config
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    ...config
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = createAxiosInstance();


export type ApiError = AxiosError<{ message?: string }>;
