// 获取验证码
export interface LoginParams {
    phone: string;
}

// 推荐歌单
export interface PlaylistParams {
    limit: number
}
export interface PlaylistItem {
    id: number
    type: number
    name: string
    copywriter: string
    picUrl: string
    canDislike: boolean
    trackNumberUpdateTime: number
    playCount: number
    trackCount: number
    highQuality: boolean
    alg: string
}

// 获取歌单详情
export interface DetailPlayListParams {
    id: number
}