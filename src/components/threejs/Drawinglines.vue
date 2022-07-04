<!--
 * @Descripttion:
 * @version:
 * @Author: yichonglou
 * @Date: 2021-08-20 11:21:01
 * @LastEditors: yichonglou
 * @LastEditTime: 2021-12-22 19:42:50
-->
<template>
  <div id="container"></div>
</template>
<script>
import * as THREE from 'three'
export default {
  name: 'Drawinglines',
  data() {
    return {}
  },
  mounted() {
    var container = document.getElementById('container')
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(container.clientWidth, container.clientHeight)
    // 绑定元素
    container.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
    camera.position.set(0, 0, 100)
    camera.lookAt(0, 0, 0)

    const scene = new THREE.Scene()
    // 创建线的材质
    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    })
    // 定义几何体
    const points = []
    points.push(new THREE.Vector3(-10, 0, 0))
    points.push(new THREE.Vector3(0, 10, 0))
    points.push(new THREE.Vector3(10, 0, 0))

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, material)
    scene.add(line)
    renderer.render(scene, camera)
  },
  methods: {}
}
</script>
<style lang="less" scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>
