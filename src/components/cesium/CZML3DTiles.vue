<template>
  <div id="cesiumContainer"></div>
</template>
<script>
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

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
        version: '1.0'
      },
      {
        id: 'BatchedColors',
        name: 'BatchedColors',
        tileset: {
          uri: '/data/SampleData/Cesium3DTiles/Batched/BatchedColors/tileset.json'
        }
      }
    ]

    var viewer = new Cesium.Viewer('cesiumContainer', {
      shouldAnimate: true
    })

    var dataSourcePromise = viewer.dataSources.add(
      // 添加CzmlDataSource
      Cesium.CzmlDataSource.load(czml)
    )

    dataSourcePromise
      .then(function (dataSource) {
        console.log(dataSource)
        viewer.flyTo(dataSource.entities.getById('BatchedColors'))
      })
      .otherwise(function (error) {
        window.alert(error)
      })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '加载CZML格式的3DTiles，有幻灯片播放效果'
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
