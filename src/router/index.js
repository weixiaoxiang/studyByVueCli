import Vue from 'vue'
import VueRouter from 'vue-router'
import openlayersRouter from './openlayersRouter'
import cesiumRouter from './cesiumRouter'
import cesiumprojectRouter from './cesiumprojectRouter'
import threejsRouter from './threejsRouter'
import comprehensiveRouter from './comprehensiveRouter'
import Login from '../views/Login.vue'
import Welcome from '@components/Welcome.vue'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// 原文地址：https://blog.csdn.net/cll1224666878/article/details/107062586
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: () => import('@views/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      ...openlayersRouter, // ol路由
      ...cesiumRouter, // cesium陆由
      ...threejsRouter, // threejs陆由
      ...cesiumprojectRouter, // cesiumproject路由
      ...comprehensiveRouter // 综合练习路由
    ]
  },
  {
    path: '/pinyougou',
    component: () => import('@components/Pinyougou.vue')
  },
  {
    path: '/firekeeper',
    component: () => import('@components/FireKeeper.vue')
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的页面路径
  // from 从哪个页面跳转而来
  // next 是一个函数，表示放行
  if (to.path === '/login') return next()
  if (to.path === '/pinyougou') return next()

  // 获取session
  const userNameStr = window.sessionStorage.getItem('username')
  const passWordStr = window.sessionStorage.getItem('password')

  if (!userNameStr && !passWordStr) return next('/login')
  next()
})

export default router
