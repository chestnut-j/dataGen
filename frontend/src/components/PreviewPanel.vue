<template>
  <div class="preview-panel">
    <div class="chart-panel">
      <div class="header">
        <div class="title">
          Preview Panel
        </div>
      </div>
      <TablePanel/>
    </div>
    <div class="data-panel">
      <div class="header">
        <div class="title">
           Data Attributes Panel  
          <span class="overview">{{ Object.keys(origin||{})[0] }}</span>
        </div>
      </div>
      <StatisticPanel/>
    </div>
    
<!--     
    <div class="content">
      <StatisticPanel/>
    </div> -->
  </div>
</template>

<script>
import TablePanel from './TablePanel.vue'
import StatisticPanel from './StatisticPanel.vue'
import { store }from '@/store/store'
export default {
  name: 'PreviewPanel',
  components: {
    TablePanel,
    StatisticPanel,
  },
  props: {
  },
  computed:{
    currentIndex(){
      return store.currentTableIndex
    },
    origin(){
      return store.totalInfo[this.currentIndex]?.origin[0]
    },
  }
}
</script>

<style lang="less" scoped>
.preview-panel {
  .header {
    border-bottom: 1px solid #e6e6e6;
    .title{
      height: 28px;
      width: 100%;
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;
      padding:4px;
      padding-left: 10px;
      background: #ebebeb;
      text-align: left;
      .overview {
        font-size: 12px;
        font-weight: 400;
        margin-left: 8px;
      }
    }
  }
  
  .chart-panel{
    height:60%;
  }

  .data-panel {
    height: 40%;
  }
}
</style>
