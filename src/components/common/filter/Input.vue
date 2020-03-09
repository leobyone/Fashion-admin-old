<template>
  <el-row>
    <el-col :span="24">
      <el-input placeholder="请输入查询内容" v-model="inputVal" class="input-with-select">
        <el-select style="width:110px;" v-model="selectVal" slot="prepend" placeholder="请选择" @change="changeOpt">
          <el-option v-for="(option,key) in options" :key="key" :label="option.label" :value="option.value">
          </el-option>
        </el-select>
      </el-input>
    </el-col>
  </el-row>
</template>
<script>
import util from '@/lib/util.js'
export default {
  props: {
    column: { default: null },
    gridID: { default: null }
  },
  data() {
    return {
      inputVal: '',
      selectVal: null,
      options: [],
      isStr: '',
      dataType: '',
    }
  },
  computed: {
    myColumn() {
      return this.column;
    }
  },
  methods: {
    changeOpt(val) {
      console.log(val);
    },
    getOpt() {
      if (this.inputVal.length == "") return null;
      return [{
        Field: this.myColumn.prop,
        DataType: this.dataType == 'string' ? util.query.dataType.string : util.query.dataType.int,
        Option: this.selectVal,
        Value: this.inputVal
      }];
    },
    reset() {
      this.myColumn.type == 'string' ? this.selectVal = util.query.opt.like : this.selectVal == null;
      this.inputVal = '';
    }
  },
  watch: {
  },
  created() {
    this.dataType = 'string|link|username|html'.split('|').indexOf(this.myColumn.type) > -1 ? 'string' : this.myColumn.type;

    //his.myColumn.type == 'string'
    if (this.dataType) {
      this.options = [
        { label: '包含', value: util.query.opt.like },
        { label: '等于', value: util.query.opt.eq }
      ];
      this.selectVal = util.query.opt.like;
    } else {
      this.options = [
        { label: '等于', value: util.query.opt.eq },
        { label: '大于', value: util.query.opt.gt },
        { label: '大于等于', value: util.query.opt.gte },
        { label: '小于', value: util.query.opt.lt },
        { label: '小于等于', value: util.query.opt.lte }
      ];
    }
  }
}
</script>
<style>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>