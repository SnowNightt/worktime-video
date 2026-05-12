import { ref } from "vue";
import { AccountDetail } from "../type";

// 用户信息状态管理
const userInfo = ref<AccountDetail | null>(null);
// 存储用户状态
const setUserInfo = (data: AccountDetail) => {
  userInfo.value = data;
};
const clearUserInfo = () => {
  userInfo.value = null;
};
export const useUserStore = () => {
  return {
    userInfo,
    setUserInfo,
    clearUserInfo,
  };
};
