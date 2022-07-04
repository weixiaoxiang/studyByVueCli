<template>
  <div class="waterdroplets">
    <div ref="waterdroplets" class="d1"></div>
    <div ref="waterdroplets2" class="d2"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-liquidfill'

export default {
  data() {
    return {}
  },
  mounted() {
    this.initEcharts()
    this.pieChart()
  },
  methods: {
    initEcharts() {
      const waterdroplets = echarts.init(this.$refs.waterdroplets)
      const option = {
        series: [
          {
            type: 'liquidFill',
            radius: '300px',
            data: [0.6],
            shape:
              'path://M 100 120 a 140 140 0 1 0 198 0 c -26 -26 -44 -48 -44 -90 c -42 28 -128 64 -154 90"',
            label: {
              normal: {
                color: '#fff',
                insideColor: 'transparent',
                textStyle: {
                  fontSize: 30,
                  fontWeight: 'bold'
                }
              }
            },
            color: [
              {
                type: 'linear',
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 1,
                    color: ['#6a7feb'] // 0% 处的颜色
                  },
                  {
                    offset: 0,
                    color: ['#27e5f1'] // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            ],
            outline: {
              show: true,
              borderDistance: 5,
              itemStyle: {
                borderColor: 'rgba(67,209,100,1)',
                borderWidth: 0
              }
            }
          }
        ]
      }
      waterdroplets.setOption(option)
    },
    pieChart() {
      var myChart = echarts.init(this.$refs.waterdroplets2)
      const option = {
        series: [
          {
            name: 'title',
            type: 'pie',
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ['45%', '55%'],
            center: ['50%', '50%'],
            color: [
              'rgba(0, 150, 254, 1)',
              'rgba(2, 205, 206, 1)',
              'rgba(253, 160, 0, 1)',
              'rgba(191, 40, 18, 1)'
            ],
            label: {
              show: true,
              formatter: params => {
                return params.value + '\n' + params.percent + '%'
              }
            },
            labelLine: {
              show: true,
              length: 30,
              length2: 20,
              lineStyle: {
                type: 'dashed'
              }
            },
            itemStyle: {
              borderColor: 'rgba(0, 18, 58, 1)',
              borderWidth: 5
            },
            data: [
              {
                value: 41,
                name: '低级',
                label: {
                  color: 'rgba(0, 150, 254, 1)'
                }
              },
              {
                value: 20,
                name: '中级',
                label: {
                  color: 'rgba(2, 205, 206, 1)'
                }
              }
            ]
          },
          {
            name: '水球图',
            type: 'liquidFill',
            radius: '45%',
            data: [0.5, 0.55], // 几个数代表几层波浪
            center: ['50%', '50%'],
            backgroundStyle: {
              color: 'RGBA(51, 66, 127, 0)'
            },
            color: [
              {
                type: 'linear',
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 1,
                    color: ['rgba(0, 117, 241, 1)'] // 0% 处的颜色
                  },
                  {
                    offset: 0,
                    color: ['rgba(0, 117, 241, 0)'] // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            ],
            label: {
              normal: {
                color: '#27e5f1',
                insideColor: '#27e5f1',
                textStyle: {
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              }
            },
            outline: {
              show: false,
              borderDistance: 5,
              itemStyle: {
                borderColor: '#27e5f1',
                borderWidth: 3
              }
            }
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => myChart.resize(), false)
    }
  }
}
</script>

<style lang="less" scoped>
.waterdroplets {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  div {
    flex: 1;
  }
}
</style>
