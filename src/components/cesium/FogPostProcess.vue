<template>
  <div id="cesiumContainer"></div>
</template>
<script>
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTQ1MTJkOC1kODA1LTQ3ZjMtYjFiMS1lNDljNGM3NDEzMTkiLCJpZCI6MjU5LCJpYXQiOjE2MjI1NjA5OTF9.DSp0vQUYQfm1d9ffL0PjA1WgnGTnmNdh3-JEl1Aiouw'

// http://localhost:8001/Apps/Sandcastle/index.html?src=Fog%20Post%20Process.html&label=All
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  watch: {},
  mounted() {
    const that = this
    var viewer = new Cesium.Viewer('cesiumContainer', {
      // terrainProvider: Cesium.createWorldTerrain(),
    })

    if (!viewer.scene.context.depthTexture) {
      window.alert('This browser does not support the fog post process.')
    }

    var tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(40866)
    })

    viewer.scene.primitives.add(tileset)

    viewer.scene.camera.setView({
      destination: new Cesium.Cartesian3(
        1216356.033078094,
        -4736402.278325668,
        4081270.375520902
      ),
      orientation: new Cesium.HeadingPitchRoll(
        0.08033365594766728,
        -0.29519015695063455,
        0.00027759141518046704
      ),
      endTransform: Cesium.Matrix4.IDENTITY
    })

    var fragmentShaderSource =
      'float getDistance(sampler2D depthTexture, vec2 texCoords) \n' +
      '{ \n' +
      ' float depth = czm_unpackDepth(texture2D(depthTexture, texCoords)); \n' +
      ' if (depth == 0.0) { \n' +
      ' return czm_infinity; \n' +
      ' } \n' +
      ' vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); \n' +
      ' return -eyeCoordinate.z / eyeCoordinate.w; \n' +
      '} \n' +
      'float interpolateByDistance(vec4 nearFarScalar, float distance) \n' +
      '{ \n' +
      ' float startDistance = nearFarScalar.x; \n' +
      ' float startValue = nearFarScalar.y; \n' +
      ' float endDistance = nearFarScalar.z; \n' +
      ' float endValue = nearFarScalar.w; \n' +
      ' float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); \n' +
      ' return mix(startValue, endValue, t); \n' +
      '} \n' +
      'vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) \n' +
      '{ \n' +
      ' return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); \n' +
      '} \n' +
      'uniform sampler2D colorTexture; \n' +
      'uniform sampler2D depthTexture; \n' +
      'uniform vec4 fogByDistance; \n' +
      'uniform vec4 fogColor; \n' +
      'varying vec2 v_textureCoordinates; \n' +
      'void main(void) \n' +
      '{ \n' +
      ' float distance = getDistance(depthTexture, v_textureCoordinates); \n' +
      ' vec4 sceneColor = texture2D(colorTexture, v_textureCoordinates); \n' +
      ' float blendAmount = interpolateByDistance(fogByDistance, distance); \n' +
      ' vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount); \n' +
      ' gl_FragColor = alphaBlend(finalFogColor, sceneColor); \n' +
      '} \n'

    var ellipsoid = viewer.scene.globe.ellipsoid
    var postProcessStage = viewer.scene.postProcessStages.add(
      new Cesium.PostProcessStage({
        fragmentShader: fragmentShaderSource,
        uniforms: {
          fogByDistance: new Cesium.Cartesian4(10, 0.0, 200, 1.0),
          fogColor: Cesium.Color.BLACK
        }
      })
    )
  },
  created() {
    this.changeActiveTitle()
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '黑夜雾化，超出当前相机指定范围外不可见'
      )
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
