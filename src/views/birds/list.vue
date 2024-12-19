<template>
  <div class="bird-encyclopedia">
    <div
      v-loading="loading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="loading-container"
    >
      <h1 class="bird-title">鸟类百科</h1>

      <div class="search-container">
        <el-input
          v-model="queryForm.keyWords"
          placeholder="请输入鸟类名称"
          class="search-input"
          prefix-icon="el-icon-search"
        />
        <el-button type="primary" class="search-button" @click="queryList">
          <i class="el-icon-search" /> 查询
        </el-button>
      </div>

      <br> <br>
      <!-- 表格展示鸟类信息 -->
      <el-table
        :data="birdList"
        style="width: 100%"
        border
        class="bird-table"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
          :index="getIndex"
        />
        <el-table-column
          label="鸟类名称"
          prop="name"
          width="180"
        />
        <el-table-column
          label="学名"
          prop="sname"
          width="180"
        />
        <el-table-column
          label="物种"
          prop="species"
          width="180"
        />
        <el-table-column
          label="图片"
          width="180"
        >
          <template slot-scope="scope">
            <el-image
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
              fit="cover"
              style="width: 100px; height: 100px"
              :initial-index="0"
              class="bird-image"
            >
              <div slot="error">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="栖息地"
          prop="area"
        />
        <el-table-column
          label="特点"
          prop="information"
        />
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          :current-page.sync="queryForm.pageNum"
          :page-sizes="[5, 10, 20]"
          :page-size="queryForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total * queryForm.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>

// import { getBirds } from '@/api/bird'

export default {
  data() {
    return {
      loading: false,
      queryForm: {
        keyWords: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      birdList: [{
        name: '鸟类名称',
        image: '',
        area: '栖息地',
        information: '特点',
        sname: '鸟���名称',
        species: '鸟类名称'
      }]
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.loading = true
      const url = 'http://localhost:8696/bird/bird/findBirdByName'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.queryForm)
      })
        .then(response => {
          if (!response.ok) { // 检查响应是否成功
            throw new Error('Network response was not ok')
          }
          return response.json() // 解析 JSON 数据
        })
        .then(data => {
          console.log(data) // 处理获取到的数据
          this.birdList = data.data.pageInfo.pageData
          this.total = data.data.pageInfo.totalPage
          this.birdList.forEach(item => {
            item.image = 'data:image/png;base64,' + item.image
          })
          console.log(this.total)
        })
        .catch(error => {
          console.error('Error:', error)
          this.$message.error('获取数据失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.queryList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNum = val
      this.queryList()
    },
    getIndex(index) {
      return (this.queryForm.pageNum - 1) * this.queryForm.pageSize + index + 1
    }
  }
}
</script>

<style scoped>
.bird-encyclopedia {
  padding: 30px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.loading-container {
  min-height: 200px;
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.bird-title {
  text-align: center;
  font-size: 36px;
  color: #409EFF;
  margin: 20px 0 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  font-weight: bold;
  letter-spacing: 2px;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.search-input {
  width: 300px;
  margin-right: 16px;
}

.search-button {
  padding: 12px 24px;
}

.bird-table {
  margin: 20px 0;
  border-radius: 4px;
  overflow: hidden;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
  padding: 16px 0;
}

::v-deep .el-loading-text {
  font-size: 30px;
  font-weight: bold;
  margin-top: 10px;
}

::v-deep .el-image {
  border-radius: 4px;
  transition: transform 0.3s;
}

::v-deep .el-image:hover {
  transform: scale(1.05);
  cursor: pointer;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #409EFF;
  color: white;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #409EFF;
}

.bird-image {
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

::v-deep .el-image-viewer__wrapper {
  backdrop-filter: blur(10px);
}

::v-deep .el-image-viewer__img {
  background-color: transparent;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
