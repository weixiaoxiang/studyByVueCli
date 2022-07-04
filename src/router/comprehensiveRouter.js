/*
 *                   江城子 . 程序员之歌
 *
 *               十年生死两茫茫，写程序，到天亮。
 *                   千行代码，Bug何处藏。
 *               纵使上线又怎样，朝令改，夕断肠。
 *
 *               领导每天新想法，天天改，日日忙。
 *                   相顾无言，惟有泪千行。
 *               每晚灯火阑珊处，夜难寐，加班狂。
 *
 *
 * @Descripttion: 描述-
 * @version: v1.0
 * @Author: yichonglou
 * @Date: 2022-04-08 09:16:02
 * @FilePath: \study\src\router\comprehensiveRouter.js
 * @LastEditors: yichonglou
 * @LastEditTime: 2022-04-08 09:17:36
 */

var comprehensiveRouter = [
  {
    path: '/ExcelExport',
    component: () => import('@components/comprehensive/ExcelExport.vue')
  },
  // *echarts实现水滴图效果
  {
    path: '/waterdroplets',
    component: () => import('@components/comprehensive/Waterdroplets.vue')
  }
]
export default comprehensiveRouter
