<template>
  <div class="table-panel">
    <div class="header">
      <div id="overview-chart">
      </div>
    </div>
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
    <div class="footer">
      {{ totalLen?currentIndex+1:0 }}/{{ totalLen }}
    </div>
  </div>
</template>
<script>
import {store} from '../store/store.js'
import * as d3 from 'd3';
import * as echarts from 'echarts'

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
      overviewChart: null
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
                .style('height','400px')
                .style('width','1200px')
            d3.select(`#chart-dom-${i}`)
              .append('svg').attr("id",`chart-${i}`)
            this.$nextTick(()=>{
              let start = +new Date()
              this.drawChart(i)
              let end = +new Date()
              perfArr.push(end-start)
            })
          } 
          store.setPerformArr(perfArr)
          console.log(perfArr)
          this.$nextTick(()=>{
            this.drawOverviewChart()
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
      store.setCurrentIndex(index)
    },
    toNext(){
      let index = (this.currentIndex + 1)%this.totalLen
      console.log('aaa')
      store.setCurrentIndex(index)
    },
    onChange(val){
      console.log(val)
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
          const chartDom = document.getElementById(`chart-dom-${index}`)
          store.visFunction(`#chart-${index}`, chartDom, data, d3, echarts)
      }
    },
    drawOverviewChart(){
      if (this.overviewChart != null && this.overviewChart != "" && this.overviewChart != undefined) {
        this.overviewChart.dispose();
      }
      this.overviewChart = echarts.init(document.getElementById('overview-chart'));
      // 绘制图表
      this.overviewChart.setOption(getOverviewBarOption('', store.performArr))
      this.overviewChart.on('click', 'series.bar', function (params) {
          console.log(params);
          store.setCurrentIndex(params.dataIndex)
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

.table-panel {
  height: calc(100% - 40px);
  overflow: hidden;
  .header {
    height: 90px;
    border-bottom:1px solid #dcdada ;
    margin: 4px 10px;
    background: rgba(191, 191, 191,0.1);
  }
  #overview-chart {
    width: 600px;
    height: 90px;
    margin: auto;
  }
  .content {
    height: calc(100% - 120px);
    padding: 10px;
    overflow: hidden;
    display: flex;
    flex-flow: row;
    align-items: center;
  }
  .footer {
    bottom: 0;
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
    }
    .chart-content {
      height: 100%;
      width:100%;
      text-align: center;
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
