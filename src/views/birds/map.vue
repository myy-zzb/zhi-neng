<template>
  <div id="app">
    <div ref="mapContainer" style="width: 100%; height: 500px;" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import chinaMap from 'echarts/map/json/china.json'

export default {
  data() {
    return {
      birdData: [
        {
          name: '白鹭',
          habitat: '湿地、湖泊',
          coordinates: [116.40, 39.90], // 经度和纬度
          image: require('/images/白鹭.png') // 鸟类图片
        },
        {
          name: '丹顶鹤',
          habitat: '湿地',
          coordinates: [120.52, 31.45],
          image: require('/images/丹顶鹤.png')
        }
      ]
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      // 注册中国地图
      echarts.registerMap('china', chinaMap)
      const myChart = echarts.init(this.$refs.mapContainer)

      const option = {
        geo: {
          map: 'china',
          roam: true,
          label: {
            emphasis: {
              show: false
            }
          }
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: this.birdData.map(bird => ({
              name: bird.name,
              value: [...bird.coordinates, 1],
              symbol: `image://${bird.image}`, // 使用图片作为标记
              symbolSize: 40,
              label: {
                formatter: bird.name,
                position: 'top',
                show: true
              }
            })),
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                const bird = this.birdData.find(b => b.name === params.name)
                return `${params.name}<br>栖息地: ${bird.habitat}`
              }
            }
          }
        ]
      }

      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
