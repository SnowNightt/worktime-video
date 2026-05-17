import { ref, watch } from "vue";
import { getPlayList, getRecommendationPlayListApi } from "../api";
import { ElMessage } from "element-plus";
import { RecommendPlaylistItem, UserPlaylistItem } from "../type";
import { useUserStore } from "./useUserStore";

const activeName = ref<"playLists" | "collect" | "favorite">("playLists");
// 歌单广场
const recommendPlayList = ref<RecommendPlaylistItem[]>([]);
// 我的收藏
const collectList = ref<UserPlaylistItem[]>([]);
// 我喜欢
const favoriteList = ref<UserPlaylistItem[]>([]);
export const useMusicTabs = () => {
  const { userInfo } = useUserStore();
  const uid = userInfo.value?.account.id;
  const queryMusicList = {
    playLists: async () => {
      const res = await getRecommendationPlayListApi({ limit: 30 });
      if (res.code === 200) {
        recommendPlayList.value = res.result;
      } else {
        recommendPlayList.value = [];
        ElMessage.warning("获取推荐歌单失败~");
      }
    },
    // todo: 区分我喜欢和我的歌单和我收藏歌单
    collect: async () => {
      if (!uid) {
        return;
      }
      const res = await getPlayList({ uid });
      if (res.code === 200) {
        favoriteList.value = res.playlist;
      } else {
        favoriteList.value = [];
        ElMessage.warning("获取我的歌单失败~");
      }
    },
    favorite: async () => {
      if (!uid) {
        return;
      }
      const res = await getPlayList({ uid });
      if (res.code === 200) {
        favoriteList.value = res.playlist;
      } else {
        favoriteList.value = [];
        ElMessage.warning("获取喜欢歌曲失败~");
      }
    },
  };
  const loadCurrentList = async () => {
    await queryMusicList[activeName.value]();
  };
  // 监听tab是否切换
  watch(activeName, loadCurrentList);
  return {
    activeName,
    favoriteList,
    recommendPlayList,
    collectList,
    loadCurrentList,
  };
};
