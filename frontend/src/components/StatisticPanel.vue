<template>
  <div class="statistic-panel">
    <div class="column-content" v-for="item in columns" :key="item.name" :id="'column-'+item.name">
    </div>
  </div>
</template>

<script>
import { store } from '../store/store.js'
import { getBoxOption } from '../common.js'
import * as echarts from 'echarts'

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
    columns(){
      return store.config
    },
    tableData(){
      return store.currentTable
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
        if(keys.includes('range') || keys.includes('max') || keys.includes('min') ||
          keys.includes('quantile') ||keys.includes('mean')  ){
            that.drawBox(item)
        }else if(keys.includes('trend') || keys.includes('correlation') ){
          that.drawLine(item)
        } else {
          that.drawHistogram(item)
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
      
      console.log(item)
    },
    drawHistogram(item){
      console.log(item)
    },
    extraData(colName) {
      return this.tableData.map(item=>item[colName])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less" scoped>
.statistic-panel {
  height: 40%;
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
    // padding: 20px;
    // white-space: normal;
    // word-wrap:break-word;
  }
  // background: #e6e6e6;
  &::-webkit-scrollbar {
    height: 4px;
    width: 10px;
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
</style>
