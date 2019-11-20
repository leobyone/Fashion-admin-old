<template>
  <div class="table" v-loading="loading" element-loading-text="正在加载">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 接口列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <tool-bar @callBack="callBack" @search="search"></tool-bar>
      </div>
      <el-table :data="tableData" border highlight-current-row class="table" ref="table" @current-change="handleSelect">
        <el-table-column prop="Name" label="接口名称" sortable width="220">
        </el-table-column>
        <el-table-column prop="LinkUrl" label="接口地址">
        </el-table-column>
        <el-table-column prop="Enabled" :label="$t('i18n.isenabled')" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Enabled ? 'success' : 'danger'">
              {{scope.row.Enabled ? $t('i18n.yes') : $t('i18n.no')}}</el-tag>
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
import moduleApi from '../../api/module.js'
export default {
  name: 'module',
  data() {
    return {
      loading: false,
      tableData: [],
      cur_page: 1,
      size: 10,
      total: 0,
      keyword: "",
      selectedRow: null
    }
  },
  created() {
    this.getData()
  },
  components: {
    toolBar: () => import('@/components/common/ToolBar.vue')
  },
  computed: {
  },
  methods: {
    callBack(button) {
      this.keyword = button.keyword;
      this[button.action].apply(this, button);
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
      moduleApi.getPageList({ page: that.cur_page, size: that.size, keyword: that.keyword }).then(res => {
        that.tableData = res.data.data.data;
        that.total = res.data.data.dataCount;
      }).catch(err => {
        that.$message({ message: '加载数据失败', type: 'error' });
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
      this.$router.push({ name: 'addOrEditModule', params: { id: 0 } });
    },
    // 编辑
    handleEdit() {
      if (!this.selectedRow) {
        this.$message({ message: "请先选择要编辑的数据", type: "warning" });
        return;
      }

      let id = this.selectedRow.Id;
      this.$router.push({ name: 'addOrEditModule', params: { id: id } });
    },
    // 删除
    handleDelete(index, row) {
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
        moduleApi.delete(id).then((res) => {
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
