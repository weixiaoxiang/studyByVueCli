<template>
  <div id="cesiumContainer">
    <el-form ref="form" :model="form" label-width="auto" size="mini" :inline="true">
      <el-row>界面操作设置:</el-row>
      <el-form-item label="搜索按钮">
        <el-switch v-model="form.v1"></el-switch>
      </el-form-item>
      <el-form-item label="Home按钮">
        <el-switch v-model="form.v2"></el-switch>
      </el-form-item>
      <el-form-item label="模式切换">
        <el-switch v-model="form.v3"></el-switch>
      </el-form-item>
      <el-form-item label="底图切换">
        <el-switch v-model="form.v4"></el-switch>
      </el-form-item>
      <el-form-item label="帮助按钮">
        <el-switch v-model="form.v5"></el-switch>
      </el-form-item>
      <el-form-item label="动画控件">
        <el-switch v-model="form.v6"></el-switch>
      </el-form-item>
      <el-form-item label="时间轴">
        <el-switch v-model="form.v7"></el-switch>
      </el-form-item>
      <el-form-item label="全屏控件">
        <el-switch v-model="form.v8"></el-switch>
      </el-form-item>
      <el-form-item label="指示器">
        <el-switch v-model="form.v9"></el-switch>
      </el-form-item>
      <el-form-item label="属性窗口">
        <el-switch v-model="form.v10"></el-switch>
      </el-form-item>
      <el-row>效果设置:</el-row>
      <el-form-item label="深度测试">
        <el-switch v-model="form.v11"></el-switch>
      </el-form-item>
      <el-form-item label="抗锯齿">
        <el-switch v-model="form.v12"></el-switch>
      </el-form-item>
      <el-form-item label="对数深度缓冲">
        <el-switch v-model="form.v13"></el-switch>
      </el-form-item>
      <el-form-item label="高动态范围">
        <el-switch v-model="form.v14"></el-switch>
      </el-form-item>
      <el-form-item label="启用光照">
        <el-switch v-model="form.v15"></el-switch>
      </el-form-item>
      <el-form-item label="启用汉化">
        <el-switch v-model="form.v16" disabled></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
