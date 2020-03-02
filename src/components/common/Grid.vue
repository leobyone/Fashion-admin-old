<template>
  <div class="io-grid" v-loading="loading">
    <el-row class="g_search_nav">
      <el-col :span="24" class="io-left io-left-div">
        <slot name="banner" class="io-left"> </slot>
        <grid-filter :initColumns="initColumns" v-if="showFilter" :gridID="gridID" @filterCallback="filerChange"
          class="io-right">
        </grid-filter>
      </el-col>
    </el-row>
    <div class="c-grid-table el-row">
      <el-table class="pc-table-bgcolor" @selection-change="selectionChange" :border="border" :data="grid.data"
        @sort-change="sortChange" @cell-click="cellClick">
        <el-table-column type="selection" width="40" v-if="showMulitSelect"> </el-table-column>
        <el-table-column v-for="(column, index) in columns" :prop="column.prop" :label="column.label"
          :sortable="column.sortable" :width="column.width" :key="index">
          <template slot-scope="scope">
            <div v-if="column.type == 'link'" class="grid_link_cell"> {{ scope.row[column.prop] }} </div>
            <div v-if="column.type == 'username'" class="grid_link_cell" @click="showUser(scope.row)">
              {{ scope.row[column.prop] }} </div>
            <div v-if="column.type == '' || column.type == 'string' || column.type == 'num'">
              {{ scope.row[column.prop] }}</div>
            <div v-if="column.type == 'date'">{{ scope.row[column.prop] | date }}</div>
            <div v-if="column.type == 'dateLocalNotSecond'">{{ scope.row[column.prop] | dateLocalNotSecond }}</div>
            <div v-if="column.type == 'formatter'">{{ column.formatter(scope.row[column.prop]) }}</div>
            <div v-if="column.type == 'html'" v-html="column.formatter(scope.row[column.prop],scope.row)"></div>
            <div class="io-center" v-if="column.type == 'boolean'" style="width:100%">
              <!--i :class="{'el-icon-circle-check-outline d-i-yes': scope.row[column.prop],'el-icon-remove-outline d-i-no':!scope.row[column.prop]}"></i-->
              <i
                :class="{ 'el-icon-check d-i-yes': scope.row[column.prop], 'el-icon-remove-outline d-i-no': !scope.row[column.prop] }"></i>
            </div>
          </template>
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>
    <div class="pc-page io-grid-pagination">
      <el-pagination class="pc-page-style" @size-change="sizeChange" @current-change="currentChange"
        :page-sizes="pageSizes" :current-page="params.index" :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper" :total="grid.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { GRID_FILTER } from '../../mutation-types';

