<template>
  <el-dialog custom-class="cu-dialog_clear cu-dialog-change" :title="title" :visible="showDialog"
    :before-close="onBeforeClose" :modal="modal" :lock-scroll="lockScroll">
    <div class="cu-dialog_box">
      <div v-show="showHeader" class="cu-dialog_header">
        <slot name="header"> </slot>
      </div>
      <div style="clear:both;width:100%"></div>
      <div class="cu-dialog_content">
        <slot></slot>
      </div>
      <div style="clear:both;width:100%"></div>
      <div v-show="showFooter" class="cu-dialog_footer">
        <el-divider v-show="showFooter"></el-divider>
        <slot name="footer"></slot>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import PerfectScrollbar from 'perfect-scrollbar';

export default {
  props: {
    lockScroll: { default: true },
    modal: { default: true },
    size: { default: 'medium' },
    height: { default: '400px' },
    contentHeight: { default: '400px' },
    width: { default: '600px' },
    autoHeight: { default: true },
    title: { default: '' },
    showFooter: { default: false },
    showHeader: { default: false },
    isScroll: { default: true }
  },
  data() {
    return {
      sizes: [{ sm: 768, md: 992, lg: 1200, xl: 1920 }],
      boxStyles: { minWidth: '', minHeight: '' },
      showDialog: false,
      clientHeighs: [
      ],
      ps: null
    }
  },
  components: {
  },
  computed: {},
  methods: {
    onBeforeClose(done) {
      this.showDialog = false;
      done();
    },
    open() {
      let that = this;
      this.showDialog = true;
      setTimeout(() => {
        that.setAutoDialog();
      }, 100)
    },
    close() {
      this.showDialog = false;
    },
    setAutoDialog() {
      if (!this.showDialog) return;

      const body = document.querySelector('body');
      const box = this.$el.querySelector('.cu-dialog_box');
      const content = this.$el.querySelector('.cu-dialog_content');
      let clientHeight = body.clientHeight;
      let clientWidth = body.clientWidth;

      let footerHeight = 0;
      let headerHeight = 0;
      let contentHeight = 0;

      if (this.showFooter) {
        footerHeight = this.$el.querySelector('.cu-dialog_footer').clientHeight;
      }

      if (this.showHeader) {
        headerHeight = this.$el.querySelector('.cu-dialog_header').clientHeight;
      }

      // let bh = 0;
      // this.$_.each(this.clientHeighs, function (t) {
      //   if (clientHeight > t.min && clientHeight < t.max) {
      //     bh = t.height;
      //   }
      // })
      // if (bh == 0) bh = 315;

      // box.style.height = bh + 'px';

      if (!this.autoHeight) {

      } else {

        let bh = 0;
        this.$_.each(this.clientHeighs, function (t) {
          if (clientHeight > t.min && clientHeight < t.max) {
            bh = t.height;
          }
        })
        if (bh == 0) bh = 315;

        box.style.height = bh + 'px';

        content.style.height = (bh - footerHeight - headerHeight - 10) + 'px';
        content.style.position = 'relative';
        console.log(content.style.height);

        if (this.isScroll) {

          if (this.ps == null) {
            this.ps = new PerfectScrollbar(content, {
              wheelSpeed: 2,
              wheelPropagation: false,
              minScrollbarLength: 20
            });
          }
          this.ps.update();
        }
      }
    },
    init() {

    },
  },
  watch: {},
  mounted() {
    let that = this;
    window.onresize = () => {
      that.setAutoDialog();
    };
  },
  created() {
    let hs = Array.apply({}, { length: 10 })
    this.$_.each(hs, function (t, k) {
      hs[k] = {};
      hs[k].height = 290 + (35 * k);
      hs[k].min = 400 + (50 * k);
      hs[k].max = 500 + (50 * k);
    });
    this.clientHeighs = hs;
  }
}
</script>
<style>
.cu-dialog_box {
  width: 100%;
  min-height: 200px;
}
.cu-dialog_header {
  width: 100%;
  clear: both;
  float: left;
}
.cu-dialog_content {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 5px 0px;
}
.cu-dialog_footer {
  width: 100%;
}
.cu-dialog_footer .el-divider--horizontal {
  margin: 0px;
  /* padding: 1px 0px; */
  height: 0px;
}
.cu-dialog_clear .el-dialog__header {
  padding: 10px 0px 0px 15px;
}
/* .cu-dialog_clear .el-dialog__header, */
.cu-dialog_clear .el-dialog__body {
  padding: 0px 15px 5px 15px;
}
.cu-dialog-change .el-dialog__headerbtn {
  top: 20px !important;
  right: 15px !important;
}
.pick_someone_margin .select_company_wrap {
  height: 20px !important;
}
</style>