<template>
  <div class="json-panel">
    <div class="content">
      <monaco
        ref="monaco"
        :opts="opts"
        @change="changeValue"
        :height="515"
      ></monaco>
    </div>
  </div>
</template>

<script>
import { store } from '../store/store.js'
import monaco from '@/components/monaco/index.vue'
import { caseOptions } from '@/common.js'
//test data
const defaultValue= `// vis function
visFunc = function(data, domId, d3, echarts, zCharts){
  
}`
export default {
  name: 'VisualizationCode',
  props: {
  },
  data(){
    return {
      jsCode: {},
      opts: {
        value: defaultValue,
        readOnly: false,
        language: 'javascript', 
        theme: 'vs-light', 
        fontSize: '21px',
        // wordWrap: true,
        scrollbar: {
          vertical: 'visible',
        },
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
    getVisFunction(data){
      let fun = data.slice( data.indexOf("visFunc"),data.indexOf('evaluationFunc'))
      let arg = fun.slice(fun.indexOf('(')+1,fun.indexOf(')')).split(',')
      let f = fun.slice(fun.indexOf('{')+1,fun.lastIndexOf('}'))
      let myFun = new Function(...arg, f)
      return myFun
    },  
    changeValue (val) {
      this.jsCode = val
      let myVisFunc = this.getVisFunction(this.jsCode)
      store.setVisFunction(myVisFunc)
    },
    handleCaseChange(val){
      const find = caseOptions.find(item=>item.id==val) 
      this.$refs.monaco.setVal(find.content.slice(find.content.indexOf("visFunc"),find.content.indexOf('evaluationFunc')))
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
    overflow: hidden;

    .monaco-editor {
      height: 100%;
    }
  }
}
</style>