export default {
  props: {
    initParams: { default: null },
    initColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // initSort: { default: {} },
    initData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    api: { default: '' },
    gridID: { default: '' },
    auto: { default: true },
    showFilter: { default: true },
    showMulitSelect: { default: false },
    border: { default: true },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 50];
      }
    }
  },
  data() {
    return {
      loading: false,
      grid: { data: [], total: 0, filter: null }
    };
  },
  components: {
    gridFilter: () => import('@/components/common/GridFilter.vue')
  },
  computed: {
    ...mapGetters({
      gridData: 'filterData',
      reload: 'reload'
    }),
    defaultParams() {
      return this.initParams;
    },
    params() {
      return this.initParams;
    },
    // sort() { return this.initSort },
    columns() {
      return this.initColumns;
    },
    gridApi() {
      return this.api;
    },
    filterID() {
      return this.gridID;
    }
  },
  methods: {
    selectionChange(val) {
      this.$store.dispatch(GRID_FILTER.SET_MULIT, { filterID: this.filterID, items: val });
    },
    cellClick(row, column, cell, event) {
      this.$emit('cellClick', row, column, cell, event);
    },
    sortChange(sort) {
      if (sort.prop != null) {
        let p = { filterID: this.filterID, sorts: [{ Field: sort.prop, SortBy: sort.order == 'ascending' ? 1 : 2 }] };
        this.$store.dispatch(GRID_FILTER.SET_PARAMS, p).then(() => {
          this.loadData();
        });
      }
    },
    currentChange(val) {
      this.$store.dispatch(GRID_FILTER.SET_PARAMS, { filterID: this.filterID, index: val }).then(() => {
        this.loadData();
      });
    },
    sizeChange(val) {
      this.params.size = val;
      this.params.index = 1;
      let p = { filterID: this.filterID, size: val, index: this.params.index };
      this.$store.dispatch(GRID_FILTER.SET_PARAMS, p).then(() => {
        this.loadData();
      });
    },
    filerChange(c) {
      let p = Object.assign({ filterID: this.filterID, index: 1 }, { conditions: this.defaultParams.conditions });
      p.conditions = p.conditions.concat(c);
      this.$store.dispatch(GRID_FILTER.SET_PARAMS, p).then(() => {
        this.loadData();
      });
    },
    loadData() {
      if (this.$_.isNull(this.gridApi) || this.$_.isUndefined(this.gridApi)) {
        this.grid.data = this.initData;
        return;
      }
      this.loading = true;
      this.$store
        .dispatch(GRID_FILTER.QUERY, Object.assign({ filterID: this.filterID }, this.gridData[this.filterID].filter))
        .then(() => {
          setTimeout(() => {
            this.grid = this.gridData[this.filterID].result;
            this.loading = false;
          }, 200);
        })
        .catch((error) => {
          this.$message({
            message: '加载出错',
            type: 'error'
          });
          this.loading = false;
        });
    },
    gridFormatter(type) {
      if (typeof type == 'function') {
        return type;
      }
      if (typeof type == 'string') {
        let formatters = {};
        formatters.shortDate = (row, column, cellVal) => {
          return this.$util.date.getDateTime(row.cellVal).format('yyyy-MM-dd');
        };
        formatters.fullDate = (row, column, cellVal) => {
          return this.$util.date.getDateTime(row.cellVal).toString();
        };
        if (typeof formatters[type] != 'undefined') return formatters[type];
      }
    },
    showUser(row) {
      this.$confirmBox.showUserDetail(row.UserID, this);
    }
  },
  watch: {
    reload: function (val, oldVal) {
      if (val == true) {
        this.loadData();
      }
    }
  },
  created() {
    this.$store
      .dispatch(
        GRID_FILTER.SET_PARAMS,
        Object.assign(
          {
            filterID: this.filterID,
            api: this.gridApi
          },
          this.params
        )
      )
      .then(() => {
        this.loadData();
      });
  },
  mounted() { },
  destroyed() {
    this.params.index = 1;
    this.$store.dispatch(GRID_FILTER.SET_PARAMS, { filterID: this.filterID, index: 1 });
  }
};
</script>

<style>
.io-left-div > div {
  float: left;
  margin-right: 20px;
}
.g_search_nav {
  height: 32px;
  margin: 5px 0 15px 0;
}
/*table表格颜色字号修改*/
.pc-table-bgcolor .has-gutter tr,
.pc-table-bgcolor .has-gutter tr th {
  background: #f7f7f7;
}
.pc-table-bgcolor .has-gutter tr th .cell {
  color: #3c7ec8;
  font-size: 16px;
  font-weight: normal;
}
/*翻页*/
.pc-page {
  margin-top: 20px;
}
.pc-page-style .el-input__inner {
  border: 1px solid #4794e8;
  color: #000000;
}
.el-pager li.active {
  color: #ffffff;
  background: #4794e8;
  border-radius: 4px;
  min-width: 28px;
  margin: 0 8px;
}
.el-pagination__total {
  color: #000000;
}
.pc-page-style .el-select .el-input .el-select__caret {
  color: #4794e8;
  font-size: 20px;
}
.el-pagination .btn-prev,
.el-pagination .btn-next {
  color: #4794e8;
}
</style>