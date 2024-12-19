<template>
  <div id="app" class="map-container">
    <div ref="mapContainer" class="map" />

    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
      custom-class="bird-dialog"
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-discover" />
        <span>{{ selectedBird.name }}</span>
      </div>
      <div class="bird-details-dialog">
        <div class="bird-image-container">
          <img :src="selectedBird.image" alt="bird" class="bird-image">
        </div>
        <div class="bird-info-container">
          <div class="info-item">
            <i class="el-icon-location" />
            <span class="label">栖息地:</span>
            <span class="value">{{ selectedBird.habitat }}</span>
          </div>
          <div class="info-item description">
            <i class="el-icon-info" />
            <span class="label">简介:</span>
            <span class="value">{{ selectedBird.description }}</span>
          </div>
        </div>
      </div>
    </el-dialog>

    <div v-if="birdData.length" class="bird-info">
      <h2>鸟类栖息地</h2>
      <div v-for="(bird, index) in birdData" :key="index" class="bird-card">
        <img
          :src="bird.image"
          alt="bird"
          class="bird-image"
          @click="showBirdInfo(bird)"
        >
        <div class="bird-details">
          <h3>{{ bird.name }}</h3>
          <p><strong>栖息地:</strong> {{ bird.habitat }}</p>
        </div>
      </div>
    </div>
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
          name: '褐马鸡',
          habitat: '针叶林、高山草甸',
          coordinates: [87.68, 43.77], // 新疆乌鲁木齐
          image: require('/images/褐马鸡.png'),
          description: '国家一级保护动物，是我国特有的雉类，栖息于天山等地区。繁殖期间雄鸟会表演独特的求偶舞蹈。'
        },
        {
          name: '白鹭',
          habitat: '湿地、湖泊',
          coordinates: [119.95, 31.79], // 江苏南京
          image: require('/images/白鹭.png'),
          description: '体型优雅的水鸟，全身洁白，繁殖期头部、胸部和背部有蓬松的装饰羽。常在浅水中觅食，以小鱼、虾、水生昆虫为食。'
        },
        {
          name: '黄嘴白鹭',
          habitat: '沿海滩涂、红树林',
          coordinates: [110.35, 20.02], // 海南海口
          image: require('/images/黄嘴白鹭.png'),
          description: '优雅的涉禽，全身洁白，嘴部呈黄色。主要栖息在热带、亚热带沿海地区，是红树林生态系统的重要成员。'
        },
        {
          name: '丹顶鹤',
          habitat: '沼泽、湿地',
          coordinates: [126.53, 45.80], // 黑龙江
          image: require('/images/丹顶鹤.png'),
          description: '国家一级保护动物，体羽洁白，头顶鲜红，被誉为"东方仙子"。主要分布在我国东北地区的沼泽湿地中。'
        },
        {
          name: '金雕',
          habitat: '高山草原、荒漠',
          coordinates: [106.27, 38.47], // 宁夏银川
          image: require('/images/金雕.png'),
          description: '国家一级保护动物，是最大的雕类之一。翼展可达2米以上，善于捕食旱獭等动物，是草原生态系统的顶级掠食者。'
        },
        {
          name: '红嘴鸥',
          habitat: '高原湖泊、城市水域',
          coordinates: [102.83, 24.88], // 云南昆明
          image: require('/images/红嘴鸥.png'),
          description: '昆明的城市象征，每年冬季从西伯利亚飞来越冬。体羽优美，嘴喙鲜红，经常在滇池等水域觅食，与市民和谐共处。'
        },
        {
          name: '四川雀鹛',
          habitat: '山地竹林、常绿阔叶林',
          coordinates: [104.07, 30.67], // 四川成都
          image: require('/images/四川雀鹛.png'),
          description: '中国特有鸟类，体型小巧，善于在竹林间穿梭。主要分布在四川盆地周边山区，是熊猫栖息地生态系统的重要成员。'
        },
        {
          name: '朱鹮',
          habitat: '山地森林、溪流',
          coordinates: [107.40, 33.42], // 陕西洋县
          image: require('/images/朱鹮.png'),
          description: '国家一级保护动物，全身白色略带粉红，被称为"东方宝石"。主要栖息在陕西洋县等地的山地森林中。'
        },
        {
          name: '白尾海雕',
          habitat: '海岸、海岛',
          coordinates: [121.54, 38.92], // 辽宁大连
          image: require('/images/白尾海雕.png'),
          description: '国家一级保护动物，是我国最大的海鹰。常在海岸线和近海岛屿活动，以鱼类和水鸟为食。'
        },
        {
          name: '黑颈鹤',
          habitat: '高原湿地、草甸',
          coordinates: [91.11, 29.97], // 西藏拉萨
          image: require('/images/黑颈鹤.png'),
          description: '国家一级保护动物，是世界上唯一在高原繁殖的鹤类，被称为"高原精灵"。主要分布在青藏高原的湿地中。'
        },
        {
          name: '彩鹮',
          habitat: '湿地、水田',
          coordinates: [113.28, 23.13], // 广东广州
          image: require('/images/彩鹮.png'),
          description: '体态优美的涉禽，羽毛呈现多彩的金属光泽。常在珠三角地区的湿地和水田中觅食，是岭南水乡的特色鸟类。'
        },
        {
          name: '蓝鹳',
          habitat: '沿海滩涂、河口',
          coordinates: [121.48, 31.22], // 上海崇明
          image: require('/images/蓝鹳.png'),
          description: '体型优美的大型涉禽，羽毛呈淡蓝灰色，嘴长而弯曲。常在沿海滩涂和河口觅食，以小鱼、甲壳类为食。'
        },
        {
          name: '大天鹅',
          habitat: '湖泊、沼泽',
          coordinates: [117.02, 36.67], // 山东济南
          image: require('/images/大天鹅.png'),
          description: '国家二级保护动物，体型硕大，全身洁白。每年冬季会在山东等地越冬，是候鸟保护的重要对象。'
        }
      ],
      dialogVisible: false, // 控制弹窗显示与否
      selectedBird: {} // 当前选中的鸟类信息
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      echarts.registerMap('china', chinaMap)
      const myChart = echarts.init(this.$refs.mapContainer)

      const option = {
        backgroundColor: '#f6f6f6', // 设置背景色
        title: {
          text: '中国鸟类分布图',
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 24,
            fontWeight: 'bold'
          }
        },
        geo: {
          map: 'china',
          roam: true,
          zoom: 1.2, // 稍微放大地图
          label: {
            emphasis: {
              show: true,
              color: '#333'
            }
          },
          itemStyle: {
            areaColor: '#e6e8eb', // 地图区域颜色
            borderColor: '#a7a7a7', // 边界颜色
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              areaColor: '#cce7ff', // 悬停时的颜色
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
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
              symbol: `image://${bird.image}`,
              symbolSize: [50, 50], // 调整图标大小
              label: {
                formatter: bird.name,
                position: 'top',
                show: true,
                fontSize: 14,
                color: '#333',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: [4, 8],
                borderRadius: 4
              }
            })),
            emphasis: {
              scale: 1.2, // 悬停时放大效果
              label: {
                show: true,
                color: '#409EFF',
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                const bird = this.birdData.find(b => b.name === params.name)
                return `
                  <div style="padding: 8px">
                    <h3 style="margin: 0 0 8px 0">${params.name}</h3>
                    <p style="margin: 0">栖息地: ${bird.habitat}</p>
                  </div>
                `
              },
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#eee',
              borderWidth: 1,
              padding: 0,
              textStyle: {
                color: '#333'
              }
            }
          }
        ]
      }

      myChart.setOption(option)

      // 添加点击事件监听器
      myChart.on('click', (params) => {
        if (params.componentType === 'series') {
          const bird = this.birdData.find(b => b.name === params.name)
          if (bird) {
            this.showBirdInfo(bird)
          }
        }
      })

      // 添加窗口大小改变时的自适应
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },

    // 点击鸟类图片时显示信息
    showBirdInfo(bird) {
      this.selectedBird = bird
      this.dialogVisible = true // 显示弹窗
    },

    handleClose(done) {
      this.dialogVisible = false // 关闭弹窗
    }
  }

}
</script>

