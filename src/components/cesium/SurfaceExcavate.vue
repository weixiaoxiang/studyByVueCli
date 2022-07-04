<!--
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-08-24 11:11:19
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-24 14:58:54
-->
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
    var viewer = new Cesium.Viewer('cesiumContainer', {
      // terrainProvider: Cesium.createWorldTerrain(),
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '初始化cesium')
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
