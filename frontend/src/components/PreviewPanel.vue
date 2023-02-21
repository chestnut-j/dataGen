<template>
  <div class="preview-panel">
    <div class="title">
      preview panel
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
  .title{
    height: 40px;
  }
  .content {
    height: calc(100% - 40px);
  }
}
</style>
