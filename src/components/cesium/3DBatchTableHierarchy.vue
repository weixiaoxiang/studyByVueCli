<template>
  <div id="cesiumContainer">
    <el-select
      v-model="value"
      :popper-append-to-body="false"
      placeholder="请选择"
      @change="changeSelected"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      tileset: null,
      styles: [],
      value: 'no style',
      options: [
        {
          value: 'no style',
          label: 'no style'
        },
        {
          value: 'Color by building',
          label: 'Color by building'
        },
        {
          value: 'Color all doors',
          label: 'Color all doors'
        },
        {
          value: 'Color all features derived from door',
          label: 'Color all features derived from door'
        },
        {
          value: 'Color features by class name',
          label: 'Color features by class name'
        },
        {
          value: 'Style by height',
          label: 'Style by height'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      activeTitle: (state) => state.activeTitle
    })
  },
  created() {
    this.changeActiveTitle()
  },
  mounted() {
    var viewer = new Cesium.Viewer('cesiumContainer')
    window.viewer = viewer
    this.tileset = new Cesium.Cesium3DTileset({
      url: '/data/SampleData/Cesium3DTiles/Hierarchy/BatchTableHierarchy/tileset.json'
    })

    window.viewer.scene.primitives.add(this.tileset)
    window.viewer.zoomTo(
      this.tileset,
      new Cesium.HeadingPitchRange(0.0, -0.3, 0.0)
    )
    this.styles = [
      {
        name: 'no style',
        style: {}
      },
      {
        name: 'Color by building',
        style: {
          color: {
            conditions: [
              ["${building_name} === 'building0'", "color('purple')"],
              ["${building_name} === 'building1'", "color('red')"],
              ["${building_name} === 'building2'", "color('orange')"],
              ['true', "color('blue')"]
            ]
          }
        }
      },
      {
        name: 'Color all doors',
        style: {
          color: {
            conditions: [
              ["isExactClass('door')", "color('orange')"],
              ['true', "color('white')"]
            ]
          }
        }
      },
      {
        name: 'Color all features derived from door',
        style: {
          color: {
            conditions: [
              ["isClass('door')", "color('orange')"],
              ['true', "color('white')"]
            ]
          }
        }
      },
      {
        name: 'Color features by class name',
        style: {
          defines: {
            suffix: "regExp('door(.*)').exec(getExactClassName())"
          },
          color: {
            conditions: [
              ["${suffix} === 'knob'", "color('yellow')"],
              ["${suffix} === ''", "color('lime')"],
              ['${suffix} === null', "color('gray')"],
              ['true', "color('blue')"]
            ]
          }
        }
      },
      {
        name: 'Style by height',
        style: {
          color: {
            conditions: [
              ['${height} >= 10', "color('purple')"],
              ['${height} >= 6', "color('red')"],
              ['${height} >= 5', "color('orange')"],
              ['true', "color('blue')"]
            ]
          }
        }
      }
    ]
    var handler = new Cesium.ScreenSpaceEventHandler(window.viewer.canvas)
    // 鼠标中击后隐藏要素
    handler.setInputAction(function (movement) {
      var feature = window.viewer.scene.pick(movement.position)
      if (!Cesium.defined(feature)) {
        return
      }
      var propertyNames = feature.getPropertyNames()
      var length = propertyNames.length
      for (var i = 0; i < length; ++i) {
        var name = propertyNames[i]
        var value = feature.getProperty(name)
        console.log(' ' + name + ' : ' + value)
      }
      feature.show = !feature.show
    }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK)
  },
  methods: {
    changeActiveTitle() {
      this.$store.commit(
        'changeActiveTitle',
        '根据批量表的属性值，修改对应的样式'
      )
    },
    changeSelected(value) {
      const style = this.styles.find((item) => {
        return item.name === value
      })
      this.tileset.style = new Cesium.Cesium3DTileStyle(style.style)
    }
  }
}
</script>
<style lang="less" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;

  .el-select {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
    height: 100%;
    max-height: 200px;
  }
}

// 解决下拉框滚动条问题
.el-select/deep/.el-select-dropdown {
  height: 100%;

  .el-scrollbar {
    height: 100%;

    .el-select-dropdown__list:hover .el-scrollbar__bar.is-vertical {
      opacity: 1;
      background-color: #dddee0;
    }
  }
}
</style>
