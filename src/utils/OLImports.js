/*
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-12-22 13:36:03
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-12-22 14:33:51
 */
import { XYZ, TileImage } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource, OSM } from 'ol/source'
const key = '0671d5773719af88b6dcc64d69a35a76'
export function tianditu(map) {
  // T=vec_c表示请求的是路网数据，x 表示切片的 x 轴坐标，y 表示切片的y轴坐标，z表示切片所在的缩放级别。
  // 使用 ol.source.XYZ 加载切片，并将获取的数据初始化一个切片图层 ol.layer.Tile：
  // 天地图底图
  var source = new XYZ({
    url:
      'http://t4.tianditu.com/DataServer?T=vec_w&tk=' +
      key +
      '&x={x}&y={y}&l={z}'
  })
  var tileLayer = new TileLayer({
    id: 'tileLayer',
    title: '天地图',
    layerName: 'baseMap',
    source: source
  })
  // 标注图层
  var sourceMark = new XYZ({
    url:
      'http://t3.tianditu.com/DataServer?T=cva_w&tk=' +
      key +
      '&x={x}&y={y}&l={z}'
  })
  var tileMark = new TileLayer({
    id: 'tileMark',
    title: '标注图层',
    layerName: 'baseMap',
    source: sourceMark
  })
  // 卫星图像
  var sourceSatellite = new XYZ({
    url:
      'http://t3.tianditu.com/DataServer?T=img_w&tk=' +
      key +
      '&x={x}&y={y}&l={z}'
  })
  var tileSatellite = new TileLayer({
    id: 'tileSatellite',
    title: '卫星图',
    layerName: 'baseMap',
    source: sourceSatellite,
    preload: 20
  })
  // 天地图地形地图
  var map_ter = new TileLayer({
    id: 'map_ter',
    title: '天地图地形',
    layerName: 'baseMap',
    source: new XYZ({
      url:
        'http://t4.tianditu.com/DataServer?T=ter_w&tk=' +
        key +
        '&x={x}&y={y}&l={z}'
    })
  })
  var map_cta = new TileLayer({
    id: 'map_cta',
    title: '天地图标注',
    layerName: 'baseMap',
    source: new XYZ({
      url:
        'http://t4.tianditu.com/DataServer?T=cva_w&tk=' +
        key +
        '&x={x}&y={y}&l={z}'
    })
  })

  return {
    tileLayer: tileLayer,
    tileMark: tileMark,
    tileSatellite: tileSatellite,
    map_ter: map_ter,
    map_cta: map_cta
  }
}
