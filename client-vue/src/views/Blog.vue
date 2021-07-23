<template>
  <div class="columns">
    <div class="column is-two-thirds">
      <div class="content">
        <h1 class="title">Vue Blog</h1>

        <ul>
          <li v-for="post in posts" :key="post.id">
            <router-link :to="`/posts/${post.id}`">{{
              post.title
            }}</router-link>
            by
            <router-link :to="`/users/${post.author.id}`">{{
              post.author.name
            }}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="column is-one-third">
      <h1 class="title">New Post</h1>
      <blog-post-form @submit:post="createPost" />
    </div>
  </div>
</template>

<script>
import BlogPostForm from '@/components/BlogPostForm.vue'

export default {
  name: 'blog',

  components: {
    BlogPostForm,
  },

  mounted() {
    this.$store.dispatch('fetchAllPosts')
  },

  computed: {
    posts() {
      return this.$store.state.posts || []
    },
  },

  methods: {
    createPost(post) {
      this.$store.dispatch('createPost', post)
    },
  },
}
</script>

<style></style>
