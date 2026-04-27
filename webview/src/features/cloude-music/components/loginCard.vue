<template>
    <el-dialog class="login-container" width="auto" :close-on-click-modal="false" :close-on-press-escape="false"
        v-model="visible" style="min-height: 500px;" :show-close="false">
        <div class="title">登录网易云</div>
        <div class="verification">
            <div class="phone">
                <span class="tag">手机号</span>
                <el-input placeholder="请输入手机号" v-model="phoneNum"></el-input>
            </div>
            <div class="captcha">
                <span class="tag">验证码</span>
                <div class="captcha-box">
                    <el-input placeholder="请输入验证码" class="captcha-input" v-model="captcha"></el-input>
                    <div v-if="!isRequestCaptcha" class="query-captcha-btn" @click="requestCaptcha">获取验证码</div>
                    <div v-else>{{ countDown }} s</div>
                </div>

            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="small" type="primary">登录</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { loginApi } from '../api';
import { request } from 'node_modules/axios/index.cjs';
import { ElMessage } from 'element-plus';

const visible = ref(true)
// 手机号
const phoneNum = ref<string>('')
// 验证码
const captcha = ref<string>('')
// 是否正在获取验证码
const isRequestCaptcha = ref<boolean>(false)
// 倒计时
const countDown = ref(60);
const isCounting = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;
let endTime = 0;

const startCountDown = () => {
    if (isCounting.value) return;
    isCounting.value = true;
    endTime = Date.now() + 60 * 1000;
    updateCountDown();
    timer = setInterval(() => {
        updateCountDown();
    }, 250); // 每250ms检查一次真实剩余时间
};
const updateCountDown = () => {
    const diff = endTime - Date.now();
    if (diff <= 0) {
        clearCountDown();
        return;
    }
    // 避免setInterval倒计时不准
    countDown.value = Math.ceil(diff / 1000);
};

const clearCountDown = () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    isCounting.value = false;
    isRequestCaptcha.value = false
    countDown.value = 60;
};
const requestCaptcha = async () => {
    const res = await loginApi({
        phone: phoneNum.value
    })
    console.log(111, res);
    if (res.code === 200) {
        isRequestCaptcha.value = true
        startCountDown()
    } else {
        ElMessage.error('获取验证码失败')
    }
}
// 登录
const handleLogin = async () => {


}
</script>
<style scoped lang="scss">
.login-container {
    .title {
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 30px;
    }

    .verification {

        .phone,
        .captcha {
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            .captcha-box {
                display: flex;

                .query-captcha-btn {
                    flex: 1;
                    cursor: pointer;
                }

                .captcha-input {
                    flex: 4;
                }
            }

            .tag {
                width: 70px;
            }
        }
    }
}
</style>