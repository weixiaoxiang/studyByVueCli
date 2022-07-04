<template>
  <div id="map"></div>
</template>
<script>
import 'ol/ol.css'
import KML from 'ol/format/KML'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import View from 'ol/View'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      map: null,
      publicPath: process.env.BASE_URL
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
    // 监听地图div大小是否发生变化
    mapUpdateSize(newVal, oldVal) {
      setTimeout(() => {
        this.map.updateSize()
      }, 400)
    }
  },
  mounted() {
    const vector = new VectorLayer({
      source: new VectorSource({
        url: this.publicPath + 'data/2012-02-10.kml', // 加载public根目录文件 使用process.env.BASE_URL 防止webpack打包失败
        format: new KML()
      })
    })

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vector
      ],
      target: 'map',
      view: new View({
        center: [876970.8463461736, 5859807.853963373],
        projection: 'EPSG:3857',
        zoom: 10
      })
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '加载public根目录kml文件,使用process.env.BASE_URL 防止webpack打包失败'
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
