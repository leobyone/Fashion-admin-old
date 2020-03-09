<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">{{$t("i18n.system")}}</div>
    <div class="header-right">
      <div class="header-user-con">
        <div class="btn-language">
          <el-dropdown @command="changeLanguage" trigger="click">
            <span class="el-dropdown-link">
              {{language}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in commands" :command="item" :key="item.key">{{item.lang}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen ? $t('i18n.cancelfullscreen') : $t('i18n.fullscreen')"
            placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark"
            :content="message?$t('i18n.unreadmessages').replace('$num', 2):$t('i18n.messagecenter')" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator"><img :src="avatar"></div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}} <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <a href="http://blog.gdfengshuo.com/about/" target="_blank">
              <el-dropdown-item>{{$t('i18n.abouttheauthor')}}</el-dropdown-item>
            </a>
            <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
              <el-dropdown-item>{{$t('i18n.github')}}</el-dropdown-item>
            </a>
            <el-dropdown-item divided command="loginout">{{$t("i18n.loginout")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/store';
import bus from '@/components/common/bus';
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: this.$t('i18n.tourist'),
      message: 2,
      language: '中文',
      commands: [{ key: 'zh-CN', lang: '中文' }, { key: 'en-US', lang: 'English' }]
    }
  },
  computed: {
    username() {
      let userInfo = JSON.parse(window.localStorage.user ? window.localStorage.user : null);
      let username = userInfo.LoginName;
      return username ? username : this.name;
    },
    avatar() {
      let userInfo = JSON.parse(window.localStorage.user ? window.localStorage.user : null);
      if (userInfo) {
        return userInfo.Avatar;
      }

      return "../../../assets/img/img.jpg";
    }
  },
  methods: {
    //切换语言
    changeLanguage(command) {
      this.language = command.lang;
      this.$i18n.locale = command.key;//关键语句 
      bus.$emit('locale', command.key);
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == 'loginout') {
        store.commit("saveToken", "");
        store.commit("saveTokenExpire", "");
        store.commit("saveTagsData", "");
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("NavigationBar");
        this.$router.push('/login');
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  }
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-language {
  margin-right: 5px;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
