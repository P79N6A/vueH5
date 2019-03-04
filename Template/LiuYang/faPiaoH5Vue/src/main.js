// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
//import { hostname } from 'os';
// import apiConfig from '../config/api.config'

//const hostname = process.env.NODE_ENV === 'development' ? '' : 'http://192.168.2.2/gaoyuan/HMS'
// axios.defaults.baseURL = apiConfig.baseUrl
axios.create({
  //baseURL:hostname,
  transformRequest:[function (data) {
    data = qs.stringify(data)
    return data
  }],
  headers:{
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
Vue.prototype.$axios = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
