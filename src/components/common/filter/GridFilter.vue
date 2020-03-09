<template>
  <el-row class="el-col-8 io-right g_wrapper">
    <el-input placeholder="请输入检索内容" v-model="keyword" size="small" :clearable="true">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
      <el-button slot="append" @click="onSearch">查询</el-button>
      <el-button slot="append">|</el-button>
      <el-button slot="append" @click="onOpen">高级查询</el-button>
    </el-input>
    <cu-dialog ref="dialog" :showFooter="true" :title="'高级查询'">
      <div>
        <el-form ref="form" :model="form" label-width="110px">
          <el-form-item :label="column.label" v-for="(column,key) in columns" :key="key">
            <el-row>
              <filter-render :column="column" :gridID="gridID" ref="child"></filter-render>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-row>
          <el-col :span="24" style="text-align:right;margin-top:5px;height:40px;">
            <el-button size="small" class="io-ml-10 io-mr-10" type="primary" @click="onFilter()">确定</el-button>
            <el-button size="small" class="io-mr-10" @click="onReset()">清空</el-button>
            <el-button size="small" class="io-mr-10" @click="onCancel()">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </cu-dialog>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import filerRender from '@/components/common/filter/filter-render.js'
export default {
  props: {
    initColumns: { type: Array, default: () => { return [] } },
    gridID: { default: '' }
  },
  data() {
    return {
      txt: '',
      showSearch: false,
      form: {},
      select: [],
      keyword: '',
      showBtn: true
    }
  },
  components: {
    cuDialog: () => import('@/components/common/CuDialog.vue')
  },
  computed: {
    columns() { return this.initColumns.filter((t) => { return t.isFilter == true }) }
  },
  methods: {
    onHover() {
      setTimeout(() => {
        this.showBtn = false;
        this.$refs.input.focus();
      }, 200)
    },
    onOpen() {
      console.log(this.columns);
      this.$refs.dialog.open();
    },
    onSearch() {
      let conditions = [];
      if (this.columns.length > 0 && this.keyword.length > 0) {
        conditions.push({
          Field: this.columns[0].prop,
          DataType: this.$util.query.dataType.str,
          Option: this.$util.query.opt.like,
          Value: this.keyword
        });
      }
      this.$emit('filterCallback', conditions);
    },
    onFilter() {
      let conditions = this.getCnditions();
      this.$emit('filterCallback', conditions);
      this.$refs.dialog.close();
    },
    onCancel() {
      this.$refs.dialog.close();
    },
    onClear() {
      this.keyword = '';
      this.$emit('filterCallback', []);
    },

    onReset() {
      this.$confirm('此操作清空查询条件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.$refs.child.length; i++) {
          this.$refs.child[i].reset();
        }
      }).catch(() => {

      });
    },
    getCnditions() {
      let conditions = [];
      for (let i = 0; i < this.$refs.child.length; i++) {
        let opts = this.$refs.child[i].getOpt();
        if (opts != null) {
          for (let j = 0; j < opts.length; j++) {
            conditions.push(opts[j]);
          }
        }
      }
      // console.log(conditions);
      return conditions;
    }
  },
  watch: {
    showSearch: function (val) {
      if (val) {
        this.$refs.dialog.open();
      } else {
        this.$refs.dialog.close();
      }
    },
    keyword: function (val) {
      if (val.length == 0) {
        this.$emit('filterCallback', []);
      }
    }
  },
  created() {
  }
}
</script>
<style>
.g_wrapper {
  box-sizing: border-box;
}
.g_search_wrap {
  position: relative;
}
.g_search_wrap .el-icon-search:before {
  font-size: 15px;
  color: #606266;
  cursor: pointer;
}
.g_search_wrap .search_cancel {
  position: absolute;
  top: 5px;
  right: -40px;
  font-size: 14px;
  color: #909399;
  cursor: pointer;
}
.search_fade-enter-active {
  transition: opacity 0.8s;
}
.search_fade-enter {
  opacity: 0;
}
.search_fade-leave-to,
.search_fade-leave-active {
  display: none;
}
</style>
