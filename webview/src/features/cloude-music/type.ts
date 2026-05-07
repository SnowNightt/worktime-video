// 获取验证码
export interface LoginParams {
  phone: string;
  captcha?: string;
  timestamp?: number;
  password?: string;
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

// 登录-start
export interface LoginResponse {
  loginType?: number;
  hitType?: number;
  code?: number;
  account?: Account;
  token?: string;
  profile?: Profile;
  bindings?: Binding[];
  message?: string;
}

export interface Account {
  id?: number;
  userName?: string;
  type?: number;
  status?: number;
  whitelistAuthority?: number;
  createTime?: number;
  salt?: string;
  tokenVersion?: number;
  ban?: number;
  baoyueVersion?: number;
  donateVersion?: number;
  vipType?: number;
  viptypeVersion?: number;
  anonimousUser?: boolean;
  uninitialized?: boolean;
}

export interface Profile {
  vipType?: number;
  authStatus?: number;
  djStatus?: number;
  detailDescription?: string;
  experts?: Record<string, unknown>;
  expertTags?: unknown[] | null;
  accountStatus?: number;
  nickname?: string;
  birthday?: number;
  gender?: number;
  province?: number;
  city?: number;
  avatarImgId?: string;
  backgroundImgId?: string;
  avatarUrl?: string;
  followed?: boolean;
  backgroundUrl?: string;
  userType?: number;
  defaultAvatar?: boolean;
  mutual?: boolean;
  remarkName?: string | null;
  avatarImgIdStr?: string;
  backgroundImgIdStr?: string;
  description?: string;
  userId?: number;
  signature?: string;
  authority?: number;
  avatarImgId_str?: string;
  followeds?: number;
  follows?: number;
  eventCount?: number;
  avatarDetail?: unknown | null;
  playlistCount?: number;
  playlistBeSubscribedCount?: number;
}

export interface Binding {
  bindingTime?: number;
  refreshTime?: number;
  tokenJsonStr?: string;
  expiresIn?: number;
  url?: string;
  expired?: boolean;
  userId?: number;
  id?: number;
  type?: number;
}
// 登录-end