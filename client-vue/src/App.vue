<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <nav-bar />

  <div class="section">
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    NavBar,
  },
}
</script>

<style lang="scss">
// .container {
//   width: 1100px;
//   margin: auto;
// }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
}

/*
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
*/
</style>
