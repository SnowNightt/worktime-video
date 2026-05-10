<template>
  <div class="top-bar-container">
    <div class="search-box"></div>
    <div class="login">
      <el-icon @click="visibleLoginCard">
        <UserFilled />
      </el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { UserFilled } from "@element-plus/icons-vue";
import { ref } from "vue";
const emit = defineEmits<{
  visibleLoginCard: [];
}>();
const visibleLoginCard = () => {
  console.log(22);

  emit("visibleLoginCard");
};
</script>
<style lang="scss" scoped>
.top-bar-container {
  display: flex;
  justify-content: space-between;
  padding: 0 10px 8px;
  .login {
    cursor: pointer;
  }
}
</style>
