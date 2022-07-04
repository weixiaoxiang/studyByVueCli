<template>
  <div id="cesiumContainer">
    <el-select
      ref="fieldSelect"
      v-model="value"
      :popper-append-to-body="false"
      placeholder="请选择"
      @change="changeSelected"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-row>
      <el-col :span="8">
        <el-button
          size="small"
          type="primary"
          @click="scene.camera.completeFlight()"
        >Complete Flight
        </el-button>
      </el-col>
      <el-col :span="8">
        <el-button
          size="small"
          type="primary"
          @click="scene.camera.cancelFlight()"
        >Cancel Flight</el-button>
      </el-col>
    </el-row>
    <div id="toolbar">
      <div id="viewChanged">View Changed</div>
      <div id="cameraChanged">Camera Changed</div>
    </div>
  </div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      viewer: null,
      referenceFramePrimitive: null,
      clock: null,
      scene: null,
      removeStart: null,
      removeEnd: null,
      removeChanged: null,
      value: 'Fly in a city',
      options: [
        {
          value: 'Fly in a city',
          label: 'Fly in a city',
          method: () => {
            this.flyInACity()
          }
        },
        {
          value: 'Fly to San Diego',
          label: 'Fly to San Diego',
          method: () => {
            this.flyToSanDiego()
          }
        },
        {
          value: 'Fly to Location with heading, pitch and roll',
          label: 'Fly to Location with heading, pitch and roll',
          method: () => {
            this.flyToHeadingPitchRoll()
          }
        },
        {
          value: 'Fly to My Location',
          label: 'Fly to My Location',
          method: () => {
            this.flyToLocation()
          }
        },
        {
          value: 'Fly to Rectangle',
          label: 'Fly to Rectangle',
          method: () => {
            this.viewRectangle()
          }
        },
        {
          value: 'View a Rectangle',
          label: 'View a Rectangle',
          method: () => {
            this.flyToRectangle()
          }
        },
        {
          value: 'Set camera reference frame',
          label: 'Set camera reference frame',
          method: () => {
            this.setReferenceFrame()
          }
        },
        {
          value: 'Set camera with heading, pitch, and roll',
          label: 'Set camera with heading, pitch, and roll',
          method: () => {
            this.setHeadingPitchRoll()
          }
        },
        {
          value: 'View in ICRF',
          label: 'View in ICRF',
          method: () => {
            this.viewInICRF()
          }
        },
        {
          value: 'Move events',
          label: 'Move events',
          method: () => {
            this.cameraEvents()
          }
        },
        {
          value: 'Camera changed event',
          label: 'Camera changed event',
          method: () => {
            this.cameraChanges()
          }
        },
        {
          value: 'Fly from Los Angeles to Tokyo via Europe',
          label: 'Fly from Los Angeles to Tokyo via Europe',
          method: () => {
            this.flyOverLongitude()
          }
        },
        {
          value: 'Look down during exaggerated flight',
          label: 'Look down during exaggerated flight',
          method: () => {
            this.flyOverLongitudeWithPitch()
          }
        }
      ]
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
    this.viewer = new Cesium.Viewer('cesiumContainer')
    this.scene = this.viewer.scene
    this.clock = this.viewer.clock
    this.referenceFramePrimitive
    // this.flyToSanDiego()
    this.scene.morphComplete.addEventListener(() => {
      this.reset()
      alert(1)
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '相机使用')
    },
    changeSelected() {
      console.log(this.value)
      const res = this.options.find((item) => {
        return item.value === this.value
      })
      res.method()
    },
    flyToSanDiego() {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0)
      })
    },
    flyToHeadingPitchRoll() {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-122.22, 46.12, 5000.0),
        orientation: {
          heading: Cesium.Math.toRadians(20.0),
          pitch: Cesium.Math.toRadians(-35.0),
          roll: 0.0
        }
      })
    },
    flyToLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            position.coords.longitude,
            position.coords.latitude,
            1000.0
          )
        })
      })
    },
    viewRectangle() {
      var west = -77.0
      var south = 38.0
      var east = -72.0
      var north = 42.0

      var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north)
      this.viewer.camera.setView({
        destination: rectangle
      })

      this.viewer.entities.add({
        rectangle: {
          coordinates: rectangle,
          fill: false,
          outline: true,
          outlineColor: Cesium.Color.WHITE
        }
      })
    },
    flyToRectangle() {
      var west = -90.0
      var south = 38.0
      var east = -87.0
      var north = 40.0
      var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north)

      this.viewer.camera.flyTo({
        destination: rectangle
      })

      // Show the rectangle. Not required; just for show.
      this.viewer.entities.add({
        rectangle: {
          coordinates: rectangle,
          fill: false,
          outline: true,
          outlineColor: Cesium.Color.WHITE
        }
      })
    },
    setReferenceFrame() {
      var center = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883)
      var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center)

      // View in east-north-up frame
      var camera = this.viewer.camera
      camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z
      camera.lookAtTransform(
        transform,
        new Cesium.Cartesian3(-120000.0, -120000.0, 120000.0)
      )

      // Show reference frame. Not required.
      referenceFramePrimitive = this.scene.primitives.add(
        new Cesium.DebugModelMatrixPrimitive({
          modelMatrix: transform,
          length: 100000.0
        })
      )
    },
    setHeadingPitchRoll() {
      var camera = this.viewer.camera
      camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-75.5847, 40.0397, 1000.0),
        orientation: {
          heading: -Cesium.Math.PI_OVER_TWO,
          pitch: -Cesium.Math.PI_OVER_FOUR,
          roll: 0.0
        }
      })
    },
    icrf(scene, time) {
      if (scene.mode !== Cesium.SceneMode.SCENE3D) {
        return
      }

      var icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time)
      if (Cesium.defined(icrfToFixed)) {
        var camera = this.viewer.camera
        var offset = Cesium.Cartesian3.clone(camera.position)
        var transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed)
        camera.lookAtTransform(transform, offset)
      }
    },
    viewInICRF() {
      this.viewer.camera.flyHome(0)
      this.clock.multiplier = 3 * 60 * 60
      this.scene.postUpdate.addEventListener(icrf)
      this.scene.globe.enableLighting = true
    },
    cameraEvents() {
      var camera = this.viewer.camera
      this.removeStart = camera.moveStart.addEventListener(() => {
        this.viewChanged.style.display = 'block'
      })
      this.removeEnd = camera.moveEnd.addEventListener(() => {
        this.viewChanged.style.display = 'none'
      })
    },
    cameraChanges() {
      var i = 0
      this.removeChanged = this.viewer.camera.changed.addEventListener(
        (percentage) => {
          ++i
          this.cameraChanged.innerText =
            'Camera Changed: ' + i + ', ' + percentage.toFixed(6)
          this.cameraChanged.style.display = 'block'
        }
      )
    },
    flyInACity() {
      var camera = this.scene.camera
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          -73.98580932617188,
          40.74843406689482,
          363.34038727246224
        ),
        complete: function () {
          setTimeout(function () {
            camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                -73.98585975679403,
                40.75759944127251,
                186.50838555841779
              ),
              orientation: {
                heading: Cesium.Math.toRadians(200.0),
                pitch: Cesium.Math.toRadians(-50.0)
              },
              easingFunction: Cesium.EasingFunction.LINEAR_NONE
            })
          }, 1000)
        }
      })
    },
    losAngelesToTokyo(adjustPitch) {
      var camera = this.scene.camera

      var tokyoOptions = {
        destination: Cesium.Cartesian3.fromDegrees(139.8148, 35.7142, 20000.0),
        orientation: {
          heading: Cesium.Math.toRadians(15.0),
          pitch: Cesium.Math.toRadians(-60),
          roll: 0.0
        },
        duration: 20,
        flyOverLongitude: Cesium.Math.toRadians(60.0)
      }

      var laOptions = {
        destination: Cesium.Cartesian3.fromDegrees(-117.729, 34.457, 10000.0),
        duration: 5,
        orientation: {
          heading: Cesium.Math.toRadians(-15.0),
          pitch: -Cesium.Math.PI_OVER_FOUR,
          roll: 0.0
        }
      }

      laOptions.complete = () => {
        setTimeout(() => {
          this.camera.flyTo(tokyoOptions)
        }, 1000)
      }

      if (adjustPitch) {
        tokyoOptions.pitchAdjustHeight = 1000
        laOptions.pitchAdjustHeight = 1000
      }

      this.camera.flyTo(laOptions)
    },
    flyOverLongitude(adjustPitch) {
      this.losAngelesToTokyo()
    },
    flyOverLongitudeWithPitch() {
      this.losAngelesToTokyo(true)
    },
    reset() {
      this.scene.completeMorph()
      this.viewer.entities.removeAll()
      this.scene.primitives.remove(this.referenceFramePrimitive)
      this.scene.tweens.removeAll()

      if (Cesium.defined(this.removeStart)) {
        this.removeStart()
        this.removeEnd()

        this.viewChanged.style.display = 'none'

        this.removeStart = undefined
        this.removeEnd = undefined
      }

      if (Cesium.defined(removeChanged)) {
        this.removeChanged()
        this.removeChanged = undefined

        this.cameraChanged.style.display = 'none'
      }

      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)

      this.clock.multiplier = 1.0
      this.scene.postUpdate.removeEventListener(icrf)
      this.scene.globe.enableLighting = false
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  .el-select {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
    height: 100%;
    max-height: 250px;
  }

  .el-row {
    position: absolute;
    top: 25px;
    left: 280px;
    width: 500px;
    z-index: 1;
  }
}

// 解决下拉框滚动条问题
.el-select/deep/.el-select-dropdown {
  height: 100%;

  .el-scrollbar {
    height: 100%;

    .el-select-dropdown__list:hover .el-scrollbar__bar.is-vertical {
      opacity: 1;
      background-color: #dddee0;
    }
  }
}

#toolbar {
  position: absolute;
  top: 80px;
  left: 20px;
  z-index: 1;
  background-color: red;
}
</style>
