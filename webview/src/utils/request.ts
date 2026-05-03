import { ResponseResult } from "@/types/request";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

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
  public request<T, D = ResponseResult<T>>(
    config: AxiosRequestConfig,
  ): Promise<D> {
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
      function (config) {
        // config.headers = {
        //   Authorization: `Bearer ${JSON.parse(localStorage.getItem(CacheEnum.TOKEN_NAME)!)[CacheEnum.TOKEN_NAME]}`
        // } as AxiosRequestHeaders;
        // 在发送请求之前做些什么
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
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
      },
    );
  }
}
const http = new Axios({
  baseURL: "http://127.0.0.1:3000",
  timeout: 30000,
});
export default http;
