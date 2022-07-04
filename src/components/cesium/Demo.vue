<template>
  <div id="cesiumContainer"></div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'
import data from '../../../public/data/psg.json'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      entityCollection: null,
      rotation: 0
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
    window.viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    window.viewer.entities.add({
      name: 'Rotating rectangle with rotating texture coordinate',
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(-92.0, 30.0, -76.0, 40.0),
        // material: "/data/Sandcastle/images/Cesium_Logo_Color.jpg",
        // material: '/data/SampleData/arrow.png',
        material: new Cesium.ImageMaterialProperty({
          image: '/data/arrow128.png',
          repeat: new Cesium.Cartesian2(1.0, 1.0),
          color: new Cesium.Color(49 / 255, 4 / 255, 200 / 255, 0.6),
          transparent: false
        }),
        rotation: new Cesium.CallbackProperty(this.getRotationValue, false),
        stRotation: new Cesium.CallbackProperty(this.getRotationValue, false),
        classificationType: Cesium.ClassificationType.TERRAIN
      }
    })

    // this.entityCollection = new Cesium.EntityCollection()
    const { features } = data
    features.map((item) => {
      const coors = item.geometry.coordinates
      const heights = [item.properties.IN_ELEV, item.properties.OUT_ELEV]
      const degreesHeight = [...coors[0], heights[0], ...coors[1], heights[1]]
      this.creatEntity(degreesHeight)
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'demo')
    },
    computeCircle(radius) {
      var positions = []
      for (var i = 0; i < 360; i++) {
        var radians = Cesium.Math.toRadians(i)
        positions.push(
          new Cesium.Cartesian2(
            radius * Math.cos(radians),
            radius * Math.sin(radians)
          )
        )
      }
      return positions
    },
    computeStar(arms, rOuter, rInner) {
      var angle = Math.PI / arms
      var length = 2 * arms
      var positions = new Array(length)
      for (var i = 0; i < length; i++) {
        var r = i % 2 === 0 ? rOuter : rInner
        positions[i] = new Cesium.Cartesian2(
          Math.cos(i * angle) * r,
          Math.sin(i * angle) * r
        )
      }
      return positions
    },
    creatEntity(degreesHeight) {
      const entity = new Cesium.Entity({
        name: '排水管',
        polylineVolume: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(degreesHeight),
          shape: this.computeCircle(0.8),
          // material: new Cesium.PolylineGlowMaterialProperty({
          // color: Cesium.Color.GREEN, //颜色
          // glowPower: 0.1, //发光强度
          // taperPower: 1, //锥型效果强度
          // })

          // material: new Cesium.ColorMaterialProperty(Cesium.Color.RED) //,
          material: new Cesium.ImageMaterialProperty({
            image: '/data/fenceline.png',
            // image: '/data/arrow128.png',
            repeat: new Cesium.Cartesian2(5.0, 1),
            color: new Cesium.Color(58 / 255, 255 / 255, 180 / 255, 1),
            transparent: true
          })
        }
      })
      window.viewer.entities.add(entity)
      window.viewer.zoomTo(entity)
      // this.entityCollection.add(entity)
    },
    getRotationValue() {
      this.rotation += 0.005
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
