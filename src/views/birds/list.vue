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

      <div style="display: flex; align-items: center;">
        <el-input v-model="queryForm.keyWords" placeholder="请输入鸟类名称" style="display: inline-block; width: 200px; margin-right: 10px;" />
        <el-button type="primary" @click="queryList">查询</el-button>
      </div>

      <br> <br>
      <!-- 表格展示鸟类信息 -->
      <el-table
        :data="birdList"
        style="width: 100%"
        border
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
        sname: '鸟类名称',
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
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
}

.bird-image {
  width: 100px;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
}
.bird-title {
text-align: center;
font-size: 36px;
color: #409EFF;
margin: 20px 0;
text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
font-weight: bold;
letter-spacing: 2px;
}

/* 添加自定义加载样式 */
.loading-container {
  min-height: 200px;
}

/* 通过深度选择器修改 Element UI 的加载文字样式 */
::v-deep .el-loading-text {
  font-size: 30px;
  font-weight: bold;
  margin-top: 10px;
}

/* 添加分页样式 */
.pagination-container {
  margin-top: 20px;
  text-align: center;
}
</style>
