// 获取验证码
export interface LoginParams {
  phone: string;
}

// 推荐歌单
export interface PlaylistParams {
  limit: number;
  timestamp?: number;
}
export interface RecommendPlaylistResponse {
  hasTaste: boolean;
  code: number;
  category: number;
  result: RecommendPlaylistItem[];
}

export interface RecommendPlaylistItem {
  id: number;
  type: number;
  name: string;
  copywriter: string;
  picUrl: string;
  canDislike: boolean;
  trackNumberUpdateTime: number;
  playCount: number;
  trackCount: number;
  highQuality: boolean;
  alg: string;
}

// 获取歌单详情
export interface DetailPlayListParams {
  id: number;
  timestamp?: number;
}

// 歌单歌曲-start
export interface SongItem {
  name: string;
  mainTitle: string;
  additionalTitle: string;
  id: number;
  pst: number;
  t: number;
  ar: Artist[];
  alia: string[];
  pop: number;
  st: number;
  rt: string;
  fee: number;
  v: number;
  crbt: null;
  cf: string;
  al: Album;
  dt: number;
  h: SongQuality;
  m: SongQuality;
  l: SongQuality;
  sq: SongQuality;
  hr: null;
  a: null;
  cd: string;
  no: number;
  rtUrl: null;
  ftype: number;
  rtUrls: string[];
  djId: number;
  copyright: number;
  s_id: number;
  mark: number;
  originCoverType: number;
  originSongSimpleData: null;
  tagPicList: null;
  resourceState: boolean;
  version: number;
  songJumpInfo: null;
  entertainmentTags: null;
  awardTags: null;
  displayTags: null;
  single: number;
  noCopyrightRcmd: null;
  alg: null;
  displayReason: null;
  pubDJProgramData: null;
  rtype: number;
  rurl: null;
  mst: number;
  cp: number;
  mv: number;
  publishTime: number;
}

export interface Artist {
  id: number;
  name: string;
  tns: string[];
  alias: string[];
}

export interface Album {
  id: number;
  name: string;
  picUrl: string;
  tns: string[];
  pic_str: string;
  pic: number;
}

export interface SongQuality {
  br: number;
  fid: number;
  size: number;
  vd: number;
}
// 歌单歌曲-end

// 获取音乐url
export interface MusicUrlParams {
  id: number;
  level?: string;
}

// 返回音乐url-start
export interface MusicUrlItem {
  id: number;
  url: string;
  br: number;
  size: number;
  md5: string;
  code: number;
  expi: number;
  type: string;
  gain: number;
  peak: number;
  closedGain: number;
  closedPeak: number;
  fee: number;
  uf: null;
  payed: number;
  flag: number;
  canExtend: boolean;
  freeTrialInfo: FreeTrialInfo;
  level: string;
  encodeType: string;
  channelLayout: null;
  freeTrialPrivilege: FreeTrialPrivilege;
  freeTimeTrialPrivilege: FreeTimeTrialPrivilege;
  urlSource: number;
  rightSource: number;
  podcastCtrp: null;
  effectTypes: null;
  time: number;
  message: null;
  levelConfuse: null;
  musicId: string;
  accompany: null;
  sr: number;
  auEff: number;
  immerseType: null;
  beatType: number;
}

interface FreeTrialInfo {
  fragmentType: number;
  start: number;
  end: number;
  algData: AlgData;
}

interface AlgData {
  fragSource: string;
  audioEffect: number;
}

interface FreeTrialPrivilege {
  resConsumable: boolean;
  userConsumable: boolean;
  listenType: number;
  cannotListenReason: number;
  playReason: null;
  freeLimitTagType: null;
}

interface FreeTimeTrialPrivilege {
  resConsumable: boolean;
  userConsumable: boolean;
  type: number;
  remainTime: number;
}
// 返回音乐url-end
