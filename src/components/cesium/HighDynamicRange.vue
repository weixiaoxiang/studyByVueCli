<!--
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-08-20 15:39:01
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-20 15:50:23
-->
<template>
  <div id="cesiumContainer">
    <el-checkbox v-model="checked" @change="change">HDR</el-checkbox>
  </div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      checked: false,
      viewer: null
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
      terrainProvider: Cesium.createWorldTerrain()
    })
    this.viewer.scene.camera.setView({
      destination: new Cesium.Cartesian3(
        -1915097.7863741855,
        -4783356.851539908,
        3748887.43462683
      ),
      orientation: new Cesium.HeadingPitchRoll(
        6.166004548388564,
        -0.043242401760068994,
        0.002179961955988574
      ),
      endTransform: Cesium.Matrix4.IDENTITY
    })
    var url = '/data/SampleData/models/DracoCompressed/CesiumMilkTruck.gltf'
    var position = Cesium.Cartesian3.fromRadians(
      -1.9516424279517286,
      0.6322397098422969,
      1239.0006814631095
    )
    var heading = Cesium.Math.toRadians(-15.0)
    var pitch = 0
    var roll = 0
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    )
    var scale = 10.0

    var entity = this.viewer.entities.add({
      name: url,
      position: position,
      orientation: orientation,
      model: {
        uri: url,
        scale: scale
      }
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'HDR高清渲染')
    },
    change() {
      this.viewer.scene.highDynamicRange = this.checked
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
