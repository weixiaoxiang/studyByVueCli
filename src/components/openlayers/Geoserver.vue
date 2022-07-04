<template>
  <div id="mapdiv">
    <el-button type="primary" @click="remove">清除路径</el-button>
  </div>
</template>

<script>
import { tianditu } from '@utils/OLImports'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { Fill, Stroke, Style } from 'ol/style'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource, OSM, TileWMS } from 'ol/source'
import { toStringXY } from 'ol/coordinate'
import * as olControl from 'ol/control'
import * as olInteraction from 'ol/interaction'
import { transform } from 'ol/proj'
import { mapState } from 'vuex'
import Feature from 'ol/Feature'
import ImageLayer from 'ol/layer/Image'
import { Point } from 'ol/geom'
import ImageWMS from 'ol/source/ImageWMS'
import GeoJSON from 'ol/format/GeoJSON'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'
export default {
  data() {
    return {
      map: null,
      view: null,
      startPoint: null,
      destPoint: null,
      result: null
    }
  },
  created() {
    this.changeActiveTitle()
  },
  computed: {
    ...mapState({
      activeTitle: state => state.activeTitle,
      // 判断地图div大小是否发生变化
      mapUpdateSize: state => state.mapUpdateSize
    })
  },
  mounted() {
    // 提示
    this.$notify({
      title: '警告',
      message: '需要开启本机geoserver和postgresql服务',
      // type: 'warning',
      iconClass: 'el-icon-eleme'
    })
    this.initOlMap()
  },
  methods: {
    initOlMap() {
      this.view = new View({
        projection: 'EPSG:3857',
        center: [13154688.633302402, 3660466.09726005], // 芜湖
        zoom: 10,
        minZoom: 3,
        maxZoom: 18,
        constrainResolution: true
      })
      this.map = new Map({
        target: 'mapdiv',
        view: this.view,
        maxTilesLoading: 160,
        controls: olControl.defaults({
          zoom: false,
          rotate: false,
          attribution: false
        }),
        interactions: olInteraction.defaults({
          doubleClickZoom: false
        }),
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ]
      })
      // 加载深圳路线底图
      const shenzhenlayer = new ImageLayer({
        source: new ImageWMS({
          ratio: 1,
          url: 'http://localhost:8083/geoserver/wuhu/wms',
          crossOrigin: 'anonymous', // 跨域声明
          params: {
            FORMAT: 'image/png',
            VERSION: '1.1.1', // 很重要！！！！！！
            LAYERS: 'wuhu:wuhutest_roads'
          }
        })
      })
      this.map.addLayer(shenzhenlayer)
      // 初始化起始点要素和目标点要素
      this.startPoint = new Feature()
      this.destPoint = new Feature()

      // 用于包含起始点要素和目标点要素的图层
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [this.startPoint, this.destPoint]
        })
      })
      this.map.addLayer(vectorLayer)
      this.map.on('singleclick', event => {
        if (this.startPoint.getGeometry() == null) {
          // 设置起始点要素的坐标信息
          this.startPoint.setGeometry(new Point(event.coordinate))
        } else if (this.destPoint.getGeometry() == null) {
          // 设置目标点要素的坐标信息
          this.destPoint.setGeometry(new Point(event.coordinate))
          var startCoord = this.startPoint.getGeometry().getCoordinates()
          var destCoord = this.destPoint.getGeometry().getCoordinates()
          // 设置GeoServer的SQL视图的请求参数
          var viewparams = [
            'x1:' + startCoord[0],
            'y1:' + startCoord[1],
            'x2:' + destCoord[0],
            'y2:' + destCoord[1]
          ]
          viewparams = viewparams.join(';')
          // 向GeoServer发送WMS请求，并将结果路径渲染出来
          this.result = new ImageLayer({
            source: new ImageWMS({
              url: 'http://localhost:8083/geoserver/wuhu/wms',
              params: {
                LAYERS: 'wuhu:wuhutest',
                FORMAT: 'image/png',
                VERSION: '1.1.1',
                SRS: 'EPSG:3857',
                STYLE: 'wuhu:line-green',
                viewparams
              }
            })
          })
          this.map.addLayer(this.result)
        }
      })
    },
    // 清除路径
    remove() {
      // 将起始点要素和目标点要素的坐标信息清空
      this.startPoint.setGeometry(null)
      this.destPoint.setGeometry(null)
      // 移除结果路径图层
      this.map.removeLayer(this.result)
    },
    changeActiveTitle() {
      // https://zhuanlan.zhihu.com/p/121602526
      this.$store.commit(
        'changeActiveTitle',
        'gerserver连接postgis发布wms地图服务，通过新建sql视图，pgrouting查询最短路径(原文:https://zhuanlan.zhihu.com/p/121602526)'
      )
    }
  }
}
</script>

<style lang="less" scoped>
#mapdiv {
  width: 100%;
  height: 100%;
  position: relative;
  .el-button {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
  }
}
</style>
