const { defineConfig } = require('@vue/cli-service')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 设置代理
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 访问数据的计算机域名
        ws: true, // 是否启用websockets
        changOrigin: true, //开启代理,
        pathRewrite: { // 重写代理规则，/api开头，代理到/
          '^/api': '/'
        }
      }
    }
  },
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin()],
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
})
