const openlayersRouter = [
  {
    path: '/map',
    component: () => import('@components/openlayers/Map.vue')
  },
  {
    path: '/bindingDiv',
    component: () => import('@components/openlayers/BindingDiv.vue')
  },
  {
    path: '/singleClick',
    component: () => import('@components/openlayers/SingleClick.vue')
  },
  {
    path: '/mapTemplate',
    component: () => import('@components/openlayers/MapTemplate.vue')
  },
  {
    path: '/imageLoadEvents',
    component: () => import('@components/openlayers/ImageLoadEvents.vue')
  },
  {
    path: '/reprojectionImage',
    component: () => import('@components/openlayers/ReprojectionImage.vue')
  },
  {
    path: '/kml',
    component: () => import('@components/openlayers/Kml.vue')
  },
  {
    path: '/layerSpy',
    component: () => import('@components/openlayers/LayerSpy.vue')
  },
  {
    path: '/layerSwipe',
    component: () => import('@components/openlayers/LayerSwipe.vue')
  },
  {
    path: '/layerExtent',
    component: () => import('@components/openlayers/LayerExtent.vue')
  },
  {
    path: '/lineArrows',
    component: () => import('@components/openlayers/LineArrows.vue')
  },
  {
    path: '/featureMoveAnimation',
    component: () => import('@components/openlayers/FeatureMoveAnimation.vue')
  },
  {
    path: '/geoserver',
    component: () => import('@components/openlayers/Geoserver.vue')
  },
  {
    path: '/geoserverWFS',
    component: () => import('@components/openlayers/GeoserverWFS.vue')
  },
  {
    path: '/geoserverWMS',
    component: () => import('@components/openlayers/GeoserverWMS.vue')
  },
  {
    path: '/WuhuTest',
    component: () => import('@components/openlayers/WuhuTest.vue')
  },
  {
    path: '/olextpointstyleedit',
    component: () => import('@components/openlayers/fontStyle/Index.vue')
  }
]

export default openlayersRouter
