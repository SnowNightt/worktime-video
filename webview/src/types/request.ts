import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export interface ResponseResult<T> {
  code: number;
  message?: string;
  data: T;
}
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isTimestamp?: boolean;
}

export interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  isTimestamp?: boolean;
}
