<template>
  <div class="comp-data">
    <div class="custom-slick-arrow" style="left: 10px" @click="toLast()">
      <left-circle-outlined />
    </div>
    <a-tabs v-model:activeKey="activeKey" size="small"  class="tab-panels">
      <a-tab-pane key="1" tab="Attributes" class="tab-panel">
        <div class="statistic-panel">
          <div class="column-content" 
          v-for="item in columns" 
          :key="item.name" >
          <div class="column-name">{{ item.name }}</div>
          <div>
            <div class="column-chart" 
              v-for="chart in chartConfig[item.name]"
              :key="item.name+chart"
              :id="'column-'+item.name+chart">
            </div>
          </div>
          <div class="constraint">{{ constraints[item.name]}}</div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Raw Data" class="tab-panel">
        <div class="data-panel">
          <div class="data-content">
            <a-table :dataSource="tableData" :columns="tableColumns" size="small" :scroll="{ x: true, y: 190 }"/>
          </div>
          <div class="json-content">
            <pre>{{origin}}</pre>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <div class="custom-slick-arrow" style="right: 10px" @click="toNext()">
      <right-circle-outlined />
    </div>
  </div>
</template>

<script>
import { store } from '../store/store.js'
import { getBoxOption, getLineOption, getHistogramOption, getBarOption, getPieOption } from '../common.js'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import * as echarts from 'echarts'
import * as ecStat from 'echarts-stat'
export default {
  name: 'StatisticPanel',
  props: ['overviewChart'],
  data(){
    return {
      charts: {},
      activeKey: '1'
    }
  },
  components:{
    LeftCircleOutlined,
    RightCircleOutlined,
  },
  computed: {
    currentIndex(){
      return store.currentTableIndex
    },
    totalLen() {
      return store.totalInfo.length
    },
    tableColumns(){
      return (store.totalInfo[this.currentIndex]?.config[0].children || []).map(v=>{
                return {
                  title: v.name,
                  dataIndex: v.name,
                  key:v.name,
                  ellipsis: true,
                }
              })
    },
    columns(){
      if(store.isGptMode) {
        return this.tableData.length?Object.keys(this.tableData[0]) :[]
      }
      return store.totalInfo[this.currentIndex]?.config[0].children || []
    },
    tableData(){
      return store.totalInfo[this.currentIndex]?.table || []
    },
    origin(){
      return store.totalInfo[this.currentIndex]?.origin[0]
    },
    constraints(){
      const cols = store.totalInfo[this.currentIndex]?.origin[0]
      return Object.values(cols)[0]
    },
    chartConfig(){
      const config = {}
      this.columns.forEach(item=>{
          let keys = Object.keys(item)
          config[item.name] = []
          if(keys.includes('max') || keys.includes('min') ||  keys.includes('quantile') ||keys.includes('mean')  || keys.includes('range')){
              config[item.name].push('box')
          }
          if(keys.includes('trend')){
            config[item.name].push('line')
          }
          if(keys.includes('empty')){
            config[item.name].push('pie-empty')
          }
          if(keys.includes('freqIf')){
            config[item.name].push(`pie-freqIf,${item['freqIf'][0]}`)
          }
          if(keys.includes('frequency')){
            config[item.name].push('pie-freq')
          }
          if(keys.includes('distribution') ){
            config[item.name].push('histogram')
          }
          if(item['type']==='String'){
            config[item.name].push('bar')
          }
        })
      return config
    }
  },
  mounted(){
  },
  watch: {
    tableData:{
      handler() {
        this.$nextTick(()=>{this.initPlots()})
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true,
    }
  },
  onShow(){
    this.initPlots()
  },
  methods:{
    toLast(){
      let index = (this.currentIndex - 1 + this.totalLen)%this.totalLen
      this.overviewChart.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: this.currentIndex});
      store.setCurrentIndex(index)
      console.log(index)

      this.overviewChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: index});
    },
    toNext(){
      let index = (this.currentIndex + 1)%this.totalLen
      this.overviewChart.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: this.currentIndex});
      store.setCurrentIndex(index)
      this.overviewChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: index});
    },
    initPlots(){
      const that = this
      if(store.isGptMode){
        console.log('table',this.tableData)
        console.log('columns',this.columns)
        this.columns.forEach(item=>{
          that.drawBar(item)
        })
      }else{
        const keys = Object.keys(this.chartConfig)
        keys.forEach(key=>{
          const items = this.chartConfig[key]
          items.forEach(chart=>{
            const id = key+chart
            if(chart.indexOf('freqIf')>-1){
              let condition = chart.split(',')[1]
              that.drawPie(key, id,'freqIf',condition)
            }else{
              switch(chart){
                case 'box': 
                    that.drawBox(key, id)
                    break
                case 'line': 
                    that.drawLine(key, id)
                    break
                case 'histogram': 
                    that.drawHistogram(key, id)
                    break
                case 'bar':
                    that.drawBar(key, id)
                    break
                case 'pie-empty':
                    that.drawPie(key, id, 'empty')
                    break
                case 'pie-freqIf':
                    that.drawPie(key, id,'freqIf')
                    break
                case 'pie-freq':
                    that.drawPie(key, id, 'freq')
                    break
                default:
                    that.drawBar(key, id)
                    break
              }
            }
            
          })
        })
      }
      
    },
    drawBox(col, chart){
      let data = this.extraData(col)

      if (this.charts[chart] != null && this.charts[chart] != "" && this.charts[chart] != undefined) {
        this.charts[chart].dispose();
      }
      this.charts[chart] = echarts.init(document.getElementById('column-'+chart));
      // 绘制图表
      this.charts[chart].setOption(getBoxOption(col, data))
    },
    drawLine(col, chart){
      let data = this.extraData(col)
      if (this.charts[chart] != null && this.charts[chart] != "" && this.charts[chart] != undefined) {
        this.charts[chart].dispose();
      }
      this.charts[chart] = echarts.init(document.getElementById('column-'+chart));
      // 绘制图表
      this.charts[chart].setOption(getLineOption(col, data))
    },
    drawHistogram(col, chart){
      echarts.registerTransform(ecStat.transform.histogram);
      let data = this.tableData.map(item=>+item[col])
      if(data.length){
        let bins = ecStat.histogram(data)
        if (this.charts[chart] != null && this.charts[chart] != "" && this.charts[chart] != undefined) {
          this.charts[chart].dispose();
        }
        this.charts[chart] = echarts.init(document.getElementById('column-'+chart));
        // 绘制图表
        this.charts[chart].setOption(getHistogramOption(col, bins.data))
      }
    },
    drawBar(col, chart){
      let data = this.extraData(col)
      let bins = this.getBins(data)
      if (this.charts[chart] != null && this.charts[chart] != "" && this.charts[chart] != undefined) {
        this.charts[chart].dispose();
      }
      this.charts[chart] = echarts.init(document.getElementById('column-'+chart));
      // 绘制图表
      this.charts[chart].setOption(getBarOption(col, bins))
    },
    drawPie(col, chart, type, condition=null){
      let data = this.extraData(col)
      let myData = data
      if(type==='freqIf') {
        myData = this.getBinsFreqIf(data, condition)
      }else{
        myData = (type==='empty')?this.getEmpty(data):this.getBins2(data)
      }
      if (this.charts[chart] != null && this.charts[chart] != "" && this.charts[chart] != undefined) {
        this.charts[chart].dispose();
      }
      this.charts[chart] = echarts.init(document.getElementById('column-'+chart));
      // 绘制图表
      this.charts[chart].setOption(getPieOption(col, myData))
    },
    extraData(colName) {
      return this.tableData.map(item=>item[colName])
    },
    getBins(data){
      let obj = {}
      data.forEach(item=>{
        if(obj[item]!==undefined){
          obj[item]++
        }else{
          obj[item]=1
        }
      })
      return obj
    },
    getBins2(data){
      let obj = {}
      data.forEach(item=>{
        if(obj[item]!==undefined){
          obj[item]++
        }else{
          obj[item]=1
        }
      })
      let res = []
      for (const [k, v] of Object.entries(obj)) {
        res.push({
          name: k,
          value: v
        })
      }
      return res
    },
    getBinsFreqIf(data, condition){
      let satisfiedCount = 0
      let notSatisfiedCount = 0 
      console.log(condition)
      data.forEach(item=>{
        if(eval(item+condition)){
          satisfiedCount++
        }else{
          notSatisfiedCount++
        }
      })
      let notCondition = (condition.indexOf('>')>-1)?condition.replace('>','<='):condition.replace('<',">=")
      return [{name:condition, value:satisfiedCount},{name:notCondition, value:notSatisfiedCount}]
    },
    getEmpty(data){
      let emptyCount = 0
      let nonEmptyCount = 0 
      data.forEach(item=>{
        if(item!==null && item!==""){
          nonEmptyCount++
        }else{
          emptyCount++
        }
      })
      return [{name:'empty', value:emptyCount},{name:'non-empty', value:nonEmptyCount}]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less" scoped>
.comp-data {
  display: flex;
  flex-flow: row;
  // height: 100%;
  overflow: hidden;
  align-items: center;
  padding: 0 5px;

  .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 22px;
    color: rgb(0, 0, 0);
    // background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }
  .custom-slick-arrow:before {
    display: none;
  }
  .custom-slick-arrow:hover {
    opacity: 0.5;
  }
  .tab-panels {
    width:calc(100% - 60px);
    height: 100%;
    .tab-panel {
      height: 100%;
    }
  }

  .data-panel {
    display: flex;
    flex-flow: row;
    height: 100%;
    overflow: hidden;

    .data-content {
      height: 100%;
      width: 68%;
      margin-right:2%;
      overflow: auto;
      padding:5px;
      flex:1;

      &::-webkit-scrollbar {
        height: 4px;
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: rgb(239, 239, 239);
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 6px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #333;
      }

      &::-webkit-scrollbar-corner {
        background: transparent;
      }
    }
  }
  .json-content {
    height: 100%;
    width: 30%;
    padding: 10px 5px 0 5px;

    pre{
      height: 100%;
      font-size: 12px;
      text-align: left;
      overflow: auto;

      &::-webkit-scrollbar {
        height: 4px;
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: rgb(239, 239, 239);
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 6px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #333;
      }

      &::-webkit-scrollbar-corner {
        background: transparent;
      }
    }
  }

  .statistic-panel {
    height: 100%;
    // margin: 0 20px;
    padding: 4px 0;
    overflow-x: auto;
    white-space: nowrap;
    flex:1;
    // border-top: 1px solid #e6e6e6;
    .column-content{
      margin-right: 20px;
      display: inline-block;
      text-align: center;
      border: 1px solid #eeeeee;
      padding:0 10px;
      padding-bottom: 4px;
      .column-name {
        font-weight:600;
        padding-top:0px;
        margin-bottom: -14px;
      }
      .column-chart {
        display: inline-block;
        width:200px;
        height: 180px;
        margin:auto;
      }
      .constraint {
        width: 100%;
        background: rgba(238, 238, 238,0.35);
        padding: 2px 10px;
        margin-top:5px;
      }
    }
    // background: #e6e6e6;
    &::-webkit-scrollbar {
      height: 8px;
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 6px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #333;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }

  }

  :deep(.ant-tabs-nav) {
    margin: 0;
  }
  :deep(.ant-table-body) {
    &::-webkit-scrollbar {
      height: 4px;
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 6px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #333;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }

}

</style>
