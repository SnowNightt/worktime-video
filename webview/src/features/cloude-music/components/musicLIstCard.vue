<template>
    <el-dialog v-model="dialogVisible" width="95%" height :before-close="handleClose" top="30px" class="music-dialog"
        modal-class="music-dialog-overlay">
        <el-table :data="tableConfig.tableData" width="100%" style="height: 75vh;" @row-dblclick="handleSelectMusic">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column v-for="music in tableConfig.columns" :prop="music.prop" :show-overflow-tooltip="true"
                :label="music.label">

            </el-table-column>
        </el-table>
        <audio ref="audioRef" controls />
    </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { SongItem } from '../type';
import { TableConfigType } from '@/types/tableConfig';
import { getMusicUrlApi } from '../api';
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
const props = defineProps<Props>()
const dialogVisible = defineModel<boolean>({
    default: false
})
const tableConfig = reactive<TableConfigType<MusicItem[]>>({
    tableData: [],
    columns: [
        { prop: 'title', label: '标题', width: '250px' },
        { prop: 'album', label: '专辑', width: '220px' },
        { prop: 'duration', label: '时长', width: '120px' },
    ]
})
// 毫秒转分钟
const formatDuration = (ms: number) => {
    const during = (ms / 1000 / 60).toFixed(2)
    const min = during.split('.')[0].padStart(2, '0')
    const sec = during.split('.')[1]
    return `${min}:${sec}`
}
watch(
    () => props.musicList,
    (newVal) => {
        tableConfig.tableData = newVal.map((item) => {
            return {
                id: item.id,
                title: item.name,
                album: item.al.name,
                duration: formatDuration(item.dt),
                albumPic: item.al.picUrl,
                singer: item.ar[0].name
            }
        })
        console.log(tableConfig.tableData);

    },
)
const handleClose = () => {
    dialogVisible.value = false
}
const audioRef = ref<HTMLAudioElement>()
// 播放音乐
const handleSelectMusic = async (row: MusicItem) => {
    const res = await getMusicUrlApi({ id: row.id, level: 'higher' })
    audioRef.value!.src = res.data[0].url
    audioRef.value!.play()
}
</script>
<style lang="scss">
.music-dialog {
    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.28);
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.22);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    overflow: hidden;
}

.music-dialog-overlay {
    background: rgba(15, 23, 42, 0.22);
    // backdrop-filter: blur(8px);
    // -webkit-backdrop-filter: blur(8px);
}

.music-dialog .el-dialog__header,
.music-dialog .el-dialog__body {
    background: transparent;
}

.music-dialog .el-dialog__header {
    padding-bottom: 8px;
}

.music-dialog .el-dialog__body {
    padding-top: 8px;
}

.music-dialog .el-table {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    color: #0f172a;
    --el-table-border-color: transparent;
    --el-table-row-border-color: transparent;
    --el-table-current-row-bg-color: rgba(255, 255, 255, 0.16);
    --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.16);
    --el-border-color-lighter: transparent;
}

.music-dialog .el-table th,
.music-dialog .el-table tr,
.music-dialog .el-table td,
.music-dialog .el-table .el-table__cell,
.music-dialog .el-table__inner-wrapper,
.music-dialog .el-table__body-wrapper,
.music-dialog .el-table__header-wrapper,
.music-dialog .el-table__fixed,
.music-dialog .el-table__fixed-right {
    background: transparent;
    border-bottom: none;
}

.music-dialog .el-table::before {
    display: none;
}

.music-dialog .el-table .el-table__body tr:hover>td.el-table__cell {
    background: rgba(255, 255, 255, 0.16) !important;
}

.music-dialog audio {
    width: 100%;
    margin-top: 16px;
    border-radius: 999px;
    opacity: 0.92;
}

.music-dialog .el-table__row {
    cursor: pointer;
}
</style>
