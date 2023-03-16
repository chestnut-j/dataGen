<template>
  <div class="table-panel">
    <div class="content">
      <div class="custom-slick-arrow" style="left: 10px" @click="toLast()">
        <left-circle-outlined />
      </div>
      <div class="panel-content" id="outer">
        <div class="item-outer" 
            v-for="(item,index) in info" 
            :key="`chart-dom-${index}`"
            v-show="`${index}`==`${currentIndex}`" 
            :id="`outer-${index}`">
          <div class="chart-content" :id="`chart-dom-${index}`" >
            <svg :id="`chart-${index}`"></svg>
          </div>
        </div>
      </div>
      <div class="custom-slick-arrow" style="right: 10px" @click="toNext()">
        <right-circle-outlined />
      </div>
    </div>
    <!-- <div class="footer">
      {{ totalLen?currentIndex+1:0 }}/{{ totalLen }}
    </div> -->
    
    <div v-if="totalLen" class="header">
      <div class="validation-label">data Intersect</div>
      <div id="overview-chart"></div>
    </div>
  </div>
</template>
<script>
import {store} from '../store/store.js'
import * as d3 from 'd3';
import * as echarts from 'echarts'
import * as visCharts from '@zjlabvis/vis-charts'  

import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import { getOverviewBarOption } from '../common.js';
export default {
  name: 'TablePanel',
  props: {
  },
  components:{
    LeftCircleOutlined,
    RightCircleOutlined,
  },
  data(){
    return {
      currentTab: 0,
      overviewChart: null,
      echartsList:[]
    }
  },
  computed:{
    info(){
      return store.totalInfo
    },
    // tableData(){
    //   return store.currentTable
    // },
    columns(){
      return store.config.map(v=>{
                return {
                  title: v.name,
                  dataIndex: v.name,
                  key:v.name,
                  ellipsis: true,
                }
              })
    },
    currentIndex(){
      return store.currentTableIndex
    },
    tableData(){
      return store.totalInfo[this.currentIndex]?.table || []
    },
    totalLen() {
      return this.info.length
    }
  },
  watch:{
    // tableData:{
    //   handler() {
    //     d3.select('#outer').selectAll('*').remove()
    //     d3.select('#outer')
    //       .append('div')
    //         .attr("id",'chart-dom')
    //         .attr('class','chart-content')
    //         .style('height','100%')
    //         .style('width','100%')
    //     d3.select('#chart-dom')
    //       .append('svg').attr("id",'chart')
    //     this.$nextTick(()=>{this.drawChart()})
    //   },
    //   immediate: true,
    //   deep: true,
    // }
    info:{
      handler() {
        store.setCurrentIndex(0)
        this.$nextTick(()=>{
          let perfArr = []
          for(let i=0;i<this.info.length;i++){ 
            d3.select(`#outer-${i}`).selectAll('*').remove()
            d3.select(`#outer-${i}`)
              .append('div')
                .attr("id",`chart-dom-${i}`)
                .attr('class','chart-content')
                .style('height','530px')
                .style('width','1233px')
            // d3.select(`#chart-dom-${i}`)
            //   .append('svg').attr("id",`chart-${i}`)
            this.$nextTick(()=>{
              let start = +new Date()
              this.drawChart(i)
              let end = +new Date()
              let efficiencyTest = end-start
              const data = this.info[i]?.table || []
              let arg = store.evaluationFunction(data, `chart-dom-${i}`, this.echartsList[i], efficiencyTest)
              perfArr.push(arg)
            })
          } 
          
          this.$nextTick(()=>{
            store.setPerformArr(perfArr)
            console.log(perfArr)
            this.$nextTick(()=>{this.drawOverviewChart()})
          })
        })
      },
      immediate: true,
      deep: true,
    }
  },  
  methods:{
    handleTabChange(val){
      this.currentTab = val
      store.setCurrentIndex(val)
    },
    toLast(){
      let index = (this.currentIndex - 1 + this.totalLen)%this.totalLen
      this.overviewChart.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: this.currentIndex});
      store.setCurrentIndex(index)
      this.overviewChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: index});
    },
    toNext(){
      let index = (this.currentIndex + 1)%this.totalLen
      this.overviewChart.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: this.currentIndex});
      store.setCurrentIndex(index)
      this.overviewChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: index});
    },
    onChange(val){
      store.setCurrentIndex(val)
    },
    getColumns(config){
      return config[0].children.map(v=>{
                return {
                  title: v.name,
                  dataIndex: v.name,
                  key:v.name,
                  ellipsis: true,
                }
              })
    },
    async drawChart(index){
      // const data = this.tableData
      const data = this.info[index]?.table || []
      if(data.length){
          // const chartDom = document.getElementById(`chart-dom-${index}`)
          // if (this.echartsList[index] != null && this.echartsList[index] != "" && this.echartsList[index] != undefined) {
          //   this.echartsList[index]=store.visFunction(data, `chart-dom-${index}`, d3, echarts, visCharts)
          // }else{
          //   const myChart = echarts.init(chartDom);
          //   this.echartsList[index]=store.visFunction(data, `chart-dom-${index}`, d3, echarts, visCharts )
          // }
        this.echartsList[index]=store.visFunction(data, `chart-dom-${index}`, d3, echarts, visCharts )
      }
    },
    drawOverviewChart(){
      if (this.overviewChart != null && this.overviewChart != "" && this.overviewChart != undefined) {
        this.overviewChart.dispose();
      }
      this.overviewChart = echarts.init(document.getElementById('overview-chart'));
      // 绘制图表
      this.overviewChart.setOption(getOverviewBarOption('', store.performArr))
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

.table-panel {
  height: calc(100% - 25px);
  overflow: hidden;
  .header {
    height: 100px;
    border-top:1px solid #dcdada ;
    margin: 2px 10px;
    display: flex;
    align-items: end;
    justify-content: flex-start;
    // background: rgba(207, 207, 207, 0.1);
  }
  .validation-label{
    width: 130px;
    font-size: 16px;
    padding-bottom: 10px;
    padding-left: 32px;
    line-height: 24px;

  }
  #overview-chart {
    width: calc(100% - 260px);
    height: 100px;
    // margin: auto;
  }
  .content {
    height: calc(100% - 130px);
    padding: 0 10px 0 10px;
    overflow: hidden;
    display: flex;
    flex-flow: row;
    align-items: center;
  }
  .footer {
    bottom: 15px;
    height: 20px;
    font-size: 14px;
    text-align: center;
  }
  .panel-content {
    // position: relative;
    height: 100%;
    margin: 5px;
    overflow: auto;
    text-align: center;
    width: calc(100% - 60px);
    .item-outer{
      width:100%;
      height:100%;
      text-align: center;
    }
    .chart-content {
      height: 100%;
      width:100%;
      text-align: center;
      margin:auto;
    }
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
  .table-content {
    width:70%;
    height: 100%;
    display: inline-block;
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
.custom-slick-arrow {
  width: 30px;
  height: 30px;
  font-size: 30px;
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
</style>
