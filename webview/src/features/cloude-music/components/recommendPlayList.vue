<template>
    <div class="play-list-container" @click="handleClickList">
        <div class="item" v-for="item in recommendPlayList">
            <img :src="item.picUrl" alt="图片失效" :data-list-id="item.id">
            <span class="list-name" :data-list-id="item.id">{{ item.name }}</span>
        </div>
    </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getDetailPlayList } from '../api';
import { RecommendPlaylistItem, SongItem } from '../type';
import { ElMessage } from 'element-plus';

interface Props {
    recommendPlayList: RecommendPlaylistItem[]
}
defineProps<Props>()
const musicList = ref<SongItem[]>([])
const handleClickList = async (event: PointerEvent) => {
    const target = event.target as HTMLElement
    const id = Number(target.dataset.listId)
    console.log(id);
    const res = await getDetailPlayList({ id })
    if (res.code) {
        musicList.value = res.playlist?.tracks
    } else {
        musicList.value = []
        ElMessage.warning('获取歌曲列表失败~')
    }

}
</script>
<style lang="scss" scoped>
.play-list-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    .item {
        width: 90%;
        height: 135%;
        cursor: pointer;

        img {
            width: 100%;
            object-fit: cover;
        }

        .list-name {
            width: 100%;
            display: inline-block;
            // white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>