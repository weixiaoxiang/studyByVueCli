/* eslint-disable*/
/***
 * 六边形扩散效果
 * 参考gitee开源ts代码
 * 取消import和export，整合两个类
 */

// 点效果集合 父类
class Effect {
  viewer
  id
  duration
  maxRadius
  pointDraged
  leftDownFlag
  update_position
  constructor(viewer, id) {
    this.viewer = viewer
    this.id = id
    this.duration = 1000
    this.maxRadius = 1000
    this.pointDraged = null
    this.leftDownFlag = false
  }
  change_duration(d) {
    this.duration = d
  }
  change_color(val) {
    const curEntity = this.viewer.entities.getById(this.id)
    curEntity._ellipse._material.color = new Cesium.Color.fromCssColorString(val)
  }
  change_position(p) {
    const cartesian3 = Cesium.Cartesian3.fromDegrees(
      parseFloat(p[0]),
      parseFloat(p[1]),
      parseFloat(p[2])
    )
    const curEntity = this.viewer.entities.getById(this.id)
    curEntity.position = cartesian3
  }
  del() {
    this.viewer.entities.removeById(this.id)
  }
  add(position, color, maxRadius, duration, isEdit = false) {
    const _this = this
    this.duration = duration
    this.maxRadius = maxRadius
    if (!isEdit) {
      return
    }

    function leftDownAction(e) {
      _this.pointDraged = _this.viewer.scene.pick(e.position) // 选取当前的entity
      if (_this.pointDraged && _this.pointDraged.id && _this.pointDraged.id.id === _this.id) {
        _this.leftDownFlag = true
        _this.viewer.scene.screenSpaceCameraController.enableRotate = false // 锁定相机
      }
    }

    function leftUpAction(e) {
      _this.leftDownFlag = false
      _this.pointDraged = null
      _this.viewer.scene.screenSpaceCameraController.enableRotate = true // 解锁相机
    }

    function mouseMoveAction(e) {
      if (
        _this.leftDownFlag === true &&
        _this.pointDraged !== null &&
        _this.pointDraged !== undefined
      ) {
        const ray = _this.viewer.camera.getPickRay(e.endPosition)
        const cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene)
        _this.pointDraged.id.position = cartesian // 此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;
        // 这里笛卡尔坐标转 经纬度
        const ellipsoid = _this.viewer.scene.globe.ellipsoid
        const cartographic = ellipsoid.cartesianToCartographic(cartesian)
        const lat = Cesium.Math.toDegrees(cartographic.latitude)
        const lng = Cesium.Math.toDegrees(cartographic.longitude)
        let alt = cartographic.height
        alt = alt < 0 ? 0 : alt
        if (_this.update_position) {
          _this.update_position([lng.toFixed(8), lat.toFixed(8), alt])
        }
      }
    }
    this.viewer.screenSpaceEventHandler.setInputAction(
      leftDownAction,
      Cesium.ScreenSpaceEventType.LEFT_DOWN
    )
    this.viewer.screenSpaceEventHandler.setInputAction(
      leftUpAction,
      Cesium.ScreenSpaceEventType.LEFT_UP
    )
    this.viewer.screenSpaceEventHandler.setInputAction(
      mouseMoveAction,
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    )
  }
}

/**
 * 六边形扩散材质
 * @date:2022-01-12
 */
function HexagonSpreadMaterialProperty(color) {
  this._definitionChanged = new Cesium.Event()
  this._color = undefined
  this._colorSubscription = undefined
  this.color = color
  this._time = new Date().getTime()
}
Object.defineProperties(HexagonSpreadMaterialProperty.prototype, {
  isConstant: {
    get: function () {
      return false
    }
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor('color')
})
HexagonSpreadMaterialProperty.prototype.getType = function (_time) {
  return Cesium.Material.HexagonSpreadMaterialType
}
HexagonSpreadMaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {}
  }
  result.color = Cesium.Property.getValueOrClonedDefault(
    this._color,
    time,
    Cesium.Color.WHITE,
    result.color
  )
  result.image = Cesium.Material.HexagonSpreadMaterialImage
  return result
}
HexagonSpreadMaterialProperty.prototype.equals = function (other) {
  const reData =
    this === other ||
    (other instanceof HexagonSpreadMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  return reData
}
Cesium.HexagonSpreadMaterialProperty = HexagonSpreadMaterialProperty
Cesium.Material.HexagonSpreadMaterialType = 'HexagonSpreadMaterial'
Cesium.Material.HexagonSpreadMaterialImage = '/data/hexagon.png'
Cesium.Material.HexagonSpreadSource = `
  czm_material czm_getMaterial(czm_materialInput materialInput)
  {
       czm_material material = czm_getDefaultMaterial(materialInput);
       vec2 st = materialInput.st;
       vec4 colorImage = texture2D(image,  vec2(st));
       material.alpha = colorImage.a * color.a * 0.5;
       material.diffuse =  1.8 * color.rgb  ;
       return material;
   }
   `
Cesium.Material._materialCache.addMaterial(Cesium.Material.HexagonSpreadMaterialType, {
  fabric: {
    type: Cesium.Material.HexagonSpreadMaterialType,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 0.5),
      image: Cesium.Material.HexagonSpreadMaterialImage
    },
    source: Cesium.Material.HexagonSpreadSource
  },
  translucent: function (material) {
    return true
  }
})

// 六边形扩散效果
class HexagonSpread extends Effect {
  constructor(viewer, id) {
    super(viewer, id)
  }
  add(position, color, maxRadius, duration, isedit = false) {
    super.add(position, color, maxRadius, duration, isedit)
    const _this = this
    let currentRadius = 1
    const entity = this.viewer.entities.add({
      id: _this.id,
      position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
      ellipse: {
        semiMajorAxis: new Cesium.CallbackProperty(function (n) {
          currentRadius += (1000 / _this.duration) * 50
          if (currentRadius > _this.maxRadius) {
            currentRadius = 1
          }
          return currentRadius
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function (n) {
          return currentRadius
        }, false),
        material: new Cesium.HexagonSpreadMaterialProperty(
          new Cesium.Color.fromCssColorString(color)
        )
      }
    })
    this.viewer.zoomTo(entity)
  }
}

export default HexagonSpread
