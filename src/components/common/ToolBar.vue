<template>
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="keyword" :placeholder="$t('i18n.keyword')" class="handle-input mr10"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchCallBack">{{$t('i18n.search')}}</el-button>
      </el-form-item>
      <!-- 这个就是当前页面内，所有的btn列表 -->
      <el-form-item v-for="item in buttonList" :key="item.id">
        <!-- 这里触发点击事件 -->
        <el-button type="primary" :icon="item.icon" @click="callBack(item)">{{item.name}}</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>
<script>
import { i18n } from '../../locale/zh-CN'
export default {
  name: "Toolbar",
  data() {
    return {
      keyword: "", //双向绑定搜索内容,
      buttonList: [],
      button: i18n.button
    };
  },
  methods: {
    callBack(item) {
      this.$emit("callBack", item); //将值传给父组件
    },
    searchCallBack() {
      this.$emit("search", this.keyword); //将值传给父组件
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