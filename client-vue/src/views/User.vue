<template>
  <div v-if="inReadMode" class="content">
    <h1 class="title">{{ user.name }}</h1>

    <div class="buttons">
      <button class="button" @click="edit = true">Edit</button>
      <button class="button is-danger is-outlined">Delete</button>
    </div>

    <h2 class="subtitle is-4">Posts</h2>
    <ul>
      <li v-for="post in user.posts" :key="post.id">
        <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
      </li>
    </ul>
  </div>
  <div v-else>
    <h1 class="title">Edit User</h1>

    <user-form
      :populateWith="user"
      @submit:post="editUser"
      @close="edit = false"
    />
  </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue'

export default {
  name: 'user',

  components: {
    UserForm,
  },

  data() {
    return {
      edit: false,
    }
  },

  async mounted() {
    this.$store.dispatch('fetchAllUsers')
  },

  computed: {
    user() {
      return this.$store.getters.getUserById(this.$route.params.id)
    },

    inReadMode() {
      return !this.edit
    },

    inEditMode() {
      return this.edit
    },
  },

  methods: {
    editUser() {
      // TODO: call API
    },
  },
}
</script>

<style></style>
