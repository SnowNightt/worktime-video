// 获取验证码
export interface LoginParams {
  phone: string;
  captcha?: string;
  // timestamp?: number;
  password?: string;
}

// 推荐歌单
export interface PlaylistParams {
  limit: number;
  // timestamp?: number;
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
  // timestamp?: number;
}

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

// 获取登录二维码
export interface QRCodeParams {
  // timestamp: number;
  key: string;
  qrimg?: boolean;
  ua?: string;
  platform?: string;
}

// 登录状态-start
export interface LoginUserInfoResponse {
  data: LoginUserInfoData;
}

export interface LoginUserInfoData {
  code: number;
  account: LoginAccountInfo;
  profile: LoginProfileInfo;
}

export interface LoginAccountInfo {
  id: number;
  userName: string;
  type: number;
  status: number;
  whitelistAuthority: number;
  createTime: number;
  tokenVersion: number;
  ban: number;
  baoyueVersion: number;
  donateVersion: number;
  vipType: number;
  anonimousUser: boolean;
  paidFee: boolean;
}

export interface LoginProfileInfo {
  userId: number;
  userType: number;
  nickname: string;
  avatarImgId: number;
  avatarUrl: string;
  backgroundImgId: number;
  backgroundUrl: string;
  signature: string;
  createTime: number;
  userName: string;
  accountType: number;
  shortUserName: string;
  birthday: number;
  authority: number;
  gender: number;
  accountStatus: number;
  province: number;
  city: number;
  authStatus: number;
  description: string | null;
  detailDescription: string | null;
  defaultAvatar: boolean;
  expertTags: string[] | null;
  experts: unknown | null;
  djStatus: number;
  locationStatus: number;
  vipType: number;
  followed: boolean;
  mutual: boolean;
  authenticated: boolean;
  lastLoginTime: number;
  lastLoginIP: string;
  remarkName: string | null;
  viptypeVersion: number;
  authenticationTypes: number;
  avatarDetail: unknown | null;
  anchor: boolean;
}
// 登录状态-end

// 账号信息
export interface AccountDetail {
  account: LoginAccountInfo;
  profile: LoginProfileInfo;
}
export interface AccountDetailResult {
  code: number;
  account: LoginAccountInfo;
  profile: LoginProfileInfo;
}

// 用户歌单-start
export interface UserPlaylistResponse {
  code: number;
  more: boolean;
  playlist: UserPlaylistItem[];
}

export interface UserPlaylistItem {
  subscribers: unknown[];
  subscribed: boolean;
  creator: PlaylistCreator;
  artists: null;
  tracks: null;
  top: boolean;
  updateFrequency: string | null;
  backgroundCoverId: number;
  backgroundCoverUrl: string | null;
  titleImage: number;
  titleImageUrl: string | null;
  englishTitle: string | null;
  opRecommend: boolean;
  recommendInfo: unknown | null;
  subscribedCount: number;
  cloudTrackCount: number;
  userId: number;
  totalDuration: number;
  coverImgId: number;
  privacy: number;
  trackUpdateTime: number;
  trackCount: number;
  updateTime: number;
  commentThreadId: string;
  coverImgUrl: string;
  specialType: number;
  anonimous: boolean;
  createTime: number;
  highQuality: boolean;
  newImported: boolean;
  trackNumberUpdateTime: number;
  playCount: number;
  adType: number;
  description: string | null;
  tags: string[];
  ordered: boolean;
  status: number;
  name: string;
  id: number;
  coverImgId_str?: string;
  sharedUsers: unknown | null;
  shareStatus: unknown | null;
  copied: boolean;
  containsTracks: boolean;
}

export interface PlaylistCreator {
  defaultAvatar: boolean;
  province: number;
  authStatus: number;
  followed: boolean;
  avatarUrl: string;
  accountStatus: number;
  gender: number;
  city: number;
  birthday: number;
  userId: number;
  userType: number;
  nickname: string;
  signature: string;
  description: string;
  detailDescription: string;
  avatarImgId: number;
  backgroundImgId: number;
  backgroundUrl: string;
  authority: number;
  mutual: boolean;
  expertTags: string[] | null;
  experts: Record<string, unknown> | null;
  djStatus: number;
  vipType: number;
  remarkName: string | null;
  authenticationTypes: number;
  avatarDetail: unknown | null;
  backgroundImgIdStr?: string;
  anchor: boolean;
  avatarImgIdStr?: string;
  avatarImgId_str?: string;
}
// 用户歌单-end

