const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const path = require('path')

console.log(process.env.NODE_ENV)

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,  // 去掉打包后js中，会自动生成的一些map文件
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : './',
  devServer: {
        proxy: {
      '/shop_api': {
        target: 'https://venus-api-demo.boomingclub.com/venus/api/',//开发地址
          //target: 'http://localhost:9089/venus/api/',//开发地址
        changeOrigin: true,     // target是域名的话，需要这个参数，
        secure: false,          // 设置支持https协议的代理
        pathRewrite: {'^/shop_api' : ''},
      },
        /*'/api': {
            target: 'http://wx.lohike.net',
            changeOrigin: true,     // target是域名的话，需要这个参数，
            secure: false,          // 设置支持https协议的代理
            pathRewrite: {'^/api' : ''},
        },
      '/test': {
          //target: 'https://api.it120.cc/xiaochengxu',
          target: 'http://localhost:9089',
          changeOrigin: true,     // target是域名的话，需要这个参数，
          secure: false,          // 设置支持https协议的代理
          pathRewrite: {'^/test' : ''},
      },*/
    },
      disableHostCheck: true
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets',resolve('src/assets'))
      .set('@styles', resolve('src/styles'))
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
          }),
          pxtorem({
            rootValue: 50,
            unitPrecision: 3,
            propList: ['*', '!font*'],
            selectorBlackList: ['.ignore ', '.hairlines', 'van-circle__layer', '.van-hairline'],
            minPixelValue: 2,
          })
        ]
      }
    }
  }
}
