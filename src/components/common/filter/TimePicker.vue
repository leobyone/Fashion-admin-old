<template>
  <el-input placeholder="请输入查询内容" v-model="inputVal" class="input-with-select">
    <el-select v-model="select" slot="prepend" placeholder="请选择">
      <el-option v-for="(option,key) in options" :key="key" :label="option.label" :value="option.value">
      </el-option>
    </el-select>
    <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
  </el-input>
</template>
<script>
export default {
  props: {
    column: { default: null },
    size: { default: 'small' },
    gridID: { default: null }
  },
  data() {
    return {
      field: null,
      inputVal: '',
      selectVal: 0,
      options: [
        { label: '包含', value: 0 },
        { label: '等于', value: 1 },
        { label: '大于', value: 2 },
        { label: '大于等于', value: 3 },
        { label: '小于', value: 4 },
        { label: '小于等于', value: 5 }
      ]
    }
  },
  computed: {
    myColumn() {
      return this.column;
    }
  },
  methods: {
  },
  watch: {
  },
  created() {

  }
}
</script>
<style>
