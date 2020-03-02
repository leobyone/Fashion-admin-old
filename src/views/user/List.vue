<template>
  <div class="table" v-loading="loading" :element-loading-text="$t('i18n.loading')">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> {{$t('i18n.userlist')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <tool-bar @callBack="callBack" @search="search"></tool-bar>
      </div>
      <el-table :data="tableData" border highlight-current-row class="table" ref="table" @current-change="handleSelect">
        <el-table-column prop="LoginName" :label="$t('i18n.loginname')" sortable width="100">
        </el-table-column>
        <el-table-column prop="RealName" :label="$t('i18n.name')">
        </el-table-column>
        <el-table-column prop="Sex" :label="$t('i18n.sex')" width="" :formatter="formatSex" sortable>
        </el-table-column>
        <el-table-column prop="Status" :label="$t('i18n.status')" width="" sortable>
          <template slot-scope="scope">
            <el-tag :type="scope.row.Status == 1  ? 'success' : 'danger'" disable-transitions>
              {{scope.row.Status == 1 ? $t('i18n.normal'):$t('i18n.disable')}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from '../../api/user.js'
import roleApi from '../../api/role.js'
import util from '../../lib/util.js'
export default {
  name: 'user',
  data() {
    return {
      loading: false,
      tableData: [],
      cur_page: 1,
      size: 10,
      total: 0,
      keyword: '',
      selectedRow: null
    }
  },
  created() {
    this.getData()
  },
  computed: {
  },
  components: {
    toolBar: () => import('@/components/common/ToolBar.vue')
  },
  methods: {
    callBack(button) {
      this.keyword = button.keyword;
      this[button.action].apply(this, button);
    },
    //性别显示转换
    formatSex: function (row, column) {
      return row.Sex == 1 ? this.$t("i18n.man") : row.Sex == 0 ? this.$t("i18n.female") : this.$t("i18n.unknown");
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取数据
    getData() {
      let that = this;
      that.loading = true;
      let conditions = [{
        Field: "IsDeleted",
        DataType: util.query.dataType.bool,
        Option: util.query.opt.eq,
        Value: false
      }];

      userApi.getPageList({ page: that.cur_page, size: that.size, conditions: util.query.convert(conditions), sorts: util.query.convert([]) }).then(res => {
        that.tableData = res.data.data.data;
        that.total = res.data.data.dataCount;
      }).catch(err => {
        that.$message({ message: that.$t("i18n.loadingfail"), type: 'error' });
      }).finally(() => {
        that.loading = false;
      })
    },
    // 搜索
    search(keyword) {
      this.keyword = keyword;
      this.getData();
    },
    // 添加
    handleAdd() {
      this.$router.push({ name: 'addOrEditUser', params: { id: 0 } });
    },
    // 编辑
    handleEdit() {
      if (!this.selectedRow) {
        this.$message({ message: "请先选择要编辑的数据", type: "warning" });
        return;
      }
      let id = this.selectedRow.Id;
      this.$router.push({ name: 'addOrEditUser', params: { id: id } });
    },
    // 删除
    handleDelete() {
      if (!this.selectedRow) {
        this.$message({ message: "请先选择要删除的数据", type: "warning" });
        return;
      }

      let id = this.selectedRow.Id;
      this.$confirm(this.$t("i18n.deletetips"), this.$t("i18n.tips"), {
        confirmButtonText: this.$t("i18n.confirm"),
        cancelButtonText: this.$t("i18n.cancel"),
        type: 'warning'
      }).then(() => {
        userApi.delete(id).then((res) => {
          let ret = res.data;
          if (ret.success) {
            this.$message({ message: this.$t("i18n.deletesuccess"), type: 'success' });
            this.reload();
          }
        }).catch(e => {
          this.$message({ message: this.$t("i18n.deleteerror") + e.response.data, type: 'error' });
        })
      }).catch(() => { })
    },
    handleSelect(val) {
      this.selectedRow = val
    },
    reload() {
      this.getData();
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
