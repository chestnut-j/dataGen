<template>
  <div class="json-panel">
    <div class="content">
      <monaco
        ref="monaco"
        :opts="opts"
        @change="changeValue"
        :height="275"
      ></monaco>
    </div>
  </div>
</template>

<script>
import { store } from '../store/store.js'
import monaco from '@/components/monaco/index.vue'
import { caseOptions } from '@/common.js'

//test data
const defaultValue= `// data definition
data = {

}`
export default {
  name: 'DataSpecCode',
  props: {
  },
  data(){
    return {
      jsCode: {},
      opts: {
        value: defaultValue,
        readOnly: false, // 是否可编辑
        language: 'javascript', // 语言类型
        theme: 'vs-light', // 编辑器主题
        minimap: {
          enabled: false
        },
        wordWrap: true,
      },
    }
  },
  components: {
    monaco
  },
  computed: {
    currentCase(){
      return store.currentCase
    }
  },
  watch:{
    currentCase:{
      handler(){
        this.$nextTick(()=>{
          if(this.currentCase!==undefined){
            this.handleCaseChange(this.currentCase)
          }
        })
      },
      deep:true,
      immediate: true,
    }
  },
  methods:{
    getJsonData(data){
      let json = data.slice(data.indexOf("=")+1,data.indexOf('visFunc'))
      json = '['+json+']'
      json = json.replace("Random('categorical, categories=['-22','+22'], weights=[0.5, 0.5]')","Frequency('-22',0.5, '+22',0.5)")
        .replace("Random('categorical, categories=['22','ppp'], weights=[0.5, 0.5]')","Frequency('22',0.5, 'ppp', 0.5)")
        .replace("Random('uniform, min=0, max=20')","Distribution('uniform',0,20)")
        .replace("Random('uniform, min=0, max=20')","Distribution('uniform',0,20)")
        .replace("Random('uniform, min=-50, max=-20')","Distribution('uniform',-50,-20)")
        .replace("Random('uniform, min=20, max=50')","Distribution('uniform',20,50)")
        .replace("Random('normal, loc=120.13, scale=0.02')","Distribution('normal', 120.13, 0.02)")
        .replace("Random('normal, loc=30.24, scale=0.01')","Distribution('normal', 30.24, 0.01)")
        .replace("Random('categorical, categories=[1]')","Enum([1])")
        console.log(json,JSON.parse(json))
      return JSON.parse(json)
    },
    changeValue (val) {
      this.jsCode = val
      store.setDataSpec(this.getJsonData(this.jsCode))
    },
    handleCaseChange(val){
      const find = caseOptions.find(item=>item.id==val) 
      this.$refs.monaco.setVal(find.content.slice(0,find.content.indexOf('visFunc')))
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less" scoped>
.json-panel {
  position: relative;
  .content {
    text-align: left;
    height: calc(100% - 100px);
    .monaco-editor {
      height: 100%;
    }
  }
}
</style>
