<template>
  <div class="comp-data">
    <div class="json-content">
      <pre>{{origin}}
      </pre>
    </div>
    <div class="statistic-panel">
      <div class="column-content" v-for="item in columns" :key="item.name" :id="'column-'+item.name">
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
      return store.totalInfo[this.currentIndex]?.config[0].children || []
    },
    tableData(){
      return store.totalInfo[this.currentIndex]?.table || []
    },
    origin(){
      return store.totalInfo[this.currentIndex]?.origin
    }
  },
  mounted(){
    // this.initPlots()

  },
  watch: {
    columns:{
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
      this.columns.forEach(item=>{
        let keys = Object.keys(item)
        if(keys.includes('range')&& !keys.includes('cluster') || keys.includes('max') || keys.includes('min') ||
          keys.includes('quantile') ||keys.includes('mean')  ){
            that.drawBox(item)
        }else if(keys.includes('trend')){
          that.drawLine(item)
        } else if(item['type']==='Real' ||item['type']==='Int'  || keys.includes('cluster')  || !keys.includes('type')  ){
          that.drawHistogram(item)
        } else {
          that.drawBar(item)
        }
      })
    },
    drawBox(item){
      let data = this.extraData(item.name)
      if (this.charts[item.name] != null && this.charts[item.name] != "" && this.charts[item.name] != undefined) {
        this.charts[item.name].dispose();
      }
      this.charts[item.name] = echarts.init(document.getElementById('column-'+item.name));
      // 绘制图表
      this.charts[item.name].setOption(getBoxOption(item.name, data))
    },
    drawLine(item){
      let data = this.extraData(item.name)
      if (this.charts[item.name] != null && this.charts[item.name] != "" && this.charts[item.name] != undefined) {
        this.charts[item.name].dispose();
      }
      this.charts[item.name] = echarts.init(document.getElementById('column-'+item.name));
      // 绘制图表
      this.charts[item.name].setOption(getLineOption(item.name, data))
    },
    drawHistogram(item){
      echarts.registerTransform(ecStat.transform.histogram);
      let data = this.extraData(item.name)
      if(data.length){
        let bins = ecStat.histogram(data)
        if (this.charts[item.name] != null && this.charts[item.name] != "" && this.charts[item.name] != undefined) {
          this.charts[item.name].dispose();
        }
        this.charts[item.name] = echarts.init(document.getElementById('column-'+item.name));
        // 绘制图表
        this.charts[item.name].setOption(getHistogramOption(item.name, bins.data))
      }
      
    },
    drawBar(item){
      let data = this.extraData(item.name)
      let bins = this.getBins(data)
      if (this.charts[item.name] != null && this.charts[item.name] != "" && this.charts[item.name] != undefined) {
        this.charts[item.name].dispose();
      }
      this.charts[item.name] = echarts.init(document.getElementById('column-'+item.name));
      // 绘制图表
      this.charts[item.name].setOption(getBarOption(item.name, bins))
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
      overflow: scroll;


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
