import { computed, Ref, ref } from "vue";
import { getMusicUrlApi } from "../api";
import { MusicUrlItem, Song } from "../type";
// 当前音乐url、名称
const currentUrl = ref("");
const currentSong = ref<MusicUrlItem>();
const currentSongInfo = ref<Song>();
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
export const useAudioPlayer = (
  audioRef?: Ref<HTMLAudioElement | undefined>,
  progressBar?: Ref<HTMLElement | undefined>
) => {
  // 当前播放时间
  const timeTip = computed(() => {
    if (!currentTime.value) {
      return "00:00";
    }
    const minutes = Math.floor(currentTime.value / 60);
    const remainingSeconds = Math.floor(currentTime.value % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  });
  // 总时长
  const totalTime = computed(() => {
    if (!currentSong.value?.time) {
      return "00:00";
    }
    const minutes = Math.floor(currentSong.value.time / 1000 / 60);
    const remainingSeconds = Math.floor((currentSong.value.time / 1000) % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  });
  const songName = computed(() => currentSongInfo.value?.name || "暂无播放");
  const songArtist = computed(
    () => currentSongInfo.value?.ar.map(item => item.name).join(" / ") || "未知歌手"
  );
  const hasCurrentSong = computed(() => Boolean(currentUrl.value && currentSongInfo.value));
  // 获取音乐url
  const getMusicUrl = async (id: number, musicList?: Song[]) => {
    if (musicList) {
      playingList.value = musicList;
    }
    const song = playingList.value.find(item => item.id === id);
    if (song) {
      currentSongInfo.value = song;
    }

    const res = await getMusicUrlApi({ id, level: "higher" });
    currentSong.value = res.data[0];
    currentUrl.value = res.data[0].url;
    currentIndex.value = playingList.value.findIndex(item => item.id === id);
    isPlaying.value = true;
  };

  // 播放/暂停
  const switchPlayingStatus = () => {
    isPlaying.value = !isPlaying.value;
  };

  // 边界判断
  // 上一首
  const handlePrevMusic = async () => {
    const song =
      playingList.value[
        --currentIndex.value < 0 ? playingList.value.length - 1 : currentIndex.value
      ];
    const id = song.id;
    currentSongInfo.value = song;
    await getMusicUrl(id);
    isPlaying.value = true;
  };
  // 下一首
  const handleNextMusic = async () => {
    const song =
      playingList.value[++currentIndex.value === playingList.value.length ? 0 : currentIndex.value];
    const id = song.id;
    currentSongInfo.value = song;
    await getMusicUrl(id);
    isPlaying.value = true;
  };

  // 当前播放时间发生变化
  const timeUpdate = (time: number) => {
    progressPercent.value = (((time * 1000) / currentSong.value!.time) * 100).toFixed(2);
    currentTime.value = time;
    // console.log(1111, progressPercent.value);
  };
  const setProgressPercent = (percent: string) => {
    progressPercent.value = percent;
  };
  const isDragging = ref(false);
  // 当前播放时间发生变化
  const handleTimeUpdate = () => {
    if (isDragging.value) return;
    const currentTime = audioRef!.value!.currentTime;
    timeUpdate(currentTime);
  };
  // 播放结束
  const handleEnded = async () => {
    await handleNextMusic();
  };
  const handleMouseUp = (event: MouseEvent) => {
    const clientX = event.clientX;
    const { left, width } = progressBar!.value!.getBoundingClientRect();
    const activeWith = clientX - left;
    const activePercent = (activeWith / width).toFixed(2);
    if (currentSong.value?.time) {
      const currentTime = (Number(activePercent) * (currentSong.value.time / 1000)).toFixed(2);
      audioRef!.value!.currentTime = Number(currentTime);
    }
    isDragging.value = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (event: MouseEvent) => {
    const clientX = event.clientX;
    const { left, width } = progressBar!.value!.getBoundingClientRect();
    const activeWith = clientX - left;
    const activePercent = ((activeWith / width) * 100).toFixed(2);
    setProgressPercent(activePercent);
  };

  // 点击进度条
  const handleMouseDown = (event: MouseEvent) => {
    isDragging.value = true;
    handleMouseMove(event);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  return {
    currentSong,
    currentUrl,
    isPlaying,
    progressPercent,
    currentTime,
    currentSongInfo,
    hasCurrentSong,
    getMusicUrl,
    switchPlayingStatus,
    handlePrevMusic,
    handleNextMusic,
    timeUpdate,
    setProgressPercent,
    timeTip,
    totalTime,
    songName,
    songArtist,
    handleTimeUpdate,
    handleEnded,
    handleMouseDown,
  };
};
