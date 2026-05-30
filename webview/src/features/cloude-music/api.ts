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
  UserPlaylistResponse,
  ToplistResponse,
} from "./type";
import { ResponseResult } from "@/types/request";
import { bridgeRequest } from "@/services/bridgeRequset";
// 退出登录
export const logoutApi = async () => {
  return http.request<{ code: number }>({
    url: "/logout",
    method: "POST",
  });
};
// 获取手机验证码
export const getCaptchaApi = async (params: LoginParams) => {
  return http.request<ResponseResult<boolean>>({
    url: "/captcha/sent",
    method: "GET",
    params,
  });
};

// 验证验证码
export const verifyCaptchaApi = async (data: LoginParams) => {
  return http.request<ResponseResult<boolean>>({
    url: "/captcha/verify",
    method: "POST",
    data,
  });
};
// 登录
export const loginApi = async (data: LoginParams) => {
  return http.request<LoginResponse>({
    url: "/login/cellphone",
    method: "POST",
    data,
  });
};
// 生成二维码key
export const queryQRCodeKeyApi = async () => {
  return http.request<ResponseResult<{ code: number; unikey: string }>>({
    url: "/login/qr/key",
    method: "GET",
    isTimestamp: true,
  });
};
// 二维码生成
export const queryQRCodeBase64Api = async (params: QRCodeParams) => {
  return http.request<ResponseResult<{ qrimg: string; qrurl: string }>>({
    url: "/login/qr/create",
    method: "GET",
    params,
  });
};
// 二维码检测扫码状态
export const checkQRCodeApi = async (params: QRCodeParams) => {
  return http.request<{ code: number; cookie: string; message: string }>({
    url: "/login/qr/check",
    method: "GET",
    params,
    isTimestamp: true,
  });
};
// 推荐歌单
export const getRecommendationPlayListApi = async (params: PlaylistParams = { limit: 30 }) => {
  return http.request<RecommendPlaylistResponse>({
    url: "/personalized",
    method: "GET",
    params,
    isTimestamp: true,
  });
};
// 歌单详情
export const getDetailPlayList = async (params: DetailPlayListParams) => {
  return http.request<any>({
    url: "/playlist/detail",
    method: "GET",
    params,
  });
};
// 获取音乐url
export const getMusicUrlApi = async (params: MusicUrlParams) => {
  return http.request<ResponseResult<MusicUrlItem[]>>({
    url: "/song/url/v1",
    method: "GET",
    params,
  });
};
// 登录状态
export const getLoginStatusApi = async (data: { ua: string }) => {
  return http.request<LoginUserInfoResponse>({
    url: "/login/status",
    method: "POST",
    data,
    isTimestamp: true,
  });
};
// 获取用户详情
export const getUserInfoApi = async (params: { uid: number }) => {
  return http.request<any>({
    url: "/user/detail",
    method: "GET",
    params,
    isTimestamp: true,
  });
};
// 获取账号信息
export const getAccountInfoApi = async () => {
  return http.request<AccountDetailResult>({
    url: "/user/account",
    method: "GET",
    isTimestamp: true,
  });
};
// 获取用户信息 , 歌单，收藏，mv, dj 数量
// export const getUserPlayList = async () => {
//   return http.request<any>({
//     url: "/user/subcount",
//     method: "GET",
//     isTimestamp: true,
//   });
// };

// 获取用户歌单
export const getPlayList = async (params: { uid: number }) => {
  return http.request<UserPlaylistResponse>({
    url: "/user/playlist",
    method: "GET",
    params,
  });
};
// 获取所有榜单
export const getTopList = async () => {
  return http.request<ToplistResponse>({
    url: "/toplist",
    method: "GET",
  });
};