// 获取榜单-start
export interface ToplistResponse {
  code: number;
  list: ToplistItem[];
  artistToplist: ArtistToplist;
}

export type ToplistDetailStatus = "idle" | "loading" | "success" | "error";

export interface ToplistDialogMeta {
  id: number;
  name: string;
  coverImgUrl: string;
  updateFrequency: string;
  trackCount: number;
}

export interface ToplistItem {
  subscribers: unknown[];
  subscribed: boolean | null;
  creator: unknown | null;
  artists: unknown | null;
  tracks: unknown | null;
  updateFrequency: string;
  backgroundCoverId: number;
  backgroundCoverUrl: string | null;
  titleImage: number;
  coverText: string | null;
  titleImageUrl: string | null;
  coverImageUrl: string | null;
  iconImageUrl: string | null;
  englishTitle: string | null;
  opRecommend: boolean;
  recommendInfo: unknown | null;
  socialPlaylistCover: string | null;
  tsSongCount: number;
  algType: string | null;
  originalCoverId: number;
  topTrackIds: unknown | null;
  promptedMgcInfo: unknown | null;
  playlistType: string;
  uiPlaylistType: string;
  coverImgUrl: string;
  updateTime: number;
  newImported: boolean;
  anonimous: boolean;
  coverImgId: number;
  totalDuration: number;
  playCount: number;
  trackCount: number;
  commentThreadId: string;
  trackUpdateTime: number;
  highQuality: boolean;
  specialType: number;
  privacy: number;
  trackNumberUpdateTime: number;
  mix: boolean;
  adType: number;
  subscribedCount: number;
  cloudTrackCount: number;
  createTime: number;
  ordered: boolean;
  description: string;
  status: number;
  tags: string[];
  userId: number;
  name: string;
  id: number;
  coverImgId_str: string;
  ToplistType: string;
}

export interface ArtistToplist {
  coverUrl: string;
  name: string;
  upateFrequency: string;
  position: number;
  updateFrequency: string;
}
// 获取榜单-end

// 歌单详情-start
export interface PlaylistDetailResponse {
  code: number;
  relatedVideos: unknown[] | null;
  playlist: Playlist;
  urls: unknown[] | null;
  privileges: Privilege[];
  sharedPrivilege: unknown | null;
  resEntrance: unknown | null;
  fromUsers: unknown[] | null;
  fromUserCount: number;
  songFromUsers: unknown[] | null;
}

export interface Playlist {
  id: number;
  name: string;
  coverImgId: number;
  coverImgUrl: string;
  coverImgId_str: string;
  adType: number;
  userId: number;
  createTime: number;
  status: number;
  opRecommend: boolean;
  highQuality: boolean;
  newImported: boolean;
  updateTime: number;
  trackCount: number;
  specialType: number;
  privacy: number;
  trackUpdateTime: number;
  commentThreadId: string;
  playCount: number;
  trackNumberUpdateTime: number;
  subscribedCount: number;
  cloudTrackCount: number;
  ordered: boolean;
  description: string | null;
  tags: string[];
  updateFrequency: string | null;
  backgroundCoverId: number;
  backgroundCoverUrl: string | null;
  titleImage: number;
  titleImageUrl: string | null;
  detailPageTitle: string | null;
  englishTitle: string | null;
  officialPlaylistType: string | null;
  copied: boolean;
  relateResType: string | null;
  coverStatus: number;
  mix: boolean;
  subscribers: unknown[];
  subscribed: boolean;
  creator: Creator;
  tracks: Song[];
  videoIds: unknown[] | null;
  videos: unknown[] | null;
  trackIds: TrackId[];
  bannedTrackIds: unknown[] | null;
  mvResourceInfos: unknown[] | null;
  shareCount: number;
  commentCount: number;
  remixVideo: unknown | null;
  newDetailPageRemixVideo: unknown | null;
  sharedUsers: unknown[] | null;
  historySharedUsers: unknown[] | null;
  gradeStatus: string;
  score: number | null;
  algTags: string[] | null;
  distributeTags: string[];
  trialMode: number;
  displayTags: string[] | null;
  displayUserInfoAsTagOnly: boolean;
  playlistType: string;
  uiPlaylistType: string;
  bizExtInfo: Record<string, unknown>;
  promptedMgcInfo: unknown | null;
  mixPodcastPlaylist: boolean;
  podcastTrackCount: number;
  mixInfo: unknown | null;
}

