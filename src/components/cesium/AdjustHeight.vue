<template>
  <div id="cesiumContainer">
    <div>
      <div>
        <span>经度方向:</span>
        <el-slider
          v-model="x"
          :min="-50"
          :max="100"
          @input="changeX"
        ></el-slider>
      </div>
      <div>
        <span>纬度方向:</span>
        <el-slider
          v-model="y"
          :min="-50"
          :max="100"
          @input="changeY"
        ></el-slider>
      </div>
      <div>
        <span>高度:</span>
        <el-slider
          v-model="height"
          :min="-50"
          :max="100"
          @input="changeHeight"
        ></el-slider>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      height: 0
    }
  },
  computed: {},
  watch: {},
  created() {
    this.activeTitleChange()
  },
  mounted() {
    window.viewer = new Cesium.Viewer('cesiumContainer', {
      shadows: true
    })
    // 开启深度监测
    window.viewer.scene.globe.depthTestAgainstTerrain = true
    window.tileset = new Cesium.Cesium3DTileset({
      url: '/data/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json'
    })
    window.tileset.readyPromise
      .then(function (tileset) {
        window.viewer.scene.primitives.add(tileset)
        window.viewer.zoomTo(
          tileset,
          new Cesium.HeadingPitchRange(
            0.0,
            -0.5,
            tileset.boundingSphere.radius * 2.0
          )
        )
        console.table(tileset)
      })
      .otherwise(function (error) {
        console.log(error)
      })
  },
  destroyed() {
    this.$destroy()
    this.$el.remove()
  },
  methods: {
    activeTitleChange() {
      this.$store.commit('changeActiveTitle', '修改3dtiles的位置')
    },
    changeX(x) {
      this.x = x
      this.x !== 0 && this.change()
    },
    changeY(y) {
      this.y = y
      this.y !== 0 && this.change()
    },
    changeHeight(height) {
      this.height = height
      this.height !== 0 && this.change()
    },
    change() {
      var cartographic = Cesium.Cartographic.fromCartesian(
        window.tileset.boundingSphere.center
      )
      var surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0.0
      )
      var offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude + this.x * 0.0000005,
        cartographic.latitude + this.y * 0.0000005,
        this.height
      )
      var translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      )
      window.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
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
    width: 40%;
    z-index: 1;
  }
}
</style>
