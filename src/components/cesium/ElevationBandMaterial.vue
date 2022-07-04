<template>
  <div id="cesiumContainer"></div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

// http://localhost:8001/Apps/Sandcastle/index.html?src=Elevation%20Band%20Material.html&label=All
import { mapState } from 'vuex'
export default {
  data() {
    return {
      viewer: null,
      viewModel: {
        gradient: false,
        band1Position: 7000.0,
        band2Position: 7500.0,
        band3Position: 8000.0,
        bandThickness: 100.0,
        bandTransparency: 0.5,
        backgroundTransparency: 0.75
      }
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
      terrainProvider: Cesium.createWorldTerrain({
        requestVertexNormals: true // Needed to visualize slope
      })
    })

    this.viewer.camera.setView({
      destination: new Cesium.Cartesian3(
        290637.5534733206,
        5637471.593707632,
        2978256.8126927214
      ),
      orientation: {
        heading: 4.747266966349747,
        pitch: -0.2206998858596192,
        roll: 6.280340554587955
      }
    })

    this.updateMaterial()
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '等高线')
    },
    updateMaterial() {
      var gradient = Boolean(this.viewModel.gradient)
      var band1Position = Number(this.viewModel.band1Position)
      var band2Position = Number(this.viewModel.band2Position)
      var band3Position = Number(this.viewModel.band3Position)
      var bandThickness = Number(this.viewModel.bandThickness)
      var bandTransparency = Number(this.viewModel.bandTransparency)
      var backgroundTransparency = Number(
        this.viewModel.backgroundTransparency
      )

      var layers = []
      var backgroundLayer = {
        entries: [
          {
            height: 4200.0,
            color: new Cesium.Color(0.0, 0.0, 0.2, backgroundTransparency)
          },
          {
            height: 8000.0,
            color: new Cesium.Color(1.0, 1.0, 1.0, backgroundTransparency)
          },
          {
            height: 8500.0,
            color: new Cesium.Color(1.0, 0.0, 0.0, backgroundTransparency)
          }
        ],
        extendDownwards: true,
        extendUpwards: true
      }
      layers.push(backgroundLayer)

      var gridStartHeight = 4200.0
      var gridEndHeight = 8848.0
      var gridCount = 50
      for (var i = 0; i < gridCount; i++) {
        var lerper = i / (gridCount - 1)
        var heightBelow = Cesium.Math.lerp(
          gridStartHeight,
          gridEndHeight,
          lerper
        )
        var heightAbove = heightBelow + 10.0
        var alpha = Cesium.Math.lerp(0.2, 0.4, lerper) * backgroundTransparency
        layers.push({
          entries: [
            {
              height: heightBelow,
              color: new Cesium.Color(1.0, 1.0, 1.0, alpha)
            },
            {
              height: heightAbove,
              color: new Cesium.Color(1.0, 1.0, 1.0, alpha)
            }
          ]
        })
      }
      var antialias = Math.min(10.0, bandThickness * 0.1)
      if (!gradient) {
        var band1 = {
          entries: [
            {
              height: band1Position - bandThickness * 0.5 - antialias,
              color: new Cesium.Color(0.0, 0.0, 1.0, 0.0)
            },
            {
              height: band1Position - bandThickness * 0.5,
              color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency)
            },
            {
              height: band1Position + bandThickness * 0.5,
              color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency)
            },
            {
              height: band1Position + bandThickness * 0.5 + antialias,
              color: new Cesium.Color(0.0, 0.0, 1.0, 0.0)
            }
          ]
        }
        var band2 = {
          entries: [
            {
              height: band2Position - bandThickness * 0.5 - antialias,
              color: new Cesium.Color(0.0, 1.0, 0.0, 0.0)
            },
            {
              height: band2Position - bandThickness * 0.5,
              color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency)
            },
            {
              height: band2Position + bandThickness * 0.5,
              color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency)
            },
            {
              height: band2Position + bandThickness * 0.5 + antialias,
              color: new Cesium.Color(0.0, 1.0, 0.0, 0.0)
            }
          ]
        }
        var band3 = {
          entries: [
            {
              height: band3Position - bandThickness * 0.5 - antialias,
              color: new Cesium.Color(1.0, 0.0, 0.0, 0.0)
            },
            {
              height: band3Position - bandThickness * 0.5,
              color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency)
            },
            {
              height: band3Position + bandThickness * 0.5,
              color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency)
            },
            {
              height: band3Position + bandThickness * 0.5 + antialias,
              color: new Cesium.Color(1.0, 0.0, 0.0, 0.0)
            }
          ]
        }
        layers.push(band1)
        layers.push(band2)
        layers.push(band3)
      } else {
        var combinedBand = {
          entries: [
            {
              height: band1Position - bandThickness * 0.5,
              color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency)
            },
            {
              height: band2Position,
              color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency)
            },
            {
              height: band3Position + bandThickness * 0.5,
              color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency)
            }
          ]
        }
        layers.push(combinedBand)
      }
      var material = Cesium.createElevationBandMaterial({
        scene: this.viewer.scene,
        layers: layers
      })
      this.viewer.scene.globe.material = material
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
