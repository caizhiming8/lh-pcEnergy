import Vue from '../static/js/directive';
import qs from 'qs';
import axios from 'axios';
import echarts from 'echarts'
import 'babel-polyfill';
import storage from '../static/js/store.js';
import session from '../static/js/session.js';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import $ from "jquery";
import '../static/css/main.css'
import "babel-polyfill";
import VUEX from '../static/js/vuex.js';
import globalData from '../static/js/globaldata';
import websokit from './api/api.js';
import bus from '../static/js/bus.js';
import VueCountUp from 'vue-countupjs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import App from './App';
import router from './router';
Vue.use(ElementUI);
Vue.use(VueCountUp);
//请求列表
const pending=[];
//取消列表
const cancelToken=axios.CancelToken;
let removePending = (ever) => {
        for(let p in pending){
            if(pending[p].u === ever.url + '&' + ever.method) { //当当前请求在数组中存在时执行函数体
                pending[p].f(); //执行取消操作
                pending.splice(p, 1); //把这条记录从数组中移除
            }
        }
}
// 前台发送请求拦截取消重复请求
axios.interceptors.request.use(config => {
    removePending(config); //在一个ajax发送前执行一下取消操作
    config.cancelToken = new cancelToken((c)=>{
        // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
        pending.push({ u: config.url + '&' + config.method, f: c });
    });
    //设置请求头
    if(storage.get('token')) {//判断token是否存在
        config.headers.Authorization =storage.get('token')//存在就在每一个请求前添加token
    }
    return config
  }, error => {//对错误的请求做出反应
    return Promise.reject(error)
  })
//前台接收后台的响应拦截
axios.interceptors.response.use(response => {
    if(response.data.login == "false") {
        window.location.href = window.location.href.split('#/')[0] +'#/login';
        Vue.prototype.$message({
            type: 'success',
            message: '您登录已过期，请重新登录',
            showClose: true,
            duration: 2000
        })
        return response;
    }
    removePending(response.config)
    return response
}, error => {
    if(error.response.status == 404) {
        setTimeout(function() {
            // window.location.href = window.location.href.split('#/')[0] +'#/err';
        }, 3000);
    }
    if(error.response.status == 504) {
        Vue.prototype.$message({
            message: "服务器异常",
            duration: 5000,
            showClose: true
        })
    }
    if(error.response.status == 500) {
        Vue.prototype.$message({
            message: "请求超时",
            showClose: true,
            duration: 5000
        })
    }
    return Promise.reject(error);
})

Vue.directive('drag',
     function (el, binding) {
        let oDiv = el;
         oDiv.onmousedown = function (e) {
            e.preventDefault();
            e.stopPropagation();
            let bw = document.body.clientWidth;
            let bh = document.body.clientHeight;
            let disX = e.clientX - oDiv.offsetLeft;
            let disY = e.clientY - oDiv.offsetTop;
            document.onmousemove = function (e) {
                e.preventDefault();
                e.stopPropagation();
                let l = 0, t = 0;
                if (e.clientX >= bw) {
                    l = bw - disX;
                }else if (e.clientX <= 0) {
                    {
                        l = 0- disX;
                    }
                }else {
                    l = e.clientX - disX;
                }
                if(e.clientY >= bh) {
                    t = bh - disY;
                }else if(e.clientY <= 0) {
                    t = 0- disY;
                }else{
                    t = e.clientY - disY;
                }
                oDiv.style.left = l + 'px';
                oDiv.style.top = t + 'px';
             };
             document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
             };
         };
     }
 );

router.beforeEach((to,form,next)=> {
  if (globalData.$_userToken) {
    if(form.path == '/login' && globalData.$_flowerRouter.length>0) {
      globalData.$_flowerRouter = [];
      const header={
        path: '/header',
        name: 'header',
        component: 'components/page/header',
        children: JSON.parse(sessionStorage.getItem('USER_FLOWROUTER'))
      }
      let a = globalData.$_filterAsyncRouter([header])
      router.addRoutes(a);
      next();
    } else {
      next();
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next({
        path: '/login',
      })
    }
  }
})
if(globalData.$_flowerRouter.length>0) {
  const header={
    path: '/header',
    name: 'header',
    component: 'components/page/header',
    children: globalData.$_flowerRouter
  }
  let a = globalData.$_filterAsyncRouter([header]);
  router.addRoutes(a)
}

Vue.prototype.$_globalData = globalData;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$storage = storage;
Vue.prototype.$echarts = echarts
Vue.prototype.$session = session;
Vue.prototype.$websokit = websokit;
Vue.prototype.$bus = bus;
Vue.prototype.$Nprogress = NProgress;

new Vue({
    router,
    store: VUEX,
    render: h => h(App)
}).$mount('#app');
