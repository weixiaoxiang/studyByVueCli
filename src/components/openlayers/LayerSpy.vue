<template>
  <div id="map"></div>
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
    const source = new OSM()
    const roads = new TileLayer({
      source: source
    })
    const imagery = new TileLayer({
      source: new Stamen({
        layer: 'toner'
      })
    })
    const container = document.getElementById('map')
    this.map = new Map({
      layers: [roads, imagery],
      target: container,
      view: new View({
        center: fromLonLat([-109, 46.5]),
        zoom: 6
      })
    })

    let radius = 75
    document.addEventListener('keydown', (evt) => {
      if (evt.which === 38) {
        radius = Math.min(radius + 5, 150)
        this.map.render()
        evt.preventDefault()
      } else if (evt.which === 40) {
        radius = Math.max(radius - 5, 25)
        this.map.render()
        evt.preventDefault()
      }
    })

    // get the pixel position with every move
    let mousePosition = null

    container.addEventListener('mousemove', (event) => {
      mousePosition = this.map.getEventPixel(event)
      this.map.render()
    })

    container.addEventListener('mouseout', (event) => {
      mousePosition = null
      this.map.render()
    })

    // before rendering the layer, do some clipping
    imagery.on('prerender', (event) => {
      const ctx = event.context
      ctx.save()
      ctx.beginPath()
      if (mousePosition) {
        // only show a circle around the mouse
        const pixel = getRenderPixel(event, mousePosition)
        const offset = getRenderPixel(event, [
          mousePosition[0] + radius,
          mousePosition[1]
        ])
        const canvasRadius = Math.sqrt(
          Math.pow(offset[0] - pixel[0], 2) + Math.pow(offset[1] - pixel[1], 2)
        )
        ctx.arc(pixel[0], pixel[1], canvasRadius, 0, 2 * Math.PI)
        ctx.lineWidth = (5 * canvasRadius) / radius
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.stroke()
      }
      ctx.clip()
    })

    // after rendering the layer, restore the canvas context
    imagery.on('postrender', (event) => {
      const ctx = event.context
      ctx.restore()
    })
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '在当前图层上查看另一个图层,试试看按下‘↑’或者‘↓’'
      )
    }
  }
}
</script>
<style lang="less" scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
