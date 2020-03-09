<template>
  <div>
    <grid :initColumns="columns" :initParams="params" :api="api" :gridID="gridID">
    </grid>
  </div>
</template>

<script>
import roleApi from '@/api/role.js'
import util from '@/lib/util.js'
export default {
  name: 'role',
  props: ['listID'],
  data() {
    return {
      columns: [],
      params: {
        index: 1,
        size: 10,
        sorts: util.query.convert([{ Field: 'CreationTime', SortBy: 1 }]),
        conditions: util.query.convert([{
          Field: "IsDeleted",
          DataType: util.query.dataType.bool,
          Option: util.query.opt.eq,
          Value: false
        }])
      },
      api: 'role/pagelist'
    }
  },
  created() {
    let that = this;
    this.columns = [
      { prop: 'Name', label: this.$t('i18n.rolename'), sortable: 'custom', width: '', type: 'string', isFilter: true },
      { prop: 'Description', label: this.$t('i18n.description'), sortable: 'custom', width: '', type: 'string', isFilter: true },
      { prop: 'Enabled', label: this.$t('i18n.isenabled'), sortable: 'custom', width: '', type: 'formatter', formatter: function (cell) { return that.formatEnable(cell); }, isFilter: true, },
      { prop: 'CreationTime', label: this.$t('i18n.creationtime'), sortable: 'custom', width: '', type: 'date', isFilter: true }
    ]
  },
  computed: {
    gridID: function () {
      return this.listID == null ? 'user' : this.listID;
    }
  },
  components: {
    grid: () => import('@/components/common/grid/Grid.vue')
  },
  methods: {
    //格式化是否启用
    formatEnable(cell) {
      return cell == 1 ? this.$t('i18n.yes') : this.$t('i18n.no');
    },
    // 添加
    handleAdd() {
      this.$router.push({ name: 'addOrEditRole', params: { id: 0 } });
    },
    // 编辑
    handleEdit(row) {
      if (!row) {
        this.$message({ message: "请先选择要编辑的数据", type: "warning" });
        return;
      }

      let id = row.Id;
      this.$router.push({ name: 'addOrEditRole', params: { id: id } });
    },
    // 授权
    handleAssign(row) {
      if (!row) {
        this.$message({ message: "请先选择要授权的角色", type: "warning" });
        return;
      }

      let id = row.Id;
      this.$router.push({ name: 'assignPermission', params: { id: id } });
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
        roleApi.delete(id).then((res) => {
          let ret = res.data;
          if (ret.success) {
            this.$message({ message: this.$t("i18n.deletesuccess"), type: 'success' });
            this.reload();
          }
        }).catch(e => {
          this.$message({ message: this.$t("i18n.deleteerror") + e.response.data, type: 'error' });
        })
      }).catch(() => { })
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
