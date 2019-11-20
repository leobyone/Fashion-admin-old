import axios from "axios";
import auth from "./auth.js";
import router from "../router";
import store from "../store";
import Vue from "vue";

let base = "";

const config = {
  baseURL: base + "/api"
};

let instance = axios.create(config);
let baseInstance = axios.create();
var storeTemp = store;

//http请求拦截
instance.interceptors.request.use(
  config => {
    var curTime = new Date();
    var expiretime = new Date(Date.parse(storeTemp.state.tokenExpire));

    if (
      storeTemp.state.token &&
      (curTime < expiretime && storeTemp.state.tokenExpire)
    ) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = "Bearer " + storeTemp.state.token;
    }

    saveRefreshtime();

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

//http响应拦截
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 超时请求处理
    var originalRequest = error.config;
    if (
      error.code == "ECONNABORTED" &&
      error.message.indexOf("timeout") != -1 &&
      !originalRequest._retry
    ) {
      Vue.prototype.$message({
        message: "请求超时！",
        type: "error"
      });

      originalRequest._retry = true;
      return null;
    }

    if (error.response) {
      if (error.response.status == 401) {
        var curTime = new Date();
        var refreshtime = new Date(Date.parse(window.localStorage.refreshtime));
        // 在用户操作的活跃期内
        if (window.localStorage.refreshtime && curTime <= refreshtime) {
          return auth
            .refreshToken({ token: window.localStorage.Token })
            .then(res => {
              if (res.success) {
                Vue.prototype.$message({
                  message: "refreshToken success! loading data...",
                  type: "success"
                });

                store.commit("saveToken", res.token);

                var curTime = new Date();
                var expiredate = new Date(
                  curTime.setSeconds(curTime.getSeconds() + res.expires_in)
                );
                store.commit("saveTokenExpire", expiredate);

                error.config.__isRetryRequest = true;
                error.config.headers.Authorization = "Bearer " + res.token;
                return axios(error.config);
              } else {
                // 刷新token失败 清除token信息并跳转到登录页面
                ToLogin();
              }
            });
        } else {
          // 返回 401，并且不知用户操作活跃期内 清除token信息并跳转到登录页面
          ToLogin();
        }
      }
      // 403 无权限
      if (error.response.status == 403) {
        Vue.prototype.$message({
          message: "失败！该操作无权限",
          type: "error"
        });
        return null;
      }
    }
    return ""; // 返回接口返回的错误信息
  }
);

export const saveRefreshtime = () => {
  let nowtime = new Date();
  let lastRefreshtime = window.localStorage.refreshtime
    ? new Date(window.localStorage.refreshtime)
    : new Date(-1);
  let expiretime = new Date(Date.parse(window.localStorage.TokenExpire));

  let refreshCount = 1; //滑动系数
  if (lastRefreshtime >= nowtime) {
    lastRefreshtime = nowtime > expiretime ? nowtime : expiretime;
    lastRefreshtime.setMinutes(lastRefreshtime.getMinutes() + refreshCount);
    window.localStorage.refreshtime = lastRefreshtime;
  } else {
    window.localStorage.refreshtime = new Date(-1);
  }
};

const ToLogin = () => {
  store.commit("saveToken", "");
  store.commit("saveTokenExpire", "");
  store.commit("saveTagsData", "");
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("NavigationBar");

  router.replace({
    path: "/login",
    query: { redirect: router.currentRoute.fullPath }
  });

  window.location.reload();
};

//instance添加Authorization验证,baseInstance默认实例不添加
const ajax = {
  instance() {
    return instance;
  },
  baseInstance() {
    return baseInstance;
  },
  get(url, params) {
    return new Promise((resolve, reject) => {
      instance
        .get(url, params)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  post(url, params) {
    return new Promise((resolve, reject) => {
      instance
        .post(url, params)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  put(url, params) {
    return new Promise((resolve, reject) => {
      instance
        .put(url, params)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  delete(url, params) {
    return new Promise((resolve, reject) => {
      instance
        .delete(url, params)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default ajax;
