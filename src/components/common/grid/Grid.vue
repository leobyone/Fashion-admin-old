<template>
  <div class="io-grid" v-loading="loading">
    <el-row class="g_search_nav">
      <el-col :span="24" class="io-left io-left-div">
        <!--过滤组件-->
        <grid-filter :initColumns="initColumns" v-if="showFilter" :gridID="gridID" @filterCallback="filerChange"
          class="io-left">
        </grid-filter>
        <!--操作按钮组件-->
        <div class="io-right">
          <tool-bar @callBack="eventCallBack"></tool-bar>
        </div>
      </el-col>
    </el-row>
    <div class="c-grid-table el-row">
      <el-table class="pc-table-bgcolor" @selection-change="selectionChange" :border="border" :data="grid.data"
        @sort-change="sortChange" @cell-click="cellClick" @current-change="handleSelect" highlight-current-row>
        <el-table-column type="selection" width="40" v-if="showMulitSelect"> </el-table-column>
        <el-table-column v-for="(column, index) in columns" :prop="column.prop" :label="column.label"
          :sortable="column.sortable" :width="column.width" :key="index">
          <template slot-scope="scope">
            <div v-if="column.type == 'link'" class="grid_link_cell"> {{ scope.row[column.prop] }} </div>
            <div v-if="column.type == '' || column.type == 'string' || column.type == 'num'">
              {{ scope.row[column.prop] }}</div>
            <div v-if="column.type == 'date'">{{ scope.row[column.prop] | date }}</div>
            <div v-if="column.type == 'dateLocalNotSecond'">{{ scope.row[column.prop] | dateLocalNotSecond }}</div>
            <div v-if="column.type == 'formatter'">{{ column.formatter(scope.row[column.prop]) }}</div>
            <div v-if="column.type == 'html'" v-html="column.formatter(scope.row[column.prop],scope.row)"></div>
            <div class="io-center" v-if="column.type == 'boolean'" style="width:100%">
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
import { GRID_FILTER } from '@/mutation-types';
import ajax from '@/api/index';
import { i18n } from '@/locale/zh-CN'

export default {
  props: {
    initParams: { default: null },
    initColumns: { type: Array, default: () => { return []; } },
    initData: { type: Array, default: () => { return []; } },
    api: { default: '' },
    gridID: { default: '' },
    auto: { default: true },
    showFilter: { default: true },
    showMulitSelect: { default: false },
    border: { default: true },
    pageSizes: { type: Array, default: () => { return [10, 20, 50]; } }
  },
  data() {
    return {
      loading: false,
      grid: { data: [], total: 0, filter: null },
      selectRow: {}
    };
  },
  components: {
    gridFilter: () => import('@/components/common/filter/GridFilter.vue'),
    toolBar: () => import('@/components/common/ToolBar.vue')
  },
  computed: {
    defaultParams() {
      return this.initParams;
    },
    params() {
      return this.initParams;
    },
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
    //执行父组件事件
    eventCallBack(action) {
      this.$parent[action].call(this, this.selectedRow);
    },
    //记录选中的行
    handleSelect(val) {
      this.selectedRow = val
    },
    selectionChange(val) {
      this.$store.dispatch(GRID_FILTER.SET_MULIT, { filterID: this.filterID, items: val });
    },
    //行点击事件
    cellClick(row, column, cell, event) {
      this.$emit('cellClick', row, column, cell, event);
    },
    //排序改变事件
    sortChange(sort) {
      if (sort.prop != null) {
        let p = { filterID: this.filterID, sorts: [{ Field: sort.prop, SortBy: sort.order == 'ascending' ? 1 : 2 }] };
        this.$store.dispatch(GRID_FILTER.SET_PARAMS, p).then(() => {
          this.loadData();
        });
      }
    },
    //页改变事件
    currentChange(val) {
      this.$store.dispatch(GRID_FILTER.SET_PARAMS, { filterID: this.filterID, index: val }).then(() => {
        this.loadData();
      });
    },
    //显示数量改变事件
    sizeChange(val) {
      this.params.size = val;
      this.params.index = 1;
      let p = { filterID: this.filterID, size: val, index: this.params.index };
      this.$store.dispatch(GRID_FILTER.SET_PARAMS, p).then(() => {
        this.loadData();
      });
    },
    //过滤事件
    filerChange(c) {
      let p = Object.assign({ filterID: this.filterID, index: 1 }, { conditions: this.defaultParams.conditions });
      p.conditions = p.conditions.concat(c);
      this.$store.dispatch(GRID_FILTER.SET_PARAMS, p).then(() => {
        this.loadData();
      });
    },
    //加载数据
    loadData() {
      if (this.$_.isNull(this.gridApi) || this.$_.isUndefined(this.gridApi)) {
        this.grid.data = this.initData;
        return;
      }
      this.loading = true;
      ajax.get(this.gridApi, { params: this.params }).then(res => {
        this.loading = false;
        this.grid.data = res.data.data.data;
        this.grid.total = res.data.data.dataCount;
      }).catch((error) => {
        this.$message({ message: '加载出错', type: 'error' });
        this.loading = false;
      });
    },
    //格式化
    gridFormatter(type) {
      if (typeof type == 'function') {
        return type;
      } else if (typeof type == 'string') {
        let formatters = {};
        formatters.shortDate = (row, column, cellVal) => {
          return this.$util.date.getDateTime(row.cellVal).format('yyyy-MM-dd');
        };
        formatters.fullDate = (row, column, cellVal) => {
          return this.$util.date.getDateTime(row.cellVal).toString();
        };
        if (typeof formatters[type] != 'undefined') return formatters[type];
      } else {

      }
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
    this.loadData();
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