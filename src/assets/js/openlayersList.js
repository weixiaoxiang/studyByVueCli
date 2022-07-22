const openlayersList = {
  id: '1',
  name: 'openlayers',
  isTarget: false,
  children: [
    {
      id: '1-100',
      name: 'map模块',
      isTarget: false,
      path: '/map'
    },
    {
      id: '1-101',
      name: 'geoserver-wms芜湖路网',
      isTarget: false,
      path: '/geoserver'
    },
    {
      id: '1-102',
      name: 'geoserver-wfs芜湖路网',
      isTarget: false,
      path: '/geoserverWFS'
    },
    {
      id: '1-103',
      name: 'geoserver-3条芜湖路网',
      isTarget: false,
      path: '/geoserverWMS'
    },
    {
      id: '1-1',
      name: '绑定div元素',
      isTarget: false,
      path: '/bindingDiv'
    },
    {
      id: '1-2',
      name: '地图事件',
      isTarget: false,
      children: [
        {
          id: '1-2-1',
          name: '地图点击',
          isTarget: false,
          children: [
            {
              id: '1-2-1-1',
              name: '单击',
              isTarget: false,
              path: '/singleClick'
            }
          ]
        }
      ]
    },
    {
      id: '1-3',
      name: '图像加载事件',
      isTarget: false,
      path: '/imageLoadEvents'
    },
    {
      id: '1-4',
      name: '图像重投影',
      isTarget: false,
      path: '/reprojectionImage'
    },
    {
      id: '1-5',
      name: 'format',
      isTarget: true,
      children: [
        {
          id: '1-5-1',
          name: '加载kml格式',
          isTarget: false,
          path: '/kml'
        }
      ]
    },
    {
      id: '1-6',
      name: '地图间谍',
      isTarget: false,
      path: '/layerSpy'
    },
    {
      id: '1-7',
      name: '地图滑动',
      isTarget: false,
      path: '/layerSwipe'
    },
    {
      id: '1-8',
      name: 'extent地图范围',
      isTarget: false,
      path: '/layerExtent'
    },
    {
      id: '1-9',
      name: '带箭头的线',
      isTarget: false,
      path: '/lineArrows'
    },
    {
      id: '1-10',
      name: '让点沿着线运动',
      isTarget: false,
      path: '/featureMoveAnimation'
    },
    {
      id: '1-11',
      name: 'olext在线点符号编辑',
      isTarget: false,
      path: '/olextpointstyleedit'
    }
  ]
}
export default openlayersList
