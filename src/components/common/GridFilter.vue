<template>
  <el-row class="el-col-8 io-right g_wrapper">
    <!-- <el-dialog title="" :visible.sync="showSearch" width="680px">
            <div style="margin:10px;">
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item :label="column.label" v-for="(column,key) in columns" :key="key">
                        <el-row>
                            <filter-render :column="column" :gridID="gridID" ref="child"></filter-render>
                        </el-row>
                    </el-form-item>
                    <el-row>
                        <el-col :span="24" style="text-align:right">
                            <el-button size="small" class="io-ml-10 io-mr-10" type="primary" @click="onFilter()">确定</el-button>
                            <el-button size="small" class="io-mr-10" type='warning' @click="onReset()">置空</el-button>
                            <el-button size="small" class="io-mr-10" @click="onCancel()">取消</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>-->
    <!-- <el-input placeholder="请输入检索内容" v-model="txt">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <el-button slot="append" @click="showSearch=true">高级查询</el-button>
        </el-input>-->
    <el-col :span="24" v-show="showBtn">
      <el-button @mouseover.native="onHover()" plain icon="el-icon-search" size="small" circle></el-button>
    </el-col>

    <transition name="search_fade">
      <el-col :span="24" v-show="!showBtn" class="g_search_wrap">
        <el-input ref="input" placeholder="请输入搜索内容" v-model="keyword" size="small" @keyup.enter.native="onFilter">
          <i class="el-icon-search el-input__icon" slot="suffix" @click="onFilter"></i>
        </el-input>
        <span class="search_cancel" @click="onClear()">清空</span>
        <!-- <el-button type="primary" size="small">搜索</el-button> -->
      </el-col>
    </transition>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { GRID_FILTER } from '../../mutation-types'
import filerRender from '../common/filter/filter-render'
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
  computed: {
    //&& t.type == 'string'
    columns() { return this.initColumns.filter((t) => { return t.isFilter == true }) }
  },
  methods: {
    onHover() {
      setTimeout(() => {
        this.showBtn = false;
        this.$refs.input.focus();
      }, 200)
    },
    onSearch() {
      console.log('ok')
    },
    onFilter() {
      let conditions = this.getCnditions();
      this.$emit('filterCallback', conditions);
      this.showSearch = false;
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
      if (this.columns.length > 0 && this.keyword.length > 0) {
        conditions.push({
          Field: this.columns[0].prop,
          DataType: this.$util.query.dataType.str,
          Option: this.$util.query.opt.like,
          Value: this.keyword
        });
      }
      // for (let i = 0; i < this.$refs.child.length; i++) {
      //     let opts = this.$refs.child[i].getOpt();
      //     if (opts != null) {
      //         for (let j = 0; j < opts.length; j++) {
      //             conditions.push(opts[j]);
      //         }
      //     }
      // }
      console.log(conditions);
      return conditions;
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
