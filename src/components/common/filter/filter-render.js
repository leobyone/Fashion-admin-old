import Vue from 'vue'
import input from '@/components/common/filter/Input.vue'

const filters = { input: input };
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
    type = type == 'string' || type == 'num' ? 'input' : type;
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