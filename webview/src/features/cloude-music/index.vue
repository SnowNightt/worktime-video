<template>
  <section class="cloud-music-page" :class="{ 'has-audio-bar': hasCurrentSong }">
    <TopBar @visibleLoginCard="handleVisibleLoginCard" @successLogout="handleLogout"></TopBar>
    <el-tabs v-model="activeName" class="music-tabs">
      <el-tab-pane label="歌单广场" name="playLists">
        <RecommendPlayList :recommendPlayList="recommendPlayList"></RecommendPlayList>
      </el-tab-pane>
      <el-tab-pane label="排行榜" name="topList"
        ><TopList :topList="topList"></TopList
      ></el-tab-pane>
      <el-tab-pane label="我的歌单" name="myPlayList">
        <MyPlayList :myPlayList="myPlayList"></MyPlayList>
      </el-tab-pane>
    </el-tabs>
  </section>
  <Transition name="audio-bar">
    <AudioBar v-if="hasCurrentSong"></AudioBar>
  </Transition>
  <LoginCard v-model="isVisible" @loginSuccess="handleLoginSuccess"></LoginCard>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import LoginCard from "./components/loginCard/index.vue";
import RecommendPlayList from "./components/recommendPlayList.vue";
import MyPlayList from "./components/myPlayList/index.vue";
import TopList from "./components/topList/index.vue";
import AudioBar from "./components/audioBar.vue";
import TopBar from "./components/topBar.vue";
import { useUserStore } from "./hooks/useUserStore";
import { useMusicTabs } from "./hooks/useMusicTabs";
import { useAudioPlayer } from "./hooks/useAudioPlayer";

const { getLoginStatus } = useUserStore();
const { activeName, recommendPlayList, myPlayList, topList, loadCurrentList } = useMusicTabs();
const { hasCurrentSong } = useAudioPlayer();
const isVisible = ref(false);

const handleVisibleLoginCard = () => {
  isVisible.value = true;
};

const handleLoginSuccess = () => {
  loadCurrentList();
};

const handleLogout = () => {
  loadCurrentList();
};

onMounted(() => {
  getLoginStatus();
  loadCurrentList();
});
</script>

<style scoped src="./index.scss" lang="scss"></style>
