/*
 * @Descripttion: 
 * @version: 
 * @Author: yichonglou
 * @Date: 2021-08-19 10:49:17
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-20 17:24:53
 */
// 定义threejs专栏 菜单列表
const threejsList = {
    id: '3',
    name: 'threejs',
    isTarget: false,
    children: [
        {
            id: '3-1',
            name: 'ThreejsHellowWorld',
            isTarget: false,
            path: '/ThreejsHellowWorld',
        },
        {
            id: '3-2',
            name: 'Drawinglines',
            isTarget: false,
            path: '/Drawinglines',
        }
        ,
        {
            id: '3-3',
            name: 'Webgl_postprocessing_glitch',
            isTarget: false,
            path: '/Webgl_postprocessing_glitch',
        }

    ]
}

export default threejsList;