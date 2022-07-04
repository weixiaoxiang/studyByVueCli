<template>
  <div id="cesiumContainer">
    <el-select v-model="value" placeholder="请选择" @change="change">
      <el-option label="Draw Lines" value="Draw Lines"> </el-option>
      <el-option label="Draw Polygons" value="Draw Polygons"> </el-option>
    </el-select>
  </div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      viewer: null,
      activeShapePoints: [],
      activeShape: undefined,
      floatingPoint: undefined,
      drawingMode: 'line',
      value: 'Draw Lines'
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  watch: {},
  mounted() {
    const that = this
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain(),
      selectionIndicator: false, // 选择指示器
      infoBox: false
    })

    if (!this.viewer.scene.pickPositionSupported) {
      window.alert('This browser does not support pickPosition.')
    }

    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )
    var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas)
    handler.setInputAction((event) => {
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      // we get the correct point when mousing over terrain.
      var earthPosition = this.viewer.scene.pickPosition(event.position)
      // `earthPosition` will be undefined if our mouse is not over the globe.
      if (Cesium.defined(earthPosition)) {
        if (this.activeShapePoints.length === 0) {
          this.floatingPoint = this.createPoint(earthPosition)
          this.activeShapePoints.push(earthPosition)
          var dynamicPositions = new Cesium.CallbackProperty(() => {
            if (this.drawingMode === 'polygon') {
              return new Cesium.PolygonHierarchy(this.activeShapePoints)
            }
            return this.activeShapePoints
          }, false)
          this.activeShape = this.drawShape(dynamicPositions)
        }
        this.activeShapePoints.push(earthPosition)
        this.createPoint(earthPosition)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((event) => {
      if (Cesium.defined(this.floatingPoint)) {
        var newPosition = this.viewer.scene.pickPosition(event.endPosition)
        if (Cesium.defined(newPosition)) {
          this.floatingPoint.position.setValue(newPosition)
          this.activeShapePoints.pop()
          this.activeShapePoints.push(newPosition)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // Redraw the shape so it's not dynamic and remove the dynamic shape.

    handler.setInputAction((event) => {
      this.terminateShape()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    this.viewer.camera.lookAt(
      Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
      new Cesium.Cartesian3(5000.0, 5000.0, 5000.0)
    )
    this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '线面的绘制')
    },
    createPoint(worldPosition) {
      var point = this.viewer.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.YELLOW,
          pixelSize: 5,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      })
      return point
    },
    drawShape(positionData) {
      var shape
      if (this.drawingMode === 'line') {
        shape = this.viewer.entities.add({
          polyline: {
            positions: positionData,
            clampToGround: true,
            width: 3
          }
        })
      } else if (this.drawingMode === 'polygon') {
        shape = this.viewer.entities.add({
          polygon: {
            hierarchy: positionData,
            material: new Cesium.ColorMaterialProperty(
              Cesium.Color.WHITE.withAlpha(0.7)
            )
          }
        })
      }
      return shape
    },
    terminateShape() {
      this.activeShapePoints.pop()
      this.drawShape(this.activeShapePoints)
      this.viewer.entities.remove(this.floatingPoint)
      this.viewer.entities.remove(this.activeShape)
      this.floatingPoint = undefined
      this.activeShape = undefined
      this.activeShapePoints = []
    },
    change(val) {
      if (val === 'Draw Lines') {
        this.terminateShape()
        this.drawingMode = 'line'
      } else {
        this.terminateShape()
        this.drawingMode = 'polygon'
      }
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
  }
}
</style>
