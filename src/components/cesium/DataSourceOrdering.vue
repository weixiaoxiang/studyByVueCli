<template>
  <div id="cesiumContainer">
    <el-button @click="changeOrder">切换顺序</el-button>
  </div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      viewer: null,
      promise1: null,
      promise2: null
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
      terrainProvider: Cesium.createWorldTerrain()
    })
    var czml1 = [
      {
        id: 'document',
        name: 'CZML Geometries: Rectangle',
        version: '1.0'
      },
      {
        rectangle: {
          coordinates: {
            wsenDegrees: [-120, 40, -110, 50]
          },
          fill: true,
          material: {
            solidColor: {
              color: {
                rgba: [255, 0, 0, 255]
              }
            }
          }
        }
      },
      {
        rectangle: {
          coordinates: {
            wsenDegrees: [-110, 40, -100, 50]
          },
          fill: true,
          material: {
            solidColor: {
              color: {
                rgba: [0, 0, 255, 255]
              }
            }
          }
        }
      }
    ]

    var czml2 = [
      {
        id: 'document',
        name: 'CZML Geometries: Rectangle',
        version: '1.0'
      },
      {
        rectangle: {
          coordinates: {
            wsenDegrees: [-120, 45, -110, 55]
          },
          fill: true,
          material: {
            solidColor: {
              color: {
                rgba: [255, 255, 0, 255]
              }
            }
          }
        }
      },
      {
        rectangle: {
          coordinates: {
            wsenDegrees: [-110, 45, -100, 55]
          },
          fill: true,
          material: {
            solidColor: {
              color: {
                rgba: [0, 255, 255, 255]
              }
            }
          }
        }
      }
    ]
    this.promise1 = Cesium.CzmlDataSource.load(czml1)
    this.viewer.dataSources.add(this.promise1)
    this.promise2 = Cesium.CzmlDataSource.load(czml2)
    this.viewer.dataSources.add(this.promise2)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '调整多个datasource的显示顺序')
    },
    changeOrder() {
      Cesium.when.all([this.promise1, this.promise2]).then((results) => {
        var ds1 = results[0]
        var ds2 = results[1]
        if (this.viewer.dataSources.indexOf(ds1) === 0) {
          this.viewer.dataSources.raise(ds1)
        } else {
          this.viewer.dataSources.lower(ds1)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
}

.el-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
}
</style>
