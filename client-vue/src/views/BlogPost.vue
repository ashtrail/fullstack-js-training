<template>
  <div v-if="loaded && !notFound">
    <div v-if="inReadMode">
      <h1 class="title">{{ post.title }}</h1>
      <h2 class="subtitle is-5">
        Author:
        <router-link :to="`/users/${post.author.id}`">{{
          post.author.name
        }}</router-link>
      </h2>
      <div class="content">
        {{ post.content }}
      </div>

      <div class="buttons">
        <button class="button" @click="edit = true">Edit</button>
        <button class="button is-danger is-outlined" @click="deletePost">
          Delete
        </button>
      </div>
    </div>
    <div v-else>
      <h1 class="title">Edit Post</h1>

      <blog-post-form
        :populateWith="post"
        @submit:post="editPost"
        @close="edit = false"
      />
    </div>
  </div>
  <div v-else-if="loaded && notFound">
    <h1 class="title">404</h1>
    Post not found
  </div>
  <div v-else>
    <p>Loading data...</p>
    <progress class="progress is-primary" max="100">70%</progress>
  </div>
</template>

<script>
import BlogPostForm from '@/components/BlogPostForm.vue'

export default {
  name: 'blog-post',

  components: {
    BlogPostForm,
  },

  data() {
    return {
      edit: false,
      loaded: false,
      notFound: false,
      post: {},
    }
  },

  async mounted() {
    const postId = this.$route.params.id
    this.$store
      .dispatch('fetchOnePost', postId)
      .then(() => {
        this.setPost(this.$store.getters.getPostById(postId))
      })
      .catch((_err) => {
        this.setPost(null)
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
    setPost(post) {
      this.loaded = true
      if (post == null) {
        this.notFound = true
      } else {
        this.post = post
      }
    },

    editPost(post) {
      this.$store.dispatch('editPost', post).then(() => {
        this.post = this.$store.getters.getPostById(this.post.id)
      })
    },

    deletePost() {
      if (confirm('Are you sure you want to delete this post?')) {
        this.$store
          .dispatch('deletePost', {
            id: this.post.id,
            userId: this.post.userId,
          })
          .then(() => {
            this.$router.push('/blog')
          })
      }
    },
  },
}
</script>

<style></style>
