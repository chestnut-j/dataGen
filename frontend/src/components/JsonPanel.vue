<template>
  <div class="json-panel">
    <div class="header">
      <div class="title">
        JS panel
      </div>
      <div class="options">
        <!-- GPT mode
        <a-switch :checked="isGPTMode" size="small" @change="handleModeChange"/> -->
        <a-select
          class="select-box"
          ref="select"
          v-model:value="currentCase"
          size="small"
          style="width: 140px"
          @change="handleCaseChange"
        >
          <a-select-option v-for="item in options" :key="item.id" :value="item.id">
            {{item.title}}
          </a-select-option>
        </a-select>
        <a-button class="run-btn" type="primary" @click="submit()">run</a-button>
      </div>
    </div>
    <div v-if="!isGPTMode" class="content">
      <monaco
        ref="monaco"
        :opts="opts"
        @change="changeValue"
        :height="970"
      ></monaco>
    </div>
    <div v-else class="gpt-content">
      <div class="description">
        <div class="label">GPT Description:</div>
        <a-textarea 
          v-model:value="gptDescription" 
          @change="handleDescriptionChange"
          placeholder="Please enter table description" 
          :rows="10" />
      </div>
      <monaco
        ref="gptmonaco"
        :opts="gptOpts"
        @change="changeValue"
        :height="600"
      ></monaco>
    </div>
    <!-- <div class="footer">
    </div> -->
  </div>
</template>

<script>
import axios from 'axios'
import { store } from '../store/store.js'
// import VueCodemirror from '@/components/JsonEditor/index.vue'
import monaco from '@/components/monaco/index.vue'
import { caseOptions, gptCaseOptions } from '@/common.js'
import { message } from 'ant-design-vue'
// import {sampleData} from './sampleData'
// const JSON = require('json-fns')

//test data
const defaultValue= `// data definition
data = {

}
// vis function
visFunc = function(svgId, chartDom, data, d3, echarts){
  
}


evaluationFunc = function(svgId, echartInstance, data, performanceTest){
  return performanceTest
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
        readOnly: false, // 是否可编辑
        language: 'javascript', // 语言类型
        theme: 'vs-light' // 编辑器主题
      },
      gptOpts: {
        value: `// vis function
visFunc = function(svgId, chartDom, data, d3, echarts){
  
}


evaluationFunc = function(svgId, echartInstance, data, performanceTest){
  
}`,
        readOnly: false, // 是否可编辑
        language: 'javascript', // 语言类型
        theme: 'vs-light' // 编辑器主题
      },
      currentCase: undefined,
      isGPTMode: false,
      gptDescription: ''
    }
  },
  components: {
    monaco
    // VueCodemirror,
  },
  computed: {
    options(){
      return this.isGPTMode? gptCaseOptions:caseOptions
    }
  },
  methods:{
    submit(){
      // const that = this
      if(this.isGPTMode){
        this.jsCode = this.$refs.gptmonaco.getVal()
        let myVisFunc = this.getVisFunction(this.jsCode)
        store.setLoading(true)
        axios.post('/api/gptSubmit',{data: this.gptDescription}).then(res=>{
          console.log(res.data)
          let info = [{
            table: res.data,
            origin: this.gptDescription,
            config: null
          }]
          store.setTotalInfo(info)
          store.setVisFunction(myVisFunc)
          message.success('generate success')
          store.setLoading(false)
        })
        .catch(err=>{
          console.log(err)
          message.error('generate failed')
          store.setLoading(false)
        })
      }else{
        this.jsCode = this.$refs.monaco.getVal()
        let myJson = this.getJsonData(this.jsCode)
        let myVisFunc = this.getVisFunction(this.jsCode)
        let myEvaluationFunc = this.getEvaluationFunction(this.jsCode)
        // myFunc('a11','a22')
        // store.setTotalInfo(sampleData)
        store.setLoading(true)
        axios.post('/api/submit',{data: myJson}).then(res=>{
          console.log(res.data)
          store.setTotalInfo(res.data)
          store.setVisFunction(myVisFunc)
          store.setEvaluationFunction(myEvaluationFunc)
          message.success('generate success')
          store.setLoading(false)
        })
        .catch(err=>{
          console.log(err)
          message.error('generate failed')
          store.setLoading(false)
        })
      }
    },
    parseData(data){
      let newData = data.config[0].children
      store.setConfig(newData)
      store.setTable(data.table)
    },
    getJsonData(data){
      let json = data.slice(data.indexOf("=")+1,data.indexOf('visFunc'))
      json = '['+json+']'
      console.log(json,JSON.parse(json))
      return JSON.parse(json)
    },
    getVisFunction(data){
      let fun = data.slice( data.indexOf("visFunc"),data.indexOf('evaluationFunc'))
      let arg = fun.slice(fun.indexOf('(')+1,fun.indexOf(')')).split(',')
      let f = fun.slice(fun.indexOf('{')+1,fun.lastIndexOf('}'))
      let myFun = new Function(...arg, f)
      return myFun
    },  
    getEvaluationFunction(data){
      let index = data.indexOf("evaluationFunc")
      let fun = data.slice(index)
      let arg = fun.slice(fun.indexOf('(')+1,fun.indexOf(')')).split(',')
      let f = fun.slice(fun.indexOf('{')+1,fun.lastIndexOf('}'))
      let myFun = new Function(...arg, f)
      return myFun
    },  
    changeValue (val) {
      // console.log(val)
      this.jsCode = val
    },
    handleCaseChange(val){
      if(!this.isGPTMode){
        const find = this.options.find(item=>item.id==val) 
        this.$refs.monaco.setVal(find.content)
      } else {
        const find = this.options.find(item=>item.id==val) 
        this.gptDescription = find.description
        this.$refs.gptmonaco.setVal(find.jsCode)
      }
    },
    handleModeChange(checked){
      this.isGPTMode = checked
      this.currentCase = null
      store.setMode(this.isGPTMode)
    },
    handleDescriptionChange(){
      console.log(this.gptDescription)
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
    align-items: center;
    .title{
      height: 28px;
      // width: 100%;
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;
      padding:4px;
      padding-left: 10px;
      text-align: left;
    }
    .options {
      font-size: 12px;
    }
    .select-box {
      margin: 3px 5px;
      margin-left: 15px;
    }
    .run-btn{
      // margin: 5px;
      height: 24px;
      padding: auto;
      line-height: 13px;
    }
  }
  
  .content {
    text-align: left;
    height: calc(100% - 100px);
    .monaco-editor {
      height: 100%;
    }
  }

  .gpt-content {
    text-align: left;
    height: calc(100% - 100px);
    .description {
      margin:20px;
      .label{
        margin-bottom: 5px;
      }
    }
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
