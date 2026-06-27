<template>
  <div class="audio-container">
    <audio
      ref="audioRef"
      class="audio"
      crossorigin="anonymous"
      @timeupdate="handleTimeUpdate"
      @ended="handleEnded"
    />
    <div class="progress-bar" @mousedown="handleMouseDown" ref="progressBar">
      <div class="progress-active" :style="{ width: progressPercent + '%' }"></div>
    </div>
    <div class="song-meta">
      <div class="song-cover-shell" :class="{ 'is-playing': isPlaying }">
        <div ref="spectrumRef" class="song-spectrum"></div>
        <div class="song-disc">
          <img
            v-if="currentSongInfo?.al.picUrl"
            class="song-cover"
            :src="currentSongInfo.al.picUrl"
            alt=""
          />
          <span v-else class="song-cover song-cover-placeholder"></span>
        </div>
      </div>
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
      <button class="prev controler" type="button" @click="handlePrevMusic">
        <img class="control-icon" :src="prevIcon" alt="" />
      </button>
      <button class="current-status controler" type="button" @click="handleSwitchStatus">
        <img class="control-icon" :src="isPlaying ? playIcon : pauseIcon" alt="" />
      </button>
      <button class="next controler" type="button" @click="handleNextMusic">
        <img class="control-icon" :src="nextIcon" alt="" />
      </button>
    </div>
    <div class="right-part">
      <div class="time-tip">{{ timeTip }} / {{ totalTime }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import AudioMotionAnalyzer from "audiomotion-analyzer";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import nextIcon from "../../../assets/next.png";
import pauseIcon from "../../../assets/pause.png";
import playIcon from "../../../assets/play.png";
import prevIcon from "../../../assets/prev.png";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
const audioRef = ref<HTMLAudioElement>();
const progressBar = ref<HTMLElement>();
const {
  currentUrl,
  isPlaying,
  progressPercent,
  currentSongInfo,
  switchPlayingStatus,
  handlePrevMusic,
  handleNextMusic,
  timeTip,
  totalTime,
  songName,
  songArtist,
  handleTimeUpdate,
  handleEnded,
  handleMouseDown,
} = useAudioPlayer(audioRef, progressBar);
const spectrumRef = ref<HTMLElement>();
let audioMotion: AudioMotionAnalyzer | undefined;
let isSpectrumUnavailable = false;
const songTitleRef = ref<HTMLElement>();
const songArtistRef = ref<HTMLElement>();
const isSongNameOverflow = ref(false);
const isSongArtistOverflow = ref(false);
let songTextResizeObserver: ResizeObserver | undefined;

const isOverflow = (element?: HTMLElement) => {
  return element!.scrollWidth > element!.clientWidth;
};

const updateSongTextOverflow = async () => {
  await nextTick();
  isSongNameOverflow.value = isOverflow(songTitleRef.value);
  isSongArtistOverflow.value = isOverflow(songArtistRef.value);
};

watch([songName, songArtist], updateSongTextOverflow);

onMounted(() => {
  updateSongTextOverflow();
  // 监听歌曲名和歌手元素的尺寸变化
  songTextResizeObserver = new ResizeObserver(updateSongTextOverflow);
  if (songTitleRef.value) {
    songTextResizeObserver.observe(songTitleRef.value);
  }
  if (songArtistRef.value) {
    songTextResizeObserver.observe(songArtistRef.value);
  }
  // 组件创建时currentUrl已经有值，watch无法监听。
  if (currentUrl.value && audioRef.value) {
    audioRef.value.src = currentUrl.value;
    void switchAudioStatus();
  }
});

onBeforeUnmount(() => {
  songTextResizeObserver?.disconnect();
  audioMotion?.destroy();
});
watch(currentUrl, newVal => {
  if (!newVal || !audioRef.value) return;
  audioRef.value.src = newVal;
  switchAudioStatus();
});
const initSpectrum = async () => {
  if (audioMotion || isSpectrumUnavailable || !audioRef.value || !spectrumRef.value) {
    return;
  }

  try {
    audioMotion = new AudioMotionAnalyzer(spectrumRef.value, {
      source: audioRef.value,
      width: 62,
      height: 62,
      mode: 2,
      radial: true,
      radius: 0.55,
      overlay: true,
      showBgColor: false,
      bgAlpha: 0,
      showScaleX: false,
      showScaleY: false,
      showPeaks: false,
      smoothing: 0.72,
      fftSize: 2048,
      minFreq: 45,
      maxFreq: 14000,
      maxFPS: 45,
      spinSpeed: 0,
      fillAlpha: 0.82,
      lineWidth: 1,
      start: false,
    });

    audioMotion.registerGradient("cover-spectrum", {
      bgColor: "rgba(0, 0, 0, 0)",
      colorStops: [
        { pos: 0, color: "#7dd3fc" },
        { pos: 0.45, color: "#c4b5fd" },
        { pos: 1, color: "#fb7185" },
      ],
    });
    audioMotion.gradient = "cover-spectrum";
  } catch {
    isSpectrumUnavailable = true;
    audioMotion = undefined;
  }
};

const syncSpectrumStatus = async () => {
  if (!audioMotion) {
    return;
  }

  if (isPlaying.value) {
    if (audioMotion.audioCtx.state === "suspended") {
      await audioMotion.audioCtx.resume();
    }
    audioMotion.start();
    return;
  }

  audioMotion.stop();
};
const switchAudioStatus = async () => {
  if (!isPlaying.value) {
    audioRef.value?.pause();
    await syncSpectrumStatus();
    return;
  }
  try {
    await syncSpectrumStatus();
    await audioRef.value?.play();
  } catch {
    switchPlayingStatus();
    audioMotion?.stop();
  }
};
// 播放/暂停
const handleSwitchStatus = async () => {
  await initSpectrum();
  switchPlayingStatus();
  switchAudioStatus();
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
  z-index: 99999;
  left: 12px;
  right: 12px;
  bottom: 10px;
  height: 65px;
  padding: 8px 12px 6px;
  overflow: hidden;
  border-radius: 20px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--vscode-foreground, #d7dae0) 13%, transparent),
      transparent 42%
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--worktime-bg, #1f2329) 62%, transparent),
      color-mix(in srgb, var(--worktime-bg, #1f2329) 82%, transparent)
    ),
    color-mix(in srgb, var(--worktime-bg, #1f2329) 76%, var(--vscode-foreground, #d7dae0) 24%);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--vscode-foreground, #d7dae0) 16%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--vscode-foreground, #d7dae0) 10%, transparent),
    0 18px 42px rgba(5, 8, 12, 0.32);
  backdrop-filter: blur(18px) saturate(112%);
  -webkit-backdrop-filter: blur(18px) saturate(112%);
  .song-meta {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    align-items: center;
    gap: 8px;
  }
  .song-cover-shell {
    position: relative;
    display: grid;
    flex: 0 0 62px;
    width: 62px;
    height: 62px;
    place-items: center;

    &::before {
      position: absolute;
      inset: 5px;
      border-radius: 50%;
      background:
        radial-gradient(circle at 28% 24%, rgba(125, 211, 252, 0.36), transparent 33%),
        radial-gradient(circle at 74% 76%, rgba(251, 113, 133, 0.3), transparent 38%),
        rgba(255, 255, 255, 0.06);
      content: "";
      opacity: 0.76;
      filter: blur(7px);
      transition:
        opacity 0.18s ease,
        transform 0.18s ease;
    }

    &.is-playing::before {
      opacity: 0.95;
      transform: scale(1.06);
    }
  }
  .song-spectrum {
    position: absolute;
    inset: 0;
    opacity: 0.52;
    pointer-events: none;
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;

    :deep(canvas) {
      display: block;
      width: 100% !important;
      height: 100% !important;
    }
  }
  .song-cover-shell.is-playing .song-spectrum {
    opacity: 1;
    transform: scale(1.02);
  }
  .song-disc {
    position: relative;
    z-index: 1;
    width: 46px;
    height: 46px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.36);
    border-radius: 50%;
    background:
      radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0 7%, transparent 8%),
      rgba(40, 44, 52, 0.46);
    box-shadow:
      0 8px 18px rgba(0, 0, 0, 0.18),
      inset 0 0 0 3px rgba(255, 255, 255, 0.08);
    animation: cover-spin 9s linear infinite;
    animation-play-state: paused;
    transform-origin: center;
    transition:
      box-shadow 0.18s ease,
      transform 0.18s ease;
    will-change: transform;

    &::before,
    &::after {
      position: absolute;
      border-radius: 50%;
      content: "";
      pointer-events: none;
    }

    &::before {
      inset: 4px;
      z-index: 2;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow:
        inset 0 0 0 7px rgba(0, 0, 0, 0.08),
        inset 0 0 14px rgba(0, 0, 0, 0.18);
    }

    &::after {
      z-index: 3;
      top: 50%;
      left: 50%;
      width: 11px;
      height: 11px;
      border: 1px solid rgba(255, 255, 255, 0.78);
      background: radial-gradient(
        circle,
        rgba(40, 44, 52, 0.88) 0 30%,
        rgba(255, 255, 255, 0.9) 32% 100%
      );
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.22);
      transform: translate(-50%, -50%);
    }
  }
  .song-cover-shell.is-playing .song-disc {
    animation-play-state: running;
    box-shadow:
      0 10px 22px rgba(0, 0, 0, 0.22),
      0 0 0 4px rgba(105, 192, 255, 0.12),
      inset 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
  .song-cover {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .song-cover-placeholder {
    background:
      radial-gradient(circle at 35% 28%, rgba(125, 211, 252, 0.38), transparent 34%),
      radial-gradient(circle at 72% 72%, rgba(251, 113, 133, 0.28), transparent 38%),
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
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    .controler {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      appearance: none;
      background: transparent;
      cursor: pointer;
      user-select: none;
      transition:
        background-color 0.16s ease,
        transform 0.16s ease,
        opacity 0.16s ease;
      &:active {
        transform: scale(0.94);
      }

      &:focus-visible {
        outline: 2px solid rgba(105, 192, 255, 0.82);
        outline-offset: 2px;
      }
    }
    .control-icon {
      display: block;
      width: 24px;
      height: 24px;
      max-width: 82%;
      max-height: 82%;
      object-fit: contain;
      pointer-events: none;
    }
    .current-status {
      width: 46px;
      height: 46px;

      .control-icon {
        width: 30px;
        height: 30px;
        max-width: 86%;
        max-height: 86%;
      }
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
    left: 18px;
    right: 18px;
    width: auto;
    top: 7px;
    height: 3px;
    overflow: hidden;
    border-radius: 999px;
    cursor: pointer;
    background-color: color-mix(in srgb, var(--vscode-foreground, #d7dae0) 15%, transparent);
    .progress-active {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--vscode-focusBorder, #61afef) 72%, #f5f7fb 28%),
        var(--vscode-focusBorder, #61afef)
      );
    }
  }
  .progress-bar:hover .progress-active {
    height: 100%;
    // box-shadow: 2px 0 2px 4px rgba(140, 140, 140, 0.35);
  }
}

@media (max-width: 340px) {
  .audio-container {
    left: 8px;
    right: 8px;
    bottom: 8px;
    padding-inline: 10px;
    border-radius: 17px;
  }
}

@keyframes cover-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
