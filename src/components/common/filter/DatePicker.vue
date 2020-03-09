<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-date-picker v-model="inputVal" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOpts">
        </el-date-picker>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import icons from '@/lib/icon.js';

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
      beginDate: null,
      endDate: null,
      pickerOpts: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三年',
          onClick(picker) {
            const end = new Date();
            const start = new Date(end.getFullYear() - 3, end.getMonth(), end.getDate());
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      options: [
        { label: '等于', value: this.$util.query.opt.eq },
        { label: '大于', value: this.$util.query.opt.gt },
        { label: '大于等于', value: this.$util.query.opt.gte },
        { label: '小于', value: this.$util.query.opt.lt },
        { label: '小于等于', value: this.$util.query.opt.lte },
        { label: '时间段', value: 0 }
      ],
    }
  },
  computed: {
    myColumn() {
      return this.column;
    }
  },
  methods: {
    getOpt() {
      //20190403杨晓科：修复日期返回""导致查询不对的bug
      if (this.inputVal == null || this.inputVal == "")
        return null;
      return [{
        Field: this.myColumn.prop,
        DataType: this.$util.query.dataType.date,
        Option: this.$util.query.opt.gte,
        Value: this.inputVal[0]
      }, {
        Field: this.myColumn.prop,
        DataType: this.$util.query.dataType.date,
        Option: this.$util.query.opt.lte,
        Value: this.inputVal[1]
      }];
    },
    reset() {
      this.inputVal = null;
    }
  },
  watch: {
  },
  created() {
  }
}
</script>
<style>
.el-date-editor--daterange.el-input__inner {
  width: 100%;
}

.date-picker-break {
  text-align: center;
  width: 100%;
  display: block;
}
</style>