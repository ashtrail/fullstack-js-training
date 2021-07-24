<template>
  <div>
    <h1 class="title">404</h1>
    {{ type || 'Entry' }} not found
  </div>
</template>

<script>
export default {
  props: ['type'],
}
</script>

<style></style>
