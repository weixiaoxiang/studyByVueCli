<template>
  <div id="map">
    <el-switch
      v-model="value"
      active-text="是否启用平滑"
      active-color="#13ce66"
      inactive-color="#ff4949"
      @change="changeValue"
    >
    </el-switch>
  </div>
</template>
<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import View from 'ol/View'
import { defaults } from 'ol/control'

import Static from 'ol/source/ImageStatic'
import proj4 from 'proj4'
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer'
import { getCenter } from 'ol/extent'
import { register } from 'ol/proj/proj4'
import { transform } from 'ol/proj'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      map: null,
      value: true,
      source: null,
      imageLayer: null,
      imageExtent: []
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle,
      // 判断地图div大小是否发生变化
      mapUpdateSize: (state) => state.mapUpdateSize
    })
  },
  watch: {
    // 监听地图div大小是否发生变化
    mapUpdateSize(newVal, oldVal) {
      setTimeout(() => {
        this.map.updateSize()
      }, 400)
    }
    // value(newVal, oldVal) {
    //     console.log(newVal, oldVal);
    // }
  },
  mounted() {
    proj4.defs(
      'EPSG:27700',
      '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
        '+x_0=400000 +y_0=-100000 +ellps=airy ' +
        '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
        '+units=m +no_defs'
    )
    register(proj4)
    this.imageExtent = [0, 0, 700000, 1300000]
    this.imageLayer = new ImageLayer()
    const source = new OSM()
    this.map = new Map({
      layers: [
        new TileLayer({
          source: source
        }),
        this.imageLayer
      ],
      target: 'map',
      view: new View({
        projection: 'EPSG:3857',
        center: transform(
          getCenter(this.imageExtent),
          'EPSG:27700',
          'EPSG:3857'
        ),
        zoom: 4
      }),
      // 去掉默认的控件
      controls: defaults({
        attribution: false,
        zoom: false
      })
    })

    this.setSource()
    this.map.on('click', (e) => {
      console.log(e.coordinate)
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '图像重投影，自定义27700坐标系')
    },
    changeValue(value) {
      this.value = value
      this.setSource()
    },
    setSource() {
      this.source = new Static({
        url:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/' +
          'British_National_Grid.svg/2000px-British_National_Grid.svg.png',
        crossOrigin: '',
        projection: 'EPSG:27700',
        imageExtent: this.imageExtent,
        imageSmoothing: this.value // 图像是否平滑
      })
      this.imageLayer.setSource(this.source)
    }
  }
}
</script>
<style lang="less" scoped>
#map {
  position: relative;
  width: 100%;
  height: 100%;

  .el-switch {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 9999;
  }
}
</style>
