<template>
  <div class="preview-panel">
    <div class="data-panel">
      <div class="header">
        <div class="title">
           Data Attributes Panel  
          <span class="overview">{{ Object.keys(origin||{})[0] }}</span>
        </div>
        <div class="switch-btn">
          Attr mode
          <a-switch :checked="isAttrMode" size="small" @change="handleModeChange"/>
        </div>
      </div>
      <StatisticPanel/>
    </div>
    <div class="chart-panel">
      <div class="header">
        <div class="title">
          Preview Panel
        </div>
      </div>
      <TablePanel/>
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
  data(){
    return {
      isAttrMode: true,
    }
  },
  computed:{
    currentIndex(){
      return store.currentTableIndex
    },
    origin(){
      return store.totalInfo[this.currentIndex]?.origin[0]
    },
  },
  methods:{
    handleModeChange(checked){
      this.isAttrMode = checked
      store.setAttrMode(this.isAttrMode)
    },
  }
}
</script>

<style lang="less" scoped>
.preview-panel {
  .header {
    border-bottom: 1px solid #e6e6e6;
    background: #ebebeb;
    display: flex;
    flex-flow: row;
    justify-content: space-between;

    .title{
      height: 28px;
      // width: 100%;
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;
      padding:4px;
      padding-left: 10px;
      text-align: left;
      .overview {
        font-size: 12px;
        font-weight: 400;
        margin-left: 8px;
      }
    }

    .switch-btn{
      margin-right: 20px;;
    }
  }
  
  .chart-panel{
    height:67%;
  }

  .data-panel {
    height: 33%;
  }
}
</style>
