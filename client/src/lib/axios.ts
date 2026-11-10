import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export class HttpClient {
  private readonly client: AxiosInstance;
  private onSessionExpired: () => void = () => {};

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  setSessionExpiredHandler(handler: () => void) {
    this.onSessionExpired = handler;
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const { data } = await this.client.get<T>(url, config);
    return data;
  }

  async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const { data } = await this.client.post<T>(url, body, config);
    return data;
  }

  async put<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const { data } = await this.client.put<T>(url, body, config);
    return data;
  }

  async patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const { data } = await this.client.patch<T>(url, body, config);
    return data;
  }

  async delete<T = void>(url: string, config?: AxiosRequestConfig) {
    const { data } = await this.client.delete<T>(url, config);
    return data;
  }

  private setupRequestInterceptor() {
    this.client.interceptors.request.use((config) => {
      config.headers.set("X-Requested-With", "XMLHttpRequest");
      return config;
    });
  }

  private setupResponseInterceptor() {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) this.onSessionExpired();
        return Promise.reject(error);
      },
    );
  }
}

export const http = new HttpClient("/api");
