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
 * @Date: 2021-08-30 09:03:37
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-30 09:04:51
 -->

<template>
  <div id="cesiumContainer"></div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'
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
    // 设置后当相机高度达到设置的最大和最小高度时将不再放大和缩小
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 250000 // 相机的高度的最小值
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000 // 相机高度的最大值
    viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000 // 设置相机缩小时的速率
    viewer.scene.screenSpaceCameraController._maximumZoomRate = 200000000 // 设置相机放大时的

    var scene = viewer.scene
    // 当相机缩放到一定高度的时候，控制鼠标不能进行缩放。
    // cesium加载二维地图，为了防止当前视野范围内虚化，可以把二维地图进行全球剖分进行缓存，发布缓存地图服务。
    // 相机控制参数：

    // 如果为true，则允许用户旋转相机。如果为假，相机将锁定到当前标题。此标志仅适用于2D和3D。
    // scene.screenSpaceCameraController.enableRotate = false;

    // 如果为true，则允许用户平移地图。如果为假，相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式。
    // scene.screenSpaceCameraController.enableTranslate = false;

    // 如果为true，允许用户放大和缩小。如果为假，相机将锁定到距离椭圆体的当前距离
    // scene.screenSpaceCameraController.enableZoom = false;

    // 如果为true，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
    // scene.screenSpaceCameraController.enableTilt = false;
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '地图相机高度限制范围显示')
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
