<template>
  <el-dialog
    v-model="dialogVisible"
    class="cloud-music-login-dialog"
    modal-class="cloud-music-login-overlay"
    width="min(92vw, 420px)"
    align-center
    :show-close="true"
    @close="handleClose"
  >
    <!-- <div class="brand-mark" aria-hidden="true">
      <span class="brand-mark__ring"></span>
      <span class="brand-mark__note"></span>
    </div> -->

    <div class="login-header">
      <p class="eyebrow">Music Login</p>
      <h1 class="title">登录网易云音乐</h1>
    </div>
    <el-tabs v-model="activeName" @tab-change="changeLoginMethod">
      <el-tab-pane label="验证码登录" name="captcha">
        <el-form :model="loginForm" label-position="top" class="login-form">
          <el-form-item label="手机号" prop="phoneNum">
            <el-input
              v-model="loginForm.phoneNum"
              class="glass-input"
              placeholder="请输入手机号"
              :maxlength="11"
              clearable
            />
          </el-form-item>

          <el-form-item label="验证码" prop="captcha">
            <div class="captcha-box">
              <el-input
                v-model="loginForm.captcha"
                class="glass-input captcha-input"
                placeholder="请输入验证码"
                clearable
              />
              <el-button v-if="!isRequestCaptcha" class="query-captcha-btn" @click="requestCaptcha">
                获取验证码
              </el-button>
              <div v-else class="countdown" aria-live="polite">{{ countDown }} s</div>
            </div>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button class="login-btn" type="primary" @click="handleLogin">登录</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="二维码登录" name="QRCode">
        <div class="qr-code-panel">
          <img class="qr-code-image" :src="imgUrl" v-if="imgUrl" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import {
  checkQRCodeApi,
  getCaptchaApi,
  getDetailPlayList,
  getLoginStatusApi,
  getRecommendationPlayListApi,
  getUserInfoApi,
  loginApi,
  queryQRCodeBase64Api,
  queryQRCodeKeyApi,
  verifyCaptchaApi,
} from "../api";
import { useUserStore } from "../hooks/useUserStore";

