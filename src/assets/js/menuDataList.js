import cesiumList from './cesiumList'
import cesiumprojectList from './cesiumprojectList'
import threejsList from './threejsList'
import openlayersList from './openlayersList'
import comprehensiveList from './comprehensiveList'
const menuDataList = [
  openlayersList, //ol菜单列表
  cesiumList, //cesium菜单列表
  threejsList, //threejs菜单列表
  // cesium项目实战
  cesiumprojectList,
  comprehensiveList,
  // 品优购
  {
    id: '10',
    name: '品优购电商',
    isTarget: false,
    children: [
      {
        id: '10-1',
        name: '静态页面',
        isTarget: true,
        path: '/pinyougou'
      }
    ]
  },
  // 森林防火
  {
    id: '11',
    name: '森林防火项目',
    isTarget: false,
    children: [
      {
        id: '11-1',
        name: '静态页面',
        isTarget: true,
        path: '/firekeeper'
      }
    ]
  }
]
export default menuDataList
