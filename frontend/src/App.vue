<template>
  <div class="homepage">
    <div class="header">
      <div>VisArena</div>
    </div>
    <router-view/>
  </div>
  <!-- <HomePage/> -->
</template>

<script>
// import HomePage from './views/Home.vue'

export default {
  name: 'App',
  components: {
    // HomePage
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .homepage {
    // width: 100%;
    // height: calc(100vh - 24px);
    // padding: 8px;
    .header{
      height: 40px;
      font-size: 26px;
      font-weight: 600;
      color: #fff;
      background: #000;
      line-height: 40px;
      padding-left: 20px;
      text-align: left;
    }
  }
}
</style>
