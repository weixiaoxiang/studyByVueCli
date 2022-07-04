<template>
  <div id="map"></div>
</template>
<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import { OSM, Stamen, Vector as VectorSource } from 'ol/source'
import {
  Image as ImageLayer,
  Tile as TileLayer,
  Vector as VectorLayer
} from 'ol/layer'
import View from 'ol/View'
import Point from 'ol/geom/Point'
import { Icon, Stroke, Style } from 'ol/style'
import Draw from 'ol/interaction/Draw'
import { defaults } from 'ol/control'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, transformExtent } from 'ol/proj'
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
    const source = new VectorSource()
    const styleFunction = function (feature) {
      const geometry = feature.getGeometry()
      const styles = [
        // linestring
        new Style({
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2
          })
        })
      ]

      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0]
        const dy = end[1] - start[1]
        const rotation = Math.atan2(dy, dx)
        // arrows
        styles.push(
          new Style({
            geometry: new Point(end),
            image: new Icon({
              src: '/data/arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation
            })
          })
        )
      })

      return styles
    }
    const vector = new VectorLayer({
      source: source,
      style: styleFunction
    })
    this.map.addLayer(vector)

    this.map.addInteraction(
      new Draw({
        source: source,
        type: 'LineString'
      })
    )
  },
  destroyed() {},
  methods: {
    activeTitleChange() {
      this.$store.commit('changeActiveTitle', '画小箭头')
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
