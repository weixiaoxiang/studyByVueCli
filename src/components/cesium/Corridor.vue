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
    var redCorridor = viewer.entities.add({
      name: 'Red corridor on surface with rounded corners',
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -100.0, 40.0, -105.0, 40.0, -105.0, 35.0
        ]),
        width: 200000.0,
        material: Cesium.Color.RED.withAlpha(0.5)
      }
    })

    var greenCorridor = viewer.entities.add({
      name: 'Green corridor at height with mitered corners and outline',
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -90.0, 40.0, -95.0, 40.0, -95.0, 35.0
        ]),
        height: 100000.0,
        width: 200000.0,
        cornerType: Cesium.CornerType.MITERED,
        material: Cesium.Color.GREEN,
        outline: true // height required for outlines to display
      }
    })

    var blueCorridor = viewer.entities.add({
      name: 'Blue extruded corridor with beveled corners and outline',
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -80.0, 40.0, -85.0, 40.0, -85.0, 35.0
        ]),
        height: 200000.0,
        extrudedHeight: 100000.0,
        width: 200000.0,
        cornerType: Cesium.CornerType.BEVELED,
        material: Cesium.Color.BLUE.withAlpha(0.5),
        outline: true, // height or extrudedHeight must be set for outlines to display
        outlineColor: Cesium.Color.WHITE
      }
    })

    viewer.zoomTo(viewer.entities)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'entity加载走廊')
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
