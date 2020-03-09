<template>
  <div class="io-grid" v-loading="loading">
    <el-row class="g_search_nav">
      <el-col :span="24" class="io-left io-left-div">
        <!--过滤组件-->
        <grid-filter :initColumns="columns" :gridID="gridID" class="io-left" @filterCallback="filerChange">
        </grid-filter>
        <!--操作按钮组件-->
        <div class="io-right">
          <tool-bar @callBack="eventCallBack"></tool-bar>
        </div>
      </el-col>
    </el-row>
    <div class="c-grid-table el-row">
      <el-table class="pc-table-bgcolor" border :data="tableData" @current-change="handleSelect" highlight-current-row
        row-key="Id" default-expand-all lazy :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="菜单/按钮" width="" sortable>
          <template slot-scope="scope">
            <i class="fa" :class="scope.row.Icon"></i>
            {{scope.row.Name}}
          </template>
        </el-table-column>
        <el-table-column prop="Name" label="菜单名称" width="" sortable>
        </el-table-column>
        <el-table-column prop="Code" label="路由地址" width="" sortable>
        </el-table-column>
        <el-table-column prop="Enabled" :label="$t('i18n.isenabled')" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Enabled ? 'success' : 'danger'">
              {{scope.row.Enabled ? $t('i18n.yes') : $t('i18n.no')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="IsButton" label="是否按钮" width="150" sortable>
          <template slot-scope="scope">
            <el-tag :type="!scope.row.IsButton  ? 'success' : 'danger'" disable-transitions>
              {{!scope.row.IsButton ? "否":"是"}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="IsHide" label="是否隐藏" width="150" sortable>
          <template slot-scope="scope">
            <el-tag :type="!scope.row.IsHide  ? 'success' : 'danger'" disable-transitions>
              {{!scope.row.IsHide ? "否":"是"}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pc-page io-grid-pagination">
      <el-pagination class="pc-page-style" @size-change="sizeChange" @current-change="currentChange"
        :page-sizes="pageSizes" :current-page="page" :page-size="size" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import permissionApi from '@/api/permission.js'
import util from '@/lib/util.js'
export default {
  name: 'permission',
  data() {
    return {
      loading: false,
      page: 1,
      size: 10,
      tableData: [],
      total: 0,
      pageSizes: [10, 20, 50],
      selectedRow: {},
      columns: [],
      gridID: 'id',
      conditions: [
        {
          Field: "ParentId",
          DataType: util.query.dataType.int,
          Option: util.query.opt.eq,
          Value: 0
        }, {
          Field: "IsDeleted",
          DataType: util.query.dataType.bool,
          Option: util.query.opt.eq,
          Value: false
        }
      ]
    }
  },
  created() {
    this.columns = [
      { prop: 'Name', label: '菜单名称', sortable: 'custom', width: '', type: 'string', isFilter: true },
      { prop: 'Code', label: '路由地址', sortable: 'custom', width: '', type: 'string', isFilter: true }
    ];
    this.getPageData();
  },
  components: {
    toolBar: () => import('@/components/common/ToolBar.vue'),
    gridFilter: () => import('@/components/common/filter/GridFilter.vue')
  },
  computed: {
  },
  methods: {
    eventCallBack(action) {
      this[action].apply(this, this.selectedRow);
    },
    // 分页导航
    handleCurrentChange(val) {
      this.page = val;
      this.getPageData();
    },
    load(tree, treeNode, resolve) {
      permissionApi.getPermissionTree({ parentId: tree.Id }).then((res) => {
        resolve(res.data.data);
      });
    },
    // 获取分页数据
    getPageData(page, size, conditions, sorts) {
      let that = this;
      that.loading = true;

      permissionApi.getPageList({ page: page, size: size, conditions: util.query.convert(conditions), sorts: util.query.convert(sorts) })
        .then(res => {
          that.tableData = res.data.data.data;
          that.total = res.data.data.dataCount;
        }).catch(err => {
          that.$message({ message: that.$t("i18n.loadingfail"), type: 'error' });
        }).finally(() => {
          that.loading = false;
        })
    },
    currentChange(val) {
      this.page = val;
      this.getPageData();
    },
    sizeChange(val) {
      this.size = val;
      this.getPageData(this.page);
    },
    filerChange(c) {
      let filter = that.conditions.concat(c);
      this.getPageData(that.page, that.size, filter, []);
    },
    // 添加
    handleAdd() {
      this.$router.push({ name: 'addOrEditPermission', params: { id: 0 } });
    },
    // 编辑
    handleEdit(row) {
      if (!row) {
        this.$message({ message: "请先选择要编辑的数据", type: "warning" });
        return;
      }

      let id = row.Id;
      this.$router.push({ name: 'addOrEditPermission', params: { id: id } });
    },
    // 删除
    handleDelete(row) {
      if (!row) {
        this.$message({ message: "请先选择要删除的数据", type: "warning" });
        return;
      }

      let id = row.Id;
      this.$confirm(this.$t("i18n.deletetips"), this.$t("i18n.tips"), {
        confirmButtonText: this.$t("i18n.confirm"),
        cancelButtonText: this.$t("i18n.cancel"),
        type: 'warning'
      }).then(() => {
        permissionApi.delete(id).then((res) => {
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
      this.getPageData();
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
