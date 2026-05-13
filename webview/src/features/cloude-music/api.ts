import http from "@/utils/request";
import {
  LoginParams,
  RecommendPlaylistResponse,
  DetailPlayListParams,
  PlaylistParams,
  MusicUrlParams,
  MusicUrlItem,
  LoginResponse,
  QRCodeParams,
  LoginUserInfoResponse,
  AccountDetailResult,
} from "./type";
import { ResponseResult } from "@/types/request";
// 退出登录
export const logoutApi = async () => {
  return http.request({
    url: "/logout",
    method: "POST",
  });
};
// 获取手机验证码
export const getCaptchaApi = async (params: LoginParams) => {
  return http.request<{}>({
    url: "/captcha/sent",
    method: "GET",
    params,
  });
};

// 验证验证码
export const verifyCaptchaApi = async (params: LoginParams) => {
  return http.request<LoginParams, ResponseResult<boolean>>({
    url: "/captcha/verify",
    method: "POST",
    params,
  });
};
// 登录
export const loginApi = async (params: LoginParams) => {
  return http.request<LoginParams, LoginResponse>({
    url: "/login/cellphone",
    method: "POST",
    params,
  });
};
// 生成二维码key
export const queryQRCodeKeyApi = async (params: { timestamp: number }) => {
  return http.request<{ timestamp: number }, ResponseResult<{ code: number; unikey: string }>>({
    url: "/login/qr/key",
    method: "GET",
    params,
  });
};
// 二维码生成
export const queryQRCodeBase64Api = async (params: QRCodeParams) => {
  return http.request<QRCodeParams, ResponseResult<{ qrimg: string; qrurl: string }>>({
    url: "/login/qr/create",
    method: "GET",
    params,
  });
};
// 二维码检测扫码状态
export const checkQRCodeApi = async (params: QRCodeParams) => {
  return http.request<QRCodeParams, { code: number; cookie: string; message: string }>({
    url: "/login/qr/check",
    method: "GET",
    params,
  });
};
// 推荐歌单
export const getRecommendationPlayListApi = async (params: PlaylistParams = { limit: 30 }) => {
  return http.request<PlaylistParams, RecommendPlaylistResponse>({
    url: "/personalized",
    method: "GET",
    params,
  });
};
// 歌单详情
export const getDetailPlayList = async (params: DetailPlayListParams) => {
  return http.request<DetailPlayListParams, any>({
    url: "/playlist/detail",
    method: "GET",
    params,
  });
};
// 获取音乐url
export const getMusicUrlApi = async (params: MusicUrlParams) => {
  return http.request<DetailPlayListParams, ResponseResult<MusicUrlItem[]>>({
    url: "/song/url/v1",
    method: "GET",
    params,
  });
};
// 登录状态
export const getLoginStatusApi = async (params: { timestamp: number; ua: string }) => {
  return http.request<{ timestamp: number; ua: string }, LoginUserInfoResponse>({
    url: "/login/status",
    method: "POST",
    params,
  });
};
// 获取用户详情
export const getUserInfoApi = async (params: { timestamp: number; uid: number }) => {
  return http.request<{ timestamp: number; uid: number }, any>({
    url: "/user/detail",
    method: "GET",
    params,
  });
};
// 获取账号信息
export const getAccountInfoApi = async (params: { timestamp: number }) => {
  return http.request<{ timestamp: number }, AccountDetailResult>({
    url: "/user/account",
    method: "GET",
    params,
  });
};
// 获取用户信息 , 歌单，收藏，mv, dj 数量
export const getUserPlayList = async (params: { timestamp: number }) => {
  return http.request<{ timestamp: number }, any>({
    url: "/user/subcount",
    method: "GET",
    params,
  });
};
