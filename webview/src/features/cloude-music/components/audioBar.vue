<template>
  <div class="audio-container">
    <audio ref="audioRef" class="audio" @timeupdate="handleTimeUpdate" @ended="handleEnded" />
    <div class="progress-bar" @mousedown="handleMouseDown" ref="progressBar">
      <div class="progress-active" :style="{ width: progressPercent + '%' }"></div>
    </div>
    <div class="song-meta">
      <img
        v-if="currentSongInfo?.al.picUrl"
        class="song-cover"
        :src="currentSongInfo.al.picUrl"
        alt=""
      />
      <span v-else class="song-cover song-cover-placeholder" aria-hidden="true"></span>
      <div class="song-text">
        <el-tooltip :content="songName" placement="top" :disabled="!isSongNameOverflow">
          <span ref="songTitleRef" class="song-title">{{ songName }}</span>
        </el-tooltip>
        <el-tooltip :content="songArtist" placement="top" :disabled="!isSongArtistOverflow">
          <span ref="songArtistRef" class="song-artist">{{ songArtist }}</span>
        </el-tooltip>
      </div>
    </div>
    <div class="left-part">
      <div class="prev controler" @click="handlePrevMusic">
        {{ "⏮" }}
      </div>
      <div class="current-status controler" @click="handleSwitchStatus">
        {{ isPlaying ? "⏸" : "▶" }}
      </div>
      <div class="next controler" @click="handleNextMusic">
        {{ "⏭" }}
      </div>
    </div>
    <div class="right-part">
      <div class="time-tip">{{ timeTip }} / {{ totalTime }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
const {
  currentSong,
  currentUrl,
  isPlaying,
  progressPercent,
  currentTime,
  currentSongInfo,
  switchPlayingStatus,
  handlePrevMusic,
  handleNextMusic,
  timeUpdate,
  setProgressPercent,
} = useAudioPlayer();
const audioRef = ref<HTMLAudioElement>();
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
const songTitleRef = ref<HTMLElement>();
const songArtistRef = ref<HTMLElement>();
const isSongNameOverflow = ref(false);
const isSongArtistOverflow = ref(false);
let songTextResizeObserver: ResizeObserver | undefined;

const isOverflow = (element?: HTMLElement) => {
  if (!element) {
    return false;
  }
  return element.scrollWidth > element.clientWidth;
};

const updateSongTextOverflow = async () => {
  await nextTick();
  isSongNameOverflow.value = isOverflow(songTitleRef.value);
  isSongArtistOverflow.value = isOverflow(songArtistRef.value);
};

watch([songName, songArtist], updateSongTextOverflow);

onMounted(() => {
  updateSongTextOverflow();
  songTextResizeObserver = new ResizeObserver(updateSongTextOverflow);
  if (songTitleRef.value) {
    songTextResizeObserver.observe(songTitleRef.value);
  }
  if (songArtistRef.value) {
    songTextResizeObserver.observe(songArtistRef.value);
  }
});

onBeforeUnmount(() => {
  songTextResizeObserver?.disconnect();
});
watch(currentUrl, newVal => {
  if (!newVal || !audioRef.value) return;
  audioRef.value.src = newVal;
  handleSwitchStatus();
});
// 当前播放时间发生变化
const handleTimeUpdate = () => {
  if (isDragging.value) return;
  const currentTime = audioRef.value!.currentTime;
  timeUpdate(currentTime);
};
// 播放结束
const handleEnded = async () => {
  await handlePrevMusic();
  handleSwitchStatus();
};
// 播放/暂停
const handleSwitchStatus = () => {
  switchPlayingStatus();
  isPlaying.value ? audioRef.value?.play() : audioRef.value?.pause();
};
const isDragging = ref(false);
const progressBar = ref<HTMLElement>();
const handleMouseUp = (event: MouseEvent) => {
  const clientX = event.clientX;
  const { left, width } = progressBar.value!.getBoundingClientRect();
  const activeWith = clientX - left;
  const activePercent = (activeWith / width).toFixed(2);
  if (currentSong.value?.time) {
    const currentTime = (Number(activePercent) * (currentSong.value.time / 1000)).toFixed(2);
    audioRef.value!.currentTime = Number(currentTime);
  }
  isDragging.value = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};
const handleMouseMove = (event: MouseEvent) => {
  const clientX = event.clientX;
  const { left, width } = progressBar.value!.getBoundingClientRect();
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
</script>
<style lang="scss" scoped>
.audio-container {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0px;
  height: 65px;
  padding: 8px 12px 6px;
  background-color: rgba(191, 191, 191, 0.5);
  backdrop-filter: blur(10px);
  .song-meta {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    align-items: center;
    gap: 8px;
  }
  .song-cover {
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 8px;
    background: rgba(40, 44, 52, 0.42);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.16);
  }
  .song-cover-placeholder {
    background:
      linear-gradient(135deg, rgba(97, 175, 239, 0.22), rgba(171, 178, 191, 0.1)),
      rgba(40, 44, 52, 0.42);
  }
  .song-text {
    display: grid;
    min-width: 0;
    gap: 4px;
  }
  .song-title,
  .song-artist {
    min-width: 0;
    overflow: hidden;
    line-height: 1.15;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .song-title {
    color: rgba(255, 255, 255, 0.92);
    font-size: 13px;
    font-weight: 700;
  }
  .song-artist {
    color: rgba(255, 255, 255, 0.62);
    font-size: 12px;
  }
  .left-part {
    display: flex;
    flex: 0 0 auto;
    justify-content: flex-end;
    .controler {
      cursor: pointer;
      font-size: 22px;
      padding-bottom: 5px;
      user-select: none;
    }
    .current-status {
      margin: 0 20px;
    }
  }
  .right-part {
    display: flex;
    flex: 0 0 auto;
    justify-content: flex-end;
    .time-tip {
      min-width: 74px;
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
  }

  .progress-bar {
    position: absolute;
    left: 0;
    right: 0;
    width: auto;
    top: 0;
    cursor: pointer;
    background-color: #d9d9d9;
    .progress-active {
      background-color: #69c0ff;
      height: 3px;
    }
  }
  .progress-bar:hover .progress-active {
    height: 6px;
    // box-shadow: 2px 0 2px 4px rgba(140, 140, 140, 0.35);
  }
}
</style>
