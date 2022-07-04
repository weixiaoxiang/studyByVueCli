<!--
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑       永不宕机     永无BUG
 *
 *        佛曰:
 *                写字楼里写字间，写字间里程序员；
 *                程序人员写程序，又拿程序换酒钱。
 *                酒醒只在网上坐，酒醉还来网下眠；
 *                酒醉酒醒日复日，网上网下年复年。
 *                但愿老死电脑间，不愿鞠躬老板前；
 *                奔驰宝马贵者趣，公交自行程序员。
 *                别人笑我忒疯癫，我笑自己命太贱；
 *                不见满街漂亮妹，哪个归得程序员？
 *
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-08-20 17:20:41
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-08-26 11:22:03
 -->

<template>
  <div id="container" ref="container"></div>
</template>
<script>
import * as THREE from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { mapState } from 'vuex'
export default {
  name: 'HelloWorld',
  data() {
    return {
      container: null,
      scene: null,
      camera: null,
      renderer: null
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle,
      // 判断地图div大小是否发生变化
      mapUpdateSize: (state) => state.mapUpdateSize
    })
  },
  watch: {},
  mounted() {
    var container = document.getElementById('container')
    let camera, scene, renderer, composer
    let object, light

    let glitchPass

    function updateOptions() {
      glitchPass.goWild = false // wildGlitch.checked;
    }
    init()
    animate()

    function init() {
      var clientWidth = container.clientWidth
      var clientHeight = container.clientHeight
      renderer = new THREE.WebGLRenderer()
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(clientWidth, clientHeight)
      container.appendChild(renderer.domElement)

      //

      camera = new THREE.PerspectiveCamera(
        70,
        clientWidth / clientHeight,
        1,
        1000
      )
      camera.position.z = 400

      scene = new THREE.Scene()
      scene.fog = new THREE.Fog(0xff0000, 1, 1000)

      object = new THREE.Object3D()
      scene.add(object)

      const geometry = new THREE.SphereGeometry(1, 4, 4)

      for (let i = 0; i < 100; i++) {
        const material = new THREE.MeshPhongMaterial({
          color: 0xffffff * Math.random(),
          flatShading: true
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position
          .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
          .normalize()
        mesh.position.multiplyScalar(Math.random() * 400)
        mesh.rotation.set(
          Math.random() * 2,
          Math.random() * 2,
          Math.random() * 2
        )
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50
        object.add(mesh)
      }
      // AmbientLight 环境光会均匀的照亮场景中的所有物体。
      scene.add(new THREE.AmbientLight(0x222222))
      // DirectionalLight 平行光是沿着特定方向发射的光。
      light = new THREE.DirectionalLight(0xffffff)
      // 光源位置  照射的目标位置默认为原点（0,0,0）
      light.position.set(1, 1, 1)
      // 将光源添加到场景中
      scene.add(light)
      // postprocessing
      // 后处理  相当于后期ps
      composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      glitchPass = new GlitchPass()
      composer.addPass(glitchPass)
      //
      window.addEventListener('resize', onWindowResize)
      updateOptions()
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }

    function animate() {
      requestAnimationFrame(animate)

      object.rotation.x += 0.005
      object.rotation.y += 0.01
      // 开始渲染
      // renderer.render(scene, camera);

      // 后期处理过程根据它们添加/插入的顺序来执行，
      // 最后一个过程会被自动渲染到屏幕上
      composer.render()
    }
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit('changeActiveTitle', '欢迎来到THREEJS')
    }
  }
}
</script>
<style lang="less" scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>
