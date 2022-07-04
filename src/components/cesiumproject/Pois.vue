<template>
  <div id="cesiumContainer"></div>
</template>
<script>
/*eslint no-undef: 0*/
import CesiumNavigation from 'cesium-navigation-es6'
import { mapState } from 'vuex'
export default {
  name: 'Pois',
  data() {
    return {
      viewer: null,
      scene: null,
      camera: null
    }
  },
  computed: {
    ...mapState({
      activeTitle: state => state.activeTitle
    })
  },
  watch: {},
  mounted() {
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 22, 130, 50) // home定位到中国范围
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain(),
      animation: true, // 动画部件
      baseLayerPicker: false, // 图层选择控件
      fullscreenButton: true, // 全屏控件
      vrButton: false, // vr
      geocoder: false, // 地点搜索
      homeButton: false, // 视图重置
      infoBox: true, // 详情弹框
      sceneModePicker: false, // 二三维切换
      selectionIndicator: true, // 指示器
      timeline: true, // 时间线
      navigationHelpButton: false, // 帮助
      navigationInstructionsInitiallyVisible: false,
      shadows: true, // 太阳折射阴影
      shouldAnimate: true, // 默认开启动画
      skyBox: new Cesium.SkyBox({
        // 用于渲染星空的SkyBox对象
        sources: {
          positiveX: require('@assets/images/SkyBox/00h+00.jpg'),
          negativeX: require('@assets/images/SkyBox/12h+00.jpg'),
          positiveY: require('@assets/images/SkyBox/06h+00.jpg'),
          negativeY: require('@assets/images/SkyBox/18h+00.jpg'),
          positiveZ: require('@assets/images/SkyBox/06h+90.jpg'),
          negativeZ: require('@assets/images/SkyBox/06h-90.jpg')
        }
      })
    })
    this.scene = this.viewer.scene
    this.camera = this.viewer.camera
    this.camera.direction = new Cesium.Cartesian3(
      0.18508079398547772,
      -0.7977531248951105,
      -0.5738772093556176
    )
    this.camera.position = new Cesium.Cartesian3(
      -5086322.618672597,
      21923559.305613995,
      15712292.5811783
    )
    this.initNavigation(this.viewer)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'cesium项目实战')
    },
    // 初始化指北针
    initNavigation() {
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
      CesiumNavigation(this.viewer, options)
      // 修改infonbox:false情况下的bug
      var iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0]
      if (!iframe) return
      iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms')
      iframe.setAttribute('src', '') // 必须设置src为空 否则不会生效
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  ::v-deep .cesium-viewer-bottom {
    display: none;
  }
}
</style>
<style lang="css"></style>
