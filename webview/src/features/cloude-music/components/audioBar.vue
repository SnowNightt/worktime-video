<template>
  <div class="audio-container">
    <audio ref="audioRef" class="audio" @timeupdate="handleTimeUpdate" />
    <div class="progress-bar" @mousedown="handleMouseDown" ref="progressBar">
      <div class="progress-active" :style="{ width: progressPercent + '%' }"></div>
    </div>
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
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
const {
  currentSong,
  currentUrl,
  isPlaying,
  progressPercent,
  currentTime,
  switchPlayingStatus,
  handlePrevMusic,
  handleNextMusic,
  timeUpdate,
} = useAudioPlayer();
const audioRef = ref<HTMLAudioElement>();
watch(currentUrl, newVal => {
  if (!newVal || !audioRef.value) return;
  audioRef.value.src = newVal;
  handleSwitchStatus();
});
// 当前播放时间发生变化
const handleTimeUpdate = () => {
  const currentTime = audioRef.value!.currentTime;
  timeUpdate(currentTime);
};
// 播放/暂停
const handleSwitchStatus = () => {
  switchPlayingStatus();
  isPlaying.value ? audioRef.value?.play() : audioRef.value?.pause();
};
const progressBar = ref<HTMLElement>();
// 点击进度条
const handleMouseDown = (event: MouseEvent) => {
  const clientX = event.clientX;
  const { left, width } = progressBar.value!.getBoundingClientRect();
  const activeWith = clientX - left;
  console.log(activeWith);
  const activePercent = (activeWith / width).toFixed(2);
  console.log("activePercent", activePercent);
  progressPercent.value = activePercent;
  if (currentSong.value?.time) {
    const currentTime = (Number(activePercent) * (currentSong.value.time / 1000)).toFixed(2);
    audioRef.value!.currentTime = Number(currentTime);
    console.log(currentTime, "秒");
  }
};
</script>
<style lang="scss" scoped>
.audio-container {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 15px;
  right: 15px;
  bottom: 15px;
  height: 35px;
  background-color: rgba(191, 191, 191, 0.5);
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  backdrop-filter: blur(10px);

  .controler {
    cursor: pointer;
    font-size: 22px;
    padding-bottom: 5px;
    user-select: none;
  }
  .current-status {
    margin: 0 20px;
  }
  .progress-bar {
    position: absolute;
    width: 100%;
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
