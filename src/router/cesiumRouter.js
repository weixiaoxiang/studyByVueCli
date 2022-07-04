var cesiumRouter = [
  {
    path: '/Demo',
    component: () => import('@components/cesium/Demo.vue')
  },
  {
    path: '/hellowCesium',
    component: () => import('@components/cesium/HellowCesium.vue')
  },
  {
    path: '/3DModels',
    component: () => import('@components/cesium/3DModels.vue')
  },
  {
    path: '/3DModelsColor',
    component: () => import('@components/cesium/3DModelsColor.vue')
  },
  {
    path: '/3DTilesBIM',
    component: () => import('@components/cesium/3DTilesBIM.vue')
  },
  {
    path: '/adjustHeight',
    component: () => import('@components/cesium/AdjustHeight.vue')
  },
  {
    path: '/3DBatchTableHierarchy',
    component: () => import('@components/cesium/3DBatchTableHierarchy.vue')
  },
  {
    path: '/3DTilesInteractivity',
    component: () => import('@components/cesium/3DTilesInteractivity.vue')
  },
  {
    path: '/3DTilesPhotogrammetryClassification',
    component: () => import('@components/cesium/3DTilesPhotogrammetryClassification.vue')
  },
  {
    path: '/3DTilesPointCloudClassification',
    component: () => import('@components/cesium/3DTilesPointCloudClassification.vue')
  },
  {
    path: '/3DTilesTerrainClassification',
    component: () => import('@components/cesium/3DTilesTerrainClassification.vue')
  },
  {
    path: '/ArcgisMapServer',
    component: () => import('@components/cesium/ArcgisMapServer.vue')
  },
  {
    path: '/ArcgisTiledElevationTerrain',
    component: () => import('@components/cesium/ArcgisTiledElevationTerrain.vue')
  },
  {
    path: '/Billboards',
    component: () => import('@components/cesium/Billboards.vue')
  },
  {
    path: '/Bloom',
    component: () => import('@components/cesium/Bloom.vue')
  },
  {
    path: '/Box',
    component: () => import('@components/cesium/Box.vue')
  },
  {
    path: '/CZML3DTiles',
    component: () => import('@components/cesium/CZML3DTiles.vue')
  },
  {
    path: '/CZMLBox',
    component: () => import('@components/cesium/CZMLBox.vue')
  },
  {
    path: '/CZMLProperties',
    component: () => import('@components/cesium/CZMLProperties.vue')
  },
  {
    path: '/CesiumTutorial',
    component: () => import('@components/cesium/CesiumTutorial.vue')
  },
  {
    path: '/Camera',
    component: () => import('@components/cesium/Camera.vue')
  },
  {
    path: '/GlobeTranslucency',
    component: () => import('@components/cesium/GlobeTranslucency.vue')
  },
  {
    path: '/PolylineVolume',
    component: () => import('@components/cesium/PolylineVolume.vue')
  },
  {
    path: '/Polyline',
    component: () => import('@components/cesium/Polyline.vue')
  },
  {
    path: '/Cardboard',
    component: () => import('@components/cesium/Cardboard.vue')
  },
  {
    path: '/CartographicLimitRectangle',
    component: () => import('@components/cesium/CartographicLimitRectangle.vue')
  },
  {
    path: '/Clamp3DModel',
    component: () => import('@components/cesium/Clamp3DModel.vue')
  },
  {
    path: '/Clamp3DTiles',
    component: () => import('@components/cesium/Clamp3DTiles.vue')
  },
  {
    path: '/ClampTerrain',
    component: () => import('@components/cesium/ClampTerrain.vue')
  },
  {
    path: '/3DTilesClippingPlanes',
    component: () => import('@components/cesium/3DTilesClippingPlanes.vue')
  },
  {
    path: '/ClassificationTypes',
    component: () => import('@components/cesium/ClassificationTypes.vue')
  },
  {
    path: '/Classification',
    component: () => import('@components/cesium/Classification.vue')
  },
  {
    path: '/Clock',
    component: () => import('@components/cesium/Clock.vue')
  },
  {
    path: '/Corridor',
    component: () => import('@components/cesium/Corridor.vue')
  },
  {
    path: '/CylindersAndCones',
    component: () => import('@components/cesium/CylindersAndCones.vue')
  },
  {
    path: '/DataSourceOrdering',
    component: () => import('@components/cesium/DataSourceOrdering.vue')
  },
  {
    path: '/DistanceDisplayConditions',
    component: () => import('@components/cesium/DistanceDisplayConditions.vue')
  },
  {
    path: '/DrawingOnTerrain',
    component: () => import('@components/cesium/DrawingOnTerrain.vue')
  },
  {
    path: '/ElevationBandMaterial',
    component: () => import('@components/cesium/ElevationBandMaterial.vue')
  },
  {
    path: '/FogPostProcess',
    component: () => import('@components/cesium/FogPostProcess.vue')
  },
  {
    path: '/GeoJSONandTopoJSON',
    component: () => import('@components/cesium/GeoJSONandTopoJSON.vue')
  },
  {
    path: '/GeometryReference',
    component: () => import('@components/cesium/GeometryReference.vue')
  },
  {
    path: '/GeometryAppearances',
    component: () => import('@components/cesium/GeometryAppearances.vue')
  },
  {
    path: '/HTMLOverlay',
    component: () => import('@components/cesium/HTMLOverlay.vue')
  },
  {
    path: '/HeadingPitchRoll',
    component: () => import('@components/cesium/HeadingPitchRoll.vue')
  },
  {
    path: '/HighDynamicRange',
    component: () => import('@components/cesium/HighDynamicRange.vue')
  },
  {
    path: '/SurfaceExcavate',
    component: () => import('@components/cesium/SurfaceExcavate.vue')
  },
  {
    path: '/CesiumPopup',
    component: () => import('@components/cesium/CesiumPopup.vue')
  },
  {
    path: '/ExentArea',
    component: () => import('@components/cesium/ExentArea.vue')
  },
  {
    path: '/Cluster',
    component: () => import('@components/cesium/Cluster.vue')
  },
  {
    path: '/CesiumHeatmap',
    component: () => import('@components/cesium/CesiumHeatmap.vue')
  },
  {
    path: '/ComputeViewRectangle',
    component: () => import('@components/cesium/ComputeViewRectangle.vue')
  },
  {
    path: '/LoadGD',
    component: () => import('@components/cesium/LoadGD.vue')
  },
  {
    path: '/Hexagon',
    component: () => import('@components/cesium/Hexagon.vue')
  }
]
export default cesiumRouter
