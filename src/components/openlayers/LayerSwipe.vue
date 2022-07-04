<template>
  <div id="map">
    <el-slider v-model="value" @input="inputValue"></el-slider>
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
import { fromLonLat } from 'ol/proj'
import { getRenderPixel } from 'ol/render'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      map: null,
      value: 50
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
    imagery.on('prerender', (event) => {
      const ctx = event.context
      const mapSize = this.map.getSize()
      const width = mapSize[0] * (this.value / 100)
      const tl = getRenderPixel(event, [width, 0])
      const tr = getRenderPixel(event, [mapSize[0], 0])
      const bl = getRenderPixel(event, [width, mapSize[1]])
      const br = getRenderPixel(event, mapSize)

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(tl[0], tl[1])
      ctx.lineTo(bl[0], bl[1])
      ctx.lineTo(br[0], br[1])
      ctx.lineTo(tr[0], tr[1])
      ctx.closePath()
      ctx.clip()
    })
    imagery.on('postrender', (event) => {
      const ctx = event.context
      ctx.restore()
    })
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '图层滑动,通过地图的prerender、postrender渲染事件实现'
      )
    },
    inputValue(value) {
      this.value = value
      this.map.render()
    }
  }
}
</script>
<style lang="less" scoped>
#map {
  position: relative;
  width: 100%;
  height: 100%;

  .el-slider {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1;
  }
}
</style>
