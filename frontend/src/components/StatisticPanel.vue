<template>
  <div class="comp-data">
    <div class="custom-slick-arrow" style="left: 10px" @click="toLast()">
      <left-circle-outlined />
    </div>
    <a-tabs v-model:activeKey="activeKey" size="small"  class="tab-panels">
      <a-tab-pane key="1" tab="Attributes" class="tab-panel">
        <div class="data-panel">
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
          <div class="json-content">
            <!-- <pre>{{origin}}</pre> -->
            <monaco
                ref="monaco1"
                :opts="opts"
                :height="275"
              ></monaco>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Raw Data" class="tab-panel">
        <div class="data-panel">
          <div class="data-content">
            <a-table :dataSource="tableData" :columns="tableColumns" size="small" :scroll="{ x: true, y: 190 }"/>
          </div>
          <div class="json-content">
            <!-- <pre>{{origin}}</pre> -->
              <monaco
                ref="monaco2"
                :opts="opts"
                :height="275"
              ></monaco>
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
import monaco from '@/components/monaco/index.vue'

import * as echarts from 'echarts'
import * as ecStat from 'echarts-stat'
export default {
  name: 'StatisticPanel',
  props: ['overviewChart'],
  data(){
    return {
      charts: {},
      activeKey: '1',
      parseOrigin: [],
      opts: {
        value: '',
        readOnly: true, // 是否可编辑
        language: 'json', // 语言类型
        theme: 'vs-light', // 编辑器主题
        fontSize: '16px',
        minimap: {
          enabled: false
        },
        scrollbar: {
          vertical: 'hidden',
        },
        wordWrap: true,
        lineNumbers: "off",
      },
    }
  },
  components:{
    LeftCircleOutlined,
    RightCircleOutlined,
    monaco,
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
      let pre = store.totalInfo[this.currentIndex]?.origin[0] || ''
      pre=JSON.stringify(pre)
      pre = pre.replace("Frequency('+12',0.2,'12',0.3,'18',0.2,'+18',0.3)","Random('categorical, categories=['+12','12','18','+18']')")
        .replace("Frequency('-10',0.3,'-20',0.3,'-30',0.4)","Random('categorical, categories=['-10','-20','-30']')")
        .replace("Distribution('uniform',0,20)","Random('uniform, min=0, max=20')")
        .replace("Distribution('uniform',0,20)","Random('uniform, min=0, max=20')")
        .replace("Distribution('uniform',-50,-20)","Random('uniform, min=-50, max=-20')")
        .replace("Distribution('uniform',20,50)","Random('uniform, min=20, max=50')")
        .replace("Distribution('normal', 120.13, 0.02)","Random('normal, loc=120.13, scale=0.02')")
        .replace("Distribution('normal', 30.24, 0.01)","Random('normal, loc=30.24, scale=0.01')")
        .replace("Enum([1])","Random('categorical, categories=[1]')")
      return JSON.parse(pre)
    },
    constraints(){
      const cols = this.origin
      console.log(cols)
      return this.origin['columns']
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
          if(keys.includes('frequency')||keys.includes('enum')){
            config[item.name].push('pie-freq')
          }
          if(keys.includes('distribution') ){
            config[item.name].push('histogram')
          }
          if(item['type']==='String' && !keys.includes('frequency')){
            config[item.name].push('bar-str')
          }else if (item['type']==='String'){
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
    },
    origin: {
      handler() {
        if(this.origin){
          this.$nextTick(()=>{
              this.$refs.monaco1?.setVal(JSON.stringify(this.origin, null, 2))
              this.$refs.monaco2?.setVal(JSON.stringify(this.origin, null, 2))
          })
        
        }
      },
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
                case 'bar-str':
                    that.drawBar(key, id, false)
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
        let myRegression = ecStat.regression('polynomial', bins.data)
        if (this.charts[chart] != null && this.charts[chart] != "" && this.charts[chart] != undefined) {
          this.charts[chart].dispose();
        }
        this.charts[chart] = echarts.init(document.getElementById('column-'+chart));
        // 绘制图表
        this.charts[chart].setOption(getHistogramOption(col, bins.data, myRegression.points))
      }
    },
    drawBar(col, chart, showLabel=true){
      let data = this.extraData(col)
      let bins = this.getBins(data)
      if (this.charts[chart] != null && this.charts[chart] != "" && this.charts[chart] != undefined) {
        this.charts[chart].dispose();
      }
      this.charts[chart] = echarts.init(document.getElementById('column-'+chart));
      // 绘制图表
      this.charts[chart].setOption(getBarOption(col, bins, showLabel))
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
    width:calc(100% - 50px);
    height: 100%;
    .tab-panel {
      // height: 100%;
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
    width: 35%;
    padding: 5px 0 0 10px;
    font-size: 16px;
    border-left: 1px dashed #999999;

    pre{
      height: 100%;
      // font-size: 12px;
      text-align: left;
      word-wrap: break-word;
      white-space: pre-wrap;

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
      margin-right: 10px;
      display: inline-block;
      text-align: center;
      // border: 1px solid #eeeeee;
      padding:0 10px;
      padding-bottom: 4px;
      .column-name {
        font-weight:600;
        padding-top:0px;
        margin-bottom: -14px;
        font-size: 18px;
      }
      .column-chart {
        display: inline-block;
        width:250px;
        height: 180px;
        margin:auto;
      }
      .constraint {
        width: 100%;
        background: rgba(238, 238, 238,0.35);
        padding: 2px 10px;
        margin-top:5px;
        font-size: 18px;
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
    margin-top: -6px;
    padding: 0px;
  }
  :deep(.ant-tabs-tab-btn){
    font-size: 16px;
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
