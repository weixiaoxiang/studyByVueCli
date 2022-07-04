<template>
  <div id="cesiumContainer"></div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'
import HexagonSpread from '@utils/Hexagon'
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
    var viewer = new Cesium.Viewer('cesiumContainer', {
      infoBox: false,
      selectionIndicator: false,
      shadows: true,
      shouldAnimate: true
    })
    var scene = viewer.scene
    scene.globe.depthTestAgainstTerrain = true
    var tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(75343)
    })
    viewer.scene.primitives.add(tileset)
    // 六边形扩散
    const hexagonSpread1 = new HexagonSpread(viewer, 'hexagonSpred1')
    hexagonSpread1.add(
      [-74.00881302800248, 40.71114333714821],
      'rgba(255,255,255,0.9)',
      1000, // 最大半径
      10000 // 控制运动速度
    )
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '六边形扩散效果')
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
