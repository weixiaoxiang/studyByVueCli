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
 * @Date: 2021-08-30 09:53:43
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-30 09:53:47
 -->

<template>
  <div id="cesiumContainer">
    <el-button @click="btn">点击查看</el-button>
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
      heatMap: null
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  watch: {},
  mounted() {
    this.viewer = new Cesium.Viewer('cesiumContainer', {
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
  },
  created() {
    this.changeActiveTitle()
    // 创建script标签，引入外部文件
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'data/CesiumHeatmap.js'
    document.getElementsByTagName('head')[0].appendChild(script)
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '初始化cesium')
    },
    btn() {
      // 矩形坐标
      var bounds = {
        west: -109.0,
        south: 30.0,
        east: -80.0,
        north: 40.0
      }

      var bounds2 = {
        west: -109.0,
        south: 40.0,
        east: -80.0,
        north: 50.0
      }

      // 初始化CesiumHeatmap
      this.heatMap = CesiumHeatmap.create(
        this.viewer, // 视图层
        bounds, // 矩形坐标
        {
          // heatmap相应参数
          maxOpacity: 0.5,
          minOpacity: 0,
          blur: 0.75
        }
      )

      var sourceData = this.getData(300)

      // 添加数据 最小值，最大值，数据集
      this.heatMap.setWGS84Data(0, 100, sourceData)
      this.viewer.zoomTo(this.viewer.entities)
      var times = 0

      setInterval(() => {
        times++
        if (times % 2 === 0) {
          this.heatMap.changeBounds(bounds)
          this.heatMap.setWGS84Data(0, 100, sourceData)
        } else {
          this.heatMap.changeBounds(bounds2)
          this.heatMap.setWGS84Data(0, 100, sourceData)
        }
      }, 2000)
    },
    // 动态数据 [{x: -97.6433525165054, y: 45.61443064377248, value: 11.409122369106317}]
    getData(length) {
      var data = []
      for (var i = 0; i < length; i++) {
        var x = Math.random() * (-109 + 80) - 80
        var y = Math.random() * (50 - 30) + 30
        var value = Math.random() * 100
        data.push({
          x: x,
          y: y,
          value: value,
          radius: 200
        })
      }
      return data
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

.el-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
}
</style>
