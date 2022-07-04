<template>
  <div id="cesiumContainer">
    <el-select
      v-model="value"
      :popper-append-to-body="false"
      placeholder="请选择"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
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
      value: 'Draw Point with Label',
      options: [
        {
          value: 'Draw Point with Label',
          label: 'Draw Point with Label',
          select: () => {
            this.select1()
          }
        },
        {
          value: 'Draw Billboard',
          label: 'Draw Billboard',
          select: () => {
            this.select2()
          }
        },
        {
          value: 'Draw Corridor',
          label: 'Draw Corridor',
          select: () => {
            this.select3()
          }
        },
        {
          value: 'Draw Polygon',
          label: 'Draw Polygon',
          select: () => {
            this.select4()
          }
        },
        {
          value: 'Draw Textured Polygon',
          label: 'Draw Textured Polygon',
          select: () => {
            this.select5()
          }
        },
        {
          value: 'Draw Rectangle',
          label: 'Draw Rectangle',
          select: () => {
            this.select6()
          }
        },
        {
          value: 'Draw Model',
          label: 'Draw Model',
          select: () => {
            this.select7()
          }
        },
        {
          value: 'Sample line positions and draw with depth test disabled',
          label: 'Sample line positions and draw with depth test disabled',
          select: () => {
            this.select8()
          }
        },
        {
          value: 'Draw polyline on terrain',
          label: 'Draw polyline on terrain',
          select: () => {
            this.select9()
          }
        }
      ]
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
      terrainProvider: Cesium.createWorldTerrain()
    })
    this.viewer.scene.globe.depthTestAgainstTerrain = true
    this.select1()
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '根据高程来裁切图元，深度监测的研究,sampleTerrain()可以获得地形的高度'
      )
    },
    change() {
      console.log(this.value)
      this.viewer.entities.removeAll()
      this.options
        .filter((item) => {
          return item.value === this.value
        })[0]
        .select()
    },
    select1() {
      var e = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-122.1958, 46.1915),
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 10,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 3,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: 'Clamped to ground',
          font: '14pt sans-serif',
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          // 垂直方向上的原点
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          // 字体颜色
          fillColor: Cesium.Color.BLACK,
          // 开启背景
          showBackground: true,
          // 背景颜色
          backgroundColor: new Cesium.Color(1, 1, 1, 0.7),
          // 背景内边距
          backgroundPadding: new Cesium.Cartesian2(8, 4),
          // 设置label是否开启深度监测 0开启    Number.POSITIVE_INFINITY不开启
          disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
        }
      })
      this.viewer.trackedEntity = e
    },
    select2() {
      var e = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-122.1958, 46.1915),
        billboard: {
          image: '/data/Sandcastle/images/facility.gif',
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      })

      this.viewer.trackedEntity = e
    },
    select3() {
      var e = this.viewer.entities.add({
        corridor: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -122.19, 46.1914, -122.21, 46.21, -122.23, 46.21
          ]),
          width: 2000.0,
          material: Cesium.Color.GREEN.withAlpha(0.5)
        }
      })

      this.viewer.zoomTo(e)
    },
    select4() {
      var e = this.viewer.entities.add({
        polygon: {
          hierarchy: {
            positions: [
              new Cesium.Cartesian3(
                -2358138.847340281,
                -3744072.459541374,
                4581158.5714175375
              ),
              new Cesium.Cartesian3(
                -2357231.4925370603,
                -3745103.7886602185,
                4580702.9757762635
              ),
              new Cesium.Cartesian3(
                -2355912.902205431,
                -3744249.029778454,
                4582402.154378103
              ),
              new Cesium.Cartesian3(
                -2357208.0209552636,
                -3743553.4420488174,
                4581961.863286629
              )
            ]
          },
          classificationType: Cesium.ClassificationType.BOTH,
          material: Cesium.Color.BLUE.withAlpha(0.5)
        }
      })

      this.viewer.zoomTo(e)
    },
    select5() {
      if (
        !Cesium.Entity.supportsMaterialsforEntitiesOnTerrain(this.viewer.scene)
      ) {
        window.alert(
          'Terrain Entity materials are not supported on this platform'
        )
        return
      }

      var e = this.viewer.entities.add({
        polygon: {
          hierarchy: {
            positions: [
              new Cesium.Cartesian3(
                -2358138.847340281,
                -3744072.459541374,
                4581158.5714175375
              ),
              new Cesium.Cartesian3(
                -2357231.4925370603,
                -3745103.7886602185,
                4580702.9757762635
              ),
              new Cesium.Cartesian3(
                -2355912.902205431,
                -3744249.029778454,
                4582402.154378103
              ),
              new Cesium.Cartesian3(
                -2357208.0209552636,
                -3743553.4420488174,
                4581961.863286629
              )
            ]
          },
          material: '/data/Sandcastle/images/Cesium_Logo_Color.jpg',
          classificationType: Cesium.ClassificationType.TERRAIN,
          stRotation: Cesium.Math.toRadians(45)
        }
      })

      this.viewer.zoomTo(e)
    },
    select6() {
      var e = this.viewer.entities.add({
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(-122.3, 46.0, -122.0, 46.3),
          material: Cesium.Color.RED.withAlpha(0.5)
        }
      })

      this.viewer.zoomTo(e)
    },
    select7() {
      var e = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-122.1958, 46.1915),
        model: {
          uri: '/data/SampleData/models/CesiumMan/Cesium_Man.glb',
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          minimumPixelSize: 128,
          maximumScale: 100
        }
      })

      this.viewer.trackedEntity = e
    },
    select8() {
      var length = 1000

      var startLon = Cesium.Math.toRadians(86.953793)
      var endLon = Cesium.Math.toRadians(86.896497)

      var lat = Cesium.Math.toRadians(27.988257)

      var terrainSamplePositions = []
      for (var i = 0; i < length; ++i) {
        var lon = Cesium.Math.lerp(endLon, startLon, i / (length - 1))
        var position = new Cesium.Cartographic(lon, lat)
        terrainSamplePositions.push(position)
      }
      Cesium.when(
        // 在地形数据集的最大可用瓦片级别上初始化sampleTerrain()请求
        Cesium.sampleTerrainMostDetailed(
          this.viewer.terrainProvider,
          terrainSamplePositions
        ),
        (samples) => {
          var offset = 10.0
          for (var i = 0; i < samples.length; ++i) {
            samples[i].height += offset
          }
          this.viewer.entities.add({
            polyline: {
              positions:
                Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(
                  samples
                ),
              arcType: Cesium.ArcType.NONE,
              width: 5,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.ORANGE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.BLACK
              }),
              depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.RED,
                outlineWidth: 2,
                outlineColor: Cesium.Color.BLACK
              })
            }
          })
          var target = new Cesium.Cartesian3(
            300770.50872389384,
            5634912.131394585,
            2978152.2865545116
          )
          offset = new Cesium.Cartesian3(
            6344.974098678562,
            -793.3419798081741,
            2499.9508860763162
          )
          this.viewer.camera.lookAt(target, offset)
          this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        }
      )
    },
    select9() {
      if (!Cesium.Entity.supportsPolylinesOnTerrain(this.viewer.scene)) {
        window.alert('Polylines on terrain are not supported on this platform')
      }
      this.viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            86.953793, 27.928257, 86.953793, 27.988257, 86.896497, 27.988257
          ]),
          clampToGround: true,
          width: 5,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.ORANGE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK
          })
        }
      })
      var target = new Cesium.Cartesian3(
        300770.50872389384,
        5634912.131394585,
        2978152.2865545116
      )
      var offset = new Cesium.Cartesian3(
        6344.974098678562,
        -793.3419798081741,
        2499.9508860763162
      )
      this.viewer.camera.lookAt(target, offset)
      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
}

.el-select {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  height: 200px;
}

// 解决下拉框滚动条问题
.el-select/deep/.el-select-dropdown {
  height: 200px;

  .el-scrollbar {
    height: 200px;

    .el-select-dropdown__list:hover .el-scrollbar__bar.is-vertical {
      opacity: 1;
      background-color: #dddee0;
    }
  }
}
</style>
