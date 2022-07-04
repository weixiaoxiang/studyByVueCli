<template>
  <div id="cesiumContainer"></div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      inID: 0
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  watch: {},
  mounted() {
    this.inID = window.setInterval(() => {
      console.log('123')
    }, 1500)
    const that = this
    var viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    var scene = viewer.scene
    var globe = scene.globe

    // Tropics of Cancer and Capricorn
    var coffeeBeltRectangle = Cesium.Rectangle.fromDegrees(
      80.0,
      -23.43687,
      180.0,
      23.43687
    )
    globe.cartographicLimitRectangle = coffeeBeltRectangle
    // 是否显示地形裙
    globe.showSkirts = false
    // 是否剔除背面地形  是否显示地球背面
    globe.backFaceCulling = false
    // 地球背面填充色 当backFaceCulling可用时
    globe.undergroundColor = undefined
    // 是否显示大气层
    scene.skyAtmosphere.show = false

    // Add rectangles to show bounds
    var rectangles = []

    for (var i = 0; i < 1; i++) {
      rectangles.push(
        viewer.entities.add({
          rectangle: {
            coordinates: coffeeBeltRectangle,
            material: Cesium.Color.WHITE.withAlpha(0.0),
            height: i * 5000.0,
            outline: true,
            outlineWidth: 4.0,
            outlineColor: Cesium.Color.WHITE
          }
        })
      )
    }
    var rectanglesLength = rectangles.length
    for (var i = 0; i < rectanglesLength; i++) {
      var rectangleEntity = rectangles[i]
      rectangleEntity.show = true
    }
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '用Rectangle分割地球')
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
