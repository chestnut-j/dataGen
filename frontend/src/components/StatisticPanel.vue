<template>
  <div class="comp-data">
    <div class="json-content">
      <pre>{{origin}}
      </pre>
    </div>
    <div class="statistic-panel">
      <div class="column-content" 
      v-for="item in columns" 
      :key="isGptMode?item:item.name" 
      :id="'column-'+(isGptMode?item:item.name)">
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '../store/store.js'
import { getBoxOption, getLineOption, getHistogramOption, getBarOption } from '../common.js'
import * as echarts from 'echarts'
import * as ecStat from 'echarts-stat';

export default {
  name: 'StatisticPanel',
  props: {
  },
  data(){
    return {
      charts: {}
    }
  },
  computed: {
    currentIndex(){
      return store.currentTableIndex
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
      return store.totalInfo[this.currentIndex]?.origin
    },
    isGptMode(){
      return store.isGptMode
    }
  },
  mounted(){
    // this.initPlots()

  },
  watch: {
    tableData:{
      handler() {
        // if(v.length) this.initPlots()
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
    initPlots(){
      const that = this
      if(store.isGptMode){
        console.log('table',this.tableData)
        console.log('columns',this.columns)
        this.columns.forEach(item=>{
          that.drawBar(item)
        })
      }else{
        this.columns.forEach(item=>{
          let keys = Object.keys(item)
          if(keys.includes('range')&& !keys.includes('cluster') || keys.includes('max') || keys.includes('min') ||
            keys.includes('quantile') ||keys.includes('mean')  ){
              that.drawBox(item.name)
          }else if(keys.includes('trend')){
            that.drawLine(item.name)
          } else if(item['type']==='Real' ||item['type']==='Int'  || keys.includes('cluster')  || !keys.includes('type')  ){
            that.drawHistogram(item.name)
          } else {
            that.drawBar(item.name)
          }
        })
      }
      
    },
    drawBox(col){
      let data = this.extraData(col)
      if (this.charts[col] != null && this.charts[col] != "" && this.charts[col] != undefined) {
        this.charts[col].dispose();
      }
      this.charts[col] = echarts.init(document.getElementById('column-'+col));
      // 绘制图表
      this.charts[col].setOption(getBoxOption(col, data))
    },
    drawLine(col){
      let data = this.extraData(col)
      if (this.charts[col] != null && this.charts[col] != "" && this.charts[col] != undefined) {
        this.charts[col].dispose();
      }
      this.charts[col] = echarts.init(document.getElementById('column-'+col));
      // 绘制图表
      this.charts[col].setOption(getLineOption(col, data))
    },
    drawHistogram(col){
      echarts.registerTransform(ecStat.transform.histogram);
      let data = this.extraData(col)
      if(data.length){
        let bins = ecStat.histogram(data)
        if (this.charts[col] != null && this.charts[col] != "" && this.charts[col] != undefined) {
          this.charts[col].dispose();
        }
        this.charts[col] = echarts.init(document.getElementById('column-'+col));
        // 绘制图表
        this.charts[col].setOption(getHistogramOption(col, bins.data))
      }
      
    },
    drawBar(col){
      let data = this.extraData(col)
      let bins = this.getBins(data)
      if (this.charts[col] != null && this.charts[col] != "" && this.charts[col] != undefined) {
        this.charts[col].dispose();
      }
      this.charts[col] = echarts.init(document.getElementById('column-'+col));
      // 绘制图表
      this.charts[col].setOption(getBarOption(col, bins))
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less" scoped>
.comp-data {
  display: flex;
  flex-flow: row;
  height: calc(100% - 40px);

  .json-content {
    height: 100%;
    width: 30%;
    // top: 0;
    // height: 100%;
    // display: inline-block;

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
    margin: 0 20px;
    padding: 10px 0;
    overflow-x: scroll;
    white-space: nowrap;
    border-top: 1px solid #e6e6e6;
    .column-content{
      margin-right: 20px;
      display: inline-block;

      border: 1px solid #eeeeee;
      width:260px;
      height: 260px;
      
    }
    // background: #e6e6e6;
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
