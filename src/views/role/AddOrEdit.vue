<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加/编辑角色</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="角色名称" prop="Name">
            <el-input v-model="form.Name"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="Enabled">
            <el-switch v-model="form.Enabled"></el-switch>
          </el-form-item>
          <el-form-item label="描述" prop="Description">
            <el-input v-model="form.Description"></el-input>
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
import roleApi from '../../api/role.js'
export default {
  name: 'role',
  data() {
    return {
      form: {
        Name: '',
        Enabled: false,
        Description: ''
      },
      id: -1,
      rules: { Name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] }
    }
  },
  methods: {
    init() {
      if (this.id > 0) {
        this.getRole(this.id);
      }
    },
    // 获取角色信息
    getRole(id) {
      let that = this;
      roleApi.get(id).then(res => {
        let ret = res.data;
        if (ret.success) {
          that.form = ret.data;
        } else {
          that.$message({ message: '获取角色信息失败', type: 'error' });
        }
      }).catch(err => {
        that.$message({ message: '获取角色信息失败', type: 'error' });
      })
    },
    // 保存编辑
    onSubmit() {
      let that = this;
      that.$refs['form'].validate(valid => {
        if (valid) {
          if (that.id > 0) {
            that.form.Id = that.id;
            roleApi.update(that.form).then(res => {
              console.log(res);
              let ret = res.data;
              if (ret.success) {
                that.$message({ message: '添加成功', type: 'success' });
              }
            }).catch(err => {
              that.$message({ message: err, type: 'error' });
              console.log(err);
            })
          } else {
            console.log('编辑');
            roleApi.add(that.form).then(res => {
              console.log(res);
              let ret = res.data;
              if (ret.success) {
                that.$message({ message: '修改成功', type: 'success' });
              }
            }).catch(err => {
              that.$message({ message: err, type: 'error' });
              console.log(err);
            })
          }
        }
      })
    },
  },
  created() {
    let id = this.$route.params.id;
    if (id) {
      this.id = parseInt(id);
    }

    this.init();
  }
}
</script>