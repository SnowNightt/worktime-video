import { ref } from "vue";

export const useCountDown = (seconds: number = 60) => {
  // 是否正在获取验证码
  const isRequestCaptcha = ref<boolean>(false);
  // 倒计时
  const countDown = ref(seconds);
  const isCounting = ref(false);
  let timer: ReturnType<typeof setInterval> | null = null;
  let endTime = 0;
  const startCountDown = () => {
    if (isCounting.value) {
      return;
    }
    isCounting.value = true;
    endTime = Date.now() + 60 * 1000;
    updateCountDown();
    timer = setInterval(updateCountDown, 250);
  };
  const updateCountDown = () => {
    const diff = endTime - Date.now();
    if (diff <= 0) {
      clearCountDown();
      return;
    }

    countDown.value = Math.ceil(diff / 1000);
  };

  const clearCountDown = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    isCounting.value = false;
    isRequestCaptcha.value = false;
    countDown.value = 60;
  };

  return {
    isRequestCaptcha,
    countDown,
    startCountDown,
  };
};
