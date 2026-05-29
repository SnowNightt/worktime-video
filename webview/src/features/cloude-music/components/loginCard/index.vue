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
} from "../../api";
import { useUserStore } from "../../hooks/useUserStore";
import { useCountDown } from "../../hooks/useCountDown";
import { setCookie } from "@/utils/cookie";
const { getLoginStatus } = useUserStore();
const { isRequestCaptcha, countDown, startCountDown } = useCountDown();
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
          setCookie(res.cookie);
        }
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
  const res = await queryQRCodeKeyApi();
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

<style scoped lang="scss" src="./index.scss"></style>
