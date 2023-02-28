<template>
  <div class="json-panel">
    <div class="header">
      <div class="title">
        js panel
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
        :height="900"
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
// import {sampleData} from './sampleData'
// const JSON = require('json-fns')

//test data
const defaultValue= `data = [{

}]
func = function(svgId, data, d3){
  
}`
export default {
  name: 'JsonPanel',
  props: {
  },
  data(){
    return {
      jsCode: {},
      opts: {
        value: defaultValue,
        height:800,
        readOnly: false, // 是否可编辑
        language: 'javascript', // 语言类型
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
      // const that = this
      this.jsCode = this.$refs.monaco.getVal()
      let myJson = this.getJsonData(this.jsCode)
      let myFunc = this.getFunction(this.jsCode)
      // myFunc('a11','a22')
      // store.setTotalInfo(sampleData)
      store.setLoading(true)
      axios.post('/api/submit',{data: myJson}).then(res=>{
        console.log(res.data)
        store.setTotalInfo(res.data)
        store.setVisFunction(myFunc)
        message.success('generate success')
        store.setLoading(false)
      })
      .catch(err=>{
        console.log(err)
        store.setLoading(false)
      })
    },
    parseData(data){
      let newData = data.config[0].children
      store.setConfig(newData)
      store.setTable(data.table)
    },
    getJsonData(data){
      let json = data.slice(data.indexOf("["),data.indexOf(']')+1)
      console.log(json,JSON.parse(json))
      return JSON.parse(json)
    },
    getFunction(data){
      let index = data.indexOf("func")
      let fun = data.slice(index)
      let arg = fun.slice(fun.indexOf('(')+1,fun.indexOf(')')).split(',')
      let f = fun.slice(fun.indexOf('{')+1,-1)
      // console.log(fun.indexOf('}'))
      // console.log(f)
      let myFun = new Function(...arg, f)
      console.log(myFun)
      return myFun
    },  
    changeValue (val) {
      // console.log(val)
      this.jsCode = val
    },
    handleCaseChange(val){
      const find = caseOptions.find(item=>item.id==val) 
      this.$refs.monaco.setVal(find.content)
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
    height: calc(100% - 100px);
    .monaco-editor {
      height: 100%;
    }
  }
  .footer{
    position: absolute;
    bottom:20px;
    right: 20px;
  }
}
</style>
