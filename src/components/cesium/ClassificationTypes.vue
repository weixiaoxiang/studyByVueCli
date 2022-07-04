<template>
  <div id="cesiumContainer">
    <div id="toolbar">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ value }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, i) in options"
            :key="i"
            :command="item.value"
          >{{ item.value }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>|</span>
      <el-dropdown @command="handleCommand1">
        <span class="el-dropdown-link">
          {{ value1 }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, i) in options1"
            :key="i"
            :command="item.value"
          >{{ item.value }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
      polygon: null,
      polyline: null,
      value: 'Classify Both',
      value1: 'Red Material',
      options: [
        {
          value: 'Classify Both',
          select: () => {
            this.polygon.polygon.classificationType =
              Cesium.ClassificationType.BOTH
            this.polyline.polyline.classificationType =
              Cesium.ClassificationType.BOTH
          }
        },
        {
          value: 'Classify Terrain',
          select: () => {
            this.polygon.polygon.classificationType =
              Cesium.ClassificationType.TERRAIN
            this.polyline.polyline.classificationType =
              Cesium.ClassificationType.TERRAIN
          }
        },
        {
          value: 'Classify 3D Tiles',
          select: () => {
            this.polygon.polygon.classificationType =
              Cesium.ClassificationType.CESIUM_3D_TILE
            this.polyline.polyline.classificationType =
              Cesium.ClassificationType.CESIUM_3D_TILE
          }
        }
      ],
      options1: [
        {
          value: 'Red Material',
          select: () => {
            this.polygon.polygon.material = Cesium.Color.RED.withAlpha(0.5)
          }
        },
        {
          value: 'Textured Material',
          select: () => {
            this.polygon.polygon.material =
              '/data/Sandcastle/images/Cesium_Logo_Color.jpg'
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
  watch: {
    value(newval, oldval) {
      const s = this.options
        .filter((item) => {
          return item.value == newval
        })[0]
        .select()
    },
    value1(newval, oldval) {
      this.options1
        .filter((item) => {
          return item.value == newval
        })[0]
        .select()
    }
  },
  mounted() {
    const that = this
    var viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    var tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(40866)
    })
    viewer.scene.primitives.add(tileset)

    tileset.readyPromise.then(function () {
      // 包围盒
      var boundingSphere = tileset.boundingSphere

      viewer.camera.viewBoundingSphere(
        boundingSphere,
        new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius + 500.0)
      )
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    })

    this.polygon = viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromRadiansArray([
            -1.3194369277314022, 0.6988062530900625, -1.3193955980204217,
            0.6988091578771254, -1.3193931220959367, 0.698743632490865,
            -1.3194358224045408, 0.6987471965556998
          ])
        ),
        material: Cesium.Color.RED.withAlpha(0.5),
        classificationType: Cesium.ClassificationType.BOTH
      }
    })

    this.polyline = viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -75.60217330403601, 40.04102882709425, -75.59968252414251,
          40.04093615560871, -75.598020153828, 40.04079437042357,
          -75.59674934074435, 40.040816173283304, -75.59630042791713,
          40.03986900370842, -75.59563636849978, 40.03930996506271,
          -75.59492397899098, 40.03873932846581, -75.59457991226778,
          40.038392701955786, -75.59424838652453, 40.03775403572295,
          -75.59387104290336, 40.03677022167725, -75.59355000490342,
          40.03588760913535
        ]),
        width: 8,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.YELLOW,
          outlineWidth: 2,
          outlineColor: Cesium.Color.BLACK
        }),
        clampToGround: true
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
        '对单体化classification进行分类，默认为BOTH'
      )
    },
    handleCommand(command) {
      this.value = command
    },
    handleCommand1(command) {
      this.value1 = command
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

#toolbar {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  padding: 5px 8px;
  border-radius: 5px;
  color: azure;
}

.el-dropdown {
  color: azure;
}

#toolbar > span {
  margin: 0 10px;
}
</style>
