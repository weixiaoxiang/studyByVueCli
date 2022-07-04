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
        name: 'CZML Custom Properties',
        version: '1.0',
        clock: {
          interval: '1970/2010',
          currentTime: '1970',
          multiplier: 500000000
        }
      },
      {
        id: 'custom_property_object',
        name: 'An object with custom properties',
        properties: {
          constant_property: true,
          population_intervals: [
            {
              interval: '1970/1980',
              number: 2209600
            },
            {
              interval: '1980/2090',
              number: 2889700
            },
            {
              interval: '1990/2000',
              number: 3307600
            },
            {
              interval: '2000/2010',
              number: 4326900
            }
          ],
          population_sampled: {
            number: [
              '1970',
              2209600,
              '1980',
              2889700,
              '1990',
              3307600,
              '2000',
              4326900,
              '2010',
              5049100
            ]
          }
        }
      },
      {
        id: 'colorado',
        name: 'Colorado',
        polygon: {
          positions: {
            cartographicDegrees: [
              -109.03, 41, 0, -102.03, 41, 0, -102.03, 37, 0, -109.03, 37, 0
            ]
          },
          material: {
            solidColor: {
              color: {
                rgba: [0, 255, 0, 150]
              }
            }
          },
          height: 0,
          extrudedHeight: 0
        }
      }
    ]

    var viewer = new Cesium.Viewer('cesiumContainer', {
      shouldAnimate: true
    })

    var dataSource = new Cesium.CzmlDataSource()

    function scaleProperty(property, scalingFactor) {
      // returns a property that scales another property by a constant factor.
      return new Cesium.CallbackProperty(function (time, result) {
        result = property.getValue(time, result)
        result = result * scalingFactor
        return result
      }, property.isConstant)
    }

    function setExtrudedHeight(propertyName) {
      var customPropertyObject = dataSource.entities.getById(
        'custom_property_object'
      )
      var property = customPropertyObject.properties[propertyName]
      console.log(customPropertyObject)
      console.log(property)
      var colorado = dataSource.entities.getById('colorado')
      colorado.polygon.extrudedHeight = scaleProperty(property, 1 / 50.0)
    }
    dataSource.load(czml)
    viewer.dataSources.add(dataSource)
    viewer.zoomTo(dataSource)
    setExtrudedHeight('population_sampled')
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '通过czml时间特性修改box的高度，模拟水淹分析'
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
