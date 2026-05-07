import http from "@/utils/request";
import {
  LoginParams,
  RecommendPlaylistResponse,
  DetailPlayListParams,
  PlaylistParams,
  MusicUrlParams,
  MusicUrlItem,
  LoginResponse,
} from "./type";
import { ResponseResult } from "@/types/request";
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

// 推荐歌单
export const getRecommendationPlayListApi = async (
  params: PlaylistParams = { limit: 30 },
) => {
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

