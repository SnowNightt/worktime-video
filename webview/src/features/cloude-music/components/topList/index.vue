<template>
  <section class="top-list-panel">
    <section v-if="featuredTopLists.length" class="top-section">
      <div class="section-heading">
        <h2>榜单推荐</h2>
        <span>{{ featuredTopLists.length }}</span>
      </div>

      <div class="recommend-strip">
        <button
          v-for="item in featuredTopLists"
          :key="item.id"
          class="recommend-card"
          type="button"
          @click="openTopList(item.id)"
        >
          <img class="row-cover" :src="item.coverImgUrl" alt="" />
          <div class="row-body">
            <h3 :title="item.name">{{ item.name }}</h3>
            <p>{{ item.updateFrequency || `${item.trackCount} 首` }}</p>
          </div>
          <el-icon class="play-icon"><VideoPlay /></el-icon>
        </button>
      </div>
    </section>

    <section v-if="officialTopLists.length" class="top-section">
      <div class="section-heading">
        <h2>官方榜</h2>
        <span>{{ officialTopLists.length }}</span>
      </div>

      <div class="list-stack">
        <button
          v-for="item in officialTopLists"
          :key="item.id"
          class="list-row is-official"
          type="button"
          @click="openTopList(item.id)"
        >
          <img class="row-cover" :src="item.coverImgUrl" alt="" />

          <div class="row-body">
            <div class="row-title">
              <h3 :title="item.name">{{ item.name }}</h3>
              <span>{{ item.updateFrequency || "持续更新" }}</span>
            </div>

            <ol v-if="getPreviewTracks(item).length" class="track-preview">
              <li v-for="(track, index) in getPreviewTracks(item)" :key="`${item.id}-${index}`">
                <strong>{{ index + 1 }}</strong>
                <span :title="track">{{ track }}</span>
              </li>
            </ol>

            <p class="row-meta">
              <span>{{ item.trackCount }} 首</span>
              <span>{{ formatPlayCount(item.playCount) }} 播放</span>
            </p>
          </div>

          <el-icon class="play-icon"><VideoPlay /></el-icon>
        </button>
      </div>
    </section>

    <section v-for="group in topListGroups" :key="group.title" class="top-section">
      <div class="section-heading">
        <h2>{{ group.title }}</h2>
        <span>{{ group.items.length }}</span>
      </div>

      <div class="list-stack">
        <button
          v-for="item in group.items"
          :key="item.id"
          class="list-row"
          type="button"
          @click="openTopList(item.id)"
        >
          <img class="row-cover" :src="item.coverImgUrl" alt="" />

          <div class="row-body">
            <div class="row-title">
              <h3 :title="item.name">{{ item.name }}</h3>
            </div>
            <p class="row-meta">
              <span>{{ item.updateFrequency || `${item.trackCount} 首` }}</span>
              <span>{{ formatPlayCount(item.playCount) }} 播放</span>
            </p>
          </div>

          <el-icon class="play-icon"><VideoPlay /></el-icon>
        </button>
      </div>
    </section>
  </section>

  <MusicListCard v-model="musicListVisible" :musicList="musicList"></MusicListCard>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { VideoPlay } from "@element-plus/icons-vue";
import { getDetailPlayList } from "../../api";
import type { Song, ToplistItem } from "../../type";
import MusicListCard from "../musicListCard/index.vue";

interface ToplistPreviewTrack {
  first?: string;
  second?: string;
}

const props = defineProps<{
  topList: ToplistItem[];
}>();

const musicListVisible = ref(false);
const musicList = ref<Song[]>([]);

const lists = computed(() => props.topList ?? []);

const officialNames = ["飙升榜", "新歌榜", "原创榜", "热歌榜"];
const styleKeywords = ["电音", "R&B", "说唱", "ACG", "摇滚", "民谣", "古典", "国风", "DJ"];
const globalKeywords = [
  "美国",
  "英国",
  "UK",
  "日本",
  "韩国",
  "法国",
  "俄罗斯",
  "全球",
  "Billboard",
  "公信榜",
  "NJR",
  "iTunes",
  "Beatport",
];

const featuredTopLists = computed(() => {
  const preferred = lists.value.filter(item => {
    return item.opRecommend || ["ACG榜", "日本公信榜", "日语榜", "欧美热歌榜"].includes(item.name);
  });

  return (preferred.length ? preferred : lists.value).slice(0, 6);
});

const officialTopLists = computed(() => {
  const official = lists.value.filter(item => officialNames.some(name => item.name.includes(name)));
  return official.length ? official : lists.value.slice(0, 4);
});

const officialIds = computed(() => new Set(officialTopLists.value.map(item => item.id)));

const styleTopLists = computed(() => {
  return lists.value.filter(item => {
    return (
      !officialIds.value.has(item.id) && styleKeywords.some(keyword => item.name.includes(keyword))
    );
  });
});

const styleIds = computed(() => new Set(styleTopLists.value.map(item => item.id)));

const globalTopLists = computed(() => {
  return lists.value.filter(item => {
    return (
      !officialIds.value.has(item.id) &&
      !styleIds.value.has(item.id) &&
      globalKeywords.some(keyword => item.name.includes(keyword))
    );
  });
});

const otherTopLists = computed(() => {
  const usedIds = new Set([
    ...officialTopLists.value.map(item => item.id),
    ...styleTopLists.value.map(item => item.id),
    ...globalTopLists.value.map(item => item.id),
  ]);

  return lists.value.filter(item => !usedIds.has(item.id));
});

const topListGroups = computed(() => {
  return [
    { title: "曲风榜", items: styleTopLists.value },
    { title: "全球榜", items: globalTopLists.value },
    { title: "更多榜单", items: otherTopLists.value },
  ].filter(group => group.items.length);
});

const getPreviewTracks = (item: ToplistItem) => {
  const tracks = Array.isArray(item.tracks) ? (item.tracks as ToplistPreviewTrack[]) : [];
  return tracks.slice(0, 3).map(track => {
    const title = track.first ?? "";
    const artist = track.second ?? "";
    return artist ? `${title} - ${artist}` : title;
  });
};

const formatPlayCount = (count = 0) => {
  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}亿`;
  }

  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }

  return `${count}`;
};

const openTopList = async (id: number) => {
  const res = await getDetailPlayList({ id });
  if (res.code === 200) {
    musicList.value = res.playlist?.tracks ?? [];
    musicListVisible.value = true;
  } else {
    musicList.value = [];
    ElMessage.warning("获取榜单歌曲失败~");
  }
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
