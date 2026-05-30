import { ref } from "vue";
import { getMusicUrlApi } from "../api";
import { Song } from "../type";
// 当前音乐url、名称
const currentUrl = ref("");
const currentSong = ref("");
// 播放状态
const isPlaying = ref(false);
// 当前歌曲所在的歌单
const playingList = ref<Song[]>([]);
// 当前播放的音乐在歌单里的索引
const currentIndex = ref();
export const useAudioPlayer = () => {
  // 获取音乐url
  const getMusicUrl = async (id: number, musicList?: Song[]) => {
    if (musicList) {
      playingList.value = musicList;
    }
    currentIndex.value = playingList.value.findIndex(item => item.id === id);
    const res = await getMusicUrlApi({ id, level: "higher" });
    currentUrl.value = res.data[0].url;
  };

  // 播放/暂停
  const switchPlayingStatus = () => {
    isPlaying.value = !isPlaying.value;
  };

  // todo: 加边界判断
  // 上一首
  const handlePrevMusic = () => {
    const id = playingList.value[--currentIndex.value].id;
    getMusicUrl(id);
  };
  // 下一首
  const handleNextMusic = () => {
    const id = playingList.value[++currentIndex.value].id;
    getMusicUrl(id);
  };
  return {
    currentSong,
    currentUrl,
    isPlaying,
    getMusicUrl,
    switchPlayingStatus,
    handlePrevMusic,
    handleNextMusic,
  };
};
