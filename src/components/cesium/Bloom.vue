<template>
  <div id="cesiumContainer">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="Bloom:">
        <el-checkbox v-model="form.Bloom"></el-checkbox>
      </el-form-item>
      <el-form-item label="GlowOnly:">
        <el-checkbox v-model="form.GlowOnly"></el-checkbox>
      </el-form-item>
      <el-form-item label="Contrast">
        <el-slider v-model="form.Contrast" :min="0" :max="150"></el-slider>
      </el-form-item>
      <el-form-item label="Brightness:">
        <el-slider
          v-model="form.Brightness"
          :format-tooltip="formatTooltip"
          :min="-10"
          :max="10"
        ></el-slider>
      </el-form-item>
      <el-form-item label="Delta:">
        <el-slider
          v-model="form.Delta"
          :format-tooltip="formatTooltip"
          :min="0"
          :max="20"
        ></el-slider>
      </el-form-item>
      <el-form-item label="Sigma:">
        <el-slider v-model="form.Sigma" :min="0" :max="10"></el-slider>
      </el-form-item>
      <el-form-item label="StepSize:">
        <el-slider v-model="form.StepSize" :min="0" :max="15"></el-slider>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      form: {
        Bloom: true,
        GlowOnly: false,
        Contrast: 128,
        Brightness: -3,
        Delta: 1.0,
        Sigma: 3.78,
        StepSize: 5.0
      },
      viewer: null
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    }),
    // 搭建计算属性中间件，在watch中监听form的变化
    watchList() {
      const obj = {}
      Object.keys(this.form).forEach((key) => {
        obj[key] = this.form[key]
      })
      return obj
    }
  },
  watch: {
    watchList(newval, oldval) {
      this.updatePostProcess()
      // return
    }
  },
  mounted() {
    const that = this
    this.viewer = new Cesium.Viewer('cesiumContainer')
    var numberOfBalloons = 13
    var lonIncrement = 0.00025
    var initialLon = -122.99875
    var lat = 44.0503706
    var height = 100.0

    var url = '/data/SampleData/models/CesiumBalloon/CesiumBalloon.glb'

    for (var i = 0; i < numberOfBalloons; ++i) {
      var lon = initialLon + i * lonIncrement
      this.createModel(url, lon, lat, height)
    }
    var target = Cesium.Cartesian3.fromDegrees(
      initialLon + lonIncrement,
      lat,
      height + 7.5
    )
    var offset = new Cesium.Cartesian3(
      -37.048378684557974,
      24.852967044804245,
      104.352023653686047
    )
    this.viewer.scene.camera.lookAt(target, offset)
    // 解除相机视角锁定
    // this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    this.updatePostProcess()
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '后渲染，bloom的初识')
    },
    formatTooltip(val) {
      return val / 10
    },
    createModel(url, x, y, height) {
      var position = Cesium.Cartesian3.fromDegrees(x, y, height)
      this.viewer.entities.add({
        name: url,
        position: position,
        model: {
          uri: url
        }
      })
    },
    updatePostProcess() {
      var bloom = this.viewer.scene.postProcessStages.bloom
      bloom.enabled = Boolean(this.form.Bloom)
      bloom.uniforms.glowOnly = Boolean(this.form.GlowOnly)
      bloom.uniforms.contrast = Number(this.form.Contrast)
      bloom.uniforms.brightness = Number(this.form.Brightness / 10)
      bloom.uniforms.delta = Number(this.form.Delta / 10)
      bloom.uniforms.sigma = Number(this.form.Sigma)
      bloom.uniforms.stepSize = Number(this.form.StepSize)
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  .el-form {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
    width: 25%;

    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
