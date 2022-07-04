<template>
  <div id="cesiumContainer">
    <el-switch
      v-model="value"
      active-color="#13ce66"
      inactive-color="#ff4949"
      @change="change"
    >
    </el-switch>
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
      value: true
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
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      // terrainProvider: Cesium.createWorldTerrain(),
    })
    this.addBillboardAndRectangle()
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '根据相机距离显示隐藏数据')
    },
    change(value) {
      this.viewer.camera.flyHome(0)
      this.viewer.entities.removeAll()
      // this.viewer.dataSources.removeAll()
      value ? this.addBillboardAndRectangle() : this.addPointAndModel()
    },
    addBillboardAndRectangle() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-77, 40.5),
        billboard: {
          image: '/data/Sandcastle/images/facility.gif',
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(5.5e6)
        },
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(-80.5, 39.7, -75.1, 42.0),
          height: 0.0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.RED,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0.0,
            5.5e6
          )
        }
      })
    },
    addPointAndModel() {
      var position = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 0.0)
      var heading = Cesium.Math.toRadians(135)
      var hpr = new Cesium.HeadingPitchRoll(heading, 0.0, -1.0)
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      )

      this.viewer.entities.add({
        position: position,
        orientation: orientation,
        point: {
          pixelSize: 10,
          color: Cesium.Color.YELLOW,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(250.5)
        },
        model: {
          uri: '/data/SampleData/models/GroundVehicle/GroundVehicle.glb',
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0.0,
            250.5
          )
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  .el-switch {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
  }
}
</style>
