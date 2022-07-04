<template>
  <div id="mapdiv">
    <div id="progress"></div>
  </div>
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
  created() {
    this.changeActiveTitle()
  },
  mounted() {
    function Progress(el) {
      this.el = el
      this.loading = 0
      this.loaded = 0
    }

    Progress.prototype.addLoading = function () {
      if (this.loading === 0) {
        this.show()
      }
      ++this.loading
      this.update()
    }

    Progress.prototype.addLoaded = function () {
      const this_ = this
      setTimeout(function () {
        ++this_.loaded
        this_.update()
      }, 100)
    }

    Progress.prototype.update = function () {
      const width = ((this.loaded / this.loading) * 100).toFixed(1) + '%'
      this.el.style.width = width
      if (this.loading === this.loaded) {
        this.loading = 0
        this.loaded = 0
        const this_ = this
        setTimeout(function () {
          this_.hide()
        }, 500)
      }
    }

    Progress.prototype.show = function () {
      this.el.style.visibility = 'visible'
    }

    Progress.prototype.hide = function () {
      if (this.loading === this.loaded) {
        this.el.style.visibility = 'hidden'
        this.el.style.width = 0
      }
    }

    const progress = new Progress(document.getElementById('progress'))

    const source = new OSM()

    source.on('tileloadstart', function () {
      progress.addLoading()
    })

    source.on('tileloadend', function () {
      progress.addLoaded()
    })
    source.on('tileloaderror', function () {
      progress.addLoaded()
    })
    this.map = new Map({
      layers: [
        new TileLayer({
          source: source
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
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '地图加载事件，底部出现加载状态条')
    }
  }
}
</script>
<style lang="less" scoped>
#mapdiv {
  position: relative;
  width: 100%;
  height: 100%;
}

#progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 10px;
  background: rgba(0, 60, 136, 0.4);
  width: 0;
  transition: width 250ms;
  z-index: 99999;
}
</style>
