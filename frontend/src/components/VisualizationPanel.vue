<template>
  <div class="table-panel">
    <div class="content">
      <div class="panel-content" id="outer">
        <div class="item-outer" 
            v-for="(item,index) in info" 
            :key="`chart-dom-${index}`"
            v-show="`${index}`==`${currentIndex}`" 
            :id="`outer-${index}`">
          <div class="chart-content" :id="`chart-dom-${index}`" >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {store} from '../store/store.js'
import * as d3 from 'd3';
import * as echarts from 'echarts'
import * as visCharts from '@zjlabvis/vis-charts'  

export default {
  name: 'VisualizationPanel',
  props: {
  },
  components:{
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
    currentIndex(){
      return store.currentTableIndex
    },
    totalLen() {
      return this.info.length
    }
  },
  watch:{
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
                .style('height','520px')
                .style('width','1380px')
            // d3.select(`#chart-dom-${i}`)
            //   .append('svg').attr("id",`chart-${i}`)
            this.$nextTick(()=>{
              let start = +new Date()
              // for(let j=0;j<10;j++){
                this.drawChart(i)
              // }
              let end = +new Date()
              let efficiencyTest = (end-start)
              const data = this.info[i]?.table || []
              let arg = store.evaluationFunction(data, `chart-dom-${i}`, this.echartsList[i], efficiencyTest)
              perfArr.push(arg)

              // d3.select(`#outer-${i}`).selectAll('*').remove()
              // d3.select(`#outer-${i}`)
              //   .append('div')
              //     .attr("id",`chart-dom-${i}`)
              //     .attr('class','chart-content')
              //     .style('height','530px')
              //     .style('width','1228px')
              // this.drawChart(i)
            })
          } 
          
          this.$nextTick(()=>{
            store.setPerformArr(perfArr)
          })
        })
      },
      immediate: true,
      deep: true,
    }
  },  
  methods:{
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

.table-panel {
  overflow: hidden;
  .content {
    height: 100%;
    padding: 0 5px;
    overflow: hidden;
    display: flex;
    flex-flow: row;
    align-items: center;
  }
  .panel-content {
    height: 100%;
    overflow: auto;
    text-align: center;
    width: 100%;
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
}
</style>
