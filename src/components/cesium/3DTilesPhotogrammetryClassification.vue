<template>
  <div id="cesiumContainer">
    <el-checkbox
      v-model="checked"
      @change="change"
    >是否显示单体层(红色)</el-checkbox>
  </div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      checked: true,
      classificationTileset: null
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  watch: {},
  mounted() {
    var that = -this
    var viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    // A normal b3dm tileset of photogrammetry
    var tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(40866)
    })
    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset)
    var classifcationTilesetUrl =
      '/data/SampleData/Cesium3DTiles/Classification/Photogrammetry/tileset.json'
    // 创建单体层的3DTileset 需要配合tileset这个图元才能够看出效果
    this.classificationTileset = new Cesium.Cesium3DTileset({
      url: classifcationTilesetUrl,
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
    })
    // 定义单体层的颜色  红色
    this.classificationTileset.style = new Cesium.Cesium3DTileStyle({
      color: 'rgba(255, 0, 0, 0.5)'
    })
    viewer.scene.primitives.add(this.classificationTileset)
    console.log(this.classificationTileset)
    // //
    // var nonClassificationTileset = new Cesium.Cesium3DTileset({
    //     url: classifcationTilesetUrl,
    //     show: false,
    // });
    // nonClassificationTileset.style = new Cesium.Cesium3DTileStyle({
    //     color: "rgba(255, 0, 0, 0.5)",
    // });
    // viewer.scene.primitives.add(nonClassificationTileset);

    // Sandcastle.addToggleButton("Show classification", true, function (
    //     checked
    // ) {
    //     classificationTileset.show = checked;
    //     nonClassificationTileset.show = !checked;
    // });
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '当仅仅只有单体层而没有其他3DTiles在时，单体层将不显示'
      )
    },
    change(value) {
      this.classificationTileset.show = this.checked
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

.el-checkbox {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
}
</style>
