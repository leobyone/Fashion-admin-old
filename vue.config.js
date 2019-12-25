// vue.config.js 配置说明
// 这里只列一部分，具体配置惨考文档啊
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
module.exports = {
  publicPath: "/",
  // 输出文件目录
  outputDir: "dist",
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "Fashion",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]
    }
  },

  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: false,

  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,

  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项
  runtimeCompiler: false,

  devServer: {
    // port: 2364, // 端口号
    // host: "localhost",
    // https: false, // https:{type:Boolean}
    // open: true, //配置自动启动浏览器
    open: true, //配置自动启动浏览器
    host: "127.0.0.1", //主机
    port: 6688, // 端口号自定义
    https: false, //是否开启https安全协议
    hotOnly: false, // https:{type:Boolean}
    // before: function(app) {
    //   app.get("./config/mobile-app-config.json", function(req, res) {
    //     window.appConfig = res;
    //     console.log(res);
    //   });
    // },
    //第三方api调用代理
    proxy: {
      "/api": {
        target: "http://localhost:62540",
        ws: true,
        changeOrigin: true, //允许跨域
        pathRewrite: { "^/apb": "" }
      }
    }
  },
  css: {
    loaderOptions: {
      stylus: {
        "resolve url": true,
        import: ["./src/theme"]
      }
    }
  },

  pluginOptions: {
    "cube-ui": {
      postCompile: true,
      theme: true
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js"
      },
      enforceExtension: false
    }
    // optimization: {
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             uglifyOptions: {
    //                 compress: {
    //                     warnings: false,
    //                     drop_console: true, //console
    //                     drop_debugger: false,
    //                     pure_funcs: ["console.log"] //移除console
    //                 }
    //             }
    //         })
    //     ]
    // }
  }
};
