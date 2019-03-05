<style lang="sass" scoped>
.btn
  display: inline-block
  min-width: 100px
  text-align: center
  user-select: none
  background-color: #ccc
  color: #000
  padding: 4px
  border-radius: 6px
  margin: 0 10px
  cursor: pointer
  color: #fff
  background-color: #909090
  &:hover
    background-color: darken(#909090, 10%)
  &.green
    background-color: green
    &:hover
      background-color: darken(green, 10%)
  &.red
    background-color: #ff7158
    &:hover
      background-color: darken(#ff7158, 10%)
</style>

<template lang="pug">
  .btn(
    @click="action"
  ): slot
</template>
<script>
export default {
  props: {
    action: {
      default: (() => {})
    }
  }
}
</script>
