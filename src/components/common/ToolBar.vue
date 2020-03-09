<template>
  <el-button-group>
    <el-button v-for="item in buttonList" size="small" type="primary" :icon="item.icon" :key="item.id"
      @click="callBack(item.action)">{{item.name}}</el-button>
  </el-button-group>
</template>
<script>
import { i18n } from '../../locale/zh-CN'
export default {
  name: "Toolbar",
  data() {
    return {
      buttonList: [],
      button: i18n.button
    };
  },
  methods: {
    callBack(action) {
      this.$emit("callBack", action); //将值传给父组件
    },
    //获取授权按钮
    getButtonList() {
      let that = this;
      let path = this.$route.path.toLowerCase();
      let navigationBar = JSON.parse(window.localStorage.NavigationBar ? window.localStorage.NavigationBar : null);
      if (navigationBar && navigationBar.length > 0) {
        //先获取当前路由的菜单信息
        let parents = navigationBar.filter(t => {
          return t.Code == path;
        });

        //再获取当前菜单的按钮信息
        if (parents.length > 0) {
          that.buttonList = navigationBar.filter(t => {
            return t.IsButton == true && t.ParentId == parents[0].Id;
          }).map(t => {
            let name = that.getGlobalName(t.Name);
            return {
              id: t.Id,
              name: name,
              icon: t.Icon,
              action: t.Action
            }
          })
        }
      }
    },
    //获取国际化名称
    getGlobalName(name) {
      let that = this;

      let key = that.$_.findKey(that.button, function (t) {
        return t === name;
      })

      if (key) {
        return that.$t('i18n.button.' + key);
      }
      return "";
    }
  },
  created() {
    this.getButtonList();
  }
};
</script>