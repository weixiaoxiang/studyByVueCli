<template>
  <div id="cesiumContainer">
    <el-select
      v-model="value"
      :popper-append-to-body="false"
      placeholder="请选择"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
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
      options: [
        {
          value: '1',
          label: 'Add billboard'
        },
        {
          value: '2',
          label: 'Set billboard properties at creation'
        },
        {
          value: '3',
          label: 'Change billboard properties'
        },
        {
          value: '4',
          label: 'Size billboard in meters'
        },
        {
          value: '5',
          label: 'Add multiple billboards'
        },
        {
          value: '6',
          label: 'Scale by viewer distance'
        },
        {
          value: '7',
          label: 'Fade by viewer distance'
        },
        {
          value: '8',
          label: 'Offset by viewer distance'
        },
        {
          value: '9',
          label: 'Add marker billboards'
        },
        {
          value: '10',
          label: 'Disable the depth test when clamped to ground'
        }
      ],
      value: '1',
      terrainProvider: null
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  watch: {
    value(newval, oldval) {
      this.viewer.camera.flyHome(0)
      this.viewer.entities.removeAll()
      if (Cesium.defined(this.terrainProvider)) {
        this.viewer.terrainProvider = this.terrainProvider
        this.terrainProvider = undefined
        this.viewer.scene.globe.depthTestAgainstTerrain = false
      }
      // 切换
      this.changeSelected()
    }
  },
  mounted() {
    const that = this
    this.viewer = new Cesium.Viewer('cesiumContainer')
    this.addBillboard()
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '加载billboards并修改大小，透明度、偏移等等'
      )
    },
    addBillboard() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: '/data/Sandcastle/images/Cesium_Logo_overlay.png'
        }
      })
    },
    setBillboardProperties() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: '/data/Sandcastle/images/Cesium_Logo_overlay.png', // default: undefined
          show: true, // default
          pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
          eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
          scale: 2.0, // default: 1.0
          color: Cesium.Color.LIME, // default: WHITE
          rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
          alignedAxis: Cesium.Cartesian3.ZERO, // default
          width: 100, // default: undefined
          height: 25 // default: undefined
        }
      })
    },
    changeBillboardProperties() {
      var entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 300000.0),
        billboard: {
          image: '/data/Sandcastle/images/Cesium_Logo_overlay.png'
        }
      })

      var billboard = entity.billboard
      billboard.scale = 3.0
      billboard.color = Cesium.Color.WHITE.withAlpha(0.25)
    },
    sizeBillboardInMeters() {
      var entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: '/data/Sandcastle/images/Cesium_Logo_overlay.png',
          sizeInMeters: true
        }
      })
      this.viewer.zoomTo(entity)
    },
    addMultipleBillboards() {
      var logoUrl = '/data/Sandcastle/images/Cesium_Logo_overlay.png'
      var facilityUrl = '/data/Sandcastle/images/facility.gif'

      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: logoUrl
        }
      })
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-80.5, 35.14),
        billboard: {
          image: facilityUrl
        }
      })
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-80.12, 25.46),
        billboard: {
          image: facilityUrl
        }
      })
    },
    scaleByDistance() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: '/data/Sandcastle/images/facility.gif',
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
        }
      })
    },
    fadeByDistance() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: '/data/Sandcastle/images/Cesium_Logo_overlay.png',
          translucencyByDistance: new Cesium.NearFarScalar(
            1.5e2,
            2.0,
            1.5e7,
            0.5
          )
        }
      })
    },
    offsetByDistance() {
      const that = this
      Cesium.when.all(
        [
          Cesium.Resource.fetchImage(
            '/data/Sandcastle/images/Cesium_Logo_overlay.png'
          ),
          Cesium.Resource.fetchImage('/data/Sandcastle/images/facility.gif')
        ],
        function (images) {
          // As viewer zooms closer to facility billboard,
          // increase pixelOffset on CesiumLogo billboard to this height
          var facilityHeight = images[1].height

          // colocated billboards, separate as viewer gets closer
          that.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            billboard: {
              image: images[1],
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
          })
          that.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            billboard: {
              image: images[0],
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0.0, -facilityHeight),
              pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                1.0e3,
                1.0,
                1.5e6,
                0.0
              ),
              translucencyByDistance: new Cesium.NearFarScalar(
                1.0e3,
                1.0,
                1.5e6,
                0.1
              )
            }
          })
        }
      )
    },
    addMarkerBillboards() {
      // Add several billboards based on the above image in the atlas.
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: '/data/Sandcastle/images/whiteShapes.png',
          imageSubRegion: new Cesium.BoundingRectangle(49, 43, 18, 18),
          color: Cesium.Color.LIME
        }
      })
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-84.0, 39.0),
        billboard: {
          image: '/data/Sandcastle/images/whiteShapes.png',
          imageSubRegion: new Cesium.BoundingRectangle(61, 23, 18, 18),
          color: new Cesium.Color(0, 0.5, 1.0, 1.0)
        }
      })
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-70.0, 41.0),
        billboard: {
          image: '/data/Sandcastle/images/whiteShapes.png',
          imageSubRegion: new Cesium.BoundingRectangle(67, 80, 14, 14),
          color: new Cesium.Color(0.5, 0.9, 1.0, 1.0)
        }
      })
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-73.0, 37.0),
        billboard: {
          image: '/data/Sandcastle/images/whiteShapes.png',
          imageSubRegion: new Cesium.BoundingRectangle(27, 103, 22, 22),
          color: Cesium.Color.RED
        }
      })
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-79.0, 35.0),
        billboard: {
          image: '/data/Sandcastle/images/whiteShapes.png',
          imageSubRegion: new Cesium.BoundingRectangle(105, 105, 18, 18),
          color: Cesium.Color.YELLOW
        }
      })
    },
    disableDepthTest() {
      const terrainProvider = this.viewer.terrainProvider
      this.viewer.terrainProvider = Cesium.createWorldTerrain()
      this.viewer.scene.globe.depthTestAgainstTerrain = true

      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-122.1958, 46.1915),
        billboard: {
          image: '/data/Sandcastle/images/facility.gif',
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })
      this.viewer.scene.camera.setView({
        destination: new Cesium.Cartesian3(
          -2357576.243142461,
          -3744417.5604860787,
          4581807.855903771
        ),
        orientation: new Cesium.HeadingPitchRoll(
          5.9920811504170475,
          -0.6032820429886212,
          6.28201303164098
        )
      })
    },
    changeSelected() {
      switch (this.value * 1) {
        case 1:
          this.addBillboard()
          break
        case 2:
          this.setBillboardProperties()
          break
        case 3:
          this.changeBillboardProperties()
          break
        case 4:
          this.sizeBillboardInMeters()
          break
        case 5:
          this.addMultipleBillboards()
          break
        case 6:
          this.scaleByDistance()
          break
        case 7:
          this.fadeByDistance()
          break
        case 8:
          this.offsetByDistance()
          break
        case 9:
          this.addMarkerBillboards()
          break
        case 10:
          this.disableDepthTest()
          break
        default:
          break
      }
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
</style>
