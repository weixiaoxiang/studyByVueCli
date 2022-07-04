<template>
  <div id="cesiumContainer"></div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'
import PolylineTrailMaterialProperty from '@utils/polylineTrailMaterialProperty.js'
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
    var viewer = new Cesium.Viewer('cesiumContainer')

    var building = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(40866)
      })
    )

    var route = viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -75.59604807301078, 40.03948512841901, -75.59644577413066, 40.039316280505446,
          -75.59584544997564, 40.03846271524258, -75.59661425371488, 40.03814087821916,
          -75.59664726332451, 40.03818297772907
        ]),
        width: 10,
        material: new Cesium.PolylineTrailMaterialProperty({
          color: new Cesium.Color(58 / 255, 5 / 255, 179 / 255, 1),
          duration: 2000,
          trailImage: '/data/colors.png' // color2.png
        }),
        show: true,
        clampToGround: true,
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
      }
    })
    viewer.zoomTo(building)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '绘制动态纹理polyline')
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
