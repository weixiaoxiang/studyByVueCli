// 定义cesium专栏 菜单列表
const cesiumList = {
  id: '2',
  name: 'cesium',
  isTarget: false,
  children: [
    {
      id: '2-100',
      name: '实用案例',
      isTarget: false,
      children: [
        {
          id: '2-100-1',
          name: '地表开挖',
          isTarget: false,
          path: '/SurfaceExcavate'
        },
        {
          id: '2-100-2',
          name: 'popup',
          isTarget: false,
          path: '/CesiumPopup'
        },
        {
          id: '2-100-3',
          name: '限制相机高度来限制地图范围',
          isTarget: false,
          path: '/ExentArea'
        },
        {
          id: '2-100-4',
          name: '聚合效果',
          isTarget: false,
          path: '/Cluster'
        },
        {
          id: '2-100-5',
          name: '更改热力图的bounds',
          isTarget: false,
          path: '/CesiumHeatmap'
        },
        {
          id: '2-100-6',
          name: '计算当前视图范围',
          isTarget: false,
          path: '/ComputeViewRectangle'
        },
        {
          id: '2-100-7',
          name: '加载高德地图',
          isTarget: false,
          path: '/LoadGD'
        },
        {
          id: '2-100-8',
          name: '六边形扩散效果',
          isTarget: false,
          path: '/Hexagon'
        }
      ]
    },
    {
      id: '2-200',
      name: 'demo',
      isTarget: false,
      path: '/Demo'
    },
    {
      id: '2-1',
      name: '初始化cesium',
      isTarget: false,
      path: '/hellowCesium'
    },
    {
      id: '2-2',
      name: '加载3D小飞机模型',
      isTarget: false,
      path: '/3DModels'
    },
    {
      id: '2-3',
      name: '修改3D小飞机模型颜色',
      isTarget: false,
      path: '/3DModelsColor'
    },
    {
      id: '2-4',
      name: '加载3DTilesBIM',
      isTarget: false,
      path: '/3DTilesBIM'
    },
    {
      id: '2-5',
      name: '平移3DTiles',
      isTarget: false,
      path: '/adjustHeight'
    },
    {
      id: '2-6',
      name: '批量表修改样式',
      isTarget: false,
      path: '/3DBatchTableHierarchy'
    },
    {
      id: '2-7',
      name: '3Dtiles联动',
      isTarget: false,
      path: '/3DTilesInteractivity'
    },
    {
      id: '2-8',
      name: '给倾斜摄影添加单体层',
      isTarget: false,
      path: '/3DTilesPhotogrammetryClassification'
    },
    {
      id: '2-9',
      name: '3DTiles添加点云数据',
      isTarget: false,
      path: '/3DTilesPointCloudClassification'
    },
    {
      id: '2-10',
      name: '将选中要素高亮',
      isTarget: false,
      path: '/3DTilesTerrainClassification'
    },
    {
      id: '2-11',
      name: '添加ArcgisMapServer',
      isTarget: false,
      path: '/ArcgisMapServer'
    },
    {
      id: '2-12',
      name: '添加ArcgisTiledElevationTerrain',
      isTarget: false,
      path: '/ArcgisTiledElevationTerrain'
    },
    {
      id: '2-13',
      name: '添加billboards(重点)',
      isTarget: false,
      path: '/Billboards'
    },
    {
      id: '2-14',
      name: 'Bloom初认识',
      isTarget: false,
      path: '/Bloom'
    },
    {
      id: '2-15',
      name: 'entity绘制Box',
      isTarget: false,
      path: '/Box'
    },
    {
      id: '2-16',
      name: 'CZML绘制entity',
      isTarget: false,
      // path: '/Box',
      children: [
        {
          id: '2-16-1',
          name: '加载CZML的3DTiles',
          isTarget: false,
          path: '/CZML3DTiles'
        },
        {
          id: '2-16-2',
          name: '加载CZML的Box',
          isTarget: false,
          path: '/CZMLBox'
        },
        {
          id: '2-16-3',
          name: '水淹分析原型',
          isTarget: false,
          path: '/CZMLProperties'
        }
      ]
    },
    {
      id: '2-17',
      name: '用键盘控制相机',
      isTarget: false,
      path: '/CesiumTutorial'
    },
    {
      id: '2-18',
      name: '相机',
      isTarget: false,
      path: '/Camera'
    },
    {
      id: '2-19',
      name: '地下管线',
      isTarget: false,
      path: '/GlobeTranslucency'
    },
    {
      id: '2-20',
      name: '绘制动态流动polylinevolume',
      isTarget: false,
      path: '/PolylineVolume'
    },
    {
      id: '2-21',
      name: '绘制动态流动polyline',
      isTarget: false,
      path: '/Polyline'
    },
    {
      id: '2-22',
      name: 'Cardboard',
      isTarget: false,
      path: '/Cardboard'
    },
    {
      id: '2-23',
      name: '用Rectangle分割地球',
      isTarget: false,
      path: '/CartographicLimitRectangle'
    },
    {
      id: '2-24',
      name: '附着夹紧model',
      isTarget: false,
      path: '/Clamp3DModel'
    },
    {
      id: '2-25',
      name: '附着紧贴3DTiles',
      isTarget: false,
      path: '/Clamp3DTiles'
    },
    {
      id: '2-26',
      name: '根据地形裁切图元',
      isTarget: false,
      path: '/ClampTerrain'
    },
    {
      id: '2-27',
      name: '裁切3DTiles',
      isTarget: false,
      path: '/3DTilesClippingPlanes'
    },
    {
      id: '2-28',
      name: '单体分类类型选择',
      isTarget: false,
      path: '/ClassificationTypes'
    },
    {
      id: '2-29',
      name: '倾斜摄影单体分类',
      isTarget: false,
      path: '/Classification'
    },
    {
      id: '2-30',
      name: '时钟',
      isTarget: false,
      path: '/Clock'
    },
    {
      id: '2-31',
      name: 'entity加载长廊',
      isTarget: false,
      path: '/Corridor'
    },
    {
      id: '2-32',
      name: 'entity加载圆柱',
      isTarget: false,
      path: '/CylindersAndCones'
    },
    {
      id: '2-33',
      name: '调整datasource显示顺序',
      isTarget: false,
      path: '/DataSourceOrdering'
    },
    {
      id: '2-34',
      name: '根据距离显示隐藏模型',
      isTarget: false,
      path: '/DistanceDisplayConditions'
    },
    {
      id: '2-35',
      name: '线面的绘制',
      isTarget: false,
      path: '/DrawingOnTerrain'
    },
    {
      id: '2-36',
      name: 'globe等高线的绘制',
      isTarget: false,
      path: '/ElevationBandMaterial'
    },
    {
      id: '2-37',
      name: '黑夜雾化，超出相机指定距离不可见',
      isTarget: false,
      path: '/FogPostProcess'
    },
    {
      id: '2-38',
      name: 'DataSource加载json',
      isTarget: false,
      path: '/GeoJSONandTopoJSON'
    },
    {
      id: '2-39',
      name: 'GeometryReference',
      isTarget: false,
      path: '/GeometryReference'
    },
    {
      id: '2-40',
      name: 'GeometryAppearances',
      isTarget: false,
      path: '/GeometryAppearances'
    },
    {
      id: '2-41',
      name: 'overlay弹出框',
      isTarget: false,
      path: '/HTMLOverlay'
    },
    {
      id: '2-42',
      name: 'headingpitchroll控制模型的运动姿态',
      isTarget: false,
      path: '/HeadingPitchRoll'
    },
    {
      id: '2-43',
      name: 'HDR高清渲染',
      isTarget: false,
      path: '/HighDynamicRange'
    }
  ]
}
export default cesiumList
