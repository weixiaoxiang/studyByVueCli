<template>
  <div id="cesiumContainer">
    <div>
      <el-select
        v-model="value"
        style="margin-right: 10px"
        size="mini"
        placeholder="请选择"
        @change="change"
      >
        <el-option label="Polygons" value="Polygons"> </el-option>
        <el-option
          label="Boxes, Cylinders and Ellipsoids"
          value="Boxes, Cylinders and Ellipsoids"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="value1"
        size="mini"
        placeholder="请选择"
        @change="change1"
      >
        <el-option label="Terrain Enabled" value="Terrain Enabled"> </el-option>
        <el-option label="Terrain Disabled" value="Terrain Disabled">
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      value: 'Polygons',
      value1: 'Terrain Enabled',
      cesiumTerrainProvider: null,
      ellipsoidTerrainProvider: null,
      viewer: null,
      longitude: 6.950615989890521,
      latitude: 45.79546589994886,
      delta: 0.001
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
    this.cesiumTerrainProvider = Cesium.createWorldTerrain()
    this.ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider()

    this.viewer = new Cesium.Viewer('cesiumContainer', {
      baseLayerPicker: false,
      terrainProvider: this.cesiumTerrainProvider
    })
    this.viewer.scene.globe.depthTestAgainstTerrain = true
    this.change('Polygons')
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'geometryreference')
    },
    change(val) {
      if (val == 'Polygons') {
        this.viewer.entities.removeAll()
        this.addPolygons()
      } else {
        this.viewer.entities.removeAll()
        this.addGeometries()
      }
    },
    change1(val) {
      if (val == 'Terrain Enabled') {
        this.viewer.scene.terrainProvider = this.cesiumTerrainProvider
      } else {
        this.viewer.scene.terrainProvider = this.ellipsoidTerrainProvider
      }
    },
    addGeometry(i, j) {
      var west = this.longitude + this.delta * i
      var north = this.latitude + this.delta * j + this.delta

      var type = Math.floor(Math.random() * 3)
      if (type === 0) {
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(west, north, 0.0),
          box: {
            dimensions: new Cesium.Cartesian3(40.0, 30.0, 50.0),
            material: Cesium.Color.fromRandom({
              alpha: 1.0
            }),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          }
        })
      } else if (type === 1) {
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(west, north, 0.0),
          cylinder: {
            length: 50.0,
            topRadius: 20.0,
            bottomRadius: 20.0,
            material: Cesium.Color.fromRandom({
              alpha: 1.0
            }),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          }
        })
      } else {
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(west, north, 0.0),
          ellipsoid: {
            radii: new Cesium.Cartesian3(20.0, 15.0, 25.0),
            material: Cesium.Color.fromRandom({
              alpha: 1.0
            }),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          }
        })
      }
    },
    addGeometries() {
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          this.addGeometry(i, j)
        }
      }
      this.viewer.zoomTo(this.viewer.entities)
    },
    addPolygon(i, j) {
      var west = this.longitude + this.delta * i
      var east = this.longitude + this.delta * i + this.delta
      var south = this.latitude + this.delta * j
      var north = this.latitude + this.delta * j + this.delta
      var a = Cesium.Cartesian3.fromDegrees(west, south)
      var b = Cesium.Cartesian3.fromDegrees(west, north)
      var c = Cesium.Cartesian3.fromDegrees(east, north)
      var d = Cesium.Cartesian3.fromDegrees(east, south)
      var positions = [a, b, c, d]
      this.viewer.entities.add({
        polygon: {
          hierarchy: positions,
          material: Cesium.Color.fromRandom({
            alpha: 1
          }),
          height: 40.0,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          extrudedHeight: 0.0,
          extrudedHeightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      })
    },
    addPolygons() {
      // create 16 polygons that are side - by - side
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          this.addPolygon(i, j)
        }
      }
      this.viewer.camera.lookAt(
        Cesium.Cartesian3.fromDegrees(this.longitude, this.latitude, 1500),
        new Cesium.HeadingPitchRange(
          -Cesium.Math.PI / 2,
          -Cesium.Math.PI_OVER_FOUR,
          2000
        )
      )
      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  > div {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
  }
}
</style>
