import {reactive} from 'vue'
import * as d3 from 'd3';

export const store = reactive({
  currentTable: [],
  config: [],
  totalInfo: [],
  currentTableIndex: 0,
  dataSpec: undefined,
  visFunction: null,
  evaluationFunction: null,
  d3:d3,
  loading: false,
  performArr: [],
  isPerformanceMode: false,
  isAttrMode: true,
  optionList: undefined,
  currentCase: undefined,
  setCurrentCase(val){
    this.currentCase = val
  },
  setLoading(state){
    this.loading = state
  },
  setConfig(data){
    this.config = data
  },
  setTable(data){
    this.currentTable = data
  },
  setTotalInfo(data){
    this.totalInfo = data
  },
  setOptionList(data){
    this.optionList = []
    this.totalInfo.forEach(item=>{
      let origin = item.origin[0]
      let key = origin['table']
      // let columns = origin[key]
      let out = {}
      if(data['table']){
        out['table'] = data['table'].find(e=>key.indexOf(e)>-1)
      }
      let colKeys = Object.keys(data)
      colKeys.forEach(colKey=>{
        if(colKey==='table'){
          out[colKey] = []
          data[colKey].forEach(op=>{
            out[colKey].push(op.find(e=>key.indexOf(e)>-1))
          })
        } else{
          out[colKey] = []
          data[colKey].forEach(op=>{
            let item = op.find(e=>origin['columns'][colKey].indexOf(e)>-1)
            out[colKey].push(item)
          })
        }
        out[colKey]=out[colKey].join(',')
      })
      this.optionList.push(out)
    })
    console.log(this.optionList)
  },
  setCurrentIndex(index){
    this.currentTableIndex = index
  },
  setDataSpec(val){
    this.dataSpec = val
  },
  setVisFunction(func){
    this.visFunction = func
  },
  setevaluationFunction(func){
    this.evaluationFunction = func
  },
  setPerformArr(arr){
    this.performArr = arr
  },
  setValidationMode(state){
    this.isPerformanceMode =state
  },
  setAttrMode(state){
    this.isAttrMode = state
  }
})