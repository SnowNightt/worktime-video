<template>
  <div class="audio-container">
    <audio ref="audioRef" class="audio" />
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
  switchPlayingStatus,
  handlePrevMusic,
  handleNextMusic,
} = useAudioPlayer();
const audioRef = ref<HTMLAudioElement>();
watch(currentUrl, newVal => {
  if (!newVal || !audioRef.value) return;
  audioRef.value.src = newVal;
  handleSwitchStatus();
});
// 播放/暂停
const handleSwitchStatus = () => {
  switchPlayingStatus();
  isPlaying.value ? audioRef.value?.play() : audioRef.value?.pause();
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
  border-radius: 7px;
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
}
</style>
