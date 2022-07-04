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
    const that = this
    var viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })
    var greenCylinder = viewer.entities.add({
      name: 'Green cylinder with black outline',
      position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 200000.0),
      // 圆柱
      cylinder: {
        length: 400000.0,
        topRadius: 200000.0,
        bottomRadius: 200000.0,
        material: Cesium.Color.GREEN.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.DARK_GREEN
      }
    })

    var redCone = viewer.entities.add({
      name: 'Red cone',
      position: Cesium.Cartesian3.fromDegrees(-105.0, 40.0, 200000.0),
      // 圆柱
      cylinder: {
        length: 400000.0,
        topRadius: 0.0,
        bottomRadius: 200000.0,
        material: Cesium.Color.RED
      }
    })

    viewer.zoomTo(viewer.entities)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'entity加载圆柱')
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
