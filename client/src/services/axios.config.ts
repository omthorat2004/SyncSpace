import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"

declare module "axios" {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean
  }

  export interface InternalAxiosRequestConfig {
    requiresAuth?: boolean
    _retry?: boolean
  }
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
let isRefreshing = false
let subscribers: Array<() => void> = []

const subscribe = (callback: () => void) => {
  subscribers.push(callback)
}

const notifySubscribers = () => {
  subscribers.forEach((cb) => cb())
  subscribers = []
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig

    if (
      error.response?.status === 401 &&
      originalRequest?.requiresAuth &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true


      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribe(() => {
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {

        await axios.post(
          `${API_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        )


        notifySubscribers()


        return axiosInstance(originalRequest)
      } catch (refreshError) {

        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance