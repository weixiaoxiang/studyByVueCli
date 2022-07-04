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
  watch: {
    mapUpdateSize: {
      handler(newval, oldval) {
        // 动态修改three的视图大小
        setTimeout(() => {
          console.log(this.container.clientWidth)
          this.renderer.setSize(
            this.container.offsetWidth,
            this.container.offsetHeight
          )
          this.camera.updateProjectionMatrix()
        }, 1000)
        // this.$nextTick(() => {
        //     console.log(this.container.clientWidth);
        //     this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        //     this.camera.updateProjectionMatrix();
        // })
      },
      immediate: false,
      deep: true
    }
  },
  mounted() {
    this.container = document.getElementById('container')
    // 场景
    this.scene = new THREE.Scene()
    // 相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    // webgl渲染器
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
      true
    )
    // 绑定元素
    this.container.appendChild(this.renderer.domElement)
    // 立方体 几何体
    const geometry = new THREE.BoxGeometry()
    // 材质
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff
    })
    // 网格对象
    const cube = new THREE.Mesh(geometry, material)
    // 将网格对象加入场景
    this.scene.add(cube)
    // 相机位置
    this.camera.position.z = 5
    // 动画
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      // 开始渲染
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(animate)
    }

    animate()
    // 监听窗口变化
    window.onresize = () => {
      return (() => {
        // 动态修改three的视图大小
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(
          this.container.offsetWidth,
          this.container.offsetHeight
        )
      })()
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
