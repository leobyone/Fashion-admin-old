<template>
  <div class="login-wrap" v-loading="loading">
    <div class="ms-login">
      <div class="ms-title">{{$t("i18n.system")}}</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="form.username" :placeholder="$t('i18n.username')">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" :placeholder="$t('i18n.password')" v-model="form.password"
            @keyup.enter.native="submitForm('form')">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('form')">{{$t('i18n.login')}}</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import authApi from "../api/auth"
import userApi from "../api/user"
import permissionApi from "../api/permission"

export default {
  data: function () {
    return {
      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: this.$t('i18n.enterusername'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('i18n.enterpassword'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          authApi.getToken({ params: { name: that.form.username, pwd: that.form.password } }).then(res => {
            that.loading = false;
            var ret = res.data;
            if (ret.success) {
              var token = ret.token;
              that.$store.commit("saveToken", token);

              var curTime = new Date();
              var expiredate = new Date(curTime.setSeconds(curTime.getSeconds() + ret.expires_in));
              that.$store.commit("saveTokenExpire", expiredate);

              window.localStorage.refreshtime = expiredate;
              window.localStorage.expires_in = ret.expires_in;

              that.getUserByToken(token);
            } else {
              that.$message({
                message: ret.message,
                type: 'error'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    getUserByToken(token) {
      let that = this;
      userApi.getUserByToken(token).then(res => {
        let ret = res.data;
        if (!ret.success) {
          that.$message({
            message: ret.message,
            type: 'error'
          });
        } else {
          if (ret.data.Id > 0) {
            window.localStorage.user = JSON.stringify(ret.data);
            that.getNavigationBar(ret.data.Id);
          }
        }
      })
    },
    // 获取路由树
    getNavigationBar(userId) {
      var that = this;
      permissionApi.getPermissionListByUserId(userId).then((res) => {
        that.loading = false;
        let ret = res.data;
        if (!ret.success) {
          that.$message({
            message: ret.message,
            type: 'error'
          });
        } else {
          let userInfo = JSON.parse(window.localStorage.user ? window.localStorage.user : null);
          that.$notify({
            type: "success",
            message: that.$t("i18n.logintips").replace('$user', userInfo.LoginName),
            duration: 6000
          });

          window.localStorage.NavigationBar = (JSON.stringify(ret.data));
          that.$router.replace(that.$route.query.redirect ? that.$route.query.redirect : "/");
        }
      });
    }
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 25px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 450px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>