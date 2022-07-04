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
 * @Date: 2021-08-30 08:47:07
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-30 08:47:30
 -->

<template>
  <div id="cesiumContainer">
    <div id="popup"></div>
  </div>
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
      // terrainProvider: Cesium.createWorldTerrain(),
      selectionIndicator: false, // 指示器
      infoBox: false, // 详情弹框
      skyBox: new Cesium.SkyBox({
        // 用于渲染星空的SkyBox对象
        // 第二种
        sources: {
          positiveX: '/data/SampleData/SkyBox/00h+00.jpg',
          negativeX: '/data/SampleData/SkyBox/12h+00.jpg',
          positiveY: '/data/SampleData/SkyBox/06h+00.jpg',
          negativeY: '/data/SampleData/SkyBox/18h+00.jpg',
          positiveZ: '/data/SampleData/SkyBox/06h+90.jpg',
          negativeZ: '/data/SampleData/SkyBox/06h-90.jpg'
        }
      })
    })
    var scene = viewer.scene
    var camera = scene.camera
    var layer = viewer.imageryLayers.get(0)
    viewer.imageryLayers.remove(layer, true)
    // 访问球体对象（viewer.scene.globe） 并设置颜色
    viewer.scene.globe.baseColor = Cesium.Color.BLACK // 设置球默认颜色
    var TDU_Key = 'f3ab231f7cdfdb7e3f3110f5c16a04a5' // 天地图申请的密钥
    // 在线天地图影像服务地址(墨卡托投影)
    var TDT_IMG_W =
      'http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
      '&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
      '&style=default&format=tiles&tk=' +
      TDU_Key
    const Img = new Cesium.WebMapTileServiceImageryProvider({
      // 调用影响中文服务
      url: TDT_IMG_W, // url地址
      layer: 'img_w', // WMTS请求的层名称
      style: 'default', // WMTS请求的样式名称
      format: 'tiles', // MIME类型，用于从服务器检索图像
      tileMatrixSetID: 'GoogleMapsCompatible', // 用于WMTS请求的TileMatrixSet的标识符
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'], // 天地图8个服务器
      minimumLevel: 0, // 最小层级
      maximumLevel: 18 // 最大层级
    })
    viewer.imageryLayers.addImageryProvider(Img) // 添加到cesium图层上

    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        117.2951754004303,
        31.86581327040441
      ), //
      billboard: {
        image: '/data/SampleData/facility.gif'
      },
      name: 'wxx',
      id: 1314
    })
    viewer.entities.add({
      // 117.307271, 31.869804
      // 117.300771,31.863965
      position: Cesium.Cartesian3.fromDegrees(
        117.2951754004303,
        31.86581327040441
      ), //
      billboard: {
        image: '/data/SampleData/facility.gif'
      },
      name: 'wxx',
      id: 1313
    })

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

    var _position, _pm_position, _cartesian
    var camera = viewer.scene.camera
    handler.setInputAction(function (e) {
      // viewer.infoBox = infoboxContainer;
      var picker = scene.pick(e.position)
      var pick1 = scene.drillPick(e.position) // 或许所有实体
      if (!Cesium.defined(picker)) {
        return
      }
      var cartesian = picker.id.position._value
      // $("#popup").show();
      // var cartesian = scene.globe.pick(camera.getPickRay(e.position), scene);
      var cartographic =
        scene.globe.ellipsoid.cartesianToCartographic(cartesian)
      var _cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        scene,
        cartesian
      )
      var bubble = document.getElementById('popup')
      bubble.style.display = 'block'
      var w = bubble.clientWidth
      var h = bubble.clientHeight
      // 设置弹出框位置
      bubble.style.left = picks.x - w / 2 + 'px'
      bubble.style.top = picks.y - h / 1 + 'px'
      bubble.style.visibility = 'visible' // visibility: "hidden"

      _position = e.position
      _cartesian = cartesian
      _pm_position = {
        x: picks.x,
        y: picks.y
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    var _pm_position_2
    // 每帧渲染结束监听
    viewer.scene.postRender.addEventListener(function (e) {
      if (_pm_position != _pm_position_2) {
        _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          scene,
          _cartesian
        )
        var trackPopUpContent_ = window.document.getElementById('popup')
        var w = trackPopUpContent_.clientWidth
        var h = trackPopUpContent_.clientHeight
        // trackPopUpContent_.style.visibility = "visible";
        trackPopUpContent_.style.left = _pm_position_2.x - w / 2 + 'px'
        trackPopUpContent_.style.top = _pm_position_2.y - h / 1 + 'px'
      }
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'popup')
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
}

#popup {
  width: 100px;
  height: 100px;
  background-color: aqua;
  position: absolute;
  display: none;
  z-index: 1;
}

.cesium-widget-credits {
  display: none !important;
  visibility: hide !important;
}
</style>
