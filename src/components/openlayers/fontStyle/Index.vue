<template>
  <div class="font-style">
    <div id="map"></div>
    <div class="panel">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="样式属性(可以展开)" name="1">
          <el-card style="margin-bottom: 10px">
            <el-form :inline="true" size="mini">
              <el-form-item label="系统颜色">
                <el-color-picker
                  class="w80"
                  v-model="color"
                  @change="colorChange('color', $event)"
                  @active-change="colorChange('color', $event)"
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="行为">
                <el-select
                  class="w80"
                  v-model="form.form"
                  placeholder="请选择行为"
                  @change="formChange"
                >
                  <el-option
                    v-for="item in forms"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="字体样式">
                <el-select
                  class="w80"
                  v-model="form.fontStyle"
                  placeholder="请选择字体样式"
                  @change="formChange"
                >
                  <el-option
                    v-for="item in fontStyles"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="填充颜色">
                <el-color-picker
                  class="w80"
                  @active-change="colorChange('fillColor', $event)"
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="笔画颜色">
                <el-color-picker
                  class="w80"
                  @active-change="colorChange('strokeColor', $event)"
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="笔画宽度">
                <el-slider
                  v-model="form.strokeWidth"
                  :min="0"
                  :max="10"
                  class="w80"
                  @input="formChange"
                ></el-slider>
              </el-form-item>
              <el-form-item label="半径">
                <el-slider
                  v-model="form.radius"
                  :min="5"
                  :max="30"
                  class="w80"
                  @input="formChange"
                ></el-slider>
              </el-form-item>
              <el-form-item label="字体大小">
                <el-slider
                  v-model="form.fontSize"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  class="w80"
                  @input="formChange"
                ></el-slider>
              </el-form-item>
              <el-form-item label="旋转角度">
                <el-slider
                  v-model="form.rotation"
                  :min="0"
                  :max="Math.PI * 2"
                  :step="0.1"
                  class="w80"
                  @input="formChange"
                ></el-slider>
              </el-form-item>
              <el-form-item label="X轴偏移">
                <el-slider
                  v-model="form.offsetX"
                  :min="-20"
                  :max="20"
                  :step="0.1"
                  class="w80"
                  @input="formChange"
                ></el-slider>
              </el-form-item>
              <el-form-item label="Y轴偏移">
                <el-slider
                  v-model="form.offsetY"
                  :min="-20"
                  :max="20"
                  :step="0.1"
                  class="w80"
                  @input="formChange"
                ></el-slider>
              </el-form-item>
              <el-form-item label="透明度">
                <el-slider
                  v-model="form.opacity"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  class="w80"
                  @input="formChange"
                ></el-slider>
              </el-form-item>
              <el-form-item label="是否渐变">
                <el-checkbox v-model="form.gradient" @change="formChange">渐变</el-checkbox>
              </el-form-item>
              <el-form-item label="跟随视图旋转" title="alt+shift+左键">
                <el-checkbox
                  title="alt+shift+左键"
                  v-model="form.rotateWithView"
                  @change="formChange"
                  >跟随</el-checkbox
                >
              </el-form-item>
            </el-form>
          </el-card>
        </el-collapse-item>
      </el-collapse>
      <p style="color: green; font-size: 14px">Text:</p>
      <div class="item">
        <span @click="setText('12')">12</span>
        <span @click="setText('25')">25</span>
        <span @click="setText('ab')">ab</span>
      </div>
      <div v-for="(value, key) in fonts" :key="key">
        <p style="color: green; font-size: 14px">{{ key }}:</p>
        <div class="item">
          <span
            v-for="item in value"
            :key="item.class"
            :class="item.class"
            @click="setFont(item.glyph)"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { Style, Fill, Stroke } from 'ol/style'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import 'ol-ext/dist/ol-ext.min.css'
