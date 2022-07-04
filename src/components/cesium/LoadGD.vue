<!--
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑       永不宕机     永无BUG
 *
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-07-26 22:24:56
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-30 10:48:48
 -->

<template>
  <div id="cesiumContainer"></div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'
// 指北针插件
import CesiumNavigation from 'cesium-navigation-es6'
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  watch: {},
  mounted() {
    const that = this
    var viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain(),
      animation: false, // 动画部件
      baseLayerPicker: false, // 图层选择控件
      fullscreenButton: false, // 全屏控件
      vrButton: false, // vr
      geocoder: false, // 地点搜索
      homeButton: false, // 视图重置
      infoBox: true, // 详情弹框
      sceneModePicker: false, // 二三维切换
      selectionIndicator: false, // 指示器
      timeline: false, // 时间线
      navigationHelpButton: false, // 帮助
      navigationInstructionsInitiallyVisible: false,
      shadows: true, // 太阳折射阴影
      shouldAnimate: true // 默认开启动画
    })
    this.initNavigation(viewer)
    // 高德矢量街道
    var gdLayer = new Cesium.UrlTemplateImageryProvider({
      url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      minimumLevel: 3,
      maximumLevel: 18
    })
    viewer.imageryLayers.addImageryProvider(gdLayer)

    // 高德影像
    var gdLayer1 = new Cesium.UrlTemplateImageryProvider({
      url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      minimumLevel: 3,
      maximumLevel: 18
    })
    // viewer.imageryLayers.addImageryProvider(gdLayer1);
    // 高德路网中文注记
    var gdLabelLayer = new Cesium.UrlTemplateImageryProvider({
      url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
      minimumLevel: 3,
      maximumLevel: 18
    })

    viewer.imageryLayers.addImageryProvider(gdLabelLayer)

    // 获得当前地图视图范围
    var scratchRectangle = new Cesium.Rectangle()
    // 存在问题：当canvas左下角和右上角都不在球上时，computeViewRectangle()不起作用
    viewer.scene.camera.moveEnd.addEventListener((e) => {
      var rect = viewer.camera.computeViewRectangle(
        viewer.scene.globe.ellipsoid,
        scratchRectangle
      )
      var coors = [
        Cesium.Math.toDegrees(rect.west).toFixed(4),
        Cesium.Math.toDegrees(rect.south).toFixed(4),
        Cesium.Math.toDegrees(rect.east).toFixed(4),
        Cesium.Math.toDegrees(rect.north).toFixed(4)
      ]
      console.log(coors)
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '初始化cesium')
    },
    // 初始化指北针
    initNavigation(viewer) {
      var options = {}
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50)
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = true
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true
      CesiumNavigation(viewer, options)
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
