import { computed, ref } from "vue";

const loadingCount = ref(0);
const isLoading = computed(() => loadingCount.value > 0);
export const useLoading = () => {
  const startLoad = () => {
    loadingCount.value += 1;
  };
  const stopLoad = () => {
    loadingCount.value = Math.max(0, loadingCount.value - 1);
  };
  return {
    isLoading,
    startLoad,
    stopLoad,
  };
};
