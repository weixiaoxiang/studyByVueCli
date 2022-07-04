<template>
  <div id="cesiumContainer">
    <div>
      <el-switch
        v-model="isPicking"
        active-color="#13ce66"
        inactive-color="#ff4949"
      >
      </el-switch>
      <span
        class="switch-text"
      ><span
        :class="[isPicking ? 'green' : 'red']"
      ><b>{{ isPicking ? "开启" : "关闭" }}</b></span>了鼠标事件</span>
    </div>
  </div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      selectedFeature: null,
      isPicking: true
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  watch: {},
  created() {
    this.changeActiveTitle()
  },
  mounted() {
    window.viewer = new Cesium.Viewer('cesiumContainer', {})
    var scene = window.viewer.scene
    var tileset = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(8564)
      })
    )
    tileset.readyPromise
      .then(function (tileset) {
        window.viewer.zoomTo(
          tileset,
          new Cesium.HeadingPitchRange(
            0.5,
            -0.2,
            tileset.boundingSphere.radius * 4.0
          )
        )
      })
      .otherwise(function (error) {
        // 抛出错误
        console.log(error)
      })
    tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    handler.setInputAction((movement) => {
      if (!this.isPicking) {
        return
      }

      var feature = scene.pick(movement.endPosition)
      this.unselectFeature(this.selectedFeature)
      if (feature instanceof Cesium.Cesium3DTileFeature) {
        // var propertyNames = feature.getPropertyNames();
        this.selectFeature(feature)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    tileset.tileLoad.addEventListener(function (tile) {
      // processTileFeatures(tile, loadFeature);
    })

    tileset.tileUnload.addEventListener(function (tile) {
      // processTileFeatures(tile, unloadFeature);
    })
  },
  destroyed() {
    this.$destroy()
    // 销毁实例
    this.$el.remove()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '加载3DTiles BIM')
    },
    selectFeature(feature) {
      if (!Cesium.defined(feature)) {
        return
      }
      this.setFeatureColor(feature, Cesium.Color.AQUA)
      this.selectedFeature = feature
    },
    unselectFeature(feature) {
      if (!Cesium.defined(feature)) {
        return
      }
      this.setFeatureColor(feature, Cesium.Color.WHITE)
      if (feature === this.selectedFeature) {
        this.selectedFeature = undefined
      }
    },
    setFeatureColor(feature, color) {
      feature.color = Cesium.Color.clone(color, feature.color)
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
    z-index: 1;
  }

  .switch-text {
    vertical-align: middle;
    margin-left: 8px;

    .green {
      color: green;
      font-size: 18px;
    }

    .red {
      color: red;
      font-size: 18px;
    }
  }
}
</style>
