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

import { loginApi } from '../api';

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

    const res = await loginApi({
        phone: loginForm.phoneNum,
    });

    if (res.code === 200) {
        isRequestCaptcha.value = true;
        startCountDown();
    } else {
        ElMessage.error('获取验证码失败');
    }
};

const handleLogin = () => {
    if (!loginForm.phoneNum.trim() || !loginForm.captcha.trim()) {
        ElMessage.warning('请填写手机号和验证码');
    }
};
</script>

<style scoped lang="scss">
.login-container {
    position: relative;
    width: min(100%, 420px);
    overflow: hidden;
    color: var(--login-text, #111827);
    border: 1px solid var(--login-glass-border, rgba(255, 255, 255, 0.52));
    border-radius: 22px;
    background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.34)),
        var(--login-glass-bg, rgba(255, 255, 255, 0.28));
    box-shadow:
        0 18px 44px rgba(255, 107, 122, 0.12),
        0 10px 26px rgba(42, 49, 68, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(16px) saturate(135%);
    -webkit-backdrop-filter: blur(16px) saturate(135%);
    transition:
        transform 180ms ease,
        box-shadow 180ms ease;

    &::before {
        position: absolute;
        inset: 0;
        pointer-events: none;
        content: '';
        background:
            radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.78), transparent 32%),
            linear-gradient(120deg, rgba(255, 255, 255, 0.22), transparent 46%);
        opacity: 0.82;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow:
            0 22px 52px rgba(255, 107, 122, 0.16),
            0 12px 30px rgba(42, 49, 68, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.75);
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
    border: 2px solid rgba(255, 255, 255, 0.78);
    border-radius: 24px 24px 18px 24px;
    background:
        radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.82), transparent 20%),
        linear-gradient(145deg, rgba(255, 255, 255, 0.58), rgba(255, 244, 248, 0.28));
    box-shadow:
        0 12px 26px rgba(255, 107, 122, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.brand-mark__ring {
    width: 34px;
    height: 34px;
    border: 7px solid var(--login-primary, #d73a31);
    border-right-color: rgba(255, 107, 122, 0.22);
    border-radius: 50%;
    box-shadow: 0 7px 14px rgba(255, 107, 122, 0.18);
}

.brand-mark__note {
    position: absolute;
    right: 17px;
    bottom: 14px;
    width: 10px;
    height: 22px;
    border-radius: 999px;
    background: var(--login-primary, #d73a31);
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
    color: var(--login-primary, #ff6b7a);
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
        color: var(--login-text, #111827);
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
        border: 1px solid rgba(255, 255, 255, 0.76);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.58);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            0 8px 18px rgba(42, 49, 68, 0.06);
        transition:
            border-color 160ms ease,
            background 160ms ease,
            box-shadow 160ms ease;
    }

    :deep(.el-input__wrapper:hover),
    :deep(.el-input__wrapper.is-focus) {
        border-color: rgba(255, 107, 122, 0.42);
        background: rgba(255, 255, 255, 0.78);
        box-shadow:
            0 0 0 3px rgba(255, 107, 122, 0.12),
            0 10px 22px rgba(42, 49, 68, 0.08);
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
    border: 1px solid rgba(255, 107, 122, 0.2);
    border-radius: 14px;
    font-weight: 700;
}

.query-captcha-btn {
    color: var(--login-primary, #ff6b7a);
    background: rgba(255, 255, 255, 0.56);
    box-shadow: 0 8px 18px rgba(255, 107, 122, 0.08);
    transition:
        color 160ms ease,
        background 160ms ease,
        box-shadow 160ms ease,
        transform 160ms ease;

    &:hover,
    &:focus-visible {
        color: #ffffff;
        border-color: transparent;
        background: var(--login-primary, #d73a31);
        box-shadow: 0 12px 24px rgba(255, 107, 122, 0.2);
        transform: translateY(-1px);
    }
}

.countdown {
    display: grid;
    color: var(--login-muted, rgba(17, 24, 39, 0.62));
    background: rgba(255, 255, 255, 0.42);
    place-items: center;
}

.dialog-footer {
    display: flex;
    margin-top: 26px;
}

.login-btn {
    width: 100%;
    min-height: 46px;
    border: 0;
    border-radius: 15px;
    background:
        linear-gradient(135deg, var(--login-primary, #d73a31), var(--login-primary-strong, #b91f1a));
    box-shadow:
        0 14px 28px rgba(255, 107, 122, 0.24),
        inset 0 1px 0 rgba(255, 255, 255, 0.24);
    font-size: 15px;
    font-weight: 700;
    transition:
        filter 160ms ease,
        box-shadow 160ms ease,
        transform 160ms ease;

    &:hover,
    &:focus-visible {
        filter: brightness(1.04);
        box-shadow:
            0 16px 32px rgba(255, 107, 122, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
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
