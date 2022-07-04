<template>
  <div id="mapdiv"></div>
</template>
<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Cluster from 'ol/source/Cluster'
import {
  Style,
  Circle as CircleStyle,
  Stroke,
  Fill,
  Text,
  RegularShape
} from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
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
    const _this = this

    function addFeatures(nb) {
      var ext = _this.map.getView().calculateExtent(_this.map.getSize())
      var features = []
      for (var i = 0; i < nb; ++i) {
        features[i] = new Feature(
          new Point([
            ext[0] + (ext[2] - ext[0]) * Math.random(),
            ext[1] + (ext[3] - ext[1]) * Math.random()
          ])
        )
        features[i].set('id', i)
      }
      clusterSource.getSource().clear()
      clusterSource.getSource().addFeatures(features)
    }
    var styleCache = {}

    function getStyle(feature, resolution) {
      var size = feature.get('features').length
      var style = styleCache[size]
      if (!style) {
        var color = size > 25 ? '192,0,0' : size > 8 ? '255,128,0' : '0,128,0'
        var radius = Math.max(8, Math.min(size * 0.75, 20))
        var dash = (2 * Math.PI * radius) / 6
        var dash = [0, dash, dash, dash, dash, dash, dash]
        style = styleCache[size] = new Style({
          image: new CircleStyle({
            radius: radius,
            stroke: new Stroke({
              color: 'rgba(' + color + ',0.5)',
              width: 15,
              lineDash: dash,
              lineCap: 'butt'
            }),
            fill: new Fill({
              color: 'rgba(' + color + ',1)'
            })
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: '#fff'
            })
          })
        })
      }
      return style
    }
    var clusterSource = new Cluster({
      distance: 100,
      source: new VectorSource()
    })
    var clusterLayer = new ol.layer.AnimatedCluster({
      name: 'Cluster',
      source: clusterSource,
      animationDuration: 700,
      style: getStyle
    })
    this.map.addLayer(clusterLayer)
    addFeatures(2000)

    var style = [
      new Style({
        image: new ol.style.Shadow({
          radius: 15
        }),
        stroke: new Stroke({
          color: [0, 0, 0, 0.3],
          width: 2
        }),
        fill: new Fill({
          color: [0, 0, 0, 0.3]
        }),
        zIndex: -1
      }),
      new Style({
        /* image: new ol.style.Icon({ src:"data/camera.png", scale: 0.8 }), */
        image: new RegularShape({
          radius: 10,
          radius2: 5,
          points: 5,
          fill: new Fill({
            color: 'blue'
          })
        }),
        stroke: new Stroke({
          color: [0, 0, 255],
          width: 2
        }),
        fill: new Fill({
          color: [0, 0, 255, 0.3]
        })
      })
    ]
    style[1].getImage().getAnchor()[1] += 10
    var source = new ol.source.Vector()
    var vector = new ol.layer.Vector({
      source: source,
      style: style // function() { return style }
    })
    console.dir(ol.layer.Vector)
    this.map.addLayer(vector)

    function addFeatureAt(p) {
      var f
      var r = _this.map.getView().getResolution() * 10
      f = new Feature(new Point(p))
      vector.getSource().addFeature(f)
      vector.animateFeature(f, [
        new ol.featureAnimation['Drop']({
          speed: 9,
          duration: 2000,
          side: true
        }),
        new ol.featureAnimation['Slide']({
          speed: 9,
          duration: 2000,
          horizontal: false
        })
      ])
    }

    function add10() {
      vector.getSource().clear()
      var ex = _this.map.getView().calculateExtent(_this.map.getSize())
      for (var i = 0; i < 10; i++) {
        setTimeout(function () {
          addFeatureAt([
            ex[0] + Math.random() * (ex[2] - ex[0]),
            ex[1] + Math.random() * (ex[3] - ex[1])
          ])
        }, 100 * i)
      }
    }
    add10()
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
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '使用ol-ext')
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
