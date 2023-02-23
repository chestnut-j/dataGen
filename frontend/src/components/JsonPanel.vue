<template>
  <div class="json-panel">
    <div class="header">
      <div class="title">
        json panel
      </div>
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
      <a-button type="primary" @click="submit()">send</a-button>
      <a-button type="primary" @click="getInfo()">get</a-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { store } from '../store/store.js'
// import VueCodemirror from '@/components/JsonEditor/index.vue'
import monaco from '@/components/monaco/index.vue'

//test data
// [
//     {
//         "( Length(100) And Column(12) )": 
//             {
//                 "name": "Faker(name)",
//                 "gender": "Frequency('male', 0.6, 'female', 0.4)", 
//                 "height": "Range(155.0,200.0) And FreqIf('>180', 0.4) And Mean(170)"
//             }
//     }
// ]
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
      }
    }
  },
  components: {
    monaco
    // VueCodemirror,
  },
  methods:{
    getInfo(){
      const that = this
      axios.get('/api/getInfo').then(res=>{
        console.log(res.data)
        that.parseData(res.data)
      })
      .catch(err=>{
        console.log(err)
      })
    },
    submit(){
      const that = this
      this.jsonData = this.$refs.monaco.getVal()
      axios.post('/api/submit',{data: that.jsonData}).then(res=>{
        console.log(res.data)
        that.parseData(res.data)
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less" scoped>
.json-panel {
  position: relative;
  .header {
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 10px;
    .title{
      height: 28px;
      width: 100%;
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      padding:4px;
      padding-left: 10px;
      background: #f6f6f6;
      text-align: left;
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
