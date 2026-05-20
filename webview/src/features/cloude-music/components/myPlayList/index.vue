<template>
  <section class="my-playlist-panel">
    <div v-if="hasPlaylists" class="playlist-dashboard">
      <div class="playlist-masonry">
        <div
          v-for="item in playlists"
          :key="item.id"
          class="owned-card"
          :class="getCardClass(item)"
          @click="openPlaylist(item.id)"
        >
          <div class="owned-cover-wrap">
            <img class="owned-cover" :src="item.coverImgUrl" alt="" />
            <span class="owned-badge">{{ getPlaylistBadge(item) }}</span>
          </div>

          <div class="owned-content">
            <div class="owned-heading">
              <h3 :title="item.name">{{ item.name }}</h3>
            </div>

            <p v-if="item.description" :title="item.description">{{ item.description }}</p>
            <div v-else class="tag-row">
              <span v-for="tag in getDisplayTags(item)" :key="tag">{{ tag }}</span>
            </div>

            <div class="owned-footer">
              <span>
                <el-icon><List /></el-icon>
                {{ item.trackCount }} 首
              </span>
              <span>
                <el-icon><Headset /></el-icon>
                {{ formatPlayCount(item.playCount) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-disc" aria-hidden="true">
        <el-icon><FolderOpened /></el-icon>
      </div>
      <h2>还没有歌单</h2>
      <p>登录后会在这里展示你创建和收藏的歌单。</p>
    </div>
  </section>

  <MusicListCard v-model="musicListVisible" :musicList="musicList"></MusicListCard>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { FolderOpened, Headset, List } from "@element-plus/icons-vue";
import { getDetailPlayList } from "../../api";
import { SongItem, UserPlaylistItem } from "../../type";
import MusicListCard from "../musicListCard/index.vue";

const props = defineProps<{
  myPlayList: UserPlaylistItem[];
}>();

const musicListVisible = ref(false);
const musicList = ref<SongItem[]>([]);

const playlists = computed(() => props.myPlayList ?? []);
const hasPlaylists = computed(() => {
  return playlists.value.length > 0;
});

const formatPlayCount = (count = 0) => {
  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}亿`;
  }

  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }

  return `${count}`;
};

const formatDate = (time?: number) => {
  if (!time) {
    return "未更新";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(time));
};

const getPlaylistBadge = (item: UserPlaylistItem) => {
  if (item.highQuality) {
    return "精品";
  }

  if (item.subscribed) {
    return "收藏";
  }

  if (item.privacy) {
    return "私密";
  }

  return "自建";
};

const getDisplayTags = (item: UserPlaylistItem) => {
  if (item.tags?.length) {
    return item.tags.slice(0, 3);
  }
  return item.subscribed ? ["收藏歌单", "持续更新"] : ["私人歌单"];
};

const getCardClass = (item: UserPlaylistItem) => {
  return {
    "is-quiet": item.subscribed,
    "is-fresh": Date.now() - item.updateTime < 1000 * 60 * 60 * 24 * 30,
  };
};

const openPlaylist = async (id: number) => {
  const res = await getDetailPlayList({ id });
  if (res.code === 200) {
    musicList.value = res.playlist?.tracks ?? [];
    musicListVisible.value = true;
  } else {
    musicList.value = [];
    ElMessage.warning("获取歌曲列表失败~");
  }
};
</script>
<style src="./index.scss" scoped lang="scss"></style>
