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
    var czml = [
      {
        id: 'document',
        name: 'box',
        version: '1.0'
      },
      {
        id: 'shape1',
        name: 'Blue box',
        position: {
          cartographicDegrees: [-114.0, 40.0, 300000.0]
        },
        box: {
          dimensions: {
            cartesian: [400000.0, 300000.0, 500000.0]
          },
          material: {
            solidColor: {
              color: {
                rgba: [0, 0, 255, 255]
              }
            }
          }
        }
      },
      {
        id: 'shape2',
        name: 'Red box with black outline',
        position: {
          cartographicDegrees: [-107.0, 40.0, 300000.0]
        },
        box: {
          dimensions: {
            cartesian: [400000.0, 300000.0, 500000.0]
          },
          material: {
            solidColor: {
              color: {
                rgba: [255, 0, 0, 128]
              }
            }
          },
          outline: true,
          outlineColor: {
            rgba: [0, 0, 0, 255]
          }
        }
      },
      {
        id: 'shape3',
        name: 'Yellow box outline',
        position: {
          cartographicDegrees: [-100.0, 40.0, 300000.0]
        },
        box: {
          dimensions: {
            cartesian: [400000.0, 300000.0, 500000.0]
          },
          fill: false,
          outline: true,
          outlineColor: {
            rgba: [255, 255, 0, 255]
          }
        }
      }
    ]

    var viewer = new Cesium.Viewer('cesiumContainer')
    var dataSourcePromise = Cesium.CzmlDataSource.load(czml)
    viewer.dataSources.add(dataSourcePromise)
    viewer.zoomTo(dataSourcePromise)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '按照czml格式定义box，可以通过CzmlDataSource接口绘制出box'
      )
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
