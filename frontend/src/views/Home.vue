<template>
  <div class="homepage">
    <div class="header">dataGen</div>
    <div class="content">
      <JsonPanel class="left-panel"/>
      <PreviewPanel class="right-panel"/>
    </div>
  </div>
</template>

<script>
import JsonPanel from '../components/JsonPanel.vue'
import PreviewPanel from '../components/PreviewPanel.vue'

export default {
  name: 'HomePage',
  components: {
    JsonPanel,
    PreviewPanel,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.homepage {
  width: 100%;
  height: calc(100vh - 24px);
  // padding: 8px;
  .header{
    height: 40px;
    font-size: 30px;
    font-weight: 600;
    color: #fff;
    background: #000;
    line-height: 40px;
    padding-left: 20px;
    text-align: left;
  }
  .content {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    height:calc(100% - 40px);
    flex:1;

    .left-panel {
      width:30%;
      border: 1px solid #eeeeee;
      margin: 5px;
    }
    .right-panel {
      width:69%;
      border: 1px solid #eeeeee;
      margin: 5px;
    }
  }
}
</style>