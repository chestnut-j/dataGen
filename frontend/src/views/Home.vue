<template>
  <div class="homepage">
    <a-spin :spinning="loading">
      <div class="content">
        <div class="comp-header">
          数据面板
          <a-select
            class="select-box"
            ref="select"
            v-model:value="currentCase"
            size="small"
            :style="{'width': '140px'}"
            @change="handleCaseChange"
          >
            <a-select-option v-for="item in options" :key="item.id" :value="item.id">
              {{item.title}}
            </a-select-option>
          </a-select>
          <a-button class="run-btn" type="secondary" @click="submit()">运行</a-button>
          <a-button class="download-btn" type="secondary" :disabled="!info" @click="download()">下载</a-button>
        </div>
        
        <div class="data-panel">
          <DataSpecCode  class="left-panel"/>
          <StatisticPanel :overviewChart="overviewChart"  class="right-panel"/>
        </div>
        <div class="comp-header">
          可视化面板
        </div>
        <div class="vis-panel">
          <VisualizationCode  class="left-panel"/>
          <VisualizationPanel class="right-panel"/>
        </div>
        <div class="comp-header">
          评估面板
        </div>
        <div class="evaluation-panel">
          <EvaluationCode  class="left-panel"/>
          <div class="right-panel">
            <div id="overview-chart"></div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import VisualizationCode from '../components/VisualizationCode.vue'
import DataSpecCode from '../components/DataSpecCode.vue'
import EvaluationCode from '../components/EvaluationCode.vue'
import VisualizationPanel from '../components/VisualizationPanel.vue'
import StatisticPanel from '../components/StatisticPanel.vue'

import {store} from '@/store/store.js'
import * as echarts from 'echarts'
import { caseOptions, getOverviewBarOption } from '../common'
import axios from 'axios'
import { message } from 'ant-design-vue'
import { saveAs } from 'file-saver';

export default {
  name: 'HomePage',
  components: {
    DataSpecCode,
    VisualizationCode,
    EvaluationCode,
    VisualizationPanel,
    StatisticPanel,
  },
  data(){
    return {
      overviewChart: null,
    }
  },
  computed:{
    loading(){
      return store.loading
    },
    totalLen() {
      return store.totalInfo.length
    },
    chartData() {
      return store.performArr
    },
    currentIndex(){
      return store.currentTableIndex
    },
    options(){
      return caseOptions
    },
    info(){
      return store.totalInfo
    },
    currentCase(){
      return store.currentCase
    }
  },
  watch:{
    chartData:{
      handler() {
        if(this.chartData){
          this.$nextTick(()=>{this.drawOverviewChart()})
        }
      },
      immediate: true,
      deep: true,
    }
  },
  methods:{
    handleCaseChange(val){
      store.setCurrentCase(val)
    },
    submit(){
      let myJson = store.dataSpec
      store.setLoading(true)
      axios.post('/api/submit',{data: myJson}).then(res=>{
        console.log(res.data)
        store.setTotalInfo(res.data.data)
        store.setOptionList(res.data.optionList)
        message.success('generate success')
        store.setLoading(false)
      })
      .catch(err=>{
        console.log(err)
        message.error('generate failed')
        store.setLoading(false)
      })
    },
    drawOverviewChart(){
      if (this.overviewChart != null && this.overviewChart != "" && this.overviewChart != undefined) {
        this.overviewChart.dispose();
      }
      this.overviewChart = echarts.init(document.getElementById('overview-chart'));
      // draw chart
      let data = store.performArr.map((v, i)=>{
        return { 
          value: v,
          info: store.optionList[i]
        }
      })
      console.log(data)
      this.overviewChart.setOption(getOverviewBarOption('', data))
      let that = this
      that.overviewChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: this.currentIndex})
      this.overviewChart.on('click', 'series.bar', function (e) {
        
          console.log(e);
          if(e.dataIndex != this.currentIndex){
              // remove highlight
              that.overviewChart.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: this.currentIndex});
          }
          // highlight selected one
          store.setCurrentIndex(e.dataIndex)
          that.overviewChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: e.dataIndex});
      });
    },
    download(){
      let tablelist = store.totalInfo.map(item=>item.table)
      let JSZip = require("jszip")
      let zip = new JSZip()

      console.log(tablelist)
      let heads = Object.keys(tablelist[0][0])
      tablelist.forEach((table, index)=>{
        let str = heads.join(',')+'\n'
        for(let item of table) {
          for(let head of heads) {
            str += item[head]+','
          }
          str+='\n'
        }
        zip.file(`table${index}.csv`,str)
      })
      console.log(zip)
      zip.generateAsync({type:'blob'}).then(function(content){
        saveAs(content,'test.zip')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.homepage {
  width: 100%;
  height: 100vh;
  // padding: 8px;
  .comp-header{
    width:100%;
    height: 40px;
    font-size: 26px;
    font-weight: 600;
    color: rgb(0, 0, 0);
    // background: rgb(220, 220, 220);
    border-bottom: 1.5px solid #acacac;
    line-height: 40px;
    padding-left: 15px;
    text-align: left;
    .select-box {
      margin-left: calc(18% - 280px);
      // vertical-align: middle;
      // margin-top: auto;
      // line-height: 28px;
      position: absolute;
      font-size: 22px;
      top: 7px;
      box-shadow: 0 0 2px rgb(119, 119, 119);

    }
    .run-btn{
      // margin: 5px;
      height: 28px;
      padding: auto;
      line-height: 13px;
      font-size: 22px;
      margin: auto 10px;
      position: absolute;
      top: 5px;
      margin-left: calc(18% - 120px);
      box-shadow: 0 0 2px rgb(119, 119, 119);

    }
    .download-btn{
      // margin: 5px;
      height: 28px;
      padding: auto;
      line-height: 15px;
      right:15px;
      font-size: 22px;
      top:5px;
      position: absolute;
      box-shadow: 0 0 2px rgb(119, 119, 119);

    }
  }

  #overview-chart {
    width: calc(100% - 20px);
    height: 225px;
    margin: auto;
  }
  .content {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    height:100vh;
    flex:1;
    overflow: hidden;

    .data-panel {
      display: flex;
      flex-flow: row;
      height:25%;
      overflow: hidden;
    }

    .vis-panel {
      display: flex;
      flex-flow: row;
      overflow: hidden;
    }

    .evaluation-panel {
      display: flex;
      flex-flow: row;
      height:20%;
      overflow: hidden;
    }


    .left-panel {
      width:26%;
      border: 1px solid #eeeeee;
      margin: 5px;
    }
    .right-panel {
      width:73%;
      border: 1px solid #eeeeee;
      margin: 5px;
    }
  }
  .ant-btn{
  }
}
</style>