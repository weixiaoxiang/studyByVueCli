<template>
  <div id="map">
    <div>
      <el-button
        v-for="(value, key, index) in extent"
        :key="index"
        type="primary"
        size="mini"
        @click="setExtent(value)"
      >{{ key }}</el-button>
    </div>
  </div>
</template>
<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import { OSM, Stamen } from 'ol/source'
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer'
import View from 'ol/View'
import { defaults } from 'ol/control'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, transformExtent } from 'ol/proj'
import { getRenderPixel } from 'ol/render'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      map: null,
      extent: {
        India: transformExtent([68.17665, 7.96553, 97.40256, 35.49401], 'EPSG:4326', 'EPSG:3857'),
        Argentina: transformExtent(
          [-73.41544, -55.25, -53.62835, -21.83231],
          'EPSG:4326',
          'EPSG:3857'
        ),
        Nigeria: transformExtent([2.6917, 4.24059, 14.57718, 13.86592], 'EPSG:4326', 'EPSG:3857'),
        Sweden: transformExtent([11.02737, 55.36174, 23.90338, 69.10625], 'EPSG:4326', 'EPSG:3857')
      }
    }
  },
  computed: {
    ...mapState({
      activeTitle: state => state.activeTitle,
      // 判断地图div大小是否发生变化
      mapUpdateSize: state => state.mapUpdateSize
    })
  },
  watch: {
    mapUpdateSize(newvalue, oldvalue) {
      setTimeout(() => {
        this.map.updateSize()
      }, 400)
    }
  },
  created() {
    this.activeTitleChange()
  },
  mounted() {
    const osm = new TileLayer({
      source: new OSM()
    })
    const imagery = new TileLayer({
      extent: this.extent.India,
      source: new Stamen({
        layer: 'toner'
      })
    })

    this.map = new Map({
      layers: [osm, imagery],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2
      }),
      controls: defaults({
        attribution: false
      })
    })
  },
  destroyed() {
    this.$destroy()
    this.$el.remove()
  },
  methods: {
    activeTitleChange() {
      this.$store.commit('changeActiveTitle', '定义图层的extent,来限定地图的显示范围')
    },
    setExtent(extent) {
      var layer = this.map.getLayers().item(1)
      layer.setExtent(extent)
    }
  }
}
</script>
<style lang="less" scoped>
#map {
  position: relative;
  width: 100%;
  height: 100%;

  > div {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 1;
  }
}
</style>
