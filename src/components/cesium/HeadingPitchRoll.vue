<!--
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-08-20 14:35:06
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-20 14:56:58
-->
<template>
  <div id="cesiumContainer">
    <el-checkbox v-model="checked" @change="change">跟随飞机</el-checkbox>
  </div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      checked: false
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
    var viewer = new Cesium.Viewer('cesiumContainer', {
      shouldAnimate: true
    })

    var canvas = viewer.canvas
    canvas.setAttribute('tabindex', '0') // needed to put focus on the canvas
    canvas.addEventListener('click', function () {
      canvas.focus()
    })
    canvas.focus()

    var scene = viewer.scene

    var pathPosition = new Cesium.SampledPositionProperty()
    var entityPath = viewer.entities.add({
      position: pathPosition,
      name: 'path',
      path: {
        show: true,
        leadTime: 0,
        trailTime: 60,
        width: 10,
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.3,
          taperPower: 0.3,
          color: Cesium.Color.PALEGOLDENROD
        })
      }
    })

    var camera = viewer.camera
    var controller = scene.screenSpaceCameraController
    var r = 0
    var center = new Cesium.Cartesian3()

    var hpRoll = new Cesium.HeadingPitchRoll()
    var hpRange = new Cesium.HeadingPitchRange()
    var speed = 10
    var deltaRadians = Cesium.Math.toRadians(3.0)

    var position = Cesium.Cartesian3.fromDegrees(
      -123.0744619,
      44.0503706,
      5000.0
    )
    var speedVector = new Cesium.Cartesian3()
    var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
      'north',
      'west'
    )

    var planePrimitive = scene.primitives.add(
      Cesium.Model.fromGltf({
        url: '/data/SampleData/models/CesiumAir/Cesium_Air.glb',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          position,
          hpRoll,
          Cesium.Ellipsoid.WGS84,
          fixedFrameTransform
        ),
        minimumPixelSize: 128
      })
    )

    planePrimitive.readyPromise.then(function (model) {
      model.activeAnimations.addAll({
        multiplier: 0.5,
        loop: Cesium.ModelAnimationLoop.REPEAT
      })

      // Zoom to model
      r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near)
      controller.minimumZoomDistance = r * 0.5
      Cesium.Matrix4.multiplyByPoint(
        model.modelMatrix,
        model.boundingSphere.center,
        center
      )
      var heading = Cesium.Math.toRadians(230.0)
      var pitch = Cesium.Math.toRadians(-20.0)
      hpRange.heading = heading
      hpRange.pitch = pitch
      hpRange.range = r * 50.0
      camera.lookAt(center, hpRange)
    })

    document.addEventListener('keydown', function (e) {
      switch (e.keyCode) {
        case 40:
          if (e.shiftKey) {
            // speed down
            speed = Math.max(--speed, 1)
          } else {
            // pitch down
            hpRoll.pitch -= deltaRadians
            if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
              hpRoll.pitch += Cesium.Math.TWO_PI
            }
          }
          break
        case 38:
          if (e.shiftKey) {
            // speed up
            speed = Math.min(++speed, 100)
          } else {
            // pitch up
            hpRoll.pitch += deltaRadians
            if (hpRoll.pitch > Cesium.Math.TWO_PI) {
              hpRoll.pitch -= Cesium.Math.TWO_PI
            }
          }
          break
        case 39:
          if (e.shiftKey) {
            // roll right
            hpRoll.roll += deltaRadians
            if (hpRoll.roll > Cesium.Math.TWO_PI) {
              hpRoll.roll -= Cesium.Math.TWO_PI
            }
          } else {
            // turn right
            hpRoll.heading += deltaRadians
            if (hpRoll.heading > Cesium.Math.TWO_PI) {
              hpRoll.heading -= Cesium.Math.TWO_PI
            }
          }
          break
        case 37:
          if (e.shiftKey) {
            // roll left until
            hpRoll.roll -= deltaRadians
            if (hpRoll.roll < 0.0) {
              hpRoll.roll += Cesium.Math.TWO_PI
            }
          } else {
            // turn left
            hpRoll.heading -= deltaRadians
            if (hpRoll.heading < 0.0) {
              hpRoll.heading += Cesium.Math.TWO_PI
            }
          }
          break
        default:
      }
    })
    // var headingSpan = document.getElementById("heading");
    // var pitchSpan = document.getElementById("pitch");
    // var rollSpan = document.getElementById("roll");
    // var speedSpan = document.getElementById("speed");
    viewer.scene.preUpdate.addEventListener((scene, time) => {
      speedVector = Cesium.Cartesian3.multiplyByScalar(
        Cesium.Cartesian3.UNIT_X,
        speed / 10,
        speedVector
      )
      position = Cesium.Matrix4.multiplyByPoint(
        planePrimitive.modelMatrix,
        speedVector,
        position
      )
      pathPosition.addSample(Cesium.JulianDate.now(), position)
      Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        fixedFrameTransform,
        planePrimitive.modelMatrix
      )
      if (this.checked) {
        // Zoom to model
        Cesium.Matrix4.multiplyByPoint(
          planePrimitive.modelMatrix,
          planePrimitive.boundingSphere.center,
          center
        )
        hpRange.heading = hpRoll.heading
        hpRange.pitch = hpRoll.pitch
        camera.lookAt(center, hpRange)
      }
    })
    viewer.scene.preRender.addEventListener(function (scene, time) {
      // headingSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.heading).toFixed(1);
      // pitchSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.pitch).toFixed(1);
      // rollSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.roll).toFixed(1);
      // speedSpan.innerHTML = speed.toFixed(1);
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        'headingpitchroll控制模型的运动姿态'
      )
    },
    change() {
      console.log(this.checked)
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  .el-checkbox {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
  }
}
</style>
