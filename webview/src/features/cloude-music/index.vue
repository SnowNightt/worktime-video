<template>
  <section class="cloud-music-page">
    <TopBar @visibleLoginCard="handleVisibleLoginCard" @successLogout="handleLogout"></TopBar>
    <el-tabs v-model="activeName" class="music-tabs" @tab-click="handleClick">
      <el-tab-pane label="歌单广场" name="playLists">
        <RecommendPlayList :recommendPlayList="recommendPlayList"></RecommendPlayList>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="collect">我的收藏</el-tab-pane>
      <el-tab-pane label="我喜欢" name="favorite">我喜欢</el-tab-pane>
    </el-tabs>
  </section>
  <AudioBar></AudioBar>
  <LoginCard v-model="isVisible" @loginSuccess="handleLoginSuccess"></LoginCard>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import LoginCard from "./components/loginCard/index.vue";
import RecommendPlayList from "./components/recommendPlayList.vue";
import AudioBar from "./components/audioBar.vue";
import { getAccountInfoApi, getRecommendationPlayListApi, getUserInfoApi } from "./api";
import { RecommendPlaylistItem } from "./type";
import { ElMessage } from "element-plus";
import TopBar from "./components/topBar.vue";
import { useUserStore } from "./hooks/useUserStore";
import { useMusicTabs } from "./hooks/useMusicTabs";

const { getLoginStatus } = useUserStore();
const { activeName, recommendPlayList, collectList, favoriteList, loadCurrentList } =
  useMusicTabs();
// const activeName = ref("playLists");
const handleClick = () => {};
// 控制登录弹窗
const isVisible = ref(false);
const handleVisibleLoginCard = () => {
  isVisible.value = true;
};
const handleLoginSuccess = () => {
  loadCurrentList();
};
// 退出登录成功
const handleLogout = () => {
  loadCurrentList();
};
onMounted(() => {
  getLoginStatus();
  loadCurrentList();
});
</script>

<style scoped src="./index.scss" lang="scss"></style>
