<template>
  <Form data-test="user-form" v-slot="{ meta }" @submit="onSubmit">
    <div class="field">
      <Field
        name="username"
        v-model="user.name"
        :validateOnInput="true"
        :validateOnChange="false"
        :validateOnBlur="false"
        :validateOnModelUpdate="false"
        :rules="isUsernameValid"
        v-slot="{ field }"
      >
        <label class="label">Name</label>
        <div class="control">
          <input
            v-bind="field"
            class="input"
            :class="{ 'is-danger': meta.touched && !meta.valid }"
            type="text"
            data-test="username-field"
            placeholder="John Doe"
          />
        </div>
      </Field>
      <ErrorMessage name="username" v-slot="{ message }">
        <p class="help is-danger">{{ message }}</p>
      </ErrorMessage>
      <p v-if="meta.dirty && meta.valid" class="help is-success">
        This username is available
      </p>
    </div>

    <div class="buttons">
      <button
        type="submit"
        class="button is-primary"
        :disabled="meta.dirty && meta.valid ? false : true"
      >
        {{ submitText }}
      </button>
      <button
        v-if="editingExistingUser"
        class="button is-danger is-outlined"
        @click="close"
      >
        Cancel
      </button>
    </div>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import http from '../http-common'

export default {
  name: 'user-form',
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
      editingExistingUser: false,
      user: {
        id: null,
        name: '',
        posts: [],
      },
    }
  },

  created() {
    if (!this.populateWith.empty) {
      this.user = { ...this.populateWith }
      this.editingExistingUser = true
    }
  },

  computed: {
    submitText() {
      return this.editingExistingUser ? 'Edit' : 'Create'
    },
  },

  methods: {
    async isUsernameValid(value) {
      if (value === '') {
        return 'User name cannot be empty'
      }
      if (value === this.populateWith['name']) {
        return 'This is the current username'
      }
      const res = await http.get('/users/available', {
        params: { name: value },
      })
      if (!res.data.available) {
        return 'This username is not available'
      }
      return true
    },

    onSubmit(_values, { resetForm }) {
      this.$emit('submit:user', { ...this.user })
      this.clearForm()
      resetForm()
      this.close()
    },

    clearForm() {
      this.user = {
        id: null,
        name: '',
        posts: [],
      }
      this.editingExistingUser = false
    },

    close() {
      this.$emit('close')
    },
  },
}
</script>

<style></style>
