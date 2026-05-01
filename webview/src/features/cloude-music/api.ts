import http from "@/utils/request";
import { LoginParams, PlaylistItem, DetailPlayListParams, PlaylistParams } from "./type";
// 获取手机验证码登录
export const getCaptchaApi = async (params: LoginParams) => {
    return http.request<{}>({
        url: '/captcha/sent',
        method: 'GET',
        params
    });
};

// 推荐歌单
export const getRecommendationPlayListApi = async (params: PlaylistParams = { limit: 30 }) => {
    return http.request<PlaylistParams, PlaylistItem[]>({
        url: '/personalized',
        method: 'GET',
        params
    });
};

export const getDetailPlayList = async (params: DetailPlayListParams) => {
    return http.request<DetailPlayListParams, any>({
        url: '/playlist/detail',
        method: 'GET',
        params
    });
};