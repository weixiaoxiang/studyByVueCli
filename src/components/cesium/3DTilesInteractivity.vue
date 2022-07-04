<template>
  <div id="cesiumContainer"></div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      action: 'zoom'
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  watch: {},
  mounted() {
    const that = this
    // Cesium.Ion.defaultAccessToken =
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

    var viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    var scene = viewer.scene
    if (!scene.pickPositionSupported) {
      window.alert('This browser does not support pickPosition.')
    }

    scene.globe.depthTestAgainstTerrain = true

    var annotations = scene.primitives.add(new Cesium.LabelCollection())

    // Set the initial camera view to look at Manhattan
    var initialPosition = Cesium.Cartesian3.fromDegrees(
      -74.01881302800248,
      40.69114333714821,
      753
    )
    // 方位角默认是以弧度制为单位的，需要通过fromdegrees来将度数转换成弧度
    var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
      21.27879878293835,
      -21.34390550872461,
      0.0716951918898415
    )
    scene.camera.setView({
      destination: initialPosition,
      orientation: initialOrientation,
      endTransform: Cesium.Matrix4.IDENTITY
    })

    // Load the NYC buildings tileset.
    var tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(75343)
    })
    scene.primitives.add(tileset)
    tileset.style = new Cesium.Cesium3DTileStyle({
      meta: {
        description: "'Building ${BIN} has height ${Height}.'"
      }
    })

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

    handler.setInputAction(function (movement) {
      var feature = scene.pick(movement.position)
      if (!Cesium.defined(feature)) {
        return
      }

      var action = that.action
      if (action === 'annotate') {
        annotate(movement, feature)
      } else if (action === 'properties') {
        printProperties(movement, feature)
      } else if (action === 'zoom') {
        zoom(movement, feature)
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    handler.setInputAction(function (movement) {
      var feature = scene.pick(movement.position)
      if (!Cesium.defined(feature)) {
        return
      }

      var action = viewModel.middleClickAction
      if (action === 'hide') {
        feature.show = false
      }
    }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK)

    function annotate(movement, feature) {
      if (scene.pickPositionSupported) {
        var cartesian = scene.pickPosition(movement.position)
        if (Cesium.defined(cartesian)) {
          var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
          var height = cartographic.height.toFixed(2) + ' m'

          annotations.add({
            position: cartesian,
            text: height,
            showBackground: true,
            font: '14px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          })
        }
      }
    }

    function printProperties(movement, feature) {
      console.log('Properties:')
      var propertyNames = feature.getPropertyNames()
      var length = propertyNames.length
      for (var i = 0; i < length; ++i) {
        var propertyName = propertyNames[i]
        console.log(
          '  ' + propertyName + ': ' + feature.getProperty(propertyName)
        )
      }
      // Evaluate feature description
      console.log(
        'Description : ' + tileset.style.meta.description.evaluate(feature)
      )
    }

    function zoom(movement, feature) {
      var longitude = Cesium.Math.toRadians(feature.getProperty('Longitude'))
      var latitude = Cesium.Math.toRadians(feature.getProperty('Latitude'))
      var height = feature.getProperty('Height')
      // 获得弧度坐标0
      var positionCartographic = new Cesium.Cartographic(
        longitude,
        latitude,
        height * 0.5
      )
      // 将弧度转为世界坐标
      var position =
        scene.globe.ellipsoid.cartographicToCartesian(positionCartographic)
      var camera = scene.camera
      var heading = camera.heading
      var pitch = camera.pitch
      var offset = offsetFromHeadingPitchRange(heading, pitch, height * 2.0)
      // 必选将坐标系转为本地坐标系
      var transform = Cesium.Transforms.eastNorthUpToFixedFrame(position)
      // 在position基础上进行平移操作，并赋值到position上
      Cesium.Matrix4.multiplyByPoint(transform, offset, position)
      camera.flyTo({
        destination: position,
        orientation: {
          heading: heading,
          pitch: pitch
        },
        easingFunction: Cesium.EasingFunction.QUADRATIC_OUT
      })
    }

    // 表示看不懂
    function offsetFromHeadingPitchRange(heading, pitch, range) {
      pitch = Cesium.Math.clamp(
        pitch,
        -Cesium.Math.PI_OVER_TWO,
        Cesium.Math.PI_OVER_TWO
      )
      heading = Cesium.Math.zeroToTwoPi(heading) - Cesium.Math.PI_OVER_TWO
      var pitchQuat = Cesium.Quaternion.fromAxisAngle(
        Cesium.Cartesian3.UNIT_Y,
        -pitch
      )
      var headingQuat = Cesium.Quaternion.fromAxisAngle(
        Cesium.Cartesian3.UNIT_Z,
        -heading
      )
      var rotQuat = Cesium.Quaternion.multiply(
        headingQuat,
        pitchQuat,
        headingQuat
      )
      var rotMatrix = Cesium.Matrix3.fromQuaternion(rotQuat)
      var offset = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_X)
      Cesium.Matrix3.multiplyByVector(rotMatrix, offset, offset)
      Cesium.Cartesian3.negate(offset, offset)
      Cesium.Cartesian3.multiplyByScalar(offset, range, offset)
      return offset
    }
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '鼠标右击，视图平移至点击处，利用ENU坐标系进行本地位置的相对平移'
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
