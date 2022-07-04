<template>
  <div id="mapdiv"></div>
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
export default {
  data() {
    return {
      map: null,
      view: null
    }
  },
  created() {},
  mounted() {
    this.initOlMap()
  },
  methods: {
    initOlMap() {
      this.view = new View({
        projection: 'EPSG:4326',
        center: [117.485993, 30.664878], // 池州市
        zoom: 10,
        minZoom: 8,
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
        })
      })
      const source = new VectorSource({
        wrapX: false
      })
      const vector = new VectorLayer({
        source: source
      })
      this.map.addLayer(vector)

      const tdResult = tianditu()
      this.map.addLayer(tdResult.tileSatellite)
      this.map.addLayer(tdResult.tileMark)

      this.map.on('singleclick', this.singleclickEvent)
    },
    singleclickEvent(e) {
      // console.log(e.coordinate);
      var out = toStringXY(e.coordinate, 6)
      console.log(out)
    }
  }
}
</script>

<style lang="less" scoped>
#mapdiv {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
