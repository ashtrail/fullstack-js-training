<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/blog">Blog</router-link>
          <router-link class="navbar-item" to="/users">Users</router-link>
        </div>
        <div class="navbar-end">
          <user-select></user-select>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import UserSelect from '@/components/UserSelect.vue'
export default {
  name: 'nav-bar',

  components: {
    UserSelect,
  },
}
</script>

<style></style>