<style scoped>
/* 整体容器 */
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
  padding: 20px;
}

/* 地图容器 */
.map {
  width: 80%;
  height: 800px;
  border: none;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* 鸟类信息部分 */
.bird-info {
  width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.bird-info h2 {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

/* 鸟类卡片 */
.bird-card {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.bird-card img.bird-image {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.bird-card .bird-details {
  flex: 1;
}

.bird-card .bird-details h3 {
  font-size: 20px;
  margin: 0;
  color: #444;
}

.bird-card .bird-details p {
  color: #666;
  font-size: 16px;
  margin: 5px 0;
}

/* 弹窗样式 */
.bird-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-title {
  display: flex;
  align-items: center;
  font-size: 22px;
  padding: 20px;
  background: #f5f7fa;
  margin: -20px -20px 20px;
  border-radius: 16px 16px 0 0;
}

.dialog-title i {
  margin-right: 10px;
  color: #409EFF;
  font-size: 24px;
}

.bird-details-dialog {
  padding: 20px;
}

.bird-image-container {
  text-align: center;
  margin-bottom: 24px;
}

.bird-image-container img {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bird-info-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.info-item i {
  color: #409EFF;
  margin-right: 8px;
  margin-top: 3px;
}

.info-item .label {
  font-weight: bold;
  color: #606266;
  margin-right: 8px;
  white-space: nowrap;
}

.info-item .value {
  color: #303133;
  flex: 1;
}

.info-item.description {
  margin-bottom: 0;
}

.info-item.description .value {
  line-height: 1.6;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .map {
    width: 100%;
  }

  .bird-info {
    width: 100%;
  }
}

::v-deep .el-dialog {
  border-radius: 10px !important;
  overflow: hidden;
}

</style>
