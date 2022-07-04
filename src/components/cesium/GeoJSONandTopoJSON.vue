<template>
  <div id="cesiumContainer">
    <div class="tooltip">
      <el-button
        type="primary"
        @click="select('Default')"
      >Default styling</el-button>
      <el-button
        type="primary"
        @click="select('Basic')"
      >Basic styling</el-button>
      <el-button
        type="primary"
        @click="select('Custom')"
      >Custom styling</el-button>
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
      viewer: null
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
      // terrainProvider: Cesium.createWorldTerrain(),
    })
    this.select('Default')
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'datasource加载geojson数据')
    },
    select(val) {
      this.viewer.dataSources.removeAll()
      this.viewer.camera.lookAt(
        Cesium.Cartesian3.fromDegrees(-98.0, 40.0),
        new Cesium.Cartesian3(0.0, -4790000.0, 3930000.0)
      )
      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      if (val === 'Default') {
        this.viewer.dataSources.add(
          Cesium.GeoJsonDataSource.load(
            '/data/SampleData/ne_10m_us_states.topojson'
          )
        )
      }
      if (val === 'Basic') {
        this.viewer.dataSources.add(
          Cesium.GeoJsonDataSource.load(
            '/data/SampleData/ne_10m_us_states.topojson',
            {
              stroke: Cesium.Color.HOTPINK,
              fill: Cesium.Color.PINK.withAlpha(0.5),
              strokeWidth: 3
            }
          )
        )
      }
      if (val === 'Custom') {
        Cesium.Math.setRandomNumberSeed(0)

        var promise = Cesium.GeoJsonDataSource.load(
          '/data/SampleData/ne_10m_us_states.topojson'
        )
        promise
          .then((dataSource) => {
            this.viewer.dataSources.add(dataSource)

            var entities = dataSource.entities.values

            var colorHash = {}
            for (var i = 0; i < entities.length; i++) {
              var entity = entities[i]
              var name = entity.name
              var color = colorHash[name]
              if (!color) {
                color = Cesium.Color.fromRandom({
                  alpha: 1.0
                })
                colorHash[name] = color
              }
              entity.polygon.material = color
              entity.polygon.outline = false
              entity.polygon.extrudedHeight =
                entity.properties.Population / 50.0
            }
          })
          .otherwise(function (error) {
            window.alert(error)
          })
      }
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  .tooltip {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
  }

  .el-button:nth-child(1) {
    margin-right: 10px;
  }

  .el-button:nth-child(2) {
    margin-right: 10px;
  }
}
</style>
