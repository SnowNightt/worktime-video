<template>
  <section
    class="top-list-panel"
    :class="{ 'is-document-hidden': !isDocumentVisible }"
    aria-labelledby="ranking-title"
  >
    <header class="ranking-overview">
      <h1 id="ranking-title">排行榜</h1>
      <span class="ranking-total" :aria-label="`共 ${lists.length} 个榜单`">
        {{ lists.length }}
      </span>
    </header>

    <div v-if="lists.length" class="ranking-content">
      <section v-if="featuredTopLists.length" class="top-section featured-section">
        <div class="section-heading">
          <h2>榜单推荐</h2>
          <span>{{ featuredTopLists.length }}</span>
        </div>

        <button
          v-if="featuredTopList"
          class="featured-hero"
          type="button"
          :aria-label="`打开${featuredTopList.name}`"
          @click="openTopList(featuredTopList)"
        >
          <img
            class="hero-fluid hero-fluid-primary"
            :src="getTopListCover(featuredTopList)"
            alt=""
            aria-hidden="true"
          />
          <img
            class="hero-fluid hero-fluid-secondary"
            :src="getTopListCover(featuredTopList)"
            alt=""
            aria-hidden="true"
          />

          <img
            class="featured-cover"
            :src="getTopListCover(featuredTopList)"
            :alt="`${featuredTopList.name}封面`"
          />

          <div class="featured-copy">
            <h3 :title="featuredTopList.name">{{ featuredTopList.name }}</h3>
            <p>{{ featuredTopList.updateFrequency || "持续更新" }}</p>
            <span>
              {{ featuredTopList.trackCount }} 首 ·
              {{ formatPlayCount(featuredTopList.playCount) }} 播放
            </span>
          </div>

          <span class="featured-action" aria-hidden="true">
            <el-icon><VideoPlay /></el-icon>
          </span>
        </button>

        <div v-if="featuredNavigation.length" class="featured-navigation" aria-label="其他推荐榜单">
          <button
            v-for="item in featuredNavigation"
            :key="item.id"
            class="featured-nav-item"
            type="button"
            :title="`${item.name} · ${item.updateFrequency || `${item.trackCount} 首`}`"
            :aria-label="`打开${item.name}`"
            @click="openTopList(item)"
          >
            <img :src="getTopListCover(item)" alt="" />
            <span>{{ item.name }}</span>
          </button>
        </div>
      </section>

      <section v-if="primaryOfficialTopLists.length" class="top-section official-section">
        <div class="section-heading">
          <h2>官方榜</h2>
          <span>{{ primaryOfficialTopLists.length }}</span>
        </div>

        <div class="official-ledger">
          <button
            v-for="(item, index) in primaryOfficialTopLists"
            :key="item.id"
            class="official-row"
            type="button"
            :aria-label="`第 ${index + 1} 名，打开${item.name}`"
            @click="openTopList(item)"
          >
            <span class="official-index">{{ String(index + 1).padStart(2, "0") }}</span>
            <img class="official-cover" :src="getTopListCover(item)" alt="" />

            <div class="official-copy">
              <div class="official-title-line">
                <h3 :title="item.name">{{ item.name }}</h3>
                <span>{{ item.updateFrequency || "持续更新" }}</span>
              </div>

              <ol v-if="getPreviewTracks(item).length" class="track-preview">
                <li v-for="(track, trackIndex) in getPreviewTracks(item)" :key="`${item.id}-${trackIndex}`">
                  <strong>{{ trackIndex + 1 }}</strong>
                  <span :title="track">{{ track }}</span>
                </li>
              </ol>

              <p class="row-meta">
                <span>{{ item.trackCount }} 首</span>
                <span>{{ formatPlayCount(item.playCount) }} 播放</span>
              </p>
            </div>

            <el-icon class="row-play-icon" aria-hidden="true"><VideoPlay /></el-icon>
          </button>
        </div>
      </section>

      <section v-if="categoryGroups.length" class="top-section category-section">
        <div class="section-heading category-heading">
          <h2>分类浏览</h2>
          <span>{{ activeCategoryGroup?.items.length ?? 0 }}</span>
        </div>

        <div class="category-tabs" role="tablist" aria-label="榜单分类">
          <button
            v-for="group in categoryGroups"
            :id="`ranking-tab-${group.key}`"
            :key="group.key"
            class="category-tab"
            :class="{ 'is-active': activeCategoryKey === group.key }"
            type="button"
            role="tab"
            :aria-selected="activeCategoryKey === group.key"
            :aria-controls="`ranking-panel-${group.key}`"
            @click="activeCategoryKey = group.key"
          >
            {{ group.title }}
          </button>
        </div>

        <Transition name="category-swap" mode="out-in">
          <div
            v-if="activeCategoryGroup"
            :id="`ranking-panel-${activeCategoryGroup.key}`"
            :key="activeCategoryGroup.key"
            class="category-list"
            role="tabpanel"
            :aria-labelledby="`ranking-tab-${activeCategoryGroup.key}`"
          >
            <button
              v-for="(item, index) in activeCategoryGroup.items"
              :key="item.id"
              class="category-row"
              type="button"
              :style="getStaggerStyle(index)"
              :aria-label="`打开${item.name}`"
              @click="openTopList(item)"
            >
              <img class="category-cover" :src="getTopListCover(item)" alt="" />
              <div class="category-copy">
                <h3 :title="item.name">{{ item.name }}</h3>
                <p>
                  <span>{{ item.updateFrequency || `${item.trackCount} 首` }}</span>
                  <span>{{ formatPlayCount(item.playCount) }} 播放</span>
                </p>
              </div>
              <el-icon class="row-play-icon" aria-hidden="true"><VideoPlay /></el-icon>
            </button>
          </div>
        </Transition>
      </section>
    </div>

    <div v-else class="ranking-empty" role="status">
      <strong>暂无榜单</strong>
      <span>切换到其他页面后再回来试试</span>
    </div>
  </section>

  <MusicListCard
    v-model="musicListVisible"
    :music-list="musicList"
    :top-list-meta="selectedTopList"
    :status="detailStatus"
    @retry="retryTopList"
  />
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { CSSProperties } from "vue";
import { ElMessage } from "element-plus";
import { VideoPlay } from "@element-plus/icons-vue";
import { getDetailPlayList } from "../../api";
import type {
  Song,
  ToplistDetailStatus,
  ToplistDialogMeta,
  ToplistItem,
} from "../../type";
import MusicListCard from "../musicListCard/index.vue";

