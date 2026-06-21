import * as vscode from "vscode";
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isTimestamp?: boolean;
}
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  isTimestamp?: boolean;
}
const COOKIE_KEY = "music.cookie";

const COOKIE_ATTRIBUTE_NAMES = new Set([
  "domain",
  "expires",
  "httponly",
  "max-age",
  "path",
  "samesite",
  "secure",
]);

function normalizeCookie(cookie: string): string {
  const cookieJar = new Map<string, string>();

  cookie
    .replace(/^cookie:\s*/i, "")
    .split(";")
    .map(item => item.trim())
    .filter(Boolean)
    .forEach(item => {
      const splitIndex = item.indexOf("=");
      if (splitIndex <= 0) {
        return;
      }

      const name = item.slice(0, splitIndex).trim();
      if (!name || COOKIE_ATTRIBUTE_NAMES.has(name.toLowerCase())) {
        return;
      }

      cookieJar.set(name, `${name}=${item.slice(splitIndex + 1).trim()}`);
    });

  return Array.from(cookieJar.values()).join("; ");
}

export class BridgeHttpClient {
  private instance: AxiosInstance;
  constructor(private readonly secrets: vscode.SecretStorage) {
    this.instance = axios.create({
      baseURL: "http://127.0.0.1:3000",
      timeout: 30000,
    });
    this.interceptors();
  }
  private async saveCookie(response: axios.AxiosResponse) {
    if (
      response.config.url === "/login/qr/check" &&
      response.data.code === 803 &&
      typeof response.data.cookie === "string"
    ) {
      const cookie = normalizeCookie(response.data.cookie);
      if (cookie) {
        await this.secrets.store(COOKIE_KEY, cookie);
      }
    }
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
      async (config: CustomInternalAxiosRequestConfig) => {
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
        // 请求头加cookie
        const cookie = await this.secrets.get(COOKIE_KEY);
        if (cookie) {
          config.headers.set("Cookie", cookie);
        }

        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
  private interceptorsResponse() {
    // 添加响应拦截器
    this.instance.interceptors.response.use(
      async (response: axios.AxiosResponse) => {
        await this.saveCookie(response);
        return response;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
}
