<template>
  <div class="homepage">
    <a-spin :spinning="loading">
      <div class="content">
        <div class="comp-header">
          Data Attibutes Panel
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
          <a-button class="run-btn" type="secondary" @click="submit()">Run</a-button>
          <a-button class="download-btn" type="secondary" :disabled="!info" @click="download()">Download</a-button>
        </div>
        
        <div class="data-panel">
          <DataSpecCode  class="left-panel"/>
          <StatisticPanel :overviewChart="overviewChart"  class="right-panel"/>
        </div>
        <div class="comp-header">
          Visualization Panel
        </div>
        <div class="vis-panel">
          <VisualizationCode  class="left-panel"/>
          <VisualizationPanel class="right-panel"/>
        </div>
        <div class="comp-header">
          Evaluation Panel
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
      // 绘制图表
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
              //没用选中的取消高亮
              that.overviewChart.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: this.currentIndex});
          }
          //选中某一条高亮
          store.setCurrentIndex(e.dataIndex)
          that.overviewChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: e.dataIndex});
      });
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
    font-size: 22px;
    font-weight: 500;
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
      font-size: 18px;
      top: 9px;
      box-shadow: 0 0 2px rgb(119, 119, 119);

    }
    .run-btn{
      // margin: 5px;
      height: 24px;
      padding: auto;
      line-height: 13px;
      font-size: 18px;
      margin: auto 10px;
      position: absolute;
      top: 9px;
      margin-left: calc(18% - 120px);
      box-shadow: 0 0 2px rgb(119, 119, 119);

    }
    .download-btn{
      // margin: 5px;
      height: 24px;
      padding: auto;
      line-height: 13px;
      right:15px;
      font-size: 18px;
      top:9px;
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