import './css/fontmaki.css'
import './css/fontmaki2.css'
import './font-awesome-4.7.0/css/font-awesome.css'
import 'ol-ext/style/FontAwesomeDef.js'
import 'ol-ext/style/FontMakiDef.js'
import 'ol-ext/style/FontMaki2Def.js'
import FontSymbol from 'ol-ext/style/FontSymbol.js'
import OlExtOrdering from 'ol-ext/render/Ordering.js'
export default {
  data() {
    return {
      color: '',
      map: null, // ol容器
      vectorSource: null, // 字体字形图层
      vector: null,
      standard: [
        '1',
        '2',
        '3',
        '8',
        '9',
        '0',
        'A',
        'B',
        'C',
        'X',
        'Y',
        'Z',
        'i',
        '$',
        '€',
        '@',
        '&',
        '&#x2600;',
        '&#x2601;',
        '&#x2603;',
        '&#x2604;',
        '&#x263A;',
        '&#x2639;'
      ],
      fonts: {
        fontmaki: [],
        fontmaki2: [],
        FontAwesome: []
      },
      forms: [
        'none',
        'circle',
        'poi',
        'bubble',
        'marker',
        'coma',
        'shield',
        'blazon',
        'bookmark',
        'hexagon',
        'diamond',
        'triangle',
        'sign',
        'ban',
        'lozenge',
        'square'
      ],
      fontStyles: ['unset', 'bold', 'italic', 'bold italic'],
      activeNames: [''],
      form: {
        form: 'none',
        opacity: 1,
        gradient: false,
        theText: '',
        theGlyph: 'maki-building',
        font: 'sans-serif',
        fontSize: 1,
        fontStyle: 'bold',
        radius: 15,
        rotation: 0,
        rotateWithView: false,
        displacement: [0, 0],
        offsetX: 0,
        offsetY: 0,
        color: '',
        strokeWidth: 3,
        strokeColor: 'white',
        fillColor: 'rgba(255, 136, 0, 0.6)',
        _strokeWidth: 2,
        _strokeColor: '#f80',
        _fillColor: 'rgba(255, 136, 0, 0.6)'
      }
    }
  },
  mounted() {
    this.creatDom()
    this.initialMap()
  },
  methods: {
    /**
     * @description: 生成dom
     * @return {*}
     */
    creatDom() {
      var glyph = FontSymbol.prototype.defs.glyphs
      for (var i in glyph) {
        if (glyph[i].font === 'fontmaki') {
          this.fonts.fontmaki.push({
            glyph: i,
            title: glyph[i].name,
            class: 'fa ' + i
          })
        }
        if (glyph[i].font === 'fontmaki2') {
          this.fonts.fontmaki2.push({
            glyph: i,
            title: glyph[i].name,
            class: 'fa ' + i
          })
        }
        if (glyph[i].font === 'FontAwesome') {
          this.fonts.FontAwesome.push({
            glyph: i,
            title: glyph[i].name,
            class: 'fa ' + i
          })
        }
      }
    },
    /**
     * @description: 初始化地图
     * @return {*}
     */
    initialMap() {
      this.map = new Map({
        target: 'map',
        view: new View({
          projection: 'EPSG:4326',
          center: [117.2, 31.7],
          zoom: 10,
          // 最小级
          minZoom: 4,
          // 最大级
          maxZoom: 18,
          constrainResolution: true
        }),
        layers: [new TileLayer({ source: new OSM() })]
      })
      this.vectorSource = new VectorSource()
      this.vector = new VectorLayer({
        source: this.vectorSource,
        ordering: OlExtOrdering.yOrdering(),
        style: this.getFeatureStyle
      })
      this.map.addLayer(this.vector)
      setTimeout(() => {
        this.randomPointByRange()
      }, 1000)
    },
    /**
     * @description: 根据范围随机生成点位
     * @return {*}
     */
    randomPointByRange(
      range = [
        [116, 30],
        [118, 32]
      ]
    ) {
      const fs = []
      for (var i = 0; i < 100; i++) {
        const point = [
          Math.random() * (range[1][0] - range[0][0]) + range[0][0],
          Math.random() * (range[1][1] - range[0][1]) + range[0][1]
        ]
        // 定义点
        const feature = new Feature({
          geometry: new Point(point)
        })
        fs.push(feature)
      }
      this.vectorSource.addFeatures(fs)
    },
    /**
     * @description: 设置字体
     * @param {*} glyph
     */
    setFont(g) {
      if (g.indexOf('&#') > -1) this.form.theGlyph = String.fromCodePoint(g.replace('&#', '0'))
      else this.form.theGlyph = g
      this.form.theText = ''
      console.log(this.form.theGlyph)
      this.styleToJSON()
      this.vector.changed()
    },
    /**
     * @description: 设置文本
     * @param {*} text
     */
    setText(t) {
      this.form.theText = t
      this.form.theGlyph = null
      this.vector.changed()
    },
    /**
     * @description: 答应样式
     * @param {*} feature
     * @return {*}
     */
    styleToJSON() {
      console.log(`当前样式：
        new Style({
            image: new FontSymbol({
              form: '${this.form.form}',
              opacity: ${this.form.opacity},
              gradient: ${this.form.gradient},
              glyph: '${this.form.theGlyph}',
              text: '${this.form.theText}',
              font:'${this.form.font}',
              fontSize: ${this.form.fontSize},
              fontStyle: '${this.form.fontStyle}',
              radius: ${this.form.radius},
              rotation: ${this.form.rotation},
              rotateWithView: ${this.form.rotateWithView},
              displacement:[${this.form.offsetX}, ${this.form.offsetY}],
              color: '${this.form.color}',
              stroke: new Stroke({
                width: ${this.form.strokeWidth},
                color: '${this.form.strokeColor}',
              }),
              fill: new Fill({
                color: '${this.form.fillColor}',
              }),
            }),
            stroke: new Stroke({
              width: ${this.form._strokeWidth},
              color: '${this.form._strokeColor}',
            }),
            fill: new Fill({
              color: '${this.form._fillColor}',
            }),
          })
    `)
    },
    /**
     * @description: 设置样式
     * @param {*}
     */
    getFeatureStyle(f) {
      return new Style({
        image: new FontSymbol({
          form: this.form.form,
          opacity: this.form.opacity,
          gradient: this.form.gradient,
          glyph: this.form.theGlyph,
          text: this.form.theText,
          font: this.form.font,
          fontSize: this.form.fontSize,
          fontStyle: this.form.fontStyle,
          radius: this.form.radius,
          rotation: this.form.rotation,
          rotateWithView: this.form.rotateWithView,
          displacement: [this.form.offsetX, this.form.offsetY],
          color: this.form.color,
          stroke: new Stroke({
            width: this.form.strokeWidth,
            color: this.form.strokeColor
          }),
          fill: new Fill({
            color: this.form.fillColor
          })
        }),
        stroke: new Stroke({
          width: this.form._strokeWidth,
          color: this.form._strokeColor
        }),
        fill: new Fill({
          color: this.form._fillColor
        })
      })
    },
    /**
     * @description: 监测样式属性
     * @return {*}
     */
    formChange() {
      this.styleToJSON()
      this.vector.changed()
    },
    /**
     * @description: colorpicker监测
     * @param {*} type
     * @param {*} color
     * @return {*}
     */
    colorChange(type, color) {
      if (type === 'color' && !color) {
        this.form[type] = ''
      }
      this.form[type] = color
      this.vector.changed()
      this.styleToJSON()
    }
  }
}
</script>
<style lang="css">
.fa {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.15);
  transition: color 0.2s ease;
}
</style>
<style lang="less" scoped>
.w80 {
  width: 80px;
}
.font-style {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  font-weight: bold;
  z-index: 999;
  overflow: hidden;
  #map {
    width: 50%;
    height: 100%;
  }
  .panel {
    width: 50%;
    height: 100%;
    padding: 10px;
    overflow-y: auto;
    .item {
      display: flex;
      flex-wrap: wrap;
      span {
        display: inline-block;
        width: 25px;
        height: 25px;
        margin: 2px;
        text-align: center;
        line-height: 25px;
        transition: all 0.5s;
        cursor: pointer;
        &:hover {
          transform: scale(2);
        }
      }
    }
    ::v-deep .el-collapse-item__header {
      height: 24px;
      padding-left: 10px;
      color: green;
      font-size: 14px;
      font-weight: bold;
      background-color: #cff8fb;
    }
    .el-card {
      ::v-deep .el-slider__runway {
        margin: 10px 0;
      }
    }
  }
}
</style>