interface ToplistPreviewTrack {
  first?: string;
  second?: string;
}

type CategoryKey = "style" | "global" | "other";

interface CategoryGroup {
  key: CategoryKey;
  title: string;
  items: ToplistItem[];
}

const props = defineProps<{
  topList: ToplistItem[];
}>();

const musicListVisible = ref(false);
const musicList = ref<Song[]>([]);
const selectedTopList = ref<ToplistDialogMeta | null>(null);
const detailStatus = ref<ToplistDetailStatus>("idle");
const activeCategoryKey = ref<CategoryKey>("style");
const isDocumentVisible = ref(!document.hidden);
const firstTrackCovers = ref<Record<number, string>>({});
const topListDetailCache = new Map<number, Song[]>();
const topListDetailRequests = new Map<number, Promise<Song[]>>();
let detailRequestId = 0;

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

const featuredTopList = computed(() => featuredTopLists.value[0]);
const featuredNavigation = computed(() => featuredTopLists.value.slice(1));

const officialTopLists = computed(() => {
  const official = lists.value.filter(item => officialNames.some(name => item.name.includes(name)));
  return official.length ? official : lists.value.slice(0, 4);
});

const primaryOfficialTopLists = computed(() => officialTopLists.value.slice(0, 4));
const officialIds = computed(() => new Set(officialTopLists.value.map(item => item.id)));

