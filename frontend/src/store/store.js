import {reactive} from 'vue'
import * as d3 from 'd3';

export const store = reactive({
  currentTable: [],
  config: [],
  totalInfo: [],
  currentTableIndex: 0,
  visFunction: null,
  d3:d3,
  loading: false,
  isGptMode: false,
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
  setCurrentIndex(index){
    this.currentTableIndex = index
  },
  setVisFunction(func){
    this.visFunction = func
  }
})