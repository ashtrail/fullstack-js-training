<template>
  <div v-if="inReadMode">
    <h1 class="title">{{ post.title }}</h1>

    <div class="content">
      {{ post.body }}
    </div>

    <div class="buttons">
      <button class="button" @click="edit = true">Edit</button>
      <button class="button is-danger is-outlined">Delete</button>
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
    }
  },

  async mounted() {
    this.$store.dispatch('fetchAllPosts')
  },

  computed: {
    post() {
      return this.$store.getters.getPostById(this.$route.params.id)
    },

    inReadMode() {
      return !this.edit
    },

    inEditMode() {
      return this.edit
    },
  },

  methods: {
    editPost() {
      // TODO: call API
    },
  },
}
</script>

<style></style>
