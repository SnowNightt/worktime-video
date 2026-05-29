<template>
  <div class="top-bar-container">
    <div class="search-box"></div>
    <div class="login-status">
      <el-icon @click="visibleLoginCard" v-if="!userInfo?.profile">
        <UserFilled />
      </el-icon>
      <el-dropdown placement="bottom" size="small" popper-class="cloud-music-user-dropdown" v-else>
        <img :src="userInfo?.profile.avatarUrl" class="avatar" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { UserFilled } from "@element-plus/icons-vue";
import { ref } from "vue";
import { useUserStore } from "../hooks/useUserStore";
import { logoutApi } from "../api";
import { ElMessage } from "element-plus";
import { removeCookie } from "@/utils/cookie";

const { userInfo, clearUserInfo } = useUserStore();
const emit = defineEmits<{
  visibleLoginCard: [];
  successLogout: [];
}>();
const visibleLoginCard = () => {
  emit("visibleLoginCard");
};
// 退出登录
const handleLogout = async () => {
  const res = await logoutApi();
  if (res.code) {
    removeCookie();
    ElMessage.success("退出登录成功~");
    clearUserInfo();
    emit("successLogout");
  }
};
</script>
<style lang="scss" scoped>
.top-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 42px;
  padding: 0 12px;

  .login-status {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 100%;
    min-height: 34px;
    width: 34px;

    :deep(.el-dropdown) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      outline: none;
    }

    .avatar {
      width: 28px;
      height: 28px;
      object-fit: cover;
      border-radius: 50%;
      border: 1px solid rgba(171, 178, 191, 0.32);
      background: rgba(24, 26, 31, 0.62);
      transition: border-color 0.18s ease;
    }

    .avatar:hover,
    .avatar:focus-visible {
      border-color: rgba(97, 175, 239, 0.62);
    }
  }
}

:global(.cloud-music-user-dropdown.el-popper),
:global(.cloud-music-user-dropdown.el-popper.is-light) {
  border: 1px solid rgba(171, 178, 191, 0.2);
  border-radius: 10px;
  background: rgba(24, 26, 31, 0.96);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.36);
}

:global(.cloud-music-user-dropdown .el-dropdown-menu) {
  min-width: 104px;
  padding: 6px;
  border: 0;
  background: transparent;
  box-shadow: none;
}

:global(.cloud-music-user-dropdown .el-dropdown-menu__item) {
  height: 32px;
  border-radius: 7px;
  color: rgba(215, 218, 224, 0.78);
  font-weight: 600;
  transition:
    color 0.18s ease,
    background-color 0.18s ease;
}

:global(.cloud-music-user-dropdown .el-dropdown-menu__item:not(.is-disabled):hover),
:global(.cloud-music-user-dropdown .el-dropdown-menu__item:not(.is-disabled):focus) {
  color: #f0f3f8;
  background: rgba(97, 175, 239, 0.16);
}

:global(.cloud-music-user-dropdown.el-popper.is-light .el-popper__arrow::before) {
  border-color: rgba(171, 178, 191, 0.2);
  background: rgba(24, 26, 31, 0.96);
}
</style>
