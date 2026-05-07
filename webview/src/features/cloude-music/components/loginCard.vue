<template>
    <el-card class="login-container" shadow="never">
        <div class="brand-mark" aria-hidden="true">
            <span class="brand-mark__ring"></span>
            <span class="brand-mark__note"></span>
        </div>

        <div class="login-header">
            <p class="eyebrow">Music Login</p>
            <h1 class="title">登录网易云音乐</h1>
        </div>

        <el-form :model="loginForm" label-position="top" class="login-form">
            <el-form-item label="手机号" prop="phoneNum">
                <el-input v-model="loginForm.phoneNum" class="glass-input" placeholder="请输入手机号" :maxlength="11"
                    clearable />
            </el-form-item>

            <el-form-item label="验证码" prop="captcha">
                <div class="captcha-box">
                    <el-input v-model="loginForm.captcha" class="glass-input captcha-input" placeholder="请输入验证码"
                        clearable />
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
    </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

import { getCaptchaApi, getDetailPlayList, getRecommendationPlayListApi, loginApi, verifyCaptchaApi } from '../api';

const loginForm = reactive({
    phoneNum: '',
    captcha: '',
});

const isRequestCaptcha = ref<boolean>(false);
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

const requestCaptcha = async () => {
    if (!loginForm.phoneNum.trim()) {
        ElMessage.warning('请先输入手机号');
        return;
    }

    const res = await getCaptchaApi({
        phone: loginForm.phoneNum,
    });

    if (res.code === 200) {
        isRequestCaptcha.value = true;
        startCountDown();
    } else {
        ElMessage.error('获取验证码失败');
    }
};
// 验证验证码
const verifyCaptcha = async () => {
    if (!loginForm.phoneNum.trim() || !loginForm.captcha.trim()) {
        ElMessage.warning('请填写手机号和验证码');
        return
    }
    const res = await verifyCaptchaApi({ phone: loginForm.phoneNum, captcha: loginForm.captcha, timestamp: new Date().getTime() })
    if (res.code === 200 && res.data) {
        getLogin()
    } else {
        ElMessage.error('验证码错误')
    }
}
// 验证码正确后登录
const getLogin = async () => {
    const res = await loginApi({
        phone: loginForm.phoneNum,
        captcha: loginForm.captcha,
        timestamp: new Date().getTime(),
        password: ''
    })
    if (res.code === 200) {
        ElMessage.success('登录成功~')
    } else {
        ElMessage.error(res.message || '登录失败，请稍后再试~')
    }
}
const handleLogin = async () => {
    verifyCaptcha()
};
</script>

<style scoped lang="scss">
.login-container {
    position: relative;
    width: min(100%, 420px);
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

    &::before {
        position: absolute;
        inset: 0;
        pointer-events: none;
        content: '';
        background:
            linear-gradient(118deg, rgba(255, 255, 255, 0.16), transparent 32%),
            linear-gradient(250deg, transparent 22%, rgba(255, 255, 255, 0.05), transparent 68%);
        opacity: 0.84;
    }

    &::after {
        position: absolute;
        inset: 1px;
        pointer-events: none;
        content: '';
        border-radius: 19px;
        background-image:
            linear-gradient(rgba(171, 178, 191, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(171, 178, 191, 0.035) 1px, transparent 1px);
        background-size: 22px 22px;
        mask-image: linear-gradient(180deg, #000, transparent 78%);
        opacity: 0.54;
    }

    &:hover {
        transform: translateY(-2px);
        border-color: rgba(171, 178, 191, 0.3);
        box-shadow:
            0 30px 78px rgba(0, 0, 0, 0.42),
            0 14px 34px rgba(12, 14, 18, 0.3),
            0 0 0 1px rgba(97, 175, 239, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
    }

    :deep(.el-card__body) {
        position: relative;
        z-index: 1;
        padding: 34px 34px 32px;
    }
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
        content: '';
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
        linear-gradient(135deg, rgba(97, 175, 239, 0.42), rgba(171, 178, 191, 0.2) 48%, rgba(127, 132, 142, 0.42)),
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
    .login-container {
        border-radius: 16px;

        :deep(.el-card__body) {
            padding: 28px 22px 24px;
        }
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
