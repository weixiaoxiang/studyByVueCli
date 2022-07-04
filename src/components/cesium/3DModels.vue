<template>
  <div id="cesiumContainer">
    <el-select
      ref="fieldSelect"
      v-model="value"
      :popper-append-to-body="false"
      placeholder="请选择"
      @change="changeSelected"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
// 指北针插件
import CesiumNavigation from 'cesium-navigation-es6'
// import Viewer from "cesium/Source/Widgets/Viewer/Viewer"
import { mapState } from 'vuex'
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
      label: 'Aircraft',
      value: 'data/SampleData/models/CesiumAir/Cesium_Air.glb',
      options: [
        {
          value: 'data/SampleData/models/CesiumAir/Cesium_Air.glb',
          label: 'Aircraft'
        },
        {
          value: 'data/SampleData/models/CesiumDrone/CesiumDrone.glb',
          label: 'Drone'
        },
        {
          value: 'data/SampleData/models/GroundVehicle/GroundVehicle.glb',
          label: 'Ground Vehicle'
        },
        {
          value: 'data/SampleData/models/CesiumBalloon/CesiumBalloon.glb',
          label: 'Hot Air Balloon'
        },
        {
          value: 'data/SampleData/models/CesiumMilkTruck/CesiumMilkTruck.glb',
          label: 'Milk Truck'
        },
        {
          value: 'data/SampleData/models/CesiumMan/Cesium_Man.glb',
          label: 'Skinned Character'
        },
        {
          value: 'data/SampleData/models/DracoCompressed/CesiumMilkTruck.gltf',
          label: 'Draco Compressed Model'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      activeTitle: state => state.activeTitle
    }),
    height: function () {
      let height = 5000
      switch (this.label) {
        case 'Aircraft':
          height = 5000
          break
        case 'Drone':
          height = 150
          break
        case 'Ground Vehicle':
          height = 0
          break
        case 'Hot Air Balloon':
          height = 1000
          break
        case 'Milk Truck':
          height = 0
          break
        case 'Skinned Character':
          height = 0
          break
        default:
          height = 0
          break
      }
      return height
    }
  },
  watch: {},
  created() {
    this.changeActiveTitle()
  },
  /* global Cesium*/
  mounted() {
    var viewer = new Cesium.Viewer('cesiumContainer', {
      infoBox: false,
      selectionIndicator: false,
      shadows: true,
      shouldAnimate: true
    })
    this.initNavigation(viewer)
    window.viewer = viewer
    this.$nextTick(function () {
      this.$refs.fieldSelect.$refs.scrollbar.$el.classList.add('scroll-opacity')
    })
    this.createModel(this.value, this.height)
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', 'entity加载模型，注意下拉框样式修改')
    },
    createModel(url, height = 5000) {
      // 删除全部的entity
      window.viewer.entities.removeAll()

      var position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, height)
      var heading = Cesium.Math.toRadians(135)
      var pitch = 0
      var roll = 0
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)
      url = this.publicPath + url
      var entity = window.viewer.entities.add({
        name: url,
        position: position,
        orientation: orientation,
        model: {
          uri: url,
          minimumPixelSize: 128,
          maximumScale: 20000
        }
      })
      window.viewer.flyTo(entity).then(() => {
        this.$message.success('飞行成功')
        window.viewer.trackedEntity = entity
      })
      // this.viewer.trackedEntity = entity;
    },
    changeSelected(value) {
      this.$nextTick(() => {
        this.label = this.options.find(item => {
          return item.value === this.value
        }).label
        this.createModel(this.value, this.height)
      })
    },
    // 初始化指北针
    initNavigation(viewer) {
      var options = {}
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50)
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = true
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true
      CesiumNavigation(viewer, options)
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  .el-select {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
    height: 100%;
    max-height: 250px;
  }
}

// 解决下拉框滚动条问题
.el-select/deep/.el-select-dropdown {
  height: 100%;

  .el-scrollbar {
    height: 100%;

    .el-select-dropdown__list:hover .el-scrollbar__bar.is-vertical {
      opacity: 1;
      background-color: #dddee0;
    }
  }
}
</style>
