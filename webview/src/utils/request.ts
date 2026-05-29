import {
  CustomAxiosRequestConfig,
  CustomInternalAxiosRequestConfig,
  ResponseResult,
} from "@/types/request";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "./cookie";

class Axios {
  private instance: AxiosInstance;
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.interceptors();
  }
  private interceptors() {
    this.interceptorsRequest();
    this.interceptorsResponse();
  }
  public request<D>(config: CustomAxiosRequestConfig): Promise<D> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.instance.request<D>(config);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  }
  private interceptorsRequest() {
    // 添加请求拦截器
    this.instance.interceptors.request.use(
      function (config: CustomInternalAxiosRequestConfig) {
        // 判断是否需要加时间戳
        const currentTime = new Date().getTime();
        if (config.isTimestamp) {
          const appendTimestamp = {
            get: () => {
              config.params = {
                ...config.params,
                timestamp: currentTime,
              };
            },
            post: () => {
              config.data = {
                ...config.data,
                timestamp: currentTime,
              };
            },
          }[config.method as "get" | "post"];
          appendTimestamp?.();
        }
        // 设置cookie
        const cookie = getCookie();
        if (cookie) {
          config.headers.Cookie = cookie;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }
  private interceptorsResponse() {
    // 添加响应拦截器
    this.instance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }
}
const http = new Axios({
  baseURL: "http://127.0.0.1:3000",
  timeout: 30000,
  withCredentials: true,
});
export default http;
