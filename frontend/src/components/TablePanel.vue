<template>
  <div class="table-panel">
    <div>
      <a-tabs :activeKey="currentTab" @change="handleTabChange">
        <a-tab-pane v-for="(item, index) in info"
          :key="index" :tab="'Table'+(index+1)"  class="panel-content">
          <a-table 
            class="table-content"
            :data-source="item.table"
            :columns="getColumns(item.config)"
            :bordered="true"
            :scroll="{
              'x':true,
              'y':280
            }"
            size="small"
          ></a-table>
          <div class="json-content">
            <pre>{{item.origin}}
            </pre>
          </div>
        </a-tab-pane>
      </a-tabs>
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
    return {
      currentTab: 0
    }
  },
  computed:{
    info(){
      return store.totalInfo
    },
    tableData(){
      return store.currentTable
    },
    columns(){
      return store.config.map(v=>{
                return {
                  title: v.name,
                  dataIndex: v.name,
                  key:v.name,
                  ellipsis: true,
                }
              })
    }
  },
  methods:{
    handleTabChange(val){
      this.currentTab = val
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
  .panel-content {
    // position: relative;
    display: flex;
    justify-content: flex-start;
  }
  .table-content {
    width:70%;
    height: 100%;
    display: inline-block;
  }
  .json-content {
    width: 30%;
    // top: 0;
    height: 100%;
    display: inline-block;
    pre{
      height: 100%;
      font-size: 12px;
      text-align: left;

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
</style>
