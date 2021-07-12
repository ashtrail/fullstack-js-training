<template>
  <div class="columns">
    <div class="column is-two-thirds">
      <div class="content">
        <h1 class="title">Authors</h1>

        <ul>
          <li v-for="author in authors" :key="author.id">
            <router-link :to="`/users/${author.id}`">{{
              author.name
            }}</router-link>
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
  name: 'authors',

  components: {
    UserForm,
  },

  mounted() {
    this.$store.dispatch('fetchAllUsers')
  },

  computed: {
    authors() {
      return this.$store.getters.getAllPostAuthors
    },
  },

  methods: {
    createUser(user) {
      this.$store.dispatch('createUser', user)
    },
  },
}
</script>

<style></style>
