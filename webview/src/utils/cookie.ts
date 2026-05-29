const COOKIE_KEY = "music_cookie";
export const getCookie = () => {
  return localStorage.getItem(COOKIE_KEY);
};
export const setCookie = (cookie: string) => {
  localStorage.setItem(COOKIE_KEY, cookie);
};
export const removeCookie = () => {
  localStorage.removeItem(COOKIE_KEY);
};
