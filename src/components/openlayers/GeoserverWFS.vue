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
import { Vector as VectorSource, OSM } from 'ol/source'
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
      result: null,
      obj: {}
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
      type: 'warning'
    })
    this.initOlMap()
  },
  methods: {
    initOlMap() {
      this.view = new View({
        projection: 'EPSG:3857',
        center: [13154688.633302402, 3660466.09726005], // 芜湖市
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
      // 加载芜湖路线底图
      const wuhulayer = new ImageLayer({
        source: new ImageWMS({
          ratio: 1,
          url: 'http://localhost:8083/geoserver/wuhu/wms',
          crossOrigin: 'anonymous', // 跨域声明
          params: {
            FORMAT: 'image/png',
            VERSION: '1.1.1', // 很重要！！！！！！
            exceptions: 'application/vnd.ogc.se_inimage',
            LAYERS: 'wuhu:wuhutest_roads'
          }
        })
      })
      this.map.addLayer(wuhulayer)
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
          this.obj = {
            x1: startCoord[0],
            y1: startCoord[1],
            x2: destCoord[0],
            y2: destCoord[1]
          }
          if (this.wfsvectorlayer instanceof VectorLayer) {
            this.map.removeLayer(this.wfsvectorlayer)
          }
          this.wfsvectorSource = new VectorSource({
            format: new GeoJSON(),
            url: extent => {
              return `http://localhost:8083/geoserver/wuhu/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=wuhu:wuhu1&maxFeatures=50&outputFormat=application/json&viewparams=x1:${this.obj.x1};y1:${this.obj.y1};
	x2:${this.obj.x2};y2:${this.obj.y2}`
            },
            strategy: bboxStrategy
          })

          this.wfsvectorlayer = new VectorLayer({
            source: this.wfsvectorSource,
            style: f => {
              console.log(f)
              return new Style({
                stroke: new Stroke({
                  color: 'red',
                  width: 10
                })
              })
            }
          })
          this.map.addLayer(this.wfsvectorlayer)
        }
      })
    },
    // 清除路径
    remove() {
      // 将起始点要素和目标点要素的坐标信息清空
      this.startPoint.setGeometry(null)
      this.destPoint.setGeometry(null)
      // 移除结果路径
      this.wfsvectorSource.clear()
      this.obj = {
        x1: null,
        y1: null,
        x2: null,
        y2: null
      }
    },
    changeActiveTitle() {
      // https://zhuanlan.zhihu.com/p/121602526
      this.$store.commit(
        'changeActiveTitle',
        'gerserver连接postgis发布wms地图服务，建立sql视图，通过WFS请求pgrouting查询最短路径(原文:https://zhuanlan.zhihu.com/p/121602526)'
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
