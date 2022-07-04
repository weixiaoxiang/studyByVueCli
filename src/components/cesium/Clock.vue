<template>
  <div id="cesiumContainer"></div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  mounted() {
    var clock = new Cesium.Clock({
      startTime: Cesium.JulianDate.fromIso8601('2013-12-25'),
      currentTime: Cesium.JulianDate.fromIso8601('2013-12-25'),
      stopTime: Cesium.JulianDate.fromIso8601('2013-12-26'),
      clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
      clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
      multiplier: 4000, // how much time to advance each tick
      shouldAnimate: true // Animation on by default
    })
    var viewer = new Cesium.Viewer('cesiumContainer', {
      clockViewModel: new Cesium.ClockViewModel(clock),
      terrainProvider: Cesium.createWorldTerrain()
    })
    // 开启黑白夜
    viewer.scene.globe.enableLighting = true
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '时钟设置')
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