const { getLoginStatus } = useUserStore();
const dialogVisible = defineModel({
  default: false,
});
const emit = defineEmits<{
  loginSuccess: [];
}>();
// 验证码登录表单
const loginForm = reactive({
  phoneNum: "",
  captcha: "",
});
const activeName = ref("captcha");
// 是否正在获取验证码
const isRequestCaptcha = ref<boolean>(false);
// 倒计时
const countDown = ref(60);
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
// 用于判断当前是否还在轮询，轮询接口还没返回若关闭登录弹窗当接口返回后await后的代码还会执行，会继续轮询，因此要加个判断
const isPolling = ref(false);
// 清除上一轮轮询
const clearPoll = () => {
  isPolling.value = false;
  if (!pollTimer.value) return;
  clearTimeout(pollTimer.value);
  pollTimer.value = null;
};
// 轮询二维码扫码状态
const pollTimer = ref<number | null>(null);
const startQrLoginPoll = () => {
  clearPoll();
  isPolling.value = true;
  const poll = async () => {
    if (!isPolling.value) return;
    try {
      const res = await checkQRCodeApi({
        timestamp: new Date().getTime(),
        key: qrCodeKey.value,
        ua: "pc",
      });
      if (!isPolling.value) return;
      switch (res.code) {
        case 800:
          clearPoll();
          ElMessage.warning("二维码过期，请重新获取二维码");
          break;
        case 801:
          console.log("待扫码");
          pollTimer.value = window.setTimeout(poll, 2000);
          break;
        case 802:
          console.log("待确认");
          pollTimer.value = window.setTimeout(poll, 2000);
          break;
        case 803:
          console.log("授权成功");
          clearPoll();
          // 获取登录状态
          await getLoginStatus();
          emit("loginSuccess");
          dialogVisible.value = false;
          break;
      }
    } catch (error) {
      ElMessage.warning("获取扫码状态失败");
      console.error(error);
      clearPoll();
    }
  };

  poll();
};
const imgUrl = ref("");
// 获取二维码base64
const getQRCode = async () => {
  const res = await queryQRCodeBase64Api({
    key: qrCodeKey.value,
    timestamp: new Date().getTime(),
    qrimg: true,
    ua: "pc",
    platform: "web",
  });
  if (res.code === 200) {
    imgUrl.value = res.data.qrimg;
    setTimeout(() => {
      startQrLoginPoll();
    }, 500);
  }
};
const qrCodeKey = ref("");
// 获取登录二维码
const getQRCodeKey = async () => {
  const res = await queryQRCodeKeyApi({ timestamp: new Date().getTime() });
  if (res.code === 200) {
    qrCodeKey.value = res.data.unikey;
    getQRCode();
  }
};
// 切换登录方式
const changeLoginMethod = (name: string) => {
  if (name === "QRCode") {
    getQRCodeKey();
  }
};
// 获取验证码
const requestCaptcha = async () => {
  if (!loginForm.phoneNum.trim()) {
    ElMessage.warning("请先输入手机号");
    return;
  }
  const res = await getCaptchaApi({
    phone: loginForm.phoneNum,
  });
  if (res.code === 200) {
    isRequestCaptcha.value = true;
    startCountDown();
  } else {
    ElMessage.error("获取验证码失败");
  }
};
// 验证验证码
const verifyCaptcha = async () => {
  if (!loginForm.phoneNum.trim() || !loginForm.captcha.trim()) {
    ElMessage.warning("请填写手机号和验证码");
    return;
  }
  const res = await verifyCaptchaApi({
    phone: loginForm.phoneNum,
    captcha: loginForm.captcha,
    timestamp: new Date().getTime(),
  });
  if (res.code === 200 && res.data) {
    setTimeout(() => {
      getLogin();
    }, 1000);
  } else {
    ElMessage.error("验证码错误");
  }
};
// 验证码正确后登录
const getLogin = async () => {
  const res = await loginApi({
    phone: loginForm.phoneNum,
    captcha: loginForm.captcha,
    timestamp: new Date().getTime(),
    password: "",
  });
  if (res.code === 200) {
    ElMessage.success("登录成功~");
  } else {
    ElMessage.error(res.message || "登录失败，请稍后再试~");
  }
};
const handleLogin = async () => {
  verifyCaptcha();
};
const handleClose = () => {
  activeName.value = "captcha";
  clearPoll();
};
</script>

<style scoped lang="scss">
:global(.cloud-music-login-overlay) {
  background:
    radial-gradient(circle at 26% 22%, rgba(97, 175, 239, 0.16), transparent 34%),
    radial-gradient(circle at 76% 18%, rgba(229, 192, 123, 0.08), transparent 28%),
    rgba(12, 14, 18, 0.46);
  backdrop-filter: blur(8px) saturate(112%);
  -webkit-backdrop-filter: blur(8px) saturate(112%);
}

:global(.cloud-music-login-dialog.el-dialog) {
  --el-dialog-padding-primary: 0;

  position: relative;
  overflow: hidden;
  color: var(--login-text, #111827);
  border: 1px solid var(--login-glass-border, rgba(171, 178, 191, 0.22));
  border-radius: 20px;
  background:
    radial-gradient(circle at 20% 0%, rgba(97, 175, 239, 0.14), transparent 34%),
    radial-gradient(circle at 86% 10%, rgba(229, 192, 123, 0.1), transparent 30%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.035) 42%),
    var(--login-glass-bg, rgba(40, 44, 52, 0.62));
  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.36),
    0 10px 28px rgba(12, 14, 18, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px) saturate(128%);
  -webkit-backdrop-filter: blur(20px) saturate(128%);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