export interface Creator {
  defaultAvatar: boolean;
  province: number;
  authStatus: number;
  followed: boolean;
  avatarUrl: string;
  accountStatus: number;
  gender: number;
  city: number;
  birthday: number;
  userId: number;
  userType: number;
  nickname: string;
  signature: string;
  description: string;
  detailDescription: string;
  avatarImgId: number;
  backgroundImgId: number;
  backgroundUrl: string;
  authority: number;
  mutual: boolean;
  expertTags: string[] | null;
  experts: Record<string, unknown> | null;
  djStatus: number;
  vipType: number;
  remarkName: string | null;
  authenticationTypes: number;
  avatarDetail: unknown | null;
  avatarImgIdStr: string;
  backgroundImgIdStr: string;
  anchor: boolean;
  avatarImgId_str: string;
}

export interface Song {
  name: string;
  mainTitle: string | null;
  additionalTitle: string | null;
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
  crbt: unknown | null;
  cf: string;
  al: Album;
  dt: number;
  h: SongQuality | null;
  m: SongQuality | null;
  l: SongQuality | null;
  sq: SongQuality | null;
  hr: SongQuality | null;
  a: unknown | null;
  cd: string;
  no: number;
  rtUrl: string | null;
  ftype: number;
  rtUrls: string[];
  djId: number;
  copyright: number;
  s_id: number;
  mark: number;
  originCoverType: number;
  originSongSimpleData: unknown | null;
  tagPicList: unknown[] | null;
  resourceState: boolean;
  version: number;
  songJumpInfo: unknown | null;
  entertainmentTags: string[] | null;
  awardTags: string[] | null;
  displayTags: string[] | null;
  markTags: string[];
  songFeature: unknown | null;
  single: number;
  noCopyrightRcmd: unknown | null;
  alg: string | null;
  displayReason: string | null;
  pubDJProgramData: unknown | null;
  rtype: number;
  rurl: string | null;
  mst: number;
  cp: number;
  mv: number;
  publishTime: number;
  tns?: string[];
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
  sr: number;
}

export interface TrackId {
  id: number;
  v: number;
  t: number;
  at: number;
  alg: string | null;
  uid: number;
  rcmdReason: string;
  rcmdReasonTitle: string;
  sc: unknown | null;
  f: unknown | null;
  sr: unknown | null;
  dpr: unknown | null;
  tr: number;
}

export interface Privilege {
  id: number;
  fee: number;
  payed: number;
  realPayed: number;
  st: number;
  pl: number;
  dl: number;
  sp: number;
  cp: number;
  subp: number;
  cs: boolean;
  maxbr: number;
  fl: number;
  pc: unknown | null;
  toast: boolean;
  flag: number;
  paidBigBang: boolean;
  preSell: boolean;
  playMaxbr: number;
  downloadMaxbr: number;
  maxBrLevel: string;
  playMaxBrLevel: string;
  downloadMaxBrLevel: string;
  plLevel: string;
  dlLevel: string;
  flLevel: string;
  rscl: unknown | null;
  freeTrialPrivilege: FreeTrialPrivilege;
  rightSource: number;
  chargeInfoList: ChargeInfo[];
  code: number;
  message: string | null;
  plLevels: unknown | null;
  dlLevels: unknown | null;
  ignoreCache: unknown | null;
  bd: unknown | null;
}
export interface ChargeInfo {
  rate: number;
  chargeUrl: string | null;
  chargeMessage: string | null;
  chargeType: number;
}
// 歌单详情-end
