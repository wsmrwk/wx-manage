<template>
  <div class="mod-demo-echarts-copy">
    <el-alert
      title="提示："
      type="warning"
      :closable="false">
      <div slot-scope="description">
        <p class="el-alert__description">1. 此Demo只提供ECharts官方使用文档，入门部署和体验功能。具体使用请参考：http://echarts.baidu.com/index.html</p>
      </div>
    </el-alert>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div id="J_chartLineBoxcopy" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  //todo import 'echarts-gl' 
  export default {
    data () {
      return {
        chartLine: null
      }
    },
    mounted () {
      this.initChartLine()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartLine) {
        this.chartLine.resize()
      }
    },
    methods: {
      // 折线图
      initChartLine () {
        this.$http({
          url: this.$http.adornUrl('/world/echarts'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            console.log(data)
            var option = data.data
            this.chartLine = echarts.init(document.getElementById('J_chartLineBoxcopy'))
            this.chartLine.setOption(option)
            window.addEventListener('resize', () => {
              this.chartLine.resize()
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts-copy {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
