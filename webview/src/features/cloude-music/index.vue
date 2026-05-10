<template>
  <section class="cloud-music-page">
    <TopBar @visibleLoginCard="handleVisibleLoginCard"></TopBar>
    <el-tabs v-model="activeName" class="music-tabs" @tab-click="handleClick">
      <el-tab-pane label="歌单广场" name="playLists">
        <RecommendPlayList :recommendPlayList="recommendPlayList"></RecommendPlayList>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="collect">我的收藏</el-tab-pane>
      <el-tab-pane label="我喜欢" name="favorite">我喜欢</el-tab-pane>
    </el-tabs>
  </section>
  <AudioBar></AudioBar>
  <LoginCard v-model="isVisible"></LoginCard>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import LoginCard from "./components/loginCard.vue";
import RecommendPlayList from "./components/recommendPlayList.vue";
import AudioBar from "./components/audioBar.vue";
import { getRecommendationPlayListApi } from "./api";
import { RecommendPlaylistItem } from "./type";
import { ElMessage } from "element-plus";
import TopBar from "./components/topBar.vue";
const activeName = ref("playLists");
const handleClick = () => {};
const isVisible = ref(false);
const handleVisibleLoginCard = () => {
  console.log(111);

  isVisible.value = true;
};
// 推荐歌单
const recommendPlayList = ref<RecommendPlaylistItem[]>([]);
const getRecommendationPlayList = async () => {
  const res = await getRecommendationPlayListApi({ limit: 30, timestamp: new Date().getTime() });
  if (res.code === 200) {
    recommendPlayList.value = res.result;
  } else {
    recommendPlayList.value = [];
    ElMessage.warning("获取推荐歌单失败~");
  }
};
onMounted(() => {
  getRecommendationPlayList();
});
</script>

<style scoped src="./index.scss" lang="scss"></style>
