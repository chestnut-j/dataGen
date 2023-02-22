<template>
  <div class="preview-panel">
    <div class="header">
      <div class="title">
        preview panel
      </div>
    </div>
    
    <div class="content">
      <TablePanel/>
      <StatisticPanel/>
    </div>
  </div>
</template>

<script>
import TablePanel from './TablePanel.vue'
import StatisticPanel from './StatisticPanel.vue'

export default {
  name: 'PreviewPanel',
  components: {
    TablePanel,
    StatisticPanel,
  },
  props: {
  }
}
</script>

<style lang="less" scoped>
.preview-panel {
  .header {
    border-bottom: 1px solid #e6e6e6;
    .title{
      height: 30px;
      width: 100%;
      font-weight: bold;
      font-size: 22px;
      line-height: 22px;
      padding:4px;
      padding-left: 10px;
      background: #f6f6f6;
      text-align: left;
    }
  }
  
  .content {
    height: calc(100% - 40px);
    overflow: hidden;
  }
}
</style>
