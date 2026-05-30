import { ref, watch } from "vue";
import { getPlayList, getRecommendationPlayListApi, getTopList } from "../api";
import { ElMessage } from "element-plus";
import { RecommendPlaylistItem, ToplistItem, UserPlaylistItem } from "../type";
import { useUserStore } from "./useUserStore";

const activeName = ref<"playLists" | "myPlayList" | "topList">("playLists");
// 歌单广场
const recommendPlayList = ref<RecommendPlaylistItem[]>([]);
// 我的歌单
const myPlayList = ref<UserPlaylistItem[]>([]);
// 排行榜
const topList = ref<ToplistItem[]>([]);
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
    myPlayList: async () => {
      if (!uid) {
        return;
      }
      const res = await getPlayList({ uid });
      if (res.code === 200) {
        myPlayList.value = res.playlist;
      } else {
        myPlayList.value = [];
        ElMessage.warning("获取我的歌单失败~");
      }
    },
    topList: async () => {
      if (!uid) {
        return;
      }
      const res = await getTopList();
      if (res.code === 200) {
        topList.value = res.list;
      } else {
        topList.value = [];
        ElMessage.warning("获取榜单失败~");
      }
    },
  };
  const loadCurrentList = async () => {
    console.log(queryMusicList[activeName.value]);

    await queryMusicList[activeName.value]();
  };
  // 监听tab是否切换
  watch(activeName, () => {
    loadCurrentList();
  });
  return {
    activeName,
    topList,
    recommendPlayList,
    myPlayList,
    loadCurrentList,
  };
};
