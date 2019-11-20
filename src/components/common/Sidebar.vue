<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in menuTreeData">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';
import { i18n } from '../../locale/zh-CN'

export default {
  data() {
    return {
      menuList: [],
      menuTreeData: [],
      collapse: false,
      menu: i18n.menu
    }
  },
  methods: {
    //获取左侧菜单栏
    getMenus() {
      let that = this;
      let navigationBar = JSON.parse(window.localStorage.NavigationBar ? window.localStorage.NavigationBar : null);
      if (navigationBar && navigationBar.length > 0) {
        this.menuList = navigationBar;

        //第一层菜单
        that.menuTreeData = that.menuList.filter((t) => {
          return (t.ParentId == 0 || t.ParentId == null) && t.IsButton == false;
        }).map((t) => {
          let title = that.getGlobalName(t.Name);
          if (t.Code !== '-') {
            return { icon: t.Icon, title: title, id: t.Id, index: t.Code };
          } else {
            return { icon: t.Icon, title: title, id: t.Id };
          }
        });

        that.menuTreeData.forEach((item, index) => {
          that.groupMenu(item);
        })
      }
    },
    //递归
    groupMenu(parent) {
      let that = this;
      let temp = that.menuList.filter((t) => {
        return t.ParentId == parent.id && t.IsButton == false;
      }).map((t) => {
        let title = that.getGlobalName(t.Name);
        return { index: t.Code, title: title, id: t.Id };
      });

      if (temp.length == 0) return;
      parent.subs = temp;

      parent.subs.forEach((item, index) => {
        that.groupMenu(item);
      })
    },
    //获取国际化名称
    getGlobalName(name) {
      let that = this;

      let key = that.$_.findKey(that.menu, function (t) {
        return t === name;
      })

      if (key) {
        return that.$t('i18n.menu.' + key);
      }
      return "";
    }
  },
  watch: {
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
    })

    bus.$on('locale', loc => {
      this.getMenus();
    })

    this.getMenus();
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
