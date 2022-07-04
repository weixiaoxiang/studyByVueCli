<template>
  <div id="cesiumContainer">
    <el-form ref="form" :model="form" size="mini" label-width="80px">
      <!-- Model Color -->
      <el-row>
        <el-col :span="24">
          <el-tag type="success" size="mini">Model颜色</el-tag>
        </el-col>
      </el-row>
      <el-form-item label="Mode">
        <el-select
          v-model="form.colorBlendMode"
          placeholder="请选择"
          @change="changeForm"
        >
          <el-option label="Highlight" value="Highlight"> </el-option>
          <el-option label="Replace" value="Replace"> </el-option>
          <el-option label="Mix" value="Mix"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Color">
        <el-select
          v-model="form.color"
          placeholder="请选择"
          @change="changeForm"
        >
          <el-option label="White" value="White"> </el-option>
          <el-option label="Red" value="Red"> </el-option>
          <el-option label="Green" value="Green"></el-option>
          <el-option label="Blue" value="Blue"></el-option>
          <el-option label="Yellow" value="Yellow"></el-option>
          <el-option label="Gray" value="Gray"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Alpha">
        <el-slider
          v-model="form.alpha"
          :format-tooltip="formatTooltip"
          @change="changeForm"
        ></el-slider>
      </el-form-item>
      <el-form-item label="Mix">
        <el-slider
          v-model="form.mix"
          :format-tooltip="formatTooltip"
          :disabled="isDisabled"
          @change="changeForm"
        >
        </el-slider>
      </el-form-item>

      <!-- Model Silhouette -->
      <el-row>
        <el-col :span="24">
          <el-tag type="success" size="mini">Model轮廓后渲染颜色</el-tag>
        </el-col>
      </el-row>
      <el-form-item label="Color">
        <el-select
          v-model="form.silhouetteColor"
          placeholder="请选择"
          @change="changeForm"
        >
          <el-option label="Red" value="Red"> </el-option>
          <el-option label="Green" value="Green"></el-option>
          <el-option label="Blue" value="Blue"></el-option>
          <el-option label="Yellow" value="Yellow"></el-option>
          <el-option label="Gray" value="Gray"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Alpha">
        <el-slider
          v-model="form.alpha1"
          :format-tooltip="formatTooltip"
          @change="changeForm"
        ></el-slider>
      </el-form-item>
      <el-form-item label="Size">
        <el-slider
          v-model="form.size"
          :format-tooltip="formatTooltip"
          @change="changeForm"
        ></el-slider>
      </el-form-item>
      <!-- 是否显示阴影 -->
      <el-form-item label="阴影">
        <el-checkbox
          v-model="form.isShadows"
          @change="changeForm"
        >是否显示阴影</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  filters: {
    colorBlendModeFormat(value) {
      return value.toUpperCase()
    }
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      entity: null,
      form: {
        color: 'Red',
        colorBlendMode: 'Highlight',
        alpha: 100,
        mix: 10, // 开启混合模式的强度
        silhouetteColor: 'yellow',
        alpha1: 100,
        size: 2,
        isShadows: true
      },
      isDisabled: true // 控制mix是否禁用
    }
  },
  computed: {
    colorBlendMode: function () {
      return this.form.colorBlendMode.toUpperCase()
    }
  },
  watch: {
    // 监听地图div大小是否发生变化
    colorBlendMode(newVal, oldVal) {
      this.isDisabled = newVal !== 'Mix'.toUpperCase()
    }
  },
  created() {
    this.changeActiveTitle()
  },
  mounted() {
    window.viewer = new Cesium.Viewer('cesiumContainer', {
      infoBox: false,
      selectionIndicator: false,
      shadows: true,
      shouldAnimate: true
    })
    this.createModel('data/SampleData/models/CesiumAir/Cesium_Air.glb', 5000)
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '修改entity小飞机模型的外观、轮廓颜色'
      )
    },
    createModel(url, height) {
      window.viewer.entities.removeAll()
      var position = Cesium.Cartesian3.fromDegrees(
        -123.0744619,
        44.0503706,
        height
      )
      var heading = Cesium.Math.toRadians(135)
      var pitch = 0
      var roll = 0
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      )
      url = this.publicPath + url
      this.entity = window.viewer.entities.add({
        name: url,
        position: position,
        orientation: orientation,
        model: {
          uri: url,
          minimumPixelSize: 128,
          maximumScale: 20000,
          color: this.getColor(this.form.color, this.form.alpha / 100), // 颜色
          colorBlendMode: this.getColorBlendMode(
            this.form.colorBlendMode.toUpperCase()
          ),
          colorBlendAmount: parseFloat(this.form.mix / 100),
          silhouetteColor: this.getColor(
            this.form.silhouetteColor,
            this.form.alpha1 / 100
          ),
          silhouetteSize: parseFloat(this.form.size)
        }
      })
      console.log(this.form.isShadows)
      window.viewer.shadows = this.form.isShadows
      window.viewer.flyTo(this.entity).then(() => {
        this.$message.success('操作成功')
        window.viewer.trackedEntity = this.entity
      })
    },
    getColorBlendMode(colorBlendMode) {
      return Cesium.ColorBlendMode[colorBlendMode.toUpperCase()]
    },
    getColor(colorName, alpha) {
      var color = Cesium.Color[colorName.toUpperCase()]
      return Cesium.Color.fromAlpha(color, parseFloat(alpha))
    },
    formatTooltip(val) {
      return val / 100
    },
    changeForm() {
      this.createModel('data/SampleData/models/CesiumAir/Cesium_Air.glb', 5000)
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  .el-form {
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    height: 70%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    color: #fff;

    .el-select {
      width: 100%;
    }

    > .el-form-item {
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }
}

.el-col {
  padding: 8px;
}

.el-tag {
  width: 100%;
}
</style>
<style>
.el-select-dropdown {
  height: 100%;
  min-height: 100px;
  max-height: 180px;
}

.el-scrollbar {
  height: 100%;
}

.el-select-dropdown__list:hover .el-scrollbar__bar.is-vertical {
  opacity: 1;
  background-color: #dddee0;
}
</style>
