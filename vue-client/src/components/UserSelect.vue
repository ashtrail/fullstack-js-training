<template>
  <div class="columns">
    <div class="column">
      <div class="navbar-item">I am :</div>
    </div>
    <div class="column">
      <div class="select">
        <select v-model="currentUser">
          <option v-for="user in users" :value="user" :key="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user-select',

  mounted() {
    this.$store.dispatch('fetchAllUsers')
  },

  computed: {
    users() {
      return this.$store.state.users
    },

    currentUser: {
      get() {
        return this.$store.state.currentUser
      },

      set(value) {
        this.$store.commit('setCurrentUser', value)
      },
    },
  },
}
</script>

<style></style>
