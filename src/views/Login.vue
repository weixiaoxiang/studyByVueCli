<template>
  <div id="container" class="login-page" @click="atuoMusic">
    <div class="login-panel">
      <div class="img-box"><img src="~@assets/images/logo.png" alt="" /></div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            show-password
          >
          </el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button
            size="mini"
            type="warning"
            @click="resetForm"
          >重置</el-button>
          <el-button size="mini" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <audio id="music" ref="MusicPlay" :src="mus" loop height="100" width="100">
      <!-- <source :src="mus" type="audio/mp3" />  -->
    </audio>
  </div>
</template>
<script>
import * as THREE from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
export default {
  filters: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        var reg = new RegExp('^[0-9]*$')
        reg.test(value) ? callback() : callback(new Error('请输入数字密码'))
      }
    }
    return {
      mus: require('@assets/media/science.mp3'),
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          },
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  created() {},
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
      console.log(clientWidth, clientHeight)
      // 渲染器
      renderer = new THREE.WebGLRenderer()
      // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
      renderer.setPixelRatio(window.devicePixelRatio)
      // 设置渲染器渲染初始大小
      renderer.setSize(clientWidth, clientHeight, true)
      container.appendChild(renderer.domElement)
      // 相机
      camera = new THREE.PerspectiveCamera(
        70,
        clientWidth / clientHeight,
        1,
        1000
      )
      // 相机位置
      camera.position.z = 400
      // 场景
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
      scene.add(new THREE.AmbientLight(0x222222))
      light = new THREE.DirectionalLight(0xffffff)
      light.position.set(1, 1, 1)
      scene.add(light)
      // postprocessing
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
      composer.render()
    }
  },
  methods: {
    atuoMusic() {
      setTimeout(() => {
        document.getElementById('music').play()
      }, 1500)
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate((vali, obj) => {
        if (!vali) {
          return this.$message.error('输入格式不正确')
        }
        if (
          this.loginForm.username !== 'wxx' &&
          this.loginForm.password !== 123456
        ) {
          return this.$message.error('账号密码错误')
        }
        window.sessionStorage.setItem('username', 'wxx')
        window.sessionStorage.setItem('password', 123456)
        this.$router.push('/home')
        this.$message.success('登录成功')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login-page {
  height: 100%;
  background: url("~@assets/images/login.png") no-repeat;
  background-size: cover;
}

.login-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 350px;
  // background-color: rgba(255, 255, 255, 0.8);
  background-color: rgba(84, 255, 163, 0.5);
  border-radius: 15px;

  .img-box {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px #ccc;

    img {
      width: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }

  .el-form {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;

    .btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
