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
  isGptMode: false,
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
  setMode(state){
    this.isGptMode = state
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
            let pre = item.replace("Frequency('+12',0.2,'12',0.3,'18',0.2,'+18',0.3)","Random('categorical, categories=['+12','12','18','+18']')")
                    .replace("Frequency('-10',0.3,'-20',0.3,'-30',0.4)","Random('categorical, categories=['-10','-20','-30']')")
                    .replace("Distribution('uniform',0,20)","Random('uniform, min=0, max=20')")
                    .replace("Distribution('uniform',0,20)","Random('uniform, min=0, max=20')")
                    .replace("Distribution('uniform',-50,-20)","Random('uniform, min=-50, max=-20')")
                    .replace("Distribution('uniform',20,50)","Random('uniform, min=20, max=50')")
                    .replace("Distribution('normal', 120.13, 0.02)","Random('normal, loc=120.13, scale=0.02')")
                    .replace("Distribution('normal', 30.24, 0.01)","Random('normal, loc=30.24, scale=0.01')")
                    .replace("Enum([1])","Random('categorical, categories=[1]')")
            out[colKey].push(pre)
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