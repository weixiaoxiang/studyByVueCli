<template>
  <div id="cesiumContainer">
    <div id="popup">
      <div class="title">
        <span>{{ type }}</span>
        <span class="close" @click="closed">X</span>
      </div>
      <div class="content">
        <div v-for="(item, i) in data" :key="i" class="content-item">
          <span>{{ item.name }}：</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 排放管
import psg from '../../../public/data/output/psg.json'
// 检查井
import jcj from '../../../public/data/output/jcj.json'
// 排放口
import pfk from '../../../public/data/output/pfk.json'
// 道路
import road from '../../../public/data/output/road.json'
// 雨水口
import ysk from '../../../public/data/output/ysk.json'
import _$ from 'jquery' // 在需要使用的页面中
import PolylineTrailMaterialProperty from '@utils/polylineTrailMaterialProperty.js'
export default {
  data() {
    return {
      entityCollection: null,
      rotation: 0,
      selectedFeature: null,
      data: [],
      type: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {
    const that = this
    window.viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain(),
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: true,
      sceneModePicker: false, // 二三维转换
      selectionIndicator: false,
      timeline: false, // 时间线
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false
    })
    window.viewer.scene.globe.depthTestAgainstTerrain = true
    const { features } = psg
    features.map((item) => {
      const coors = item.geometry.coordinates
      const heights = [item.properties.IN_ELEV, item.properties.OUT_ELEV]
      const degreesHeight = [...coors[0], heights[0], ...coors[1], heights[1]]
      this.creatEntity(degreesHeight, item.properties)
    })

    var handler = new Cesium.ScreenSpaceEventHandler(
      window.viewer.scene.canvas
    )

    var _position, _pm_position, _cartesian
    var camera = window.viewer.scene.camera
    handler.setInputAction((e) => {
      // viewer.infoBox = infoboxContainer;
      var picker = window.viewer.scene.pick(e.position)
      // var pick1 = window.viewer.scene.drillPick(e.position); //或许所有实体

      // var ray = window.viewer.camera.getPickRay(e.position);
      // var cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);

      var cartesian = window.viewer.scene.pickPosition(e.position)
      if (!Cesium.defined(picker) || !Cesium.defined(cartesian)) {
        return
      }
      if (Cesium.defined(this.selectedFeature)) {
        this.selectedFeature.polylineVolume.material =
          new Cesium.PolylineTrailMaterialProperty({
            // color: Cesium.Color.GREEN,
            // color: new Cesium.Color(58 / 255, 5 / 255, 179 / 255, 1),
            duration: 3000,
            trailImage: '/data/colors.png'
          })
      }
      var cartographic =
        window.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
      var _cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        window.viewer.scene,
        cartesian
      )
      var bubble = document.getElementById('popup')
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
      _$('#popup').show()
      this.selectedFeature = picker.id;
      (this.selectedFeature.polylineVolume.material =
        new Cesium.PolylineTrailMaterialProperty({
          // color: Cesium.Color.GREEN,
          color: new Cesium.Color(58 / 255, 5 / 255, 179 / 255, 1),
          duration: 3000,
          trailImage: '/data/colors.png'
        })),
      console.log(this.selectedFeature)
      const name = picker.id.name
      const id = picker.id.id
      this.creatDetailPanel(name, id)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    var _pm_position_2
    // 每帧渲染结束监听
    window.viewer.scene.postRender.addEventListener(function (e) {
      if (_pm_position != _pm_position_2) {
        _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          window.viewer.scene,
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
  created() {},
  methods: {
    computeCircle(radius) {
      var positions = []
      for (var i = 0; i < 360; i++) {
        var radians = Cesium.Math.toRadians(i)
        positions.push(
          new Cesium.Cartesian2(
            radius * Math.cos(radians),
            radius * Math.sin(radians)
          )
        )
      }
      return positions
    },
    computeStar(arms, rOuter, rInner) {
      var angle = Math.PI / arms
      var length = 2 * arms
      var positions = new Array(length)
      for (var i = 0; i < length; i++) {
        var r = i % 2 === 0 ? rOuter : rInner
        positions[i] = new Cesium.Cartesian2(
          Math.cos(i * angle) * r,
          Math.sin(i * angle) * r
        )
      }
      return positions
    },
    creatEntity(degreesHeight, properties) {
      const entity = new Cesium.Entity({
        id: properties.OBJECTID,
        name: '排水管',
        polylineVolume: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(degreesHeight),
          shape: this.computeCircle(0.8),
          // material: new Cesium.ColorMaterialProperty(Cesium.Color.RED) //,
          // material: new Cesium.ImageMaterialProperty({
          //   image: '/data/fenceline.png',
          //   // image: '/data/arrow128.png',
          //   repeat: new Cesium.Cartesian2(3.0, 1),
          //   color: new Cesium.Color(58 / 255, 255 / 255, 180 / 255, 1),
          //   transparent: true,
          // }),
          material: new Cesium.PolylineTrailMaterialProperty({
            // color: Cesium.Color.GREEN,
            // color: new Cesium.Color(58 / 255, 5 / 255, 179 / 255, 1),
            duration: 3000,
            trailImage: '/data/colors.png'
          })
        }
      })
      window.viewer.entities.add(entity)
      window.viewer.zoomTo(entity)
      // this.entityCollection.add(entity)
    },
    creatDetailPanel(name, id) {
      let feature
      this.data = []
      switch (name) {
        case '排水管':
          feature = psg.features.find((item) => {
            return item.properties.OBJECTID === id
          })
          for (const key in feature.properties) {
            var obj = {}
            if (
              [
                'LINKCODE',
                'SYSTEMID',
                'SHAPE_Leng',
                'IN_ELEV',
                'OUT_ELEV'
              ].includes(key)
            ) {
              obj['name'] = key
              obj['value'] = feature.properties[key]
              this.data.push(obj)
            }
          }
          this.type = '排水管'
          break
        case '':
          break
        default:
          break
      }
    },
    closed() {
      _$('#popup').hide()
    }
  }
}
</script>
<style>
.cesium-widget-credits {
  display: none !important;
  visibility: hide !important;
}
</style>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  #popup {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 10px 15px;
    max-width: 400px;
    max-height: 400px;
    border-radius: 5%;
    background-color: rgba(41, 42, 43, 0.5);
    z-index: 1;

    .title {
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      color: #fff;
      padding: 0 5px;
      border-bottom: 1px solid #616161;
    }

    .close {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 20px;
      height: 20px;
      font-size: 12px;
      color: #fff;
      line-height: 20px;
      text-align: center;
    }

    .content-item {
      margin-top: 5px;
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
