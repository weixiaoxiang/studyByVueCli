/*
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-08-19 10:50:56
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-20 17:21:24
 */
var threejsRouter = [
  {
    path: '/ThreejsHellowWorld',
    component: () => import('@components/threejs/ThreejsHellowWorld.vue')
  },
  {
    path: '/Drawinglines',
    component: () => import('@components/threejs/Drawinglines.vue')
  },
  {
    path: '/Webgl_postprocessing_glitch',
    component: () =>
      import('@components/threejs/Webgl_postprocessing_glitch.vue')
  }
]
export default threejsRouter
