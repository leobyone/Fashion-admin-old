<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 菜单管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加/编辑菜单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="菜单/按钮名称" prop="Name">
            <el-input v-model="form.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="路由地址" prop="Code">
            <el-tooltip class="item" effect="dark" content="如果是导航条且无路由，请填‘-’字符，如果是按钮，请输入空格即可" placement="top-start">
              <el-input v-model="form.Code" auto-complete="off"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="图标" prop="Icon">
            <el-input v-model="form.Icon"></el-input>
          </el-form-item>
          <el-form-item label="方法" prop="Action">
            <el-input v-model="form.Action"></el-input>
          </el-form-item>
          <el-form-item prop="ParentId" label="父级菜单" width="">
            <el-cascader style="width: 400px" v-model="parentIds" :options="permissionOptions"
              :props="{ checkStrictly: true }" clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item prop="ModuleId" label="API接口" width="">
            <el-select style="width: 100%;" v-model="form.ModuleId" placeholder="请选择API">
              <el-option :key="0" :value="0" :label="'无'">
              </el-option>
              <el-option v-for="item in moduleList" :key="item.Id" :value="item.Id" :label="item.LinkUrl">
                <span style="float: left">{{ item.LinkUrl }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="Description">
            <el-input v-model="form.Description" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="Enabled">
            <el-switch v-model="form.Enabled"></el-switch>
          </el-form-item>
          <el-form-item prop="IsButton" label="是否按钮" width="" sortable>
            <el-switch v-model="form.IsButton">
            </el-switch>
          </el-form-item>
          <el-form-item prop="IsHide" label="隐藏菜单" width="" sortable>
            <el-switch v-model="form.IsHide">
            </el-switch>
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
import permissionApi from '../../api/permission.js'
import moduleApi from '../../api/module.js'
export default {
  name: 'addOrEdit',
  data() {
    return {
      form: {
        Name: '',
        Code: '',
        Icon: '',
        Action: '',
        Description: '',
        Enabled: false,
        IsButton: false,
        IsHide: false
      },
      id: -1,
      rules: {
        Name: [{ required: true, message: '请输入菜单/按钮名称', trigger: 'blur' }],
        parentIds: [{ required: true, message: '请输入菜单/按钮名称', trigger: 'blur' }]
      },
      permissionList: [],
      permissionOptions: [],
      moduleList: [],
      parentIds: [],
      tempIds: []
    }
  },
  computed: {
  },
  methods: {
    init() {
      this.getPermissionList().then(res => {
        if (this.id > 0) {
          this.getPermission(this.id);
        }
      });
      this.getModuleList();
    },
    // 获取菜单信息
    getPermission(id) {
      let that = this;
      permissionApi.get(id).then(res => {
        debugger
        let ret = res.data;
        if (ret.success) {
          that.form = ret.data;

          //获取父节点数组
          that.tempIds.push(that.form.ParentId);
          if (that.form.ParentId > 0) {
            let parent = that.permissionList.find(t => {
              return t.Id == that.form.ParentId;
            })

            if (!parent) return;
            that.tempIds.push(parent.ParentId);
            that.group(parent);

            //排序
            that.tempIds.sort((a, b) => a - b);
            that.parentIds = that.tempIds;
          }
        } else {
          that.$message({ message: '获取菜单信息失败', type: 'error' });
        }
      }).catch(err => {
        that.$message({ message: '获取菜单信息失败', type: 'error' });
      })
    },
    group(child) {
      let parent = this.permissionList.find(t => {
        return t.Id == child.ParentId;
      })

      if (!parent) return;
      this.tempIds.push(parent.ParentId);
      this.group(parent);
    },
    // 获取接口列表
    getModuleList() {
      let that = this;
      moduleApi.getList({}).then(res => {
        let ret = res.data;
        if (ret.success) {
          that.moduleList = res.data.data;
        } else {
          that.$message({ message: ret.message, type: 'error' });
        }
      }).catch(err => {
        that.$message({ message: '加载接口列表失败', type: 'error' });
      })
    },
    // 获取菜单列表
    getPermissionList() {
      let that = this;
      return new Promise((resolve, reject) => {
        permissionApi.getList({}).then(res => {
          let ret = res.data;
          if (ret.success) {
            let options = [{ value: 0, label: '根节点', children: [] }];
            that.permissionList = ret.data;

            if (that.permissionList.length == 0) {
              that.permissionOptions = options;
              return;
            }

            that.permissionOptions = that.permissionList.filter((t) => {
              return t.ParentId == 0 || t.ParentId == null;
            }).map((t) => {
              return { value: t.Id, label: t.Name };
            });

            that.permissionOptions.forEach((item, index) => {
              that.groupPermission(item);
            })

            options[0].children = that.permissionOptions;
            that.permissionOptions = options;
          } else {
            that.$message({ message: ret.message, type: 'error' });
          }

          resolve();
        }).catch(err => {
          that.$message({ message: '加载菜单列表失败', type: 'error' });
        })
      })
    },
    //递归
    groupPermission(parent) {
      let temp = this.permissionList.filter((t) => {
        return t.ParentId == parent.value;
      }).map((t) => {
        return { value: t.Id, label: t.Name };
      });

      if (temp.length == 0) return null;
      parent.children = temp;

      parent.children.forEach((item, index) => {
        this.groupPermission(item);
      })
    },
    // 提交保存
    onSubmit() {
      let that = this;
      that.$refs['form'].validate(valid => {
        if (valid) {
          that.form.ParentId = that.parentIds[that.parentIds.length - 1];
          if (that.id > 0) {
            that.form.Id = that.id;
            permissionApi.update(that.form).then(res => {
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
            permissionApi.add(that.form).then(res => {
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
    }
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
