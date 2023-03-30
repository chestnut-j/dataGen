<template>
  <div class="homepage">
    <!-- <div class="header">
      <div>VisArena</div>
    </div> -->
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
  color: #10161c;
  .homepage {
    // width: 100%;
    // height: calc(100vh - 24px);
    // padding: 8px;
    .header{
      height: 30px;
      font-size: 26px;
      font-weight: 600;
      color: #fff;
      background: rgb(0, 0, 0);
      line-height: 30px;
      padding-left: 20px;
      text-align: left;
    }
  }
}
</style>