:global(.cloud-music-login-dialog.el-dialog::before) {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: "";
  background:
    linear-gradient(118deg, rgba(255, 255, 255, 0.16), transparent 32%),
    linear-gradient(250deg, transparent 22%, rgba(255, 255, 255, 0.05), transparent 68%);
  opacity: 0.84;
}

:global(.cloud-music-login-dialog.el-dialog::after) {
  position: absolute;
  inset: 1px;
  pointer-events: none;
  content: "";
  border-radius: 19px;
  background-image:
    linear-gradient(rgba(171, 178, 191, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(171, 178, 191, 0.035) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: linear-gradient(180deg, #000, transparent 78%);
  opacity: 0.54;
}

:global(.cloud-music-login-dialog.el-dialog:hover) {
  transform: translateY(-2px);
  border-color: rgba(171, 178, 191, 0.3);
  box-shadow:
    0 30px 78px rgba(0, 0, 0, 0.42),
    0 14px 34px rgba(12, 14, 18, 0.3),
    0 0 0 1px rgba(97, 175, 239, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

:global(.cloud-music-login-dialog .el-dialog__header) {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
}

:global(.cloud-music-login-dialog .el-dialog__headerbtn) {
  position: static;
  display: grid;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(171, 178, 191, 0.16);
  border-radius: 10px;
  background: rgba(24, 26, 31, 0.34);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  place-items: center;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;
}

:global(.cloud-music-login-dialog .el-dialog__headerbtn:hover),
:global(.cloud-music-login-dialog .el-dialog__headerbtn:focus-visible) {
  border-color: rgba(97, 175, 239, 0.36);
  background: rgba(24, 26, 31, 0.58);
  transform: translateY(-1px);
}

:global(.cloud-music-login-dialog .el-dialog__close) {
  color: rgba(215, 218, 224, 0.72);
  font-size: 17px;
}

:global(.cloud-music-login-dialog .el-dialog__body) {
  position: relative;
  z-index: 1;
  padding: 34px 34px 32px;
}

.brand-mark {
  position: relative;
  display: grid;
  width: 64px;
  height: 64px;
  margin: 0 auto 22px;
  place-items: center;
  border: 1px solid rgba(171, 178, 191, 0.28);
  border-radius: 20px;
  background:
    radial-gradient(circle at 28% 18%, rgba(255, 255, 255, 0.22), transparent 22%),
    linear-gradient(145deg, rgba(171, 178, 191, 0.16), rgba(24, 26, 31, 0.48));
  box-shadow:
    0 14px 30px rgba(0, 0, 0, 0.26),
    0 0 34px rgba(97, 175, 239, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.brand-mark__ring {
  width: 34px;
  height: 34px;
  border: 7px solid rgba(171, 178, 191, 0.78);
  border-right-color: rgba(97, 175, 239, 0.42);
  border-radius: 50%;
  box-shadow: 0 7px 18px rgba(97, 175, 239, 0.16);
}

.brand-mark__note {
  position: absolute;
  right: 17px;
  bottom: 14px;
  width: 10px;
  height: 22px;
  border-radius: 999px;
  background: linear-gradient(180deg, #d7dae0, #61afef);
  transform: rotate(18deg);

  &::after {
    position: absolute;
    right: -8px;
    bottom: -3px;
    width: 15px;
    height: 10px;
    content: "";
    border-radius: 999px;
    background: inherit;
  }
}

.login-header {
  margin-bottom: 28px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 8px;
  color: rgba(97, 175, 239, 0.92);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}

.title {
  margin: 0;
  color: var(--login-text, #111827);
  font-size: 25px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.22;
  text-wrap: pretty;
}

.subtitle {
  margin: 10px 0 0;
  color: var(--login-muted, rgba(17, 24, 39, 0.62));
  font-size: 14px;
  line-height: 1.7;
  text-wrap: pretty;
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    height: auto;
    margin-bottom: 8px;
    color: rgba(215, 218, 224, 0.82);
    font-size: 13px;
    font-weight: 650;
    line-height: 1.25;
  }
}

.glass-input {
  width: 100%;

  :deep(.el-input__wrapper) {
    min-height: 44px;
    padding: 0 14px;
    border: 1px solid rgba(171, 178, 191, 0.18);
    border-radius: 12px;
    background: rgba(24, 26, 31, 0.38);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 8px 18px rgba(0, 0, 0, 0.16);
    transition:
      border-color 160ms ease,
      background 160ms ease,
      box-shadow 160ms ease;
  }

  :deep(.el-input__inner) {
    color: #e5e8ee;
  }

  :deep(.el-input__inner::placeholder) {
    color: rgba(215, 218, 224, 0.42);
  }

  :deep(.el-input__wrapper:hover),
  :deep(.el-input__wrapper.is-focus) {
    border-color: rgba(97, 175, 239, 0.46);
    background: rgba(24, 26, 31, 0.52);
    box-shadow:
      0 0 0 3px rgba(97, 175, 239, 0.12),
      0 10px 22px rgba(0, 0, 0, 0.2);
  }
}

.captcha-box {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 116px;
  gap: 10px;
  width: 100%;
}

.query-captcha-btn,
.countdown {
  min-height: 44px;
  border: 1px solid rgba(171, 178, 191, 0.18);
  border-radius: 12px;
  font-weight: 700;
}

.query-captcha-btn {
  color: rgba(215, 218, 224, 0.86);
  background: rgba(24, 26, 31, 0.36);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
  transition:
    color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;

  &:hover,
  &:focus-visible {
    color: #f5f7fb;
    border-color: rgba(97, 175, 239, 0.34);
    background:
      linear-gradient(135deg, rgba(97, 175, 239, 0.28), rgba(171, 178, 191, 0.12)),
      rgba(24, 26, 31, 0.54);
    box-shadow: 0 12px 24px rgba(97, 175, 239, 0.14);
    transform: translateY(-1px);
  }
}

.countdown {
  display: grid;
  color: rgba(215, 218, 224, 0.64);
  background: rgba(24, 26, 31, 0.38);
  place-items: center;
}

.qr-code-panel {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 18px 0 4px;
}

.qr-code-image {
  display: block;
  width: min(220px, 100%);
  height: auto;
}

.dialog-footer {
  display: flex;
  margin-top: 26px;
}

.login-btn {
  width: 100%;
  min-height: 46px;
  border: 1px solid rgba(171, 178, 191, 0.16);
  border-radius: 13px;
  background:
    linear-gradient(
      135deg,
      rgba(97, 175, 239, 0.42),
      rgba(171, 178, 191, 0.2) 48%,
      rgba(127, 132, 142, 0.42)
    ),
    rgba(24, 26, 31, 0.34);
  box-shadow:
    0 14px 30px rgba(0, 0, 0, 0.26),
    0 0 28px rgba(97, 175, 239, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
  color: #f5f7fb;
  font-size: 15px;
  font-weight: 700;
  transition:
    filter 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;

  &:hover,
  &:focus-visible {
    filter: brightness(1.04);
    border-color: rgba(97, 175, 239, 0.32);
    box-shadow:
      0 16px 34px rgba(0, 0, 0, 0.3),
      0 0 34px rgba(97, 175, 239, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: 420px) {
  :global(.cloud-music-login-dialog.el-dialog) {
    border-radius: 16px;
  }

  :global(.cloud-music-login-dialog.el-dialog::after) {
    border-radius: 15px;
  }

  :global(.cloud-music-login-dialog .el-dialog__body) {
    padding: 28px 22px 24px;
  }

  .captcha-box {
    grid-template-columns: 1fr;
  }

  .query-captcha-btn,
  .countdown {
    width: 100%;
  }
}
</style>
