import http from "@/utils/request";
import { LoginParams } from "./type";

export const loginApi = async (params: LoginParams) => {
    return http.request<{}>({
        url: '/captcha/sent',
        method: 'GET',
        params
    });
};
