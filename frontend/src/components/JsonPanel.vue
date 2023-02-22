<template>
  <div class="json-panel">
    json panel
    <div class="footer">
      <a-button type="primary" @click="getInfo()">run</a-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { store } from '../store/store.js'
export default {
  name: 'JsonPanel',
  props: {
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
    parseData(data){
      let newData = data.config[0].children
      store.setConfig(newData)
      store.setTable(data.table)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less" scoped>
.json-panel {
  position: relative;
  .footer{
    position: absolute;
    bottom:20px;
    right: 20px;
  }
}
</style>
