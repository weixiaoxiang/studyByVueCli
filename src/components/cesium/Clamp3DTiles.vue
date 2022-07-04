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
      terrainProvider: Cesium.createWorldTerrain()
    })

    var scene = viewer.scene
    var clock = viewer.clock

    var entity
    var positionProperty
    var dataSourcePromise = Cesium.CzmlDataSource.load(
      '/data/SampleData/ClampToGround.czml'
    )
    viewer.dataSources.add(dataSourcePromise).then(function (dataSource) {
      entity = dataSource.entities.getById('CesiumMilkTruck')
      positionProperty = entity.position
    })

    var tileset = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(40866)
      })
    )

    viewer.camera.setView({
      destination: new Cesium.Cartesian3(
        1216403.8845586285,
        -4736357.493351395,
        4081299.715698949
      ),
      orientation: new Cesium.HeadingPitchRoll(
        4.2892217081808806,
        -0.4799070147502502,
        6.279789177843313
      ),
      endTransform: Cesium.Matrix4.IDENTITY
    })

    if (scene.clampToHeightSupported) {
      tileset.initialTilesLoaded.addEventListener(start)
    } else {
      window.alert('This browser does not support clampToHeight.')
    }

    function start() {
      clock.shouldAnimate = true
      var objectsToExclude = [entity]
      scene.postRender.addEventListener(function () {
        var position = positionProperty.getValue(clock.currentTime)
        // console.log(position, 1);
        entity.position = scene.clampToHeight(position, objectsToExclude)
        // console.log(scene.clampToHeight(position, objectsToExclude), 2);
      })
    }
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '紧贴3DTiles')
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
