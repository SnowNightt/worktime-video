<template>
    <div class="audio-container">
        <audio ref="audioRef" controls class="audio" />

    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
const { currentSong, currentUrl } = useAudioPlayer()
const audioRef = ref<HTMLAudioElement>()
watch(currentUrl, (newVal) => {
    if (!newVal || !audioRef.value) return
    audioRef.value.src = newVal
    audioRef.value.play()
})
</script>
<style lang="scss" scoped>
.audio-container {
    width: 100%;
    display: flex;
    justify-content: center;

    .audio {
        width: 95%;
        position: fixed;
        bottom: 20px;
    }
}
</style>