<template>
  <Form
    id="blog-post-form"
    data-test="blog-post-form"
    v-slot="{ meta }"
    @submit="onSubmit"
  >
    <Field
      name="title"
      v-model="post.title"
      :rules="titleIsValid"
      :validateOnChange="false"
      v-slot="{ field, meta }"
    >
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input
            v-bind="field"
            class="input"
            :class="{ 'is-danger': meta.touched && !meta.valid }"
            type="text"
            data-test="title-field"
            placeholder="Post Title"
          />
        </div>
        <ErrorMessage name="title" v-slot="{ message }">
          <p class="help is-danger">{{ message }}</p>
        </ErrorMessage>
      </div>
    </Field>

    <Field
      name="content"
      v-model="post.content"
      :rules="contentIsValid"
      :validateOnChange="false"
      v-slot="{ field, meta }"
    >
      <div class="field">
        <label class="label">Content</label>
        <div class="control">
          <textarea
            v-bind="field"
            class="textarea"
            :class="{ 'is-danger': meta.touched && !meta.valid }"
            data-test="content-field"
            placeholder="Post Content"
          ></textarea>
        </div>
        <ErrorMessage name="content" v-slot="{ message }">
          <p class="help is-danger">{{ message }}</p>
        </ErrorMessage>
      </div>
    </Field>

    <div class="field">
      <p v-if="meta.touched && invalidPostAuthor" class="help is-danger">
        You need to be "logged in" as a user to add a post
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-primary"
          :disabled="
            meta.dirty && meta.valid && !invalidPostAuthor ? false : true
          "
        >
          {{ submitText }}
        </button>
      </div>

      <div class="control">
        <button
          v-if="editingExistingPost"
          class="button is-danger is-outlined"
          @click="close"
        >
          Cancel
        </button>
      </div>
    </div>
  </Form>
</template>

<script>
import { mapGetters } from 'vuex'
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  name: 'blog-post-form',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    populateWith: {
      type: Object,
      default: () => ({ empty: true }),
    },
  },

  data() {
    return {
      editingExistingPost: false,
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
      this.editingExistingPost = true
    }
  },

  computed: {
    ...mapGetters(['getCurentUserId']),

    submitText() {
      return this.editingExistingPost ? 'Edit' : 'Create'
    },

    invalidPostAuthor() {
      return !this.editingExistingPost && !this.getCurentUserId
    },
  },

  methods: {
    titleIsValid(value) {
      if (value === '') {
        return 'Title cannot be empty'
      }
      if (!!value && value.length < 3) {
        return 'Title must be at least 3 characters long'
      }
      return true
    },

    contentIsValid(value) {
      if (value === '') return 'Content cannot be empty'
      return true
    },

    onSubmit(_values, { resetForm }) {
      const post = this.editingExistingPost
        ? { ...this.post }
        : { ...this.post, userId: this.getCurentUserId }

      this.$emit('submit:post', post)
      this.clearForm()
      resetForm()
      this.close()
    },

    clearForm() {
      this.post = {
        userId: null,
        id: null,
        title: '',
        content: '',
      }
      this.editingExistingPost = false
    },

    close() {
      this.$emit('close')
    },
  },
}
</script>

<style></style>
