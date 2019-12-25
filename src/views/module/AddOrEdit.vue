<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 接口管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加/编辑接口</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="接口名称" prop="Name">
            <el-input v-model="form.Name"></el-input>
          </el-form-item>
          <el-form-item label="接口地址" prop="LinkUrl">
            <el-input v-model="form.LinkUrl"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="Enabled">
            <el-switch v-model="form.Enabled"></el-switch>
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
import moduleApi from '../../api/module.js'
export default {
  name: 'addOrEdit',
  data() {
    return {
      form: {
        Name: '',
        LinkUrl: '',
        Enabled: false
      },
      id: -1,
      rules: {
        Name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  methods: {
    init() {
      if (this.id > 0) {
        this.getModule(this.id);
      }
    },
    // 获取接口信息
    getModule(id) {
      let that = this;
      moduleApi.get(id).then(res => {
        let ret = res.data;
        if (ret.success) {
          that.form = ret.data;
        } else {
          that.$message({ message: '获取接口信息失败', type: 'error' });
        }
      }).catch(err => {
        that.$message({ message: '获取接口信息失败', type: 'error' });
      })
    },
    // 提交保存
    onSubmit() {
      let that = this;
      that.$refs['form'].validate(valid => {
        if (valid) {
          if (that.id > 0) {
            that.form.Id = that.id;
            moduleApi.update(that.form).then(res => {
              console.log(res);
              let ret = res.data;
              if (ret.success) {
                that.$message({ message: '保存成功', type: 'success' });
              }
            }).catch(err => {
              that.$message({ message: err, type: 'error' });
              console.log(err);
            })
          } else {
            moduleApi.add(that.form).then(res => {
              console.log(res);
              let ret = res.data;
              if (ret.success) {
                that.$message({ message: '保存成功', type: 'success' });
              }
            }).catch(err => {
              that.$message({ message: err, type: 'error' });
              console.log(err);
            })
          }
        }
      })
    },
    created() {
      let id = this.$route.params.id;
      if (id) {
        this.id = parseInt(id);
      }

      this.init();
    }
  }
}
</script>
