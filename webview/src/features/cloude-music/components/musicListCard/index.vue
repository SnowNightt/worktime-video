<template>
  <el-dialog
    v-model="dialogVisible"
    width="min(520px, calc(100vw - 20px))"
    :before-close="handleClose"
    class="music-dialog"
    modal-class="music-dialog-overlay"
    align-center
    :lock-scroll="false"
  >
    <template #header>
      <div class="music-dialog-header">
        <img
          v-if="topListMeta?.coverImgUrl"
          class="dialog-chart-cover"
          :src="topListMeta.coverImgUrl"
          alt=""
        />
        <span
          v-else
          class="dialog-chart-cover dialog-chart-cover-placeholder"
          aria-hidden="true"
        ></span>

        <div class="music-dialog-title-group">
          <h2 :title="topListMeta?.name || '歌曲列表'">
            {{ topListMeta?.name || "歌曲列表" }}
          </h2>
          <p>
            <span>{{ topListMeta?.updateFrequency || "持续更新" }}</span>
            <span>{{ displayedTrackCount }} 首</span>
          </p>
        </div>
      </div>
    </template>

    <section class="music-list-panel" :aria-busy="status === 'loading'">
      <div
        v-if="status === 'loading'"
        class="music-list-skeleton"
        role="status"
        aria-label="正在加载歌曲"
      >
        <div v-for="index in 7" :key="index" class="skeleton-row">
          <span class="skeleton-cover"></span>
          <span class="skeleton-lines">
            <i></i>
            <i></i>
          </span>
          <span class="skeleton-time"></span>
        </div>
      </div>

      <div v-else-if="status === 'error'" class="music-list-state" role="alert">
        <strong>榜单暂时没有加载成功</strong>
        <span>网络恢复后可以重新获取</span>
        <button type="button" @click="emit('retry')">
          <el-icon><RefreshRight /></el-icon>
          重新加载
        </button>
      </div>

      <div v-else-if="!tableConfig.tableData.length" class="music-list-state" role="status">
        <strong>暂无歌曲</strong>
        <span>这个榜单目前还没有可播放内容</span>
      </div>

      <div v-else class="song-list" role="list" aria-label="榜单歌曲">
        <button
          v-for="(row, index) in tableConfig.tableData"
          :key="row.id"
          class="song-row"
          :class="{ 'is-playing': isCurrentSong(row.id) }"
          type="button"
          role="listitem"
          :aria-label="`${row.title}，${row.singer}，双击或按 Enter 播放`"
          :aria-current="isCurrentSong(row.id) ? 'true' : undefined"
          title="双击或按 Enter 播放"
          @dblclick="handleSelectMusic(row)"
          @keydown.enter.prevent="handleSelectMusic(row)"
          @keydown.space.prevent="handleSelectMusic(row)"
        >
          <span class="song-index" aria-hidden="true">{{
            String(index + 1).padStart(2, "0")
          }}</span>
          <img v-if="row.albumPic" class="song-cover" :src="row.albumPic" alt="" />
          <span v-else class="song-cover song-cover-placeholder" aria-hidden="true"></span>

          <span class="song-info">
            <span class="song-title">{{ row.title }}</span>
            <span class="song-secondary">
              <span class="song-artist">{{ row.singer }}</span>
              <span class="song-album">{{ row.album }}</span>
            </span>
          </span>

          <span v-if="isCurrentSong(row.id)" class="playing-indicator" aria-label="正在播放">
            <i></i><i></i><i></i>
          </span>
          <time v-else class="song-duration">{{ row.duration }}</time>
        </button>
      </div>
    </section>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from "vue";
import { RefreshRight } from "@element-plus/icons-vue";
import type { TableConfigType } from "@/types/tableConfig";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import type { Song, ToplistDetailStatus, ToplistDialogMeta } from "../../type";

interface Props {
  musicList: Song[];
  topListMeta: ToplistDialogMeta | null;
  status?: ToplistDetailStatus;
}

interface MusicItem {
  id: number;
  title: string;
  album: string;
  duration: string;
  albumPic: string;
  singer: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  retry: [];
}>();

const dialogVisible = defineModel<boolean>({
  default: false,
});

const tableConfig = reactive<TableConfigType<MusicItem[]>>({
  tableData: [],
});

const { getMusicUrl, currentSongInfo } = useAudioPlayer();

const displayedTrackCount = computed(() => {
  return tableConfig.tableData.length || props.topListMeta?.trackCount || 0;
});

const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

watch(
  () => props.musicList,
  newVal => {
    tableConfig.tableData = newVal.map(item => ({
      id: item.id,
      title: item.name,
      album: item.al.name,
      duration: formatDuration(item.dt),
      albumPic: item.al.picUrl,
      singer: item.ar.map(artist => artist.name).join(" / ") || "未知歌手",
    }));
  },
  { immediate: true }
);

const handleClose = () => {
  dialogVisible.value = false;
};

const isCurrentSong = (id: number) => currentSongInfo.value?.id === id;

const handleSelectMusic = async (row: MusicItem) => {
  await getMusicUrl(row.id, props.musicList);
};
</script>

<style lang="scss" src="./index.scss"></style>
