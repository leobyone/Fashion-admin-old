<template>
  <el-row class="el-col-8 io-right g_wrapper">
    <!-- <el-col :span="24" v-show="showBtn">
      <el-button @mouseover.native="onHover()" plain icon="el-icon-search" size="small" circle></el-button>
    </el-col> -->
    <!-- <transition name="search_fade"> -->
    <el-col :span="24" v-show="showBtn" class="g_search_wrap">
      <el-input ref="input" placeholder="请输入搜索内容" v-model="keyword" size="small" @keyup.enter.native="onFilter">
        <i class="el-icon-search el-input__icon" slot="suffix" @click="onFilter"></i>
      </el-input>
      <span class="search_cancel" @click="onClear()">清空</span>
    </el-col>
    <!-- </transition> -->
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GRID_FILTER } from '@/store/mutation-types'
import filerRender from '@/components/common/filter/filter-render.js'
export default {
  data() {
    return {
      showSearch: false,
      keyword: '',
      showBtn: true
    }
  },
  computed: {
  },
  methods: {
    onHover() {
      setTimeout(() => {
        this.showBtn = false;
        this.$refs.input.focus();
      }, 200)
    },
    onFilter() {
      this.$emit('filterCallback', this.keyword);
      this.showSearch = false;
    },
    onClear() {
      this.keyword = '';
      this.$emit('filterCallback', this.keyword);
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
