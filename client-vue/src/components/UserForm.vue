<template>
  <form data-test="user-form" @submit.prevent="onSubmit">
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input"
          type="text"
          data-test="username-field"
          placeholder="John Doe"
          v-model="username"
        />
      </div>
      <p v-if="nameIsEmpty" class="help is-danger">User name cannot be empty</p>
      <p v-else-if="inputIsCurrentUsername" class="help is-danger">
        This is the current username
      </p>
      <p v-else-if="!usernameAvailable" class="help is-danger">
        This username is not available
      </p>
      <p v-else class="help is-success">This username is available</p>
    </div>

    <div class="buttons">
      <button
        type="submit"
        class="button is-primary"
        :disabled="!canSubmit ? '' : false"
      >
        {{ submitText }}
      </button>
      <button
        v-if="inEditMode"
        class="button is-danger is-outlined"
        @click="close"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script>
import http from '../http-common'

export default {
  name: 'user-form',
  props: {
    populateWith: {
      type: Object,
      default: () => ({ empty: true }),
    },
  },

  data() {
    return {
      edit: false,
      usernameAvailable: true,
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

    nameIsEmpty() {
      return this.user.name === ''
    },

    canSubmit() {
      return !this.nameIsEmpty && this.usernameAvailable
    },

    inputIsCurrentUsername() {
      return this.user.name === this.populateWith['name']
    },

    username: {
      get() {
        return this.user.name
      },

      set(value) {
        this.user.name = value
        http
          .get('/users/available', { params: { name: value } })
          .then(({ data }) => {
            this.usernameAvailable = data.available
          })
      },
    },
  },

  methods: {
    onSubmit() {
      if (this.canSubmit) {
        this.$emit('submit:user', this.user)
        console.log('emit submit one user')
        this.clearForm()
        this.close()
      }
    },

    clearForm() {
      this.user = {
        id: null,
        name: '',
        posts: [],
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