const styleTopLists = computed(() => {
  return lists.value.filter(item => {
    return !officialIds.value.has(item.id) && styleKeywords.some(keyword => item.name.includes(keyword));
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

const categoryGroups = computed<CategoryGroup[]>(() => {
  return [
    { key: "style", title: "曲风榜", items: styleTopLists.value },
    { key: "global", title: "全球榜", items: globalTopLists.value },
    { key: "other", title: "更多榜单", items: otherTopLists.value },
  ].filter(group => group.items.length) as CategoryGroup[];
});

const activeCategoryGroup = computed(() => {
  return (
    categoryGroups.value.find(group => group.key === activeCategoryKey.value) ??
    categoryGroups.value[0]
  );
});

const visibleTopLists = computed(() => {
  const uniqueItems = new Map<number, ToplistItem>();
  [
    ...featuredTopLists.value,
    ...primaryOfficialTopLists.value,
    ...(activeCategoryGroup.value?.items ?? []),
  ].forEach(item => uniqueItems.set(item.id, item));
  return [...uniqueItems.values()];
});

watch(categoryGroups, groups => {
  if (groups.length && !groups.some(group => group.key === activeCategoryKey.value)) {
    activeCategoryKey.value = groups[0].key;
  }
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

const getTopListCover = (item: ToplistItem) => {
  return firstTrackCovers.value[item.id] || item.coverImgUrl;
};

const fetchTopListSongs = (id: number) => {
  const cachedSongs = topListDetailCache.get(id);
  if (cachedSongs) {
    return Promise.resolve(cachedSongs);
  }

  const pendingRequest = topListDetailRequests.get(id);
  if (pendingRequest) {
    return pendingRequest;
  }

  const request = getDetailPlayList({ id })
    .then(res => {
      if (res.code !== 200) {
        throw new Error("Failed to load top list detail");
      }

      const songs = res.playlist?.tracks ?? [];
      const firstTrackCover = songs[0]?.al?.picUrl;
      topListDetailCache.set(id, songs);

      if (firstTrackCover) {
        firstTrackCovers.value = {
          ...firstTrackCovers.value,
          [id]: firstTrackCover,
        };

        if (selectedTopList.value?.id === id) {
          selectedTopList.value = {
            ...selectedTopList.value,
            coverImgUrl: firstTrackCover,
          };
        }
      }

      return songs;
    })
    .finally(() => {
      topListDetailRequests.delete(id);
    });

  topListDetailRequests.set(id, request);
  return request;
};

async function prefetchTopListCovers(items: ToplistItem[]) {
  const pendingItems = items.filter(item => {
    return !firstTrackCovers.value[item.id] && !topListDetailCache.has(item.id);
  });

  for (let index = 0; index < pendingItems.length; index += 4) {
    const batch = pendingItems.slice(index, index + 4);
    await Promise.allSettled(batch.map(item => fetchTopListSongs(item.id)));
  }
}

watch(
  visibleTopLists,
  items => {
    void prefetchTopListCovers(items);
  },
  { immediate: true }
);

const toDialogMeta = (item: ToplistItem): ToplistDialogMeta => ({
  id: item.id,
  name: item.name,
  coverImgUrl: getTopListCover(item),
  updateFrequency: item.updateFrequency,
  trackCount: item.trackCount,
});

const loadTopList = async (item: ToplistItem | ToplistDialogMeta) => {
  const requestId = ++detailRequestId;
  detailStatus.value = "loading";
  musicList.value = [];

  try {
    const songs = await fetchTopListSongs(item.id);
    if (requestId !== detailRequestId) return;

    musicList.value = songs;
    detailStatus.value = "success";
  } catch {
    if (requestId !== detailRequestId) return;
    detailStatus.value = "error";
    ElMessage.warning("获取榜单歌曲失败");
  }
};

const openTopList = (item: ToplistItem) => {
  selectedTopList.value = toDialogMeta(item);
  musicListVisible.value = true;
  void loadTopList(item);
};

const retryTopList = () => {
  if (selectedTopList.value) {
    void loadTopList(selectedTopList.value);
  }
};

const getStaggerStyle = (index: number) => {
  return { "--item-index": Math.min(index, 3) } as CSSProperties;
};

const syncDocumentVisibility = () => {
  isDocumentVisible.value = !document.hidden;
};

onMounted(() => {
  document.addEventListener("visibilitychange", syncDocumentVisibility);
});

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", syncDocumentVisibility);
});
</script>

<style src="./index.scss" lang="scss" scoped></style>
