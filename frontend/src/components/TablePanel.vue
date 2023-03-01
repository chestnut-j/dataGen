<template>
  <div class="table-panel">
    <div class="content">
      <div class="custom-slick-arrow" style="left: 10px" @click="toLast()">
        <left-circle-outlined />
      </div>
      <div class="panel-content">
        <svg class="chart">
          {{drawChart(tableData)}}

        </svg>
      </div>
      <div class="custom-slick-arrow" style="right: 10px" @click="toNext()">
        <right-circle-outlined />
      </div>
    </div>
    <div class="footer">
      {{ currentIndex+1 }}/{{ totalLen }}
    </div>
  </div>
</template>
<script>
import {store} from '../store/store.js'
import * as d3 from 'd3';

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
    drawChart(data){
      if(data.length){
        d3.select('.chart').selectAll('*').remove();
        store.visFunction('.chart',data, d3)
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
    text-align: center;
  }
  .panel-content {
    // position: relative;
    height: 100%;
    margin: 5px;
    overflow: auto;
    width: calc(100% - 60px);
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
