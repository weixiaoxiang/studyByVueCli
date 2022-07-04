<template>
  <div id="cesiumContainer">
    <button class="btn" @click="btn">{{ btntext }}</button>
    <div id="popup">
      <div class="title">
        <span>{{ type }}</span>
        <span class="close" @click="closed">X</span>
      </div>
      <div class="content">
        <div v-for="(item, i) in data" :key="i" class="content-item">
          <span>{{ item.name }}：</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 排放管
// import psg from '~@../../../public/data/output/psg.json'
import psg from '~@../../../public/data/output/psg.json'
// 检查井
import jcj from '~@../../../public/data/output/jcj.json'
// 排放口
import pfk from '~@../../../public/data/output/pfk.json'
// 道路
import road from '~@../../../public/data/output/road.json'
// 雨水口
import ysk from '~@../../../public/data/output/ysk.json'
import _$ from 'jquery' // 在需要使用的页面中
import PolylineTrailMaterialProperty from '@utils/polylineTrailMaterialProperty.js'
export default {
  data() {
    return {
      entityCollection: null,
      rotation: 0,
      selectedFeature: null,
      data: [],
      type: '',
      coor: [
        116.38803339703314, 39.90397476600515, 116.38829986518512,
        39.904256010796125
      ],
      polyline: null,
      btntext: '隐藏道路',
      tileset1: null,
      planesDistance: [50, 0, 0, 0],
      // 用于存放多个裁切面
      clippingPlanesArray: [],
      boundingSphere: null,
      radius: 0,
      selectedPlane: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    const that = this
    window.viewer = new Cesium.Viewer('cesiumContainer', {
      // terrainProvider: Cesium.createWorldTerrain(),
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false, // 二三维转换
      selectionIndicator: false,
      timeline: false, // 时间线
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false
    })
    // window.viewer.scene.globe.show = false
    // window.viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0)
    window.viewer.scene.globe.depthTestAgainstTerrain = true

    window.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true
    // 是否剔除背面地形 是否显示地球背面
    window.viewer.scene.globe.backFaceCulling = true
    window.viewer.scene.globe.translucency.frontFaceAlphaByDistance =
      new Cesium.NearFarScalar(400.0, 0.0, 800.0, 1.0)
    // globe.translucency.enabled = true;
    // globe.translucency.backFaceAlpha = 0.5
    this.clippingPlanesArray = [
      new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0.0), // 往下为裁切
      new Cesium.ClippingPlane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), 0.0) // 侧面裁切
    ]
    // 定义裁切平面集合
    this.clippingPlanes = new Cesium.ClippingPlaneCollection({
      planes: this.clippingPlanesArray, // 定义的切面数组
      edgeColor: Cesium.Color.WHITE, // 平面切割时模型的边缘颜色
      edgeWidth: 1.0, // 边缘的宽度y
      unionClippingRegions: false, // true 才能多个切割
      enabled: true // 裁切平面是否处于活动
    })

    const style = new Cesium.Cesium3DTileStyle({
      defines: {
        name: "${feature['name']}"
      },
      color: {
        conditions: [
          ["${name} === 'jianzhuwu'", "color('white',0.6)"],
          ["${name} === 'jianzhuwu001'", "color('white',0.6)"],
          ['true', "color('white')"] // This is the else case
        ]
      }
    })

    var tileset = window.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: '/data/3/tileset.json',
        clippingPlanes: this.clippingPlanes
      })
    )
    this.tileset1 = window.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: '/data/4/tileset.json'
      })
    )
    tileset.style = style

    style.color = {
      evaluateColor: function (feature, result) {
        var name = feature.getProperty('name')
        var color = Cesium.Color.WHITE
        if (name === 'jianzhuwu') {
          color = Cesium.Color.WHITE.withAlpha(0.6)
        }
        if (name === 'jianzhuwu001') {
          color = Cesium.Color.WHITE.withAlpha(0.6)
        }
        if (name.includes('Jcj')) {
          color = Cesium.Color.WHITE.withAlpha(0.6)
        }
        return color
      }
    }
    window.viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 1000))
    tileset.readyPromise.then((tileset) => {
      // 添加裁切面
      tileset.debugShowBoundingVolume = false
      that.boundingSphere = tileset.boundingSphere // 3d模型的中心和半径
      that.radius = that.boundingSphere.radius
      if (
        !Cesium.Matrix4.equals(tileset.root.transform, Cesium.Matrix4.IDENTITY)
      ) {
        var transformCenter = Cesium.Matrix4.getTranslation(
          tileset.root.transform,
          new Cesium.Cartesian3()
        ) // 获取矩阵的平移部分
        var transformCartographic =
          Cesium.Cartographic.fromCartesian(transformCenter) // 结果对象中的值将以弧度表示。
        var boundingSphereCartographic = Cesium.Cartographic.fromCartesian(
          tileset.boundingSphere.center
        )
        var height =
          boundingSphereCartographic.height - transformCartographic.height
        var longitude =
          boundingSphereCartographic.longitude -
          transformCartographic.longitude // 经度
        var latitude =
          boundingSphereCartographic.latitude - transformCartographic.latitude // 维度
        // 下面决定了是否在中心点
        that.clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(
          new Cesium.Cartesian3(0, 0, height)
        )
      }
      // 创建可视化对象
      for (let i = 0; i < that.clippingPlanes.length; ++i) {
        const plane = that.clippingPlanes.get(i)
        viewer.entities.add({
          name: i,
          position: that.boundingSphere.center, // 设置裁切面的位置,offset, 根据3dtiles同步调整裁切面高度
          // PlaneGraphics.html
          plane: {
            // 每个裁切对象（distance为裁切面距离远点的高度）
            dimensions: new Cesium.Cartesian2(that.radius, that.radius), // 调整裁切面的长和宽
            material: Cesium.Color.YELLOW.withAlpha(0.1), // 裁切面的颜色和透明度
            // plane: new Cesium.CallbackProperty(that.createPlaneUpdateFunction(plane, that.radius, i), false),
            plane: new Cesium.CallbackProperty(() => {
              plane.distance = that.planesDistance[i]
              // 切面距离原点的距离就等于移动的距离+模型的半径的一半
              return plane
            }, false),
            outline: true, // 是否显示边框
            outlineColor: Cesium.Color.YELLOW // 边框颜色
          }
        })
      }
    })

    // 裁切面定义鼠标事件
    var ellipsoid = viewer.scene.globe.ellipsoid
    // 注册鼠标事件
    var downHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 鼠标点击事件
    downHandler.setInputAction((movement) => {
      var position = viewer.scene.camera.pickEllipsoid(
        movement.position,
        viewer.scene.globe.ellipsoid
      )
      // console.log(position);
      var pickObject = viewer.scene.pick(movement.position)
      if (
        Cesium.defined(pickObject) &&
        Cesium.defined(pickObject.id) &&
        Cesium.defined(pickObject.id.plane)
      ) {
        this.selectedPlane = pickObject.id.plane // 将entities
        this.selectedPlane.name = pickObject.id.name // 将name赋予selectedPlane
        this.selectedPlane.material = Cesium.Color.YELLOW.withAlpha(0.05)
        this.selectedPlane.outlineColor = Cesium.Color.YELLOW // 更换切面的颜色
        this.selectedPlane.startPosition = movement.position //
        this.selectedPlane.startPosition1 = Cesium.Math.toDegrees(
          ellipsoid.cartesianToCartographic(position).longitude
        ) // 初始位置维度
        viewer.scene.screenSpaceCameraController.enableInputs = false // 取消默认的相机一切交互事件
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

    // 注册鼠标松开事件
    var upHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 鼠标点击向上事件
    upHandler.setInputAction(() => {
      if (Cesium.defined(this.selectedPlane)) {
        // 如果存在这个对象
        this.selectedPlane.material = Cesium.Color.YELLOW.withAlpha(0.1) // 恢复选中的切面颜色
        this.selectedPlane.outlineColor = Cesium.Color.YELLOW //
        this.selectedPlane = undefined
      }
      viewer.scene.screenSpaceCameraController.enableInputs = true // 恢复默认的相机一切交互事件
    }, Cesium.ScreenSpaceEventType.LEFT_UP)

    // 注册鼠标移动事件，
    var moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 鼠标点击移动事件
    moveHandler.setInputAction((movement) => {
      // 通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
      var cartesianEnd = viewer.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      ) // 笛卡尔积，获取鼠标移动结束世界坐标
      var cartesianStart = viewer.camera.pickEllipsoid(
        movement.startPosition,
        ellipsoid
      ) // 笛卡尔积，获取鼠标开始移动时世界坐标
      if (Cesium.defined(this.selectedPlane)) {
        // console.log(selectedPlane.name);//做判断哪个面
        if (this.selectedPlane.name == 0) {
          // 往下
          var deltaSize = movement.startPosition.y - movement.endPosition.y // 计算鼠标移动的过程中产生的垂直高度距离
          console.log('开始')
          console.log('起始位置' + movement.startPosition.y)
          console.log('结束为止' + movement.endPosition.y)
          console.log('移动的幅度' + deltaSize)
          this.planesDistance[this.selectedPlane.name] += deltaSize / 5 // 更改鼠标移动的幅度//从初始位置开始算
          console.log('结束')
        }

        if (this.selectedPlane.name == 1) {
          // 侧面
          console.log(2)
          if (cartesianEnd && cartesianStart) {
            // 能获取
            // 将笛卡尔坐标转换为地理（地图）坐标
            var cartographiEnd =
              ellipsoid.cartesianToCartographic(cartesianEnd)
            var cartographicStart =
              ellipsoid.cartesianToCartographic(cartesianStart)
            // console.log(cartographic);
            // 将弧度转为度的十进制度表示，因为差值很小，保留20位小数
            var longitudeStringEnd = Cesium.Math.toDegrees(
              cartographiEnd.longitude
            ).toFixed(20)
            var longitudeStringStart = Cesium.Math.toDegrees(
              cartographicStart.longitude
            ).toFixed(20)
            var longitudeGap =
              (longitudeStringEnd - longitudeStringStart) * 100000
            console.log('两者之间的差距' + longitudeGap)
            console.log('++===')
            // 获取经度往上变大
            this.planesDistance[this.selectedPlane.name] += longitudeGap / 5 // 原来的距离加上移动的距离（很重要，决定了裁切面的移动方向）
          } else {
            // mouse_state.innerText = "";
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // 创建流动线
    // this.creatPolylineEntity()
    var handler = new Cesium.ScreenSpaceEventHandler(
      window.viewer.scene.canvas
    )

    var _position, _pm_position, _cartesian
    var camera = window.viewer.scene.camera
    handler.setInputAction((event) => {
      var picker = window.viewer.scene.pick(event.position)
      // var picker1 = window.viewer.scene.drillPick(e.position); //或许所有实体
      var cartesian = window.viewer.scene.pickPosition(event.position)
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      if (!Cesium.defined(picker) || !Cesium.defined(cartesian)) {
        return
      }
      if (Cesium.defined(this.selectedFeature)) {
        this.selectedFeature = null
        _$('#popup').hide()
      }
      var cartographic =
        window.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
      var _cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        window.viewer.scene,
        cartesian
      )
      var bubble = document.getElementById('popup')
      var w = bubble.clientWidth
      var h = bubble.clientHeight
      // 设置弹出框位置
      bubble.style.left = picks.x - w / 2 + 'px'
      bubble.style.top = picks.y - h / 1 + 'px'
      bubble.style.visibility = 'visible' // visibility: "hidden"

      _position = event.position
      _cartesian = cartesian
      _pm_position = {
        x: picks.x,
        y: picks.y
      }
      this.selectedFeature = picker
      var id = this.selectedFeature.getProperty('id')
      if (
        !id.includes('jianzhuwu') &&
        !id.includes('lvhua') &&
        !id.includes('tree') &&
        !id.includes('lumian')
      ) {
        _$('#popup').show()
        this.creatDetailPanel('', id)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    var _pm_position_2
    // 每帧渲染结束监听
    window.viewer.scene.postRender.addEventListener(() => {
      // 避免渲染帧时出错
      try {
        if (_pm_position != _pm_position_2) {
          _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            window.viewer.scene,
            _cartesian
          )
          var trackPopUpContent_ = window.document.getElementById('popup')
          var w = trackPopUpContent_.clientWidth
          var h = trackPopUpContent_.clientHeight
          // trackPopUpContent_.style.visibility = "visible";
          trackPopUpContent_.style.left =
            _pm_position_2.x - parseInt(w / 2) + 'px'
          trackPopUpContent_.style.top =
            _pm_position_2.y - parseInt(h / 1) + 'px'
        }
      } catch (error) {
        // 抓住throw抛出的错误
        console.log(error)
        return
      }
    })
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '添加横向和纵向的裁切面')
    },
    computeCircle(radius) {
      var positions = []
      for (var i = 0; i < 360; i++) {
        var radians = Cesium.Math.toRadians(i)
        positions.push(
          new Cesium.Cartesian2(
            radius * Math.cos(radians),
            radius * Math.sin(radians)
          )
        )
      }
      return positions
    },
    computeStar(arms, rOuter, rInner) {
      var angle = Math.PI / arms
      var length = 2 * arms
      var positions = new Array(length)
      for (var i = 0; i < length; i++) {
        var r = i % 2 === 0 ? rOuter : rInner
        positions[i] = new Cesium.Cartesian2(
          Math.cos(i * angle) * r,
          Math.sin(i * angle) * r
        )
      }
      return positions
    },
    creatEntity(degreesHeight, properties) {
      const entity = new Cesium.Entity({
        id: properties.OBJECTID,
        name: '排水管',
        polylineVolume: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(degreesHeight),
          shape: this.computeCircle(0.8),
          material: new Cesium.PolylineTrailMaterialProperty({
            // color: Cesium.Color.GREEN,
            // color: new Cesium.Color(58 / 255, 5 / 255, 179 / 255, 1),
            duration: 3000,
            trailImage: '/data/colors.png'
          })
        }
      })
      return window.viewer.entities.add(entity)
    },
    creatPolylineEntity(degreesHeight, properties) {
      this.polyline = window.viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(this.coor),
          width: 10,
          material: new Cesium.PolylineTrailMaterialProperty({
            // color: Cesium.Color.GREEN,
            // color: new Cesium.Color(58 / 255, 5 / 255, 179 / 255, 1),
            duration: 3000,
            trailImage: '/data/fenceline.png' // colors.png
          }),
          show: true,
          clampToGround: true,
          classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
        }
      })
    },

    creatDetailPanel(name = '', id) {
      let feature
      this.data = []
      if (id.includes('Psg')) {
        id = id.split('Psg').pop()
        if (id[0] == '-') {
          id = id.slice(1, id.length).split('-').join('-')
        }
        feature = psg.features.find((item) => {
          return item.properties.LINKCODE === id
        })
        for (const key in feature.properties) {
          var obj = {}
          var sz = {
            LINKCODE: '标识码',
            SYSTEMID: '系统编码',
            SHAPE_Leng: '管长',
            IN_ELEV: '起点标高',
            OUT_ELEV: '终点标高',
            SHAPE_DATA: '断面数据',
            MATERIAL: '管道材质',
            DATASOURCE: '数据来源',
            REPORTDEPT: '填报单位'
          }
          if (
            [
              'LINKCODE',
              'SYSTEMID',
              'SHAPE_Leng',
              'IN_ELEV',
              'OUT_ELEV',
              'SHAPE_DATA',
              'MATERIAL',
              'DATASOURCE',
              'REPORTDEPT'
            ].includes(key)
          ) {
            obj['name'] = sz[key]
            obj['value'] = feature.properties[key]
            this.data.push(obj)
          }
        }
        this.type = '排水管'
      }
      if (id.includes('Jcj')) {
        id = id.split('Jcj').pop()
        if (id[0] == '-') {
          id = id.slice(1, id.length).split('-').join('-')
        }
        feature = jcj.features.find((item) => {
          return item.properties.NODECODE === id
        })
        for (const key in feature.properties) {
          var sz = {
            NODECODE: '标识码',
            SYSTEMID: '系统编码',
            LANE_WAY: '所在道路',
            JUNC_SLUIC: '形式',
            DEPTH: '井深',
            SURFACE_EL: '地面高程',
            COV_MATERI: '井盖材质',
            DATASOURCE: '数据来源',
            REPORTDEPT: '填报单位'
          }
          var obj = {}
          if (
            [
              'NODECODE',
              'SYSTEMID',
              'LANE_WAY',
              'JUNC_SLUIC',
              'DEPTH',
              'SURFACE_EL',
              'COV_MATERI',
              'DATASOURCE',
              'REPORTDEPT'
            ].includes(key)
          ) {
            obj['name'] = sz[key]
            obj['value'] = feature.properties[key]
            this.data.push(obj)
          }
        }
        this.type = '检查井'
      }
      if (id.includes('Ysk')) {
        id = id.split('Ysk').pop()
        if (id[0] == '-') {
          id = id.slice(1, id.length).split('-').join('-')
        }
        console.log(id)
        feature = ysk.features.find((item) => {
          return item.properties.NODECODE === id
        })
        for (const key in feature.properties) {
          var obj = {}
          var sz = {
            NODECODE: '标识码',
            SYSTEMID: '系统编码',
            LANE_WAY: '所在道路',
            INLET_TYPE: '形式',
            LENGTH: '长度',
            WIDTH: '宽度',
            GRAMATERIA: '材质',
            MAXDEPTH: '最大深度',
            SURFACE_EL: '地面高程',
            DATASOURCE: '数据来源'
          }
          if (
            [
              'NODECODE',
              'SYSTEMID',
              'LANE_WAY',
              'INLET_TYPE',
              'LENGTH',
              'WIDTH',
              'GRAMATERIA',
              'MAXDEPTH',
              'SURFACE_EL',
              'DATASOURCE'
            ].includes(key)
          ) {
            obj['name'] = sz[key]
            obj['value'] = feature.properties[key]
            this.data.push(obj)
          }
        }
        this.type = '雨水口'
      }
    },
    closed() {
      _$('#popup').hide()
    },
    update() {
      var viewModel = {
        translucencyEnabled: true,
        fadeByDistance: true,
        showVectorData: false,
        alpha: 0.5
      }
      window.viewer.scene.globe.translucency.enabled =
        viewModel.translucencyEnabled

      var alpha = Number(viewModel.alpha)
      alpha = !isNaN(alpha) ? alpha : 1.0
      alpha = Cesium.Math.clamp(alpha, 0.0, 1.0)

      window.viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue =
        alpha
      window.viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue =
        viewModel.fadeByDistance ? 1.0 : alpha

      // polygon.show = viewModel.showVectorData;
      // polyline.show = viewModel.showVectorData;
    },
    btn() {
      this.btntext = this.btntext == '隐藏道路' ? '显示道路' : '隐藏道路'
      this.tileset1.show = this.btntext != '显示道路'
    },
    createPlaneUpdateFunction(plane, radius, name) {
      var that = this
      return () => {
        debugger
        plane.distance = this.planesDistance[name] + radius * 0.5 // 切面距离原点的距离就等于移动的距离+模型的半径的一半
        return plane
      }
    }
  }
}
</script>
<style>
.cesium-widget-credits {
  display: none !important;
  visibility: hide !important;
}
</style>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  #popup {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 20px 15px;
    max-width: 400px;
    max-height: 400px;
    border-radius: 5%;
    background-color: rgba(41, 42, 43, 0.5);
    z-index: 1;

    .title {
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      color: #fff;
      padding: 0 5px;
      border-bottom: 1px solid #616161;
    }

    .close {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 20px;
      height: 20px;
      font-size: 12px;
      color: #fff;
      line-height: 20px;
      text-align: center;
    }

    .content-item {
      margin-top: 5px;
      font-size: 14px;
      color: #fff;
    }
  }
}

.btn {
  position: absolute;
  top: 20px;
  left: 20px;
  // width: 80px;
  // height: 40px;
  padding: 10px 15px;
  background-color: #1488f5;
  z-index: 1;
  border-radius: 10px;
  border: none;
  color: #fff;
}
</style>
