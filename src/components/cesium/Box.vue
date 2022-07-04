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
    var viewer = new Cesium.Viewer('cesiumContainer')
    // box默认不带轮廓
    var blueBox = viewer.entities.add({
      name: 'Blue box',
      position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
      box: {
        // box在世界坐标中大小，单位为米
        dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        // 设置材质
        material: Cesium.Color.BLUE
      }
    })

    var redBox = viewer.entities.add({
      name: 'Red box with black outline',
      position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
      box: {
        dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        // 材质的颜色
        material: Cesium.Color.RED.withAlpha(0.5),
        // 添加外轮廓线
        outline: true,
        // 轮廓线的颜色
        outlineColor: Cesium.Color.BLACK
      }
    })

    var outlineOnly = viewer.entities.add({
      name: 'Yellow box outline',
      position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 300000.0),
      box: {
        dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        // 取消填充  材质的颜色（无材质，仅仅显示轮廓）
        fill: false,
        outline: true,
        outlineColor: Cesium.Color.YELLOW
      }
    })

    viewer.zoomTo(viewer.entities)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'entity绘制box,默认不添加外轮廓')
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
