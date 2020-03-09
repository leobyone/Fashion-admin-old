import Vue from 'vue'
import input from '@/components/common/filter/Input.vue'
import checkbox from '@/components/common/filter/Checkbox.vue'
import select from '@/components/common/filter/Select.vue'
import datePicker from '@/components/common/filter/DatePicker.vue'

const filters = { input: input, checkbox: checkbox, select: select, date: datePicker };
Vue.component('filterRender', {
  date() {
    return { data: {} }
  },
  props: {
    column: {},
    gridID: ''
  },
  computed: {},
  render(h) {
    let type = 'input';
    if (typeof this.column.type != 'undefined') {
      type = this.column.type;
    }
    type = 'string|link|username|html'.split('|').indexOf(type) > -1 ? 'input' : type;
    return h(filters[type], { attrs: { 'gridID': this.gridID, 'column': this.column } });
  },
  methods: {
    getOpt() {
      return this.$children[0].getOpt();
    },
    reset() {
      this.$children[0].reset();
    }
  }
})