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
const defaultValue= `{
  "table":"",
  "columns": {
    
  }
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
        readOnly: false, 
        language: 'json',
        theme: 'vs-light',
        fontSize: '17px',
        minimap: {
          enabled: false
        },
        scrollbar: {
          vertical: 'visible',
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
      let json = data
      json = '['+json+']'
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
    // height: calc(100% - 100px);
    overflow: hidden;
    .monaco-editor {
      height: 100%;
    }
  }
}
</style>
