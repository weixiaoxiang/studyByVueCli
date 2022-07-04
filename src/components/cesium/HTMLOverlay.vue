<!--
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-08-20 14:19:39
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-20 14:30:50
-->
<template>
  <div id="cesiumContainer">
    <img
      id="htmlOverlay"
      style="position: absolute; z-index: 1"
      src="/data/Sandcastle/images/Cesium_Logo_overlay.png"
    />
  </div>
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
    var viewer = new Cesium.Viewer('cesiumContainer', {})
    var htmlOverlay = document.getElementById('htmlOverlay')
    var scratch = new Cesium.Cartesian2()
    // preRender:在场景更新之后，渲染之前之前代码
    viewer.scene.preRender.addEventListener(function () {
      try {
        var position = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883)
        // 世界坐标转为屏幕坐标
        var canvasPosition = viewer.scene.cartesianToCanvasCoordinates(
          position,
          scratch
        )
        if (Cesium.defined(canvasPosition)) {
          htmlOverlay.style.top = canvasPosition.y + 'px'
          htmlOverlay.style.left = canvasPosition.x + 'px'
        }
      } catch (e) {
        console.log(e)
      }
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        'overlay添加html元素,通过prerender实时修改overlay的坐标'
      )
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
</style>
