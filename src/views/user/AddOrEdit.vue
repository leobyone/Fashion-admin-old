<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加/编辑用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="登录名" prop="LoginName">
            <el-input v-model="form.LoginName"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="Avatar">
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
              :before-upload="beforeAvatarUpload" :http-request="uploadImage">
              <img v-if="form.Avatar" :src="form.Avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="密码" prop="Password" v-if="id === 0">
            <el-input v-model="form.Password" show-password auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" prop="RoleIds">
            <el-select v-model="roleIds" multiple placeholder="请选择">
              <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.RealName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.Sex">
              <el-radio class="radio" :label="1">男</el-radio>
              <el-radio class="radio" :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="form.Age" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.Birthday"></el-date-picker>
          </el-form-item>
          <el-form-item label="地址">
            <el-input type="textarea" v-model="form.Address"></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="status"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import userApi from '../../api/user.js'
import roleApi from '../../api/role.js'
import uploadApi from '../../api/upload.js'
export default {
  name: 'addOrEdit',
  data() {
    return {
      roleIds: [],
      roleList: [],
      status: true,
      form: {
        LoginName: '',
        RealName: '',
        Password: '',
        Status: 0,
        Age: 0,
        Sex: 0,
        Birthday: '',
        Address: '',
        Avatar: ''
      },
      id: -1,
      rules: {
        LoginName: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        Password: []
      },
      uploadUrl: '/api/upload/upload-image'
    }
  },
  computed: {
  },
  methods: {
    init() {
      if (this.id > 0) {
        this.getUser(this.id);
      }
      this.getRoleList();
    },
    // 获取用户信息
    getUser(id) {
      let that = this;
      userApi.get(id).then(res => {
        let ret = res.data;
        if (ret.success) {
          that.form = ret.data;
          that.status = that.form.Status == 0 ? false : true;
          if (that.form.RoleIds) {
            that.roleIds = that.form.RoleIds.split(',').map(t => {
              return parseInt(t);
            })
          }
        } else {
          that.$message({ message: '获取用户信息失败', type: 'error' });
        }
      }).catch(err => {
        that.$message({ message: '获取用户信息失败', type: 'error' });
      })
    },
    // 获取角色列表
    getRoleList() {
      let that = this;
      return new Promise((resolve, reject) => {
        roleApi.getList({}).then(res => {
          let ret = res.data;
          if (ret.success) {
            that.roleList = ret.data.map(t => {
              return {
                value: t.Id,
                label: t.Name
              }
            });
          } else {
            that.$message({ message: '加载角色列表失败', type: 'error' });
          }
        }).catch(err => {
          that.$message({ message: '加载角色列表失败', type: 'error' });
        })
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //上传头像
    uploadImage(params) {
      let img = new FormData()
      img.append('file', params.file)
      let conf = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      uploadApi.uploadImg(img, conf).then(res => {
        let ret = res.data;
        if (ret.success) {
          this.form.Avatar = ret.data;
        } else {
          this.$message.error('上传失败!');
        }
      })
    },
    // 提交保存
    onSubmit() {
      let that = this;
      that.$refs['form'].validate(valid => {
        if (valid) {
          that.form.RoleIds = that.roleIds.join(',');
          that.form.Status = that.status ? 1 : 0;

          if (that.id > 0) {
            that.form.Id = that.id;
            userApi.update(that.form).then(res => {
              let ret = res.data;
              if (ret.success) {
                that.$message({ message: '保存成功', type: 'success' });
              }
            }).catch(err => {
              that.$message({ message: err, type: 'error' });
            })
          } else {
            userApi.add(that.form).then(res => {
              let ret = res.data;
              if (ret.success) {
                that.$message({ message: '保存成功', type: 'success' });
              }
            }).catch(err => {
              that.$message({ message: err, type: 'error' });
            })
          }
        }
      })
    }
  },
  created() {
    let id = this.$route.params.id;
    if (id >= 0) {
      this.id = parseInt(id);
    }

    if (this.id === 0) {
      this.rules.Password.push({ required: true, message: '请输入密码', trigger: 'blur' });
    }

    this.init();
  }
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>