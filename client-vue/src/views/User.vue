<template>
  <div v-if="loaded && exists">
    <div v-if="inReadMode" class="content">
      <h1 class="title">{{ user.name }}</h1>

      <div class="buttons">
        <button class="button" @click="edit = true">Edit</button>
        <button class="button is-danger is-outlined" @click="deleteUser">
          Delete
        </button>
      </div>

      <h2 class="subtitle is-4">Posts</h2>
      <ul>
        <li v-for="post in user.posts" :key="post.id">
          <router-link :to="`/posts/${post.id}`">{{ post.title }}</router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <h1 class="title">Edit User</h1>

      <user-form
        :populateWith="user"
        @submit:user="editUser"
        @close="edit = false"
      />
    </div>
  </div>
  <div v-else-if="loaded && !exists">
    <h1 class="title">404</h1>
    User not found
  </div>
  <div v-else>
    <p>Loading data...</p>
    <progress class="progress is-primary" max="100">70%</progress>
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
      loaded: false,
      exists: true,
      user: {},
    }
  },

  async mounted() {
    const userId = this.$route.params.id
    this.$store
      .dispatch('fetchOneUser', userId)
      .then(() => {
        this.setUser(this.$store.getters.getUserById(userId))
      })
      .catch((err) => {
        console.log(`fetch user with id ${userId} failed, error = `, err)
        this.setUser(null)
      })
  },

  computed: {
    inReadMode() {
      return !this.edit
    },

    inEditMode() {
      return this.edit
    },
  },

  methods: {
    setUser(user) {
      this.loaded = true
      if (user == null) {
        this.exists = false
      } else {
        this.user = user
      }
    },

    editUser(user) {
      console.log('submitting edited user !')
      this.$store.dispatch('editUser', user).then(() => {
        console.log('submitted edited user !')
        this.user = this.$store.getters.getUserById(this.user.id)
      })
    },

    deleteUser() {
      if (confirm('Are you sure you want to delete this user?')) {
        this.$store.dispatch('deleteUser', this.user.id).then(() => {
          this.$router.push('/authors')
        })
      }
    },
  },
}
</script>

<style></style>
