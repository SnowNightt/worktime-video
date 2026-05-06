<template>
    <div class="play-list-container" @click="handleClickList">
        <article class="playlist-card" v-for="item in recommendPlayList" :key="item.id" :data-list-id="item.id">
            <div class="cover-wrap" :data-list-id="item.id">
                <img class="cover" :src="item.picUrl" alt="playlist cover" :data-list-id="item.id">
                <div class="cover-shade" :data-list-id="item.id">
                    <span class="play-count" :data-list-id="item.id">{{ formatPlayCount(item.playCount) }}</span>
                </div>
            </div>
            <div class="playlist-info" :data-list-id="item.id">
                <h3 class="list-name" :title="item.name" :data-list-id="item.id">{{ item.name }}</h3>
                <div class="playlist-meta" :data-list-id="item.id">
                    <span :data-list-id="item.id">{{ item.trackCount }} 首</span>
                    <span v-if="item.copywriter" :data-list-id="item.id">{{ item.copywriter }}</span>
                </div>
            </div>
        </article>
    </div>
    <MusicListCard v-model="musicListVisible" :musicList="musicList"></MusicListCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getDetailPlayList } from '../api';
import { RecommendPlaylistItem, SongItem } from '../type';
import { ElMessage } from 'element-plus';
import MusicListCard from './musicLIstCard.vue'

interface Props {
    recommendPlayList: RecommendPlaylistItem[]
}

defineProps<Props>();

const musicListVisible = ref(false)
const musicList = ref<SongItem[]>([])

const formatPlayCount = (count: number) => {
    if (count >= 100000000) {
        return `${(count / 100000000).toFixed(1)}B 播放`
    }

    if (count >= 10000) {
        return `${(count / 10000).toFixed(1)}W 播放`
    }

    return `${count} 播放`
}

const handleClickList = async (event: PointerEvent) => {
    const target = event.target as HTMLElement
    const card = target.closest<HTMLElement>('[data-list-id]')
    const id = Number(card?.dataset.listId)

    if (!id) {
        return
    }

    const res = await getDetailPlayList({ id })
    if (res.code) {
        musicList.value = res.playlist?.tracks
        musicListVisible.value = true
    } else {
        musicList.value = []
        ElMessage.warning('获取歌曲列表失败~')
    }
}
</script>

<style lang="scss" scoped>
.play-list-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
    gap: 18px;
    align-items: stretch;
    padding: 4px 2px 24px;
}

.playlist-card {
    position: relative;
    min-width: 0;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(171, 178, 191, 0.14);
    border-radius: 14px;
    background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.075), transparent 34%),
        rgba(24, 26, 31, 0.42);
    box-shadow:
        0 14px 34px rgba(0, 0, 0, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.075);
    backdrop-filter: blur(14px) saturate(118%);
    -webkit-backdrop-filter: blur(14px) saturate(118%);
    transition:
        border-color 180ms ease,
        box-shadow 180ms ease,
        transform 180ms ease;

    &:hover {
        border-color: rgba(97, 175, 239, 0.34);
        box-shadow:
            0 18px 42px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(97, 175, 239, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        transform: translateY(-3px);
    }

    &:hover .cover {
        transform: scale(1.045);
    }

    &:hover .playlist-meta span:last-child {
        color: rgba(215, 218, 224, 0.76);
    }
}

.cover-wrap {
    position: relative;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    background: rgba(24, 26, 31, 0.5);
}

.cover {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 220ms ease;
}

.cover-shade {
    position: absolute;
    inset: auto 0 0;
    display: flex;
    justify-content: flex-end;
    padding: 34px 10px 9px;
    background: linear-gradient(180deg, transparent, rgba(12, 14, 18, 0.78));
}

.play-count {
    max-width: 100%;
    overflow: hidden;
    padding: 4px 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    color: rgba(245, 247, 251, 0.92);
    background: rgba(24, 26, 31, 0.52);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    font-size: 11px;
    font-weight: 650;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.playlist-info {
    padding: 11px 11px 13px;
}

.list-name {
    display: -webkit-box;
    min-height: 38px;
    margin: 0;
    overflow: hidden;
    color: #e5e8ee;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 1.45;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.playlist-meta {
    display: grid;
    gap: 4px;
    margin-top: 9px;
    color: rgba(215, 218, 224, 0.58);
    font-size: 11px;
    line-height: 1.45;

    span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    span:first-child {
        color: rgba(97, 175, 239, 0.78);
        font-weight: 650;
    }

    span:last-child {
        transition: color 180ms ease;
    }
}

@media (max-width: 420px) {
    .play-list-container {
        grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
        gap: 14px;
    }

    .playlist-info {
        padding: 10px;
    }
}
</style>
