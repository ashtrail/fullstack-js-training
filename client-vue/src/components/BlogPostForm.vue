<template>
  <form id="blog-post-form" @submit.prevent="onSubmit">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          class="input"
          :class="{ 'is-danger': submitting && invalidTitle }"
          type="text"
          placeholder="Post Title"
          v-model="post.title"
        />
      </div>
      <p v-if="submitting && invalidTitle" class="help is-danger">
        Title cannot be empty
      </p>
    </div>

    <div class="field">
      <label class="label">Content</label>
      <div class="control">
        <textarea
          class="textarea"
          :class="{ 'is-danger': submitting && invalidContent }"
          placeholder="Post Content"
          v-model="post.content"
        ></textarea>
      </div>
      <p v-if="submitting && invalidContent" class="help is-danger">
        Content cannot be empty
      </p>
    </div>

    <div class="field">
      <p v-if="error && submitting" class="help is-danger">
        You need to be "logged in" as a user to add a post
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-primary">
          {{ submitText }}
        </button>
      </div>

      <div class="control">
        <button
          v-if="inEditMode"
          class="button is-danger is-outlined"
          @click="close"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'blog-post-form',
  props: {
    populateWith: {
      type: Object,
      default: () => ({ empty: true }),
    },
  },

  data() {
    return {
      edit: false,
      submitting: false,
      error: false,
      success: false,
      post: {
        userId: null,
        id: null,
        title: '',
        content: '',
      },
    }
  },

  created() {
    if (!this.populateWith.empty) {
      this.post = { ...this.populateWith }
      this.edit = true
    }
  },

  computed: {
    inCreationMode() {
      return !this.edit
    },

    inEditMode() {
      return this.edit
    },

    submitText() {
      return this.inCreationMode ? 'Create' : 'Edit'
    },

    invalidTitle() {
      return this.post.title === ''
    },

    invalidContent() {
      return this.post.content === ''
    },

    invalidPostAuthor() {
      return !this.post.userId
    },
  },

  methods: {
    onSubmit() {
      this.submitting = true
      this.clearStatus()

      if (this.inCreationMode) {
        this.post.userId = this.$store.getters.getCurentUserId
      }
      if (this.invalidTitle || this.invalidContent || this.invalidPostAuthor) {
        this.error = true
        return
      }

      this.$emit('submit:post', this.post)
      this.clearForm()
      this.error = false
      this.success = true
      this.submitting = false
      this.close()
    },

    clearStatus() {
      this.success = false
      this.error = false
    },

    clearForm() {
      this.post = {
        userId: null,
        id: null,
        title: '',
        content: '',
      }
      this.edit = false
    },

    close() {
      this.$emit('close')
    },
  },
}
</script>

<style></style>
