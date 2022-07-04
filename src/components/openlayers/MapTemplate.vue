<template>
  <div id="mapdiv"></div>
</template>
<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import { OSM, Stamen } from 'ol/source'
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer'
import View from 'ol/View'
import { defaults } from 'ol/control'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import { getRenderPixel } from 'ol/render'
import { mapState } from 'vuex'
export default {
  filters: {},
  data() {
    return {
      map: null
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
  },
  created() {
    this.changeActiveTitle()
  },
  mounted() {
    const osm = new TileLayer({
      source: new OSM()
    })
    const imagery = new TileLayer({
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

    this.map.on('pointermove', function (e) {
      const pixel = this.map.getEventPixel(e.originalEvent)
      const hit = this.map.hasFeatureAtPixel(pixel)
      this.map.getTarget().style.cursor = hit ? 'pointer' : ''
    })
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '创建模板')
    }
  }
}
</script>
<style lang="less" scoped>
#mapdiv {
  height: 100%;
}
</style>
