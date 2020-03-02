import Vue from "vue";
import Router from "vue-router";
import store from "./store";

Vue.use(Router);

const routes = [
  {
    path: "/",
    redirect: "/dashboard"
  },
  {
    path: "/",
    component: resolve => require(["@/views/Home.vue"], resolve),
    meta: { title: "自述文件" },
    children: [
      {
        path: "dashboard",
        component: resolve => require(["@/views/Dashboard.vue"], resolve),
        meta: {
          title: "系统首页",
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: "user",
        component: resolve => require(["@/views/user/Index.vue"], resolve),
        meta: {
          title: "用户管理",
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        children: [
          {
            path: "list",
            component: resolve => require(["@/views/user/List.vue"], resolve),
            meta: {
              title: "用户列表",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          },
          {
            path: "addOrEdit/:id",
            name: "addOrEditUser",
            component: resolve =>
              require(["@/views/user/AddOrEdit.vue"], resolve),
            meta: {
              title: "添加/编辑用户",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          }
        ]
      },
      {
        path: "role",
        component: resolve => require(["@/views/role/Index.vue"], resolve),
        meta: {
          title: "角色管理",
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        children: [
          {
            path: "list",
            component: resolve => require(["@/views/role/List.vue"], resolve),
            meta: {
              title: "角色列表",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          },
          {
            path: "addOrEdit/:id",
            name: "addOrEditRole",
            component: resolve =>
              require(["@/views/role/AddOrEdit.vue"], resolve),
            meta: {
              title: "添加/编辑角色",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          },
          {
            path: "assign/:id",
            name: "assignPermission",
            component: resolve => require(["@/views/role/Assign.vue"], resolve),
            meta: {
              title: "权限分配",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          }
        ]
      },
      {
        path: "module",
        component: resolve => require(["@/views/module/Index.vue"], resolve),
        meta: {
          title: "接口管理",
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        children: [
          {
            path: "list",
            component: resolve => require(["@/views/module/List.vue"], resolve),
            meta: {
              title: "接口列表",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          },
          {
            path: "addOrEdit/:id",
            name: "addOrEditModule",
            component: resolve =>
              require(["@/views/module/AddOrEdit.vue"], resolve),
            meta: {
              title: "添加/编辑接口",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          }
        ]
      },
      {
        path: "permission",
        component: resolve =>
          require(["@/views/permission/Index.vue"], resolve),
        meta: {
          title: "菜单管理",
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        children: [
          {
            path: "list",
            component: resolve =>
              require(["@/views/permission/List.vue"], resolve),
            meta: {
              title: "菜单列表",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          },
          {
            path: "addOrEdit/:id",
            name: "addOrEditPermission",
            component: resolve =>
              require(["@/views/permission/AddOrEdit.vue"], resolve),
            meta: {
              title: "添加/编辑菜单",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          }
        ]
      },
      {
        path: "banner",
        component: resolve => require(["@/views/banner/Index.vue"], resolve),
        meta: {
          title: "接口管理",
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        children: [
          {
            path: "list",
            component: resolve => require(["@/views/banner/List.vue"], resolve),
            meta: {
              title: "Banner列表",
              requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: resolve => require(["@/views/Login.vue"], resolve)
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
  }
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

var storeTemp = store;
router.beforeEach((to, from, next) => {
  // 浏览器刷新后会清空store的数据，所以需要把localStorage的值重新赋值给store
  if (!storeTemp.state.token && window.localStorage.Token != "") {
    storeTemp.commit("saveToken", window.localStorage.Token);
  }

  if (!storeTemp.state.tokenExpire && window.localStorage.TokenExpire != "") {
    storeTemp.commit("saveTokenExpire", window.localStorage.TokenExpire);
  }

  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (storeTemp.state.token) {
      // 通过vuex state获取当前的token是否存在
      next();
    } else {
      //这里使用Id4授权认证，用Jwt，请删之，并把下边的跳转login 打开；
      // applicationUserManager.login();

      //这里使用Jwt登录，如果不用Id4授权认证，这里打开它；
      next({
        path: "/login",
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

export default router;
