import { ref } from "vue";
import { getMusicUrlApi } from "../api";
import { MusicUrlItem, Song } from "../type";
// 当前音乐url、名称
const currentUrl = ref("");
const currentSong = ref<MusicUrlItem>();
// 当前播放的时间
const currentTime = ref();
// 播放状态
const isPlaying = ref(false);
// 当前歌曲所在的歌单
const playingList = ref<Song[]>([]);
// 当前播放的音乐在歌单里的索引
const currentIndex = ref();
// 进度条长度
const progressPercent = ref("0");
export const useAudioPlayer = () => {
  // 获取音乐url
  const getMusicUrl = async (id: number, musicList?: Song[]) => {
    if (musicList) {
      playingList.value = musicList;
    }
    const res = await getMusicUrlApi({ id, level: "higher" });
    currentSong.value = res.data[0];
    currentUrl.value = res.data[0].url;
    currentIndex.value = playingList.value.findIndex(item => item.id === id);
  };

  // 播放/暂停
  const switchPlayingStatus = () => {
    isPlaying.value = !isPlaying.value;
  };

  // 边界判断
  // 上一首
  const handlePrevMusic = () => {
    const id =
      playingList.value[
        --currentIndex.value < 0 ? playingList.value.length - 1 : currentIndex.value
      ].id;
    getMusicUrl(id);
  };
  // 下一首
  const handleNextMusic = () => {
    const id =
      playingList.value[++currentIndex.value === playingList.value.length ? 0 : currentIndex.value]
        .id;
    getMusicUrl(id);
  };

  // 当前播放时间发生变化
  const timeUpdate = (time: number) => {
    progressPercent.value = (((time * 1000) / currentSong.value!.time) * 100).toFixed(2);
    currentTime.value = time;
    console.log(1111, progressPercent.value);
  };
  return {
    currentSong,
    currentUrl,
    isPlaying,
    progressPercent,
    currentTime,
    getMusicUrl,
    switchPlayingStatus,
    handlePrevMusic,
    handleNextMusic,
    timeUpdate,
  };
};
