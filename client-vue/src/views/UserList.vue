<template>
  <div class="columns">
    <div class="column is-two-thirds">
      <div class="content">
        <h1 class="title">Users</h1>

        <ul data-test="user-list">
          <li v-for="user in users" :key="user.id">
            <router-link :to="`/users/${user.id}`">{{ user.name }}</router-link>
            {{ authorText(user) }}
          </li>
        </ul>
      </div>
    </div>
    <div class="column is-one-third">
      <h1 class="title">New User</h1>

      <user-form @submit:user="createUser" />
    </div>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue'

export default {
  name: 'users',

  components: {
    UserForm,
  },

  mounted() {
    this.$store.dispatch('fetchAllUsers')
  },

  computed: {
    users() {
      return this.$store.state.users || []
    },
  },

  methods: {
    createUser(user) {
      this.$store.dispatch('createUser', user)
    },

    authorText(user) {
      return user.posts.length > 0 ? '(author)' : ''
    },
  },
}
</script>

<style></style>
