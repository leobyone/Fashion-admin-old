<template>
  <div>
    <grid :initColumns="columns" :initParams="params" :api="api" :gridID="gridID">
    </grid>
  </div>
</template>

<script>
import userApi from '@/api/product.js'
import util from '@/lib/util.js'
export default {
  name: 'product',
  props: ['listID'],
  data() {
    return {
      columns: [],
      params: {
        index: 1,
        size: 10,
        sorts: util.query.convert([{ Field: 'LoginName', SortBy: 1 }]),
        conditions: util.query.convert([{
          Field: "IsDeleted",
          DataType: util.query.dataType.bool,
          Option: util.query.opt.eq,
          Value: false
        }])
      },
      api: 'user/pagelist'
    }
  },
  created() {
    let that = this;
    this.columns = [
      { prop: 'LoginName', label: this.$t('i18n.loginname'), sortable: 'custom', width: '', type: 'string', isFilter: true },
      { prop: 'RealName', label: this.$t('i18n.name'), sortable: 'custom', width: '', type: 'string', isFilter: true },
      { prop: 'Sex', label: this.$t('i18n.sex'), sortable: 'custom', width: '', type: 'formatter', formatter: function (cell) { return that.formatSex(cell); }, isFilter: true, },
      { prop: 'Status', label: this.$t('i18n.status'), sortable: 'custom', width: '', type: 'formatter', formatter: function (cell) { return that.formatStatus(cell); }, isFilter: true }
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
    //性别显示转换
    formatSex: function (cell) {
      return cell == 1 ? this.$t("i18n.man") : cell == 0 ? this.$t("i18n.female") : this.$t("i18n.unknown");
    },
    //格式化状态
    formatStatus: function (cell) {
      return cell == 1 ? this.$t("i18n.normal") : this.$t("i18n.disable");
    },
    // 添加
    handleAdd() {
      this.$router.push({ name: 'addOrEditUser', params: { id: 0 } });
    },
    // 编辑
    handleEdit(row) {
      if (!row) {
        this.$message({ message: "请先选择要编辑的数据", type: "warning" });
        return;
      }

      this.$router.push({ name: 'addOrEditUser', params: { id: row.Id } });
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
