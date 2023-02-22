import {reactive} from 'vue'

export const store = reactive({
  currentTable: [],
  config: [],
  setConfig(data){
    this.config = data
  },
  setTable(data){
    this.currentTable = data
  }
})