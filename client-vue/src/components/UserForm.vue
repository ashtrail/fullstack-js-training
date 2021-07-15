<template>
  <form @submit.prevent="onSubmit">
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="John Doe"
          v-model="username"
        />
      </div>
      <p v-if="inputAvailable" class="help is-success">
        This username is available
      </p>
      <p v-else-if="inputIsCurrentUsername" class="help is-danger">
        This is the current username
      </p>
      <p v-else-if="inputNotAvailable" class="help is-danger">
        This username is not available
      </p>
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

    nameIsNotEmpty() {
      return this.user.name != ''
    },

    canSubmit() {
      return this.nameIsNotEmpty && this.usernameAvailable
    },

    inputAvailable() {
      return this.nameIsNotEmpty && this.usernameAvailable
    },

    inputNotAvailable() {
      return this.nameIsNotEmpty && !this.usernameAvailable
    },

    inputIsCurrentUsername() {
      return (
        this.nameIsNotEmpty &&
        !this.usernameAvailable &&
        this.user.name == this.populateWith.name
      )
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
