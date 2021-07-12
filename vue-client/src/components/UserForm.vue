<template>
  <form @submit.prevent="onSubmit">
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="John Doe"
          v-model="user.name"
        />
      </div>
    </div>

    <div class="buttons">
      <button type="submit" class="button is-primary">{{ submitText }}</button>
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
      user: {
        id: null,
        name: '',
        posts: [],
      },
    }
  },

  created() {
    if (!this.populateWith.empty) {
      this.user = this.populateWith
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
  },

  methods: {
    onSubmit() {
      if (this.user.name != '') {
        this.$emit('submit:user', this.user)
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
