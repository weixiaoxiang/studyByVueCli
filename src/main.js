/*
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-07-20 20:06:28
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-12-23 10:41:12
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '@assets/css/global.css'
import '@assets/fonts/iconfont.css'
import '@assets/fonts/al/iconfont.css'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
  // 创建全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
