<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a
          role="button"
          class="navbar-burger burger"
          :class="{ 'is-active': isActive }"
          aria-label="menu"
          aria-expanded="false"
          @click="toggleActive"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isActive }">
        <div class="navbar-start">
          <router-link class="navbar-item" data-test="navlink-blog" to="/blog"
            >Blog</router-link
          >
          <router-link class="navbar-item" data-test="navlink-users" to="/users"
            >Users</router-link
          >
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

  data() {
    return {
      isActive: false,
    }
  },

  methods: {
    toggleActive() {
      this.isActive = !this.isActive
    },
  },
}
</script>

<style></style>
