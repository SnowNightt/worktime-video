<template>
  <div class="play-list-container" @click="handleClickList">
    <article
      class="playlist-card"
      v-for="item in recommendPlayList"
      :key="item.id"
      :data-list-id="item.id"
    >
      <div class="cover-wrap" :data-list-id="item.id">
        <img class="cover" :src="item.picUrl" alt="playlist cover" :data-list-id="item.id" />
        <div class="cover-shade" :data-list-id="item.id">
          <span class="play-count" :data-list-id="item.id">{{
            formatPlayCount(item.playCount)
          }}</span>
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
import { ref } from "vue";
import { getDetailPlayList } from "../api";
import { RecommendPlaylistItem, Song } from "../type";
import { ElMessage } from "element-plus";
import MusicListCard from "./musicListCard/index.vue";

interface Props {
  recommendPlayList: RecommendPlaylistItem[];
}

defineProps<Props>();

const musicListVisible = ref(false);
const musicList = ref<Song[]>([]);

const formatPlayCount = (count: number) => {
  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}B 播放`;
  }

  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}W 播放`;
  }

  return `${count} 播放`;
};

const handleClickList = async (event: PointerEvent) => {
  const target = event.target as HTMLElement;
  const card = target.closest<HTMLElement>("[data-list-id]");
  const id = Number(card?.dataset.listId);

  if (!id) {
    return;
  }

  const res = await getDetailPlayList({ id });
  if (res.code) {
    musicList.value = res.playlist?.tracks;
    musicListVisible.value = true;
  } else {
    musicList.value = [];
    ElMessage.warning("获取歌曲列表失败~");
  }
};
</script>

<style lang="scss" scoped>
.play-list-container {
  --playlist-grid-gap: 10px;

  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(112px, max(0px, calc((100% - var(--playlist-grid-gap)) / 2))), 1fr)
  );
  gap: var(--playlist-grid-gap);
  height: calc(100dvh - 122px);
  padding: 2px 2px 18px;
  grid-auto-rows: max-content;
  overflow-y: auto;
}

.playlist-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(171, 178, 191, 0.14);
  border-radius: 10px;
  background: rgba(24, 26, 31, 0.42);
  transition:
    border-color 180ms ease,
    background 180ms ease;

  &:hover {
    border-color: rgba(97, 175, 239, 0.34);
    background: rgba(24, 26, 31, 0.58);
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
  padding: 3px 7px;
  border-radius: 999px;
  color: rgba(245, 247, 251, 0.92);
  background: rgba(24, 26, 31, 0.58);
  font-size: 11px;
  font-weight: 650;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-info {
  padding: 10px;
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
</style>
