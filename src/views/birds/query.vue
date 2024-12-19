<template>
  <div class="upload-container">
    <el-card class="upload-card" shadow="hover">
      <div class="header">
        <i class="el-icon-camera camera-icon" />
        <h2 class="title">智能鸟类识别</h2>
      </div>
      <div class="subtitle">上传鸟类图片，快速识别鸟类信息</div>

      <!-- 上传图片的表单 -->
      <el-upload
        class="upload-demo"
        :http-request="customUpload"
        list-type="picture-card"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :show-file-list="false"
      >
        <div class="upload-area">
          <i class="el-icon-upload upload-icon" />
          <div class="upload-text">
            <span class="main-text">点击或拖拽图片上传</span>
          </div>
        </div>
      </el-upload>

      <!-- 识别结果展示 -->
      <el-dialog
        :visible.sync="dialogVisible"
        :show-close="false"
        width="500px"
        custom-class="result-dialog"
      >
        <div slot="title" class="dialog-title">
          <i class="el-icon-discover" />
          <span>鸟类识别结果</span>
        </div>
        <div v-if="birdData">
          <div class="result-content">
            <el-image
              class="result-image"
              :src="birdData.image"
              fit="cover"
            />
            <div class="result-info">
              <h3 class="bird-name">
                {{ birdData.name }}
              </h3>
              <p class="bird-description">学名: {{ birdData.sname }}</p>
              <p class="bird-description">物种: {{ birdData.species }}</p>
              <p class="bird-description">栖息地: {{ birdData.area }}</p>
              <p class="bird-description">特点: {{ birdData.information }}</p>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="loading-result">
            <i class="el-icon-loading" />
            <p>正在进行智能识别...</p>
          </div>
        </div>
        <el-button type="primary" class="close-btn" @click="dialogVisible = false">
          <i class="el-icon-close" /> 关闭
        </el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      dialogVisible: false,
      filename: '',
      birdName: '',
      birdData: ''
    }
  },
  methods: {
    // 上传图片之前的检查
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        this.$message.error('请上传图片文件')
      }
      return isImage
    },
    async customUpload({ file }) {
      this.birdData = ''
      this.dialogVisible = true
      console.log('上传的文件名:', file.name)
      this.filename = file.name
      const formData = new FormData()
      formData.append('file', file)

      try {
        const uploadResponse = await axios.post('http://localhost:8696/bird/bird/uploadsFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        console.log(uploadResponse)

        const identifyResponse = await fetch('http://localhost:8696/bird/bird/identifyBird', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.filename)
        })
        const identifyData = await identifyResponse.json()
        console.log(identifyData)
        this.birdName = identifyData.data
        console.log(this.birdName)
        const birdResponse = await fetch('http://localhost:8696/bird/bird/findBirdByName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            keyWords: this.birdName,
            pageNum: 1,
            pageSize: 10
          })
        })
        const birdData = await birdResponse.json()
        this.birdData = birdData.data.pageInfo.pageData[0]
        this.birdData.image = 'data:image/png;base64,' + this.birdData.image
        console.log(this.birdData)
      } catch (error) {
        console.error('Error:', error)
        this.$message.error('上传或识别失败')
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style scoped>
.upload-container {
  width: 100%;
  min-height: calc(100vh - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f0f2f5;
}

.upload-card {
  width: 600px;
  padding: 40px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.camera-icon {
  font-size: 32px;
  color: #409EFF;
  margin-right: 10px;
}

.title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.subtitle {
  text-align: center;
  color: #909399;
  margin-bottom: 30px;
}

.upload-area {
  width: 100%;
  min-height: 280px;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  background-color: #b4c7e2;
}

.upload-icon {
  font-size: 48px;
  color: #909399;
  margin-top: 40px;
}

.upload-text {
  text-align: center;
  margin-top: 20px;
}

.main-text {
  display: block;
  font-size: 16px;
  color: #606266;
  margin-bottom: 8px;
}

.sub-text {
  display: block;
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
}

.result-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #303133;
  padding: 20px;
  background: #f0f2f5;
  margin: -20px -20px 20px;
  border-radius: 16px 16px 0 0;
}

.dialog-title i {
  margin-right: 8px;
  color: #409EFF;
  font-size: 24px;
}

.result-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-image {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.result-image:hover {
  transform: scale(1.02);
}

.bird-name {
  font-size: 24px;
  color: #303133;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bird-name i {
  margin-right: 8px;
  color: #409EFF;
}

.bird-description {
  color: #606266;
  line-height: 1.6;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
  width: 100%;
}

.bird-description:last-child {
  border-bottom: none;
}

.loading-result {
  text-align: center;
  padding: 40px 0;
}

.loading-result i {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 16px;
}

.loading-result p {
  color: #606266;
  font-size: 16px;
}

.close-btn {
  width: 100%;
  margin-top: 20px;
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

::v-deep .el-dialog {
  border-radius: 16px;
  overflow: hidden;
}
</style>
