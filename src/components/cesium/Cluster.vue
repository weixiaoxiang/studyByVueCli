<!--
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑       永不宕机     永无BUG
 *
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-08-30 09:16:39
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-30 09:20:44
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
    var viewer = new Cesium.Viewer('cesiumContainer', {
      // terrainProvider: Cesium.createWorldTerrain(),
      animation: false, // 动画部件
      baseLayerPicker: false, // 图层选择控件
      fullscreenButton: false, // 全屏控件
      vrButton: false, // vr
      geocoder: false, // 地点搜索
      homeButton: false, // 视图重置
      infoBox: true, // 详情弹框
      sceneModePicker: false, // 二三维切换
      selectionIndicator: false, // 指示器
      timeline: false, // 时间线
      navigationHelpButton: false, // 帮助
      navigationInstructionsInitiallyVisible: false,
      shadows: true, // 太阳折射阴影
      shouldAnimate: true // 默认开启动画
    })
    const scene = viewer.scene
    scene.globe.depthTestAgainstTerrain = false // 关闭深度监测
    var geoJsonDataSource = new Cesium.GeoJsonDataSource()
      .load('/data/SampleData/gyqy.geojson')
      .then((dataSource) => {
        var entities = dataSource.entities.values
        // 设置初始的billboard图标
        entities.forEach((entity) => {
          entity.billboard.image = '/data/SampleData/qy.png'
          entity.billboard.width = 24
          entity.billboard.height = 24
        })
        var pixelRange = 25
        var minimumClusterSize = 2
        var enabled = true
        dataSource.clustering.enabled = enabled
        dataSource.clustering.pixelRange = pixelRange
        dataSource.clustering.minimumClusterSize = minimumClusterSize
        var removeListener

        function customStyle() {
          if (Cesium.defined(removeListener)) {
            removeListener()
            removeListener = undefined
          } else {
            removeListener =
              dataSource.clustering.clusterEvent.addEventListener(function (
                clusteredEntities,
                cluster
              ) {
                cluster.billboard.show = true
                cluster.label.show = true
                cluster.label.eyeOffset = new Cesium.Cartesian3(0, 0, -10)
                cluster.label.style = Cesium.LabelStyle.FILL
                cluster.label.fillColor = Cesium.Color.BLUE
                cluster.billboard.id = cluster.label.id
                cluster.billboard.horizontalOrigin =
                  Cesium.HorizontalOrigin.CENTER
                cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER
                cluster.billboard.verticalOrigin =
                  Cesium.HorizontalOrigin.CENTER
                cluster.label.verticalOrigin = Cesium.HorizontalOrigin.CENTER
                if (clusteredEntities.length >= 50) {
                  cluster.billboard.image = '/data/SampleData/cluster1.png'
                  cluster.label.scale = 0.7
                } else if (clusteredEntities.length >= 40) {
                  cluster.billboard.image = '/data/SampleData/cluster2.png'
                  cluster.label.scale = 0.6
                } else {
                  cluster.billboard.image = '/data/SampleData/cluster3.png'
                  cluster.label.scale = 0.5
                }
              })
          }
          var pixelRange = dataSource.clustering.pixelRange
          dataSource.clustering.pixelRange = 0
          dataSource.clustering.pixelRange = pixelRange
        }
        customStyle()
        // 将数据添加到viewer中
        viewer.dataSources.add(dataSource)
        viewer.zoomTo(dataSource)
      })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '点聚合')
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