/*eslint no-undef: 0*/
import CesiumZh from '@utils/CesiumZh'
import CesiumNavigation from 'cesium-navigation-es6'
import { mapState } from 'vuex'
export default {
  name: 'ToolPanel',
  data() {
    return {
      viewer: null,
      scene: null,
      camera: null,
      form: {
        v1: true,
        v2: true,
        v3: true,
        v4: true,
        v5: true,
        v6: true,
        v7: true,
        v8: true,
        v9: true,
        v10: true,
        v11: true,
        v12: true,
        v13: true,
        v14: true,
        v15: true,
        v16: true
      }
    }
  },
  computed: {
    ...mapState({
      activeTitle: state => state.activeTitle
    })
  },
  watch: {
    form: {
      handler(newval, oldval) {
        console.log(1)
        this.changeConfig()
      },
      deep: true
    }
  },
  mounted() {
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 22, 130, 50) // home定位到中国范围
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      // terrainProvider: Cesium.createWorldTerrain(),
      animation: true, // 动画部件
      baseLayerPicker: true, // 图层选择控件
      fullscreenButton: true, // 全屏控件
      vrButton: false, // vr
      geocoder: true, // 地点搜索
      homeButton: true, // 视图重置
      infoBox: true, // 详情弹框
      sceneModePicker: true, // 二三维切换
      selectionIndicator: true, // 指示器
      timeline: true, // 时间线
      navigationHelpButton: true, // 帮助
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
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(117.3, 31.87),
      billboard: {
        image: '/data/Sandcastle/images/Cesium_Logo_overlay.png'
      }
    })
    this.viewer.scene.globe.depthTestAgainstTerrain = true
    // 开启光照
    this.scene.globe.enableLighting = true
    // 导航罗盘
    this.initNavigation(this.viewer)
    // 修改了baselayerpicker控件
    this.modifyBaselayerPicker()
    // 开启汉化  引用了CesoumZh.js
    CesiumZh.load()
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
    // 控件方法
    changeConfig() {
      // 地点检索
      if (this.form.v1) {
        this.viewer.geocoder.container.style.display = 'inline-block'
      } else {
        this.viewer.geocoder.container.style.display = 'none' // 隐藏地名查找控件
      }
      // home
      const el2 = document.querySelector('.cesium-home-button')
      if (this.form.v2) {
        el2.style.display = 'inline-block'
      } else {
        el2.style.display = 'none' //
      }
      // 二三维切换
      const el3 = document.querySelector('.cesium-sceneModePicker-wrapper')
      if (this.form.v3) {
        el3.style.display = 'inline-block'
      } else {
        el3.style.display = 'none' //
      }
      // 图层选择
      const el4 = document.querySelector('.cesium-baseLayerPicker-selected').parentElement
      if (this.form.v4) {
        el4.style.display = 'inline-block'
      } else {
        el4.style.display = 'none' //
      }
      // 帮助
      const el5 = document.querySelector('.cesium-navigationHelpButton-wrapper')
      if (this.form.v5) {
        el5.style.display = 'inline-block'
      } else {
        el5.style.display = 'none' //
      }
      // 时钟
      if (this.form.v6) {
        this.viewer.animation.container.style.display = 'block'
      } else {
        this.viewer.animation.container.style.display = 'none' // 隐藏动画控件
      }
      // 时间轴
      if (this.form.v7) {
        this.viewer.timeline.container.style.display = 'block'
      } else {
        this.viewer.timeline.container.style.display = 'none' //
      }
      // 全屏
      const el8 = document.querySelector('.cesium-viewer-fullscreenContainer')
      if (this.form.v8) {
        el8.style.display = 'inline-block'
      } else {
        el8.style.display = 'none' //
      }
      // infobox
      const el10 = document.querySelector('.cesium-viewer-infoBoxContainer')
      if (this.form.v10) {
        el10.style.display = 'block'
      } else {
        el10.style.display = 'none' //
      }
      // 深度检测
      if (this.form.v11) {
        this.viewer.scene.globe.depthTestAgainstTerrain = true
      } else {
        this.viewer.scene.globe.depthTestAgainstTerrain = false
      }
      // 是否支持图像渲染像素化处理
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        this.viewer.resolutionScale = window.devicePixelRatio
        // 开启抗锯齿
        if (this.form.v11) {
          this.viewer.scene.postProcessStages.fxaa.enabled = true
        } else {
          this.viewer.scene.postProcessStages.fxaa.enabled = false
        }
      } else {
        alert('电脑不支持图像渲染像素化处理')
      }
      // 开启对数深度缓冲
      if (this.form.v13) {
        this.scene.logarithmicDepthBuffer = true
      } else {
        this.scene.logarithmicDepthBuffer = false
      }
      // 高动态范围 HDR
      if (this.form.v14) {
        this.scene.highDynamicRange = true
      } else {
        this.scene.highDynamicRange = false
      }
      // 启用光照
      if (this.form.v15) {
        this.scene.globe.enableLighting = true
        // this.scene.globe.dynamicAtmosphereLighting = true
        // this.scene.globe.dynamicAtmosphereLightingFromSun = true
      } else {
        this.scene.globe.enableLighting = false
        // this.scene.globe.dynamicAtmosphereLighting = false
        // this.scene.globe.dynamicAtmosphereLightingFromSun = false
      }
    },
    // 修改baselayerPicker
    modifyBaselayerPicker() {
      const imageryViewModels = []
      const terrainViewModels = []
      imageryViewModels.push(
        new Cesium.ProviderViewModel({
          // 图层名称
          name: '高德矢量',
          // 图层缩略图
          iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
          // 图层鼠标悬浮提示
          tooltip: '高德矢量 地图服务',
          creationFunction: function () {
            return new Cesium.UrlTemplateImageryProvider({
              url: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
              subdomains: ['1', '2', '3', '4']
            })
          }
        })
      )
      imageryViewModels.push(
        new Cesium.ProviderViewModel({
          // 图层名称
          name: 'arcgis影像',
          // 图层缩略图
          iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
          // 图层鼠标悬浮提示
          tooltip: 'arcgis影像 地图服务',
          creationFunction: function () {
            return new Cesium.ArcGisMapServerImageryProvider({
              url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
          }
        })
      )
      this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels = imageryViewModels

      terrainViewModels.push(
        new Cesium.ProviderViewModel({
          // 图层名称
          name: 'cesium地形',
          // 图层缩略图
          iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
          // 图层鼠标悬浮提示
          tooltip: 'cesium地形 地图服务',
          creationFunction: function () {
            return Cesium.createWorldTerrain()
          }
        })
      )
      this.viewer.baseLayerPicker.viewModel.terrainProviderViewModels = terrainViewModels
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
  .el-form {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 600px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    ::v-deep .el-form-item__label {
      color: #fff;
    }
    z-index: 1;
    .el-row {
      padding: 5px 15px;
    }
  }
}
</style>
<style lang="css"></style>
