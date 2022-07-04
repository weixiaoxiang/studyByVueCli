<template>
  <div id="cesiumContainer"></div>
</template>
<script>
/*global Cesium*/
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      activeTitle: state => state.activeTitle
    })
  },
  watch: {},
  mounted() {
    const that = this
    var viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    // 搜索
    var geocoder = viewer.geocoder.viewModel
    geocoder.searchText = 'Vienna'
    geocoder.flightDuration = 0.0
    geocoder.search()

    // Vector 3D Tiles are experimental and the format is subject to change in the future.
    // For more details, see:
    // https://github.com/CesiumGS/3d-tiles/tree/vctr/TileFormats/VectorData
    var tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(5737)
    })
    viewer.scene.primitives.add(tileset)

    tileset.style = new Cesium.Cesium3DTileStyle({
      color: 'rgba(255, 255, 255, 0.5)'
    })

    // Information about the currently highlighted feature
    var highlighted = {
      feature: undefined,
      originalColor: new Cesium.Color()
    }

    // Color a feature yellow on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
      // If a feature was previously highlighted, undo the highlight
      if (Cesium.defined(highlighted.feature)) {
        highlighted.feature.color = highlighted.originalColor
        highlighted.feature = undefined
      }
      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.endPosition)
      if (!Cesium.defined(pickedFeature)) {
        return
      }
      // Highlight the feature
      highlighted.feature = pickedFeature
      Cesium.Color.clone(pickedFeature.color, highlighted.originalColor)
      pickedFeature.color = Cesium.Color.YELLOW
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '将选中的要素高亮')
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
