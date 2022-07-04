<template>
  <div id="mapdiv"></div>
</template>
<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import { defaults } from 'ol/control'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      map: null
    }
  },
  mounted() {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      target: 'mapdiv',
      view: new View({
        center: [0, 0],
        zoom: 2
      }),
      // 去掉默认的控件
      controls: defaults({
        attribution: false,
        zoom: false
      })
    })
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
  watch: {
    // 监听地图div大小是否发生变化
    mapUpdateSize(newVal, oldVal) {
      setTimeout(() => {
        this.map.updateSize()
      }, 400)
    }
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '绑定Div')
    }
  }
}
</script>
<style lang="less" scoped>
#mapdiv {
  width: 100%;
  height: 100%;
}
</style>
