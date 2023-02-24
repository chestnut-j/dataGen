<template>
  <div class="json-panel">
    <div class="header">
      <div class="title">
        json panel
      </div>
      <a-select
        class="select-box"
        ref="select"
        :value="currentCase"
        size="small"
        style="width: 90px"
        @change="handleCaseChange"
      >
        <a-select-option v-for="item in options" :key="item.id" :value="item.id">
          {{item.title}}
        </a-select-option>
      </a-select>
    </div>
    <div class="content">
      <monaco
        ref="monaco"
        :opts="opts"
        @change="changeValue"
        :height="600"
      ></monaco>
    </div>
    <div class="footer">
      <a-button type="primary" @click="submit()">run</a-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { store } from '../store/store.js'
// import VueCodemirror from '@/components/JsonEditor/index.vue'
import monaco from '@/components/monaco/index.vue'
import {caseOptions} from '@/common.js'
import { message } from 'ant-design-vue'

//test data
export default {
  name: 'JsonPanel',
  props: {
  },
  data(){
    return {
      jsonData: {},
      opts: {
        value: '',
        readOnly: false, // 是否可编辑
        language: 'json', // 语言类型
        theme: 'vs-light' // 编辑器主题
      },
      options: caseOptions,
      currentCase: undefined,
    }
  },
  components: {
    monaco
    // VueCodemirror,
  },
  methods:{
    submit(){
      const that = this
      this.jsonData = this.$refs.monaco.getVal()
      axios.post('/api/submit',{data: JSON.parse(that.jsonData)}).then(res=>{
        console.log(res.data)
        store.setTotalInfo(res.data)
        message.success('generate success')
      })
      .catch(err=>{
        console.log(err)
      })
    },
    parseData(data){
      let newData = data.config[0].children
      store.setConfig(newData)
      store.setTable(data.table)
    },
    changeValue (val) {
      // console.log(val)
      this.jsonData = val
    },
    handleCaseChange(val){
      const find = caseOptions.find(item=>item.id==val) 
      this.$refs.monaco.setVal(JSON.stringify(find.content))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less" scoped>
.json-panel {
  position: relative;
  .header {
    background: #f6f6f6;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 10px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    .title{
      height: 28px;
      // width: 100%;
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      padding:4px;
      padding-left: 10px;
      text-align: left;
    }
    .select-box {
      margin: 3px 5px;
    }
  }
  
  .content {
    text-align: left;
  }
  .footer{
    position: absolute;
    bottom:20px;
    right: 20px;
  }
}
</style>
