// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'

import store from './store'
import '@/styles/index.less'
import '@/styles/reset.js'

import router from './router'
router.beforeEach((to,from,next)=>{
  let path = to.path
  if(path === '/' || path === '/category' || path === '/cart' || path === '//mine'){
    store.state.tabBarShow = true
  }else{
    store.state.tabBarShow = false
  }
  next()
})


import { Swipe, SwipeItem, Lazyload,Indicator,MessageBox } from 'mint-ui';

Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.use(Lazyload)
Vue.prototype.loading = Indicator
Vue.prototype.$msg = MessageBox
//引入http库
import axios from 'axios'
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
