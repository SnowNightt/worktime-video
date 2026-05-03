import { ref } from "vue";
import { getMusicUrlApi } from "../api";
// 当前音乐url、名称
const currentUrl = ref("");
const currentSong = ref("");
export const useAudioPlayer = () => {
  // 获取音乐url
  const getMusicUrl = async (id: number) => {
    const res = await getMusicUrlApi({ id, level: "higher" });
    currentUrl.value = res.data[0].url;
    console.log(currentUrl.value);
  };
  return {
    currentSong,
    currentUrl,
    getMusicUrl,
  };
};
