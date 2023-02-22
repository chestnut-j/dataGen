<template>
  <div class="table-panel">
    <div class="table-content">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Tab 1">
          <a-table 
            :data-source="tableData"
            :columns="columns"
            :bordered="true"
            :scroll="{
              x: true,
              y:280
            }"
            size="small"
          ></a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2">Content of Tab Pane 2</a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </div>
    <div class="json-content">
      [{'( Length(100) And Column(12) )': 
        {'name': 'Faker(name)', 'gender': "Frequency('male', 0.6, 'female', 0.4)", 
        'telephone': 'Faker(phone_number) And Empty(2)', 
        'height': "Range(155.0,200.0) And FreqIf('>180', 0.4) And Mean(170)", 
        'weight': 'Range(35.0,100.0) And Max(88.8) And Quantile(50,50)', 
        'score': "Distribution('normal',80,15)", 
        'doubleScore': "Correlation('score','linear',2) ", 
        'comment': "Repeat('goodcomment',2) Or Repeat('badcomment',2)", 
        'trend': "Trend('exponential',1.4)", 
        'cluster': 'Int And Cluster(4) And Range(0,300)'
      }}]

    </div>
  </div>
</template>

<script>
import {store} from '../store/store.js'
export default {
  name: 'TablePanel',
  props: {
  },
  data(){
    return {}
  },
  computed:{
    tableData(){
      return store.currentTable
    },
    columns(){
      console.log(store)
      let item = store.currentTable.length>0?store.currentTable[0] : []
      return Object.keys(item).map(v=>{
                return {
                  title: v,
                  dataIndex: v,
                  key:v,
                  ellipsis: true,
                }
              })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.table-panel {
  height: 60%;
  // background: #e0e0e0;
  padding: 10px;
  display: flex;
  flex-flow: row;
  .table-content {
    width:70%;
  }
  .json-content {
    width: 30%;
  }

  /deep/.ant-table-body {
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
