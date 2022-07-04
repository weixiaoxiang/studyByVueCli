/*
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2022-02-17 14:20:08
 * @LastEditors: yichonglou
 * @LastEditTime: 2022-02-17 14:48:36
 */
const cesiumprojectRouter = [
  {
    path: '/cstoolpanel',
    component: () => import('@components/cesiumproject/ToolPanel.vue')
  },
  {
    path: '/csarearegion',
    component: () => import('@components/cesiumproject/AreaRegion.vue')
  },
  {
    path: '/csbuildings',
    component: () => import('@components/cesiumproject/Buildings.vue')
  },
  {
    path: '/csroads',
    component: () => import('@components/cesiumproject/Roads.vue')
  },
  {
    path: '/cssubway',
    component: () => import('@components/cesiumproject/Subway.vue')
  },
  {
    path: '/cspois',
    component: () => import('@components/cesiumproject/Pois.vue')
  },
  {
    path: '/csmodels',
    component: () => import('@components/cesiumproject/Models.vue')
  },
  {
    path: '/csundergroundpipe',
    component: () => import('@components/cesiumproject/UndergroundPipe.vue')
  },
  {
    path: '/cstravelplan',
    component: () => import('@components/cesiumproject/TravelPlan.vue')
  },
  {
    path: '/cssearchposition',
    component: () => import('@components/cesiumproject/SearchPosition.vue')
  },
  {
    path: '/csscheduling',
    component: () => import('@components/cesiumproject/Scheduling.vue')
  },
  {
    path: '/csmonitor',
    component: () => import('@components/cesiumproject/Monitor.vue')
  },
  {
    path: '/cscutfill',
    component: () => import('@components/cesiumproject/CutFill.vue')
  },
  {
    path: '/csclippingplane',
    component: () => import('@components/cesiumproject/ClippingPlane.vue')
  },
  {
    path: '/csinundationanalysis',
    component: () => import('@components/cesiumproject/InundationAnalysis.vue')
  },
  {
    path: '/csprofileanalysis',
    component: () => import('@components/cesiumproject/Profileanalysis.vue')
  },
  {
    path: '/csperspectiveanalysis',
    component: () => import('@components/cesiumproject/PerspectiveAnalysis.vue')
  },
  {
    path: '/csterrainanalysis',
    component: () => import('@components/cesiumproject/TerrainAnalysis.vue')
  },
  {
    path: '/csspecial',
    component: () => import('@components/cesiumproject/Special.vue')
  },
  {
    path: '/csmeasure',
    component: () => import('@components/cesiumproject/Measure.vue')
  },
  {
    path: '/csvideoplay',
    component: () => import('@components/cesiumproject/VideoPlay.vue')
  },
  {
    path: '/csmeteorological',
    component: () => import('@components/cesiumproject/Meteorological.vue')
  }
]

export default cesiumprojectRouter
