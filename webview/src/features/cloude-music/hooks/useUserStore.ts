import { ref } from "vue";
import { AccountDetail } from "../type";
import { getAccountInfoApi, getLoginStatusApi, getUserInfoApi } from "../api";
import { ElMessage } from "element-plus";

// 用户信息状态管理
const userInfo = ref<AccountDetail | null>(null);
// 存储用户状态
const setUserInfo = (data: AccountDetail) => {
  userInfo.value = data;
};
const clearUserInfo = () => {
  userInfo.value = null;
};
// 获取登录状态
const getLoginStatus = async () => {
  const res = await getLoginStatusApi({ ua: "pc" });
  if (res.data.code === 200 && res.data.profile) {
    await getAccountInfo();
  }
};
// 获取账号详情-暂时不用
const getAccountInfo = async () => {
  const res = await getAccountInfoApi();
  if (res.code === 200 && res.profile) {
    setUserInfo({ account: res.account, profile: res.profile });
  } else {
    ElMessage.error("获取用户信息失败~");
  }
};
// 获取用户详细
const getUserInfo = async (uid: number) => {
  const res = await getUserInfoApi({ uid });
};
export const useUserStore = () => {
  return {
    userInfo,
    setUserInfo,
    clearUserInfo,
    getLoginStatus,
    getAccountInfo,
  };
};
