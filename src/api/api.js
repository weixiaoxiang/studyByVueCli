import http from '../utils/http'
//
/**
 *  @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/...
 *  @param '/testIp'代表vue-cil中config，index.js中配置的代理
 */
// let resquest = "/localhost/hander/HandlerMap.ashx"
const resquest = '/api232/hander/HandlerMap.ashx'
const data = '/data'
// get请求
export default {
  getListAPI(params) {
    return http.get(`${resquest}/getList.json`, params)
  },
  postJdList(params) {
    return http.post(`${resquest}/GetJdList`, params)
  },
  getData(str) {
    return http.get(`${data}/${str}`)
  }
}
