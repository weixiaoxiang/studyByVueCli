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
      infoBox: false,
      selectionIndicator: false,
      shadows: true,
      shouldAnimate: true
    })
    var scene = viewer.scene
    scene.globe.depthTestAgainstTerrain = true

    if (!scene.sampleHeightSupported) {
      window.alert('This browser does not support sampleHeight.')
    }

    var longitude = -2.1480545852753163
    var latitude = 0.7688240036937101
    var range = 0.000002
    var duration = 4.0

    var entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromRadians(longitude, latitude),
      model: {
        uri: '/data/SampleData/models/GroundVehicle/GroundVehicle.glb'
      }
    })

    var point = viewer.entities.add({
      position: new Cesium.CallbackProperty(updatePosition, false),
      point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      label: {
        show: false,
        showBackground: true,
        font: '14px monospace',
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(5, 5),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })

    var objectsToExclude = [point]
    var cartographic = new Cesium.Cartographic()

    function updatePosition(time, result) {
      // 控制offset四秒内数值从0依次累加到1
      var offset = (time.secondsOfDay % duration) / duration
      cartographic.longitude = longitude - range + offset * range * 2.0
      cartographic.latitude = latitude

      var height
      if (scene.sampleHeightSupported) {
        // sampleHeight 返回给定地理坐标位置的场景几何高度
        height = scene.sampleHeight(cartographic, objectsToExclude)
      }

      if (Cesium.defined(height)) {
        cartographic.height = height
        point.label.text = Math.abs(height).toFixed(2).toString() + ' m'
        point.label.show = true
      } else {
        cartographic.height = 0.0
        point.label.show = false
      }

      return Cesium.Cartographic.toCartesian(
        cartographic,
        Cesium.Ellipsoid.WGS84,
        result
      )
    }
    // viewer.trackedEntity = entity;
    viewer.zoomTo(entity)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '紧紧抓住model(控制offset四秒内数值从0依次累加到1)'
      )
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
