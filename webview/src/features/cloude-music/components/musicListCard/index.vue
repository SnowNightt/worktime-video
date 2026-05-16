<template>
  <el-dialog
    v-model="dialogVisible"
    width="min(920px, calc(100vw - 32px))"
    :before-close="handleClose"
    top="24px"
    class="music-dialog"
    modal-class="music-dialog-overlay"
  >
    <template #header>
      <div class="music-dialog-header">
        <div class="music-dialog-title-group">
          <div>
            <h2>歌曲列表</h2>
          </div>
        </div>
        <div class="music-dialog-stat">
          <strong>{{ tableConfig.tableData.length }}</strong>
          <span>首歌</span>
        </div>
      </div>
    </template>

    <section class="music-list-panel">
      <el-table
        :data="tableConfig.tableData"
        height="100%"
        width="100%"
        empty-text="暂无歌曲"
        @row-dblclick="handleSelectMusic"
        :tooltip-options="{
          appendTo: 'body',
          popperClass: 'music-table-tooltip',
        }"
      >
        <!-- <el-table-column type="index" label="#" width="64" align="center"></el-table-column> -->
        <el-table-column prop="title" label="歌曲" min-width="150" :show-overflow-tooltip="true">
          <template #default="{ row }">
            <div class="song-cell">
              <img v-if="row.albumPic" class="song-cover" :src="row.albumPic" alt="" />
              <span v-else class="song-cover song-cover-placeholder" aria-hidden="true"></span>
              <div class="song-info">
                <span class="song-title">{{ row.title }}</span>
                <span class="song-artist">{{ row.singer }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="album"
          label="专辑"
          min-width="100"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="duration" label="时长" min-width="90" align="right">
          <template #default="{ row }">
            <span class="song-duration">{{ row.duration }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import { TableConfigType } from "@/types/tableConfig";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { SongItem } from "../../type";

interface Props {
  musicList: SongItem[];
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
const dialogVisible = defineModel<boolean>({
  default: false,
});

const tableConfig = reactive<TableConfigType<MusicItem[]>>({
  tableData: [],
  // columns: [
  //   { prop: "title", label: "标题", width: "150px" },
  //   { prop: "album", label: "专辑", width: "150px" },
  //   { prop: "duration", label: "时长", width: "120px" },
  // ],
});

const { getMusicUrl } = useAudioPlayer();

// 毫秒转分钟
const formatDuration = (ms: number) => {
  const during = (ms / 1000 / 60).toFixed(2);
  const min = during.split(".")[0].padStart(2, "0");
  const sec = during.split(".")[1];
  return `${min}:${sec}`;
};

watch(
  () => props.musicList,
  newVal => {
    tableConfig.tableData = newVal.map(item => {
      return {
        id: item.id,
        title: item.name,
        album: item.al.name,
        duration: formatDuration(item.dt),
        albumPic: item.al.picUrl,
        singer: item.ar[0].name,
      };
    });
  }
);

const handleClose = () => {
  dialogVisible.value = false;
};

// 播放音乐
const handleSelectMusic = async (row: MusicItem) => {
  getMusicUrl(row.id);
};
</script>

<style lang="scss" src="./index.scss"></style>
