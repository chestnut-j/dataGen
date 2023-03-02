<template>
  <div class="table-panel">
    <div class="content">
      <div class="custom-slick-arrow" style="left: 10px" @click="toLast()">
        <left-circle-outlined />
      </div>
      <div class="panel-content" id="outer">
        <div class="chart-content" id="chart-dom">
          <svg id="chart"></svg>
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
    tableData:{
      handler() {
        d3.select('#outer').selectAll('*').remove()
        d3.select('#outer')
          .append('div')
            .attr("id",'chart-dom')
            .attr('class','chart-content')
            .style('height','100%')
            .style('width','100%')
        d3.select('#chart-dom')
          .append('svg').attr("id",'chart')
        this.$nextTick(()=>{this.drawChart()})
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
    async drawChart(){
      const data = this.tableData
      if(data.length){
          const chartDom = document.getElementById('chart-dom')
          store.visFunction('#chart', chartDom, data, d3, echarts)
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

.table-panel {
  height: calc(100% - 40px);
  
  .content {
    height: calc(100% - 20px);
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
    .chart-content {
      height: 100%;
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
