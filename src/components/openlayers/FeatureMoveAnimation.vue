<template>
  <div id="map"></div>
</template>
<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import { OSM, Stamen, Vector as VectorSource } from 'ol/source'
import { Image as ImageLayer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import Feature from 'ol/Feature'
import View from 'ol/View'
import { defaults } from 'ol/control'
import XYZ from 'ol/source/XYZ'
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import { getRenderPixel, getVectorContext } from 'ol/render'
import Point from 'ol/geom/Point'
import Polyline from 'ol/format/Polyline'
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
    const osm = new TileLayer({
      source: new OSM()
    })
    this.map = new Map({
      layers: [osm],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2
      }),
      controls: defaults({
        attribution: false
      })
    })
    var that = this
    fetch('/data/route.json').then(function (response) {
      response.json().then(function (result) {
        const polyline = result.routes[0].geometry

        const route = new Polyline({
          factor: 1e6
        }).readGeometry(polyline, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        })

        const routeFeature = new Feature({
          type: 'route',
          geometry: route
        })
        const startMarker = new Feature({
          type: 'icon',
          geometry: new Point(route.getFirstCoordinate())
        })
        const endMarker = new Feature({
          type: 'icon',
          geometry: new Point(route.getLastCoordinate())
        })
        const position = startMarker.getGeometry().clone()
        const geoMarker = new Feature({
          type: 'geoMarker',
          geometry: position
        })

        const styles = {
          route: new Style({
            stroke: new Stroke({
              width: 6,
              color: [237, 212, 0, 0.8]
            })
          }),
          icon: new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: require('@assets/images/pos.png')
            })
          }),
          geoMarker: new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: 'black'
              }),
              stroke: new Stroke({
                color: 'white',
                width: 2
              })
            })
          })
        }
        const vectorLayer = new VectorLayer({
          source: new VectorSource({
            features: [routeFeature, geoMarker, startMarker, endMarker]
          }),
          style: function (feature) {
            return styles[feature.get('type')]
          }
        })

        that.map.addLayer(vectorLayer)

        const speedInput = document.getElementById('speed')
        const startButton = document.getElementById('start-animation')
        let animating = false
        let distance = 0
        let lastTime

        function moveFeature(event) {
          const speed = Number(5)
          const time = event.frameState.time
          const elapsedTime = time - lastTime
          distance = (distance + (speed * elapsedTime) / 1e6) % 2
          lastTime = time

          const currentCoordinate = route.getCoordinateAt(distance > 1 ? 2 - distance : distance)
          position.setCoordinates(currentCoordinate)
          const vectorContext = getVectorContext(event)
          vectorContext.setStyle(styles.geoMarker)
          vectorContext.drawGeometry(position)
          // tell OpenLayers to continue the postrender animation
          that.map.render()
        }

        function startAnimation() {
          animating = true
          lastTime = Date.now()
          // startButton.textContent = 'Stop Animation';
          vectorLayer.on('postrender', moveFeature)
          // hide geoMarker and trigger map render through change event
          geoMarker.setGeometry(null)
        }

        function stopAnimation() {
          animating = false
          // startButton.textContent = 'Start Animation';

          // Keep marker at current animation position
          geoMarker.setGeometry(position)
          vectorLayer.un('postrender', moveFeature)
        }

        startAnimation()
        // startButton.addEventListener('click', function () {
        //     if (animating) {
        //         stopAnimation();
        //     } else {
        //         startAnimation();
        //     }
        // });
      })
    })
  },
  destroyed: {},
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '让点沿着线的轨迹进行动画')
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
