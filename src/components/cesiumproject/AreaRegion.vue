<template>
  <div id="cesiumContainer">
    <div class="panel">
      <el-radio-group v-model="radio1" size="mini" @change="change">
        <el-radio-button label="默认样式"></el-radio-button>
        <el-radio-button label="基础样式"></el-radio-button>
        <el-radio-button label="注记标签"></el-radio-button>
        <el-radio-button label="分色渲染"></el-radio-button>
        <el-radio-button label="标签+分色渲染"></el-radio-button>
        <el-radio-button label="渐变"></el-radio-button>
        <el-radio-button label="高度可视化"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
/*eslint no-undef: 0*/
import baseApi from '@/api/api'
import CesiumNavigation from 'cesium-navigation-es6'
import { mapState } from 'vuex'
export default {
  name: 'AreaRegion',
  data() {
    return {
      viewer: null,
      scene: null,
      camera: null,
      radio1: '默认样式'
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
    this.$notify({
      title: '警告',
      message: '需要开启本机nginx',
      type: 'warning'
    })
    // 加载json
    this.loadShp()
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
    },
    // 加载shp 需要启动nginx
    async loadShp() {
      const dataSources = this.viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load('http://localhost:9004/data/340100.json')
      )
      this.viewer.zoomTo(dataSources)
    },
    // change
    change() {
      // 重置
      this.cameraReset()
      const value = this.radio1
      if (value === '默认样式') {
        this.viewer.dataSources.add(
          Cesium.GeoJsonDataSource.load('http://localhost:9004/data/340100.json')
        )
      } else if (value === '基础样式') {
        this.viewer.dataSources.add(
          Cesium.GeoJsonDataSource.load('http://localhost:9004/data/340100.json'),
          {
            stroke: Cesium.Color.RED,
            fill: Cesium.Color.PINK.withAlpha(0.5),
            strokeWidth: 3
          }
        )
      } else if (value === '注记标签') {
      } else if (value === '分色渲染') {
      } else if (value === '标签+分色渲染') {
      } else if (value === '渐变') {
      } else if (value === '高度可视化') {
      }
    },
    cameraReset() {
      // 删除datasource
      this.viewer.dataSources.removeAll()
      var center = Cesium.Cartesian3.fromDegrees(117.22, 31.82)
      var heading = Cesium.Math.toRadians(0.0)
      var pitch = Cesium.Math.toRadians(-50.0)
      var range = 300000.0
      this.viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range))
      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
  ::v-deep .cesium-viewer-bottom {
    display: none;
  }
  .panel {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: #fff;
    border-radius: 8px;
    z-index: 1;
  }
}
</style>
<style lang="css"></style>
