<template>
    <section class="cloud-music-page">
        <!-- <div class="ambient-grid" aria-hidden="true"></div>
        <div class="ambient-disc ambient-disc--primary" aria-hidden="true"></div>
        <div class="ambient-disc ambient-disc--accent" aria-hidden="true"></div> -->
        <!-- <loginCard /> -->
        <el-tabs v-model="activeName" class="music-tabs" @tab-click="handleClick">
            <el-tab-pane label="歌单广场" name="playLists">
                <RecommendPlayList :recommendPlayList="recommendPlayList"></RecommendPlayList>
            </el-tab-pane>
            <el-tab-pane label="我的收藏" name="collect">我的收藏</el-tab-pane>
            <el-tab-pane label="我喜欢" name="favorite">我喜欢</el-tab-pane>
            <el-tab-pane label="登录" name="login">
                <LoginCard></LoginCard>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import LoginCard from './components/loginCard.vue';
import RecommendPlayList from './components/recommendPlayList.vue';
import { getRecommendationPlayListApi } from './api';
import { RecommendPlaylistItem } from './type';
import { ElMessage } from 'element-plus';
const activeName = ref('playLists')
const handleClick = () => {

}
// 推荐歌单
const recommendPlayList = ref<RecommendPlaylistItem[]>([])
const getRecommendationPlayList = async () => {
    const res = await getRecommendationPlayListApi()
    if (res.code === 200) {
        recommendPlayList.value = res.result
    } else {
        recommendPlayList.value = []
        ElMessage.warning('获取推荐歌单失败~')
    }
}
onMounted(() => {
    getRecommendationPlayList()
})
</script>

<style scoped src="./index.scss" lang="scss"></style>